using Microsoft.EntityFrameworkCore;
using LeaveManagementAPI.Data;
using Azure.Data.Tables;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS - Allow all origins for Azure deployment
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add DbContext with SQLite
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection") 
        ?? "Data Source=leavemanagement.db"));

// Add Azure Table Storage Service Client
builder.Services.AddSingleton(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    var connectionString = config["StorageConnection"];
    
    // Use development storage if no connection string is provided
    if (string.IsNullOrEmpty(connectionString))
    {
        connectionString = "UseDevelopmentStorage=true";
    }
    
    return new TableServiceClient(connectionString);
});

var app = builder.Build();

// Initialize database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.EnsureCreated();
}

// Configure the HTTP request pipeline - Always enable Swagger for Azure
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Leave Management API V1");
    c.RoutePrefix = string.Empty; // Swagger at root
    c.DocumentTitle = "Leave Management API Documentation";
});

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
