import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LeaveService } from '../services/leave.service';
import { Dashboard } from '../models/leave-request.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <nav class="navbar">
        <div class="nav-content">
          <div class="nav-brand">
            <h2>🏢 Leave Management</h2>
          </div>
          <div class="nav-user">
            <span class="user-info">
              <strong>{{ authService.currentUser()?.fullName }}</strong>
              <span class="user-role">{{ authService.currentUser()?.role }}</span>
            </span>
            <button (click)="logout()" class="btn btn-secondary">Logout</button>
          </div>
        </div>
      </nav>

      <div class="main-content">
        <div class="header">
          <h1>Dashboard</h1>
          <div class="header-actions">
            @if (!authService.isManager()) {
              <button (click)="navigateToApply()" class="btn btn-primary">
                ➕ Apply for Leave
              </button>
            }
            <button (click)="navigateToLeaves()" class="btn btn-outline">
              📋 View All Leaves
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="loading">Loading...</div>
        } @else if (dashboard()) {
          <div class="stats-grid">
            <div class="stat-card stat-total">
              <div class="stat-icon">📊</div>
              <div class="stat-content">
                <div class="stat-value">{{ dashboard()!.totalLeaves }}</div>
                <div class="stat-label">Total Leaves</div>
              </div>
            </div>

            <div class="stat-card stat-pending">
              <div class="stat-icon">⏳</div>
              <div class="stat-content">
                <div class="stat-value">{{ dashboard()!.pendingLeaves }}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>

            <div class="stat-card stat-approved">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">{{ dashboard()!.approvedLeaves }}</div>
                <div class="stat-label">Approved</div>
              </div>
            </div>

            <div class="stat-card stat-rejected">
              <div class="stat-icon">❌</div>
              <div class="stat-content">
                <div class="stat-value">{{ dashboard()!.rejectedLeaves }}</div>
                <div class="stat-label">Rejected</div>
              </div>
            </div>
          </div>

          <div class="recent-leaves">
            <h2>Recent Leave Requests</h2>
            @if (dashboard()!.recentLeaves.length === 0) {
              <div class="empty-state">
                <p>No leave requests yet</p>
              </div>
            } @else {
              <div class="leave-list">
                @for (leave of dashboard()!.recentLeaves; track leave.id) {
                  <div class="leave-card">
                    <div class="leave-header">
                      <div class="leave-user">
                        <strong>{{ leave.userFullName }}</strong>
                        @if (authService.isManager()) {
                          <span class="leave-email">{{ leave.userEmail }}</span>
                        }
                      </div>
                      <span [class]="'status-badge status-' + leave.status.toLowerCase()">
                        {{ leave.status }}
                      </span>
                    </div>
                    <div class="leave-dates">
                      <span>📅 {{ formatDate(leave.startDate) }} → {{ formatDate(leave.endDate) }}</span>
                      <span class="leave-days">{{ leave.totalDays }} days</span>
                    </div>
                    <div class="leave-reason">
                      <strong>Reason:</strong> {{ leave.reason }}
                    </div>
                    @if (leave.managerComment) {
                      <div class="leave-comment">
                        <strong>Manager Comment:</strong> {{ leave.managerComment }}
                      </div>
                    }
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      min-height: 100vh;
      background: #f7fafc;
    }

    .navbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 16px 0;
    }

    .nav-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand h2 {
      margin: 0;
      color: #667eea;
      font-size: 24px;
    }

    .nav-user {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .user-role {
      font-size: 12px;
      color: #718096;
    }

    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header h1 {
      margin: 0;
      color: #1a202c;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #2d3748;
    }

    .btn-secondary:hover {
      background: #cbd5e0;
    }

    .btn-outline {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .btn-outline:hover {
      background: #667eea;
      color: white;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    .stat-icon {
      font-size: 36px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a202c;
    }

    .stat-label {
      font-size: 14px;
      color: #718096;
    }

    .recent-leaves {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .recent-leaves h2 {
      margin: 0 0 20px 0;
      color: #1a202c;
    }

    .leave-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .leave-card {
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      transition: all 0.2s;
    }

    .leave-card:hover {
      border-color: #667eea;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
    }

    .leave-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 12px;
    }

    .leave-user {
      display: flex;
      flex-direction: column;
    }

    .leave-email {
      font-size: 12px;
      color: #718096;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
    }

    .status-pending {
      background: #fef3c7;
      color: #92400e;
    }

    .status-approved {
      background: #d1fae5;
      color: #065f46;
    }

    .status-rejected {
      background: #fee2e2;
      color: #991b1b;
    }

    .leave-dates {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      color: #4a5568;
      font-size: 14px;
    }

    .leave-days {
      font-weight: 600;
      color: #667eea;
    }

    .leave-reason, .leave-comment {
      font-size: 14px;
      color: #4a5568;
      margin-top: 8px;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 40px;
      color: #718096;
    }
  `]
})
export class DashboardComponent implements OnInit {
  dashboard = signal<Dashboard | null>(null);
  loading = signal(true);

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.leaveService.getDashboard(userId).subscribe({
      next: (data) => {
        this.dashboard.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading dashboard:', error);
        this.loading.set(false);
      }
    });
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  navigateToApply(): void {
    this.router.navigate(['/apply']);
  }

  navigateToLeaves(): void {
    this.router.navigate(['/leaves']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
