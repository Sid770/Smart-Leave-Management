using Microsoft.EntityFrameworkCore;
using LeaveManagementAPI.Models;

namespace LeaveManagementAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<LeaveRequest> LeaveRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Seed initial data
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Username = "manager1",
                    Email = "manager@company.com",
                    Password = "manager123", // In production, use hashing
                    Role = "Manager",
                    FullName = "John Manager",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 2,
                    Username = "employee1",
                    Email = "employee1@company.com",
                    Password = "employee123",
                    Role = "Employee",
                    FullName = "Alice Employee",
                    ManagerId = 1,
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = 3,
                    Username = "employee2",
                    Email = "employee2@company.com",
                    Password = "employee123",
                    Role = "Employee",
                    FullName = "Bob Employee",
                    ManagerId = 1,
                    CreatedAt = DateTime.UtcNow
                }
            );

            // Seed sample leave requests
            modelBuilder.Entity<LeaveRequest>().HasData(
                new LeaveRequest
                {
                    Id = 1,
                    UserId = 2,
                    StartDate = DateTime.UtcNow.AddDays(5),
                    EndDate = DateTime.UtcNow.AddDays(7),
                    Reason = "Family vacation",
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow
                },
                new LeaveRequest
                {
                    Id = 2,
                    UserId = 3,
                    StartDate = DateTime.UtcNow.AddDays(10),
                    EndDate = DateTime.UtcNow.AddDays(12),
                    Reason = "Medical appointment",
                    Status = "Approved",
                    ReviewedBy = 1,
                    ReviewedAt = DateTime.UtcNow,
                    ManagerComment = "Approved",
                    CreatedAt = DateTime.UtcNow.AddDays(-2)
                }
            );
        }
    }
}
