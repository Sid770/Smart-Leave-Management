using Azure;
using Azure.Data.Tables;

namespace LeaveManagementAPI.Models
{
    public class UserEntity : ITableEntity
    {
        public string PartitionKey { get; set; } = "USER";
        public string RowKey { get; set; } = Guid.NewGuid().ToString();

        public string Username { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Role { get; set; } = "Employee";
        public string FullName { get; set; } = string.Empty;
        public string ManagerId { get; set; } = string.Empty;

        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }
    }

    public class LeaveRequestEntity : ITableEntity
    {
        public string PartitionKey { get; set; } = "LEAVE";
        public string RowKey { get; set; } = Guid.NewGuid().ToString();

        public string UserId { get; set; } = string.Empty;
        public string UserFullName { get; set; } = string.Empty;
        public string UserEmail { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string Status { get; set; } = "Pending";
        public string ManagerComment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string ReviewedAt { get; set; } = string.Empty;
        public string ReviewedBy { get; set; } = string.Empty;

        public DateTimeOffset? Timestamp { get; set; }
        public ETag ETag { get; set; }
    }
}
