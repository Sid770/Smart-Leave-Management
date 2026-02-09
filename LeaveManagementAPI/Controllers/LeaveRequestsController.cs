using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LeaveManagementAPI.Data;
using LeaveManagementAPI.Models;
using LeaveManagementAPI.DTOs;

namespace LeaveManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LeaveRequestsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LeaveRequestsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/LeaveRequests
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaveRequestResponseDto>>> GetLeaveRequests([FromQuery] int? userId = null, [FromQuery] string? status = null)
        {
            var query = _context.LeaveRequests.Include(lr => lr.User).AsQueryable();

            if (userId.HasValue)
            {
                query = query.Where(lr => lr.UserId == userId.Value);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(lr => lr.Status == status);
            }

            var leaveRequests = await query
                .Select(lr => new LeaveRequestResponseDto
                {
                    Id = lr.Id,
                    UserId = lr.UserId,
                    UserFullName = lr.User.FullName,
                    UserEmail = lr.User.Email,
                    StartDate = lr.StartDate,
                    EndDate = lr.EndDate,
                    Reason = lr.Reason,
                    Status = lr.Status,
                    ManagerComment = lr.ManagerComment,
                    CreatedAt = lr.CreatedAt,
                    ReviewedAt = lr.ReviewedAt,
                    ReviewedBy = lr.ReviewedBy,
                    TotalDays = (int)(lr.EndDate - lr.StartDate).TotalDays + 1
                })
                .OrderByDescending(lr => lr.CreatedAt)
                .ToListAsync();

            return Ok(leaveRequests);
        }

        // GET: api/LeaveRequests/5
        [HttpGet("{id}")]
        public async Task<ActionResult<LeaveRequestResponseDto>> GetLeaveRequest(int id)
        {
            var leaveRequest = await _context.LeaveRequests
                .Include(lr => lr.User)
                .FirstOrDefaultAsync(lr => lr.Id == id);

            if (leaveRequest == null)
            {
                return NotFound();
            }

            var response = new LeaveRequestResponseDto
            {
                Id = leaveRequest.Id,
                UserId = leaveRequest.UserId,
                UserFullName = leaveRequest.User.FullName,
                UserEmail = leaveRequest.User.Email,
                StartDate = leaveRequest.StartDate,
                EndDate = leaveRequest.EndDate,
                Reason = leaveRequest.Reason,
                Status = leaveRequest.Status,
                ManagerComment = leaveRequest.ManagerComment,
                CreatedAt = leaveRequest.CreatedAt,
                ReviewedAt = leaveRequest.ReviewedAt,
                ReviewedBy = leaveRequest.ReviewedBy,
                TotalDays = (int)(leaveRequest.EndDate - leaveRequest.StartDate).TotalDays + 1
            };

            return Ok(response);
        }

        // GET: api/LeaveRequests/team/{managerId}
        [HttpGet("team/{managerId}")]
        public async Task<ActionResult<IEnumerable<LeaveRequestResponseDto>>> GetTeamLeaveRequests(int managerId)
        {
            var teamMembers = await _context.Users
                .Where(u => u.ManagerId == managerId)
                .Select(u => u.Id)
                .ToListAsync();

            var leaveRequests = await _context.LeaveRequests
                .Include(lr => lr.User)
                .Where(lr => teamMembers.Contains(lr.UserId))
                .Select(lr => new LeaveRequestResponseDto
                {
                    Id = lr.Id,
                    UserId = lr.UserId,
                    UserFullName = lr.User.FullName,
                    UserEmail = lr.User.Email,
                    StartDate = lr.StartDate,
                    EndDate = lr.EndDate,
                    Reason = lr.Reason,
                    Status = lr.Status,
                    ManagerComment = lr.ManagerComment,
                    CreatedAt = lr.CreatedAt,
                    ReviewedAt = lr.ReviewedAt,
                    ReviewedBy = lr.ReviewedBy,
                    TotalDays = (int)(lr.EndDate - lr.StartDate).TotalDays + 1
                })
                .OrderByDescending(lr => lr.CreatedAt)
                .ToListAsync();

            return Ok(leaveRequests);
        }

        // POST: api/LeaveRequests
        [HttpPost]
        public async Task<ActionResult<LeaveRequestResponseDto>> CreateLeaveRequest([FromBody] CreateLeaveRequestDto dto, [FromQuery] int userId)
        {
            // Validate dates
            if (dto.EndDate < dto.StartDate)
            {
                return BadRequest(new { message = "End date must be after start date" });
            }

            if (dto.StartDate < DateTime.UtcNow.Date)
            {
                return BadRequest(new { message = "Cannot request leave for past dates" });
            }

            var leaveRequest = new LeaveRequest
            {
                UserId = userId,
                StartDate = dto.StartDate,
                EndDate = dto.EndDate,
                Reason = dto.Reason,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            _context.LeaveRequests.Add(leaveRequest);
            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            var response = new LeaveRequestResponseDto
            {
                Id = leaveRequest.Id,
                UserId = leaveRequest.UserId,
                UserFullName = user?.FullName ?? "",
                UserEmail = user?.Email ?? "",
                StartDate = leaveRequest.StartDate,
                EndDate = leaveRequest.EndDate,
                Reason = leaveRequest.Reason,
                Status = leaveRequest.Status,
                CreatedAt = leaveRequest.CreatedAt,
                TotalDays = (int)(leaveRequest.EndDate - leaveRequest.StartDate).TotalDays + 1
            };

            return CreatedAtAction(nameof(GetLeaveRequest), new { id = leaveRequest.Id }, response);
        }

        // PUT: api/LeaveRequests/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateLeaveStatus(int id, [FromBody] UpdateLeaveStatusDto dto, [FromQuery] int managerId)
        {
            var leaveRequest = await _context.LeaveRequests.FindAsync(id);

            if (leaveRequest == null)
            {
                return NotFound();
            }

            if (leaveRequest.Status != "Pending")
            {
                return BadRequest(new { message = "Can only update pending leave requests" });
            }

            if (dto.Status != "Approved" && dto.Status != "Rejected")
            {
                return BadRequest(new { message = "Status must be Approved or Rejected" });
            }

            leaveRequest.Status = dto.Status;
            leaveRequest.ManagerComment = dto.ManagerComment;
            leaveRequest.ReviewedBy = managerId;
            leaveRequest.ReviewedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/LeaveRequests/dashboard/{userId}
        [HttpGet("dashboard/{userId}")]
        public async Task<ActionResult> GetDashboard(int userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound();
            }

            var query = user.Role == "Manager"
                ? _context.LeaveRequests.Include(lr => lr.User)
                    .Where(lr => _context.Users.Any(u => u.ManagerId == userId && u.Id == lr.UserId))
                : _context.LeaveRequests.Include(lr => lr.User)
                    .Where(lr => lr.UserId == userId);

            var totalLeaves = await query.CountAsync();
            var pendingLeaves = await query.CountAsync(lr => lr.Status == "Pending");
            var approvedLeaves = await query.CountAsync(lr => lr.Status == "Approved");
            var rejectedLeaves = await query.CountAsync(lr => lr.Status == "Rejected");

            var recentLeaves = await query
                .OrderByDescending(lr => lr.CreatedAt)
                .Take(5)
                .Select(lr => new LeaveRequestResponseDto
                {
                    Id = lr.Id,
                    UserId = lr.UserId,
                    UserFullName = lr.User.FullName,
                    UserEmail = lr.User.Email,
                    StartDate = lr.StartDate,
                    EndDate = lr.EndDate,
                    Reason = lr.Reason,
                    Status = lr.Status,
                    ManagerComment = lr.ManagerComment,
                    CreatedAt = lr.CreatedAt,
                    ReviewedAt = lr.ReviewedAt,
                    ReviewedBy = lr.ReviewedBy,
                    TotalDays = (int)(lr.EndDate - lr.StartDate).TotalDays + 1
                })
                .ToListAsync();

            return Ok(new
            {
                totalLeaves,
                pendingLeaves,
                approvedLeaves,
                rejectedLeaves,
                recentLeaves
            });
        }

        // DELETE: api/LeaveRequests/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLeaveRequest(int id, [FromQuery] int userId)
        {
            var leaveRequest = await _context.LeaveRequests.FindAsync(id);

            if (leaveRequest == null)
            {
                return NotFound();
            }

            if (leaveRequest.UserId != userId)
            {
                return Forbid();
            }

            if (leaveRequest.Status != "Pending")
            {
                return BadRequest(new { message = "Can only delete pending leave requests" });
            }

            _context.LeaveRequests.Remove(leaveRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
