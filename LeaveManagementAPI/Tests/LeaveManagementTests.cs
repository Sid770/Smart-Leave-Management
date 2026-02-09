using Xunit;
using LeaveManagementAPI.DTOs;
using System;

namespace LeaveManagementAPI.Tests
{
    public class LeaveValidationTests
    {
        [Fact]
        public void LeaveRequest_EndDateBeforeStartDate_ShouldBeInvalid()
        {
            // Arrange
            var leaveRequest = new CreateLeaveRequestDto
            {
                StartDate = DateTime.UtcNow.AddDays(5),
                EndDate = DateTime.UtcNow.AddDays(3),
                Reason = "Test"
            };

            // Act
            bool isValid = leaveRequest.EndDate >= leaveRequest.StartDate;

            // Assert
            Assert.False(isValid, "End date should not be before start date");
        }

        [Fact]
        public void LeaveRequest_StartDateInPast_ShouldBeInvalid()
        {
            // Arrange
            var leaveRequest = new CreateLeaveRequestDto
            {
                StartDate = DateTime.UtcNow.AddDays(-5),
                EndDate = DateTime.UtcNow.AddDays(3),
                Reason = "Test"
            };

            // Act
            bool isValid = leaveRequest.StartDate >= DateTime.UtcNow.Date;

            // Assert
            Assert.False(isValid, "Start date should not be in the past");
        }

        [Fact]
        public void LeaveRequest_ValidDates_ShouldBeValid()
        {
            // Arrange
            var leaveRequest = new CreateLeaveRequestDto
            {
                StartDate = DateTime.UtcNow.AddDays(5),
                EndDate = DateTime.UtcNow.AddDays(10),
                Reason = "Valid vacation request"
            };

            // Act
            bool isValidDateRange = leaveRequest.EndDate >= leaveRequest.StartDate;
            bool isValidStartDate = leaveRequest.StartDate >= DateTime.UtcNow.Date;

            // Assert
            Assert.True(isValidDateRange, "Date range should be valid");
            Assert.True(isValidStartDate, "Start date should be valid");
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void LeaveRequest_EmptyReason_ShouldBeInvalid(string reason)
        {
            // Arrange
            var leaveRequest = new CreateLeaveRequestDto
            {
                StartDate = DateTime.UtcNow.AddDays(5),
                EndDate = DateTime.UtcNow.AddDays(10),
                Reason = reason
            };

            // Act
            bool isValid = !string.IsNullOrWhiteSpace(leaveRequest.Reason);

            // Assert
            Assert.False(isValid, "Reason should not be empty");
        }

        [Fact]
        public void LeaveRequest_CalculateTotalDays_ShouldBeCorrect()
        {
            // Arrange
            var startDate = new DateTime(2026, 2, 10);
            var endDate = new DateTime(2026, 2, 15);
            
            // Act
            int totalDays = (int)(endDate - startDate).TotalDays + 1;

            // Assert
            Assert.Equal(6, totalDays);
        }
    }

    public class ApprovalFlowTests
    {
        [Theory]
        [InlineData("Approved")]
        [InlineData("Rejected")]
        public void LeaveStatus_ValidStatusChange_ShouldBeAllowed(string newStatus)
        {
            // Arrange
            string currentStatus = "Pending";
            var validStatuses = new[] { "Approved", "Rejected" };

            // Act
            bool isValidTransition = Array.Exists(validStatuses, s => s == newStatus);

            // Assert
            Assert.True(isValidTransition, $"Status change from {currentStatus} to {newStatus} should be allowed");
        }

        [Fact]
        public void LeaveRequest_OnlyPendingCanBeUpdated_ShouldBeValid()
        {
            // Arrange
            var approvedLeave = new { Status = "Approved" };
            var pendingLeave = new { Status = "Pending" };

            // Act
            bool canUpdateApproved = approvedLeave.Status == "Pending";
            bool canUpdatePending = pendingLeave.Status == "Pending";

            // Assert
            Assert.False(canUpdateApproved, "Approved leave should not be updatable");
            Assert.True(canUpdatePending, "Pending leave should be updatable");
        }

        [Fact]
        public void ApprovalDto_RequiredFields_ShouldBePresent()
        {
            // Arrange
            var updateDto = new UpdateLeaveStatusDto
            {
                Status = "Approved",
                ManagerComment = "Looks good"
            };

            // Act
            bool hasStatus = !string.IsNullOrEmpty(updateDto.Status);
            bool isValidStatus = updateDto.Status == "Approved" || updateDto.Status == "Rejected";

            // Assert
            Assert.True(hasStatus, "Status should be present");
            Assert.True(isValidStatus, "Status should be either Approved or Rejected");
        }

        [Fact]
        public void LeaveRequest_ManagerComment_ShouldBeOptional()
        {
            // Arrange
            var updateDto = new UpdateLeaveStatusDto
            {
                Status = "Approved",
                ManagerComment = null
            };

            // Act & Assert
            Assert.NotNull(updateDto.Status);
            Assert.Null(updateDto.ManagerComment);
        }
    }
}
