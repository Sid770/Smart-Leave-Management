import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LeaveService } from '../services/leave.service';
import { LeaveRequest } from '../models/leave-request.model';

@Component({
  selector: 'app-leave-list',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <nav class="navbar">
        <div class="nav-content">
          <button (click)="goBack()" class="btn-back">← Back</button>
          <h2>Leave Requests</h2>
        </div>
      </nav>

      <div class="main-content">
        <div class="controls">
          <div class="filter-tabs">
            <button 
              [class.active]="filterStatus() === 'all'"
              (click)="filterStatus.set('all')"
              class="tab-btn">
              All
            </button>
            <button 
              [class.active]="filterStatus() === 'Pending'"
              (click)="filterStatus.set('Pending')"
              class="tab-btn">
              Pending
            </button>
            <button 
              [class.active]="filterStatus() === 'Approved'"
              (click)="filterStatus.set('Approved')"
              class="tab-btn">
              Approved
            </button>
            <button 
              [class.active]="filterStatus() === 'Rejected'"
              (click)="filterStatus.set('Rejected')"
              class="tab-btn">
              Rejected
            </button>
          </div>

          <div class="view-toggle">
            <button 
              [class.active]="viewMode() === 'list'"
              (click)="viewMode.set('list')"
              class="view-btn">
              📋 List
            </button>
            <button 
              [class.active]="viewMode() === 'calendar'"
              (click)="viewMode.set('calendar')"
              class="view-btn">
              📅 Calendar
            </button>
          </div>
        </div>

        @if (loading()) {
          <div class="loading">Loading...</div>
        } @else {
          @if (viewMode() === 'list') {
            <div class="leave-list">
              @if (filteredLeaves().length === 0) {
                <div class="empty-state">
                  <p>No leave requests found</p>
                </div>
              } @else {
                @for (leave of filteredLeaves(); track leave.id) {
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

                    <div class="leave-actions">
                      @if (authService.isManager() && leave.status === 'Pending') {
                        <button (click)="approveLeave(leave)" class="btn btn-approve">
                          ✓ Approve
                        </button>
                        <button (click)="rejectLeave(leave)" class="btn btn-reject">
                          ✗ Reject
                        </button>
                      }
                      @if (!authService.isManager() && leave.status === 'Pending' && leave.userId === authService.getCurrentUserId()) {
                        <button (click)="deleteLeave(leave)" class="btn btn-delete">
                          🗑️ Delete
                        </button>
                      }
                    </div>
                  </div>
                }
              }
            </div>
          } @else {
            <div class="calendar-view">
              <div class="calendar-header">
                <button (click)="previousMonth()" class="calendar-nav">‹</button>
                <h3>{{ currentMonthName() }} {{ currentYear() }}</h3>
                <button (click)="nextMonth()" class="calendar-nav">›</button>
              </div>
              
              <div class="calendar-grid">
                <div class="calendar-weekdays">
                  @for (day of weekDays; track day) {
                    <div class="weekday">{{ day }}</div>
                  }
                </div>
                
                <div class="calendar-days">
                  @for (day of calendarDays(); track $index) {
                    <div [class]="getCalendarDayClass(day)" (click)="selectDate(day)">
                      <span class="day-number">{{ day > 0 ? day : '' }}</span>
                      @if (day > 0 && getLeavesForDay(day).length > 0) {
                        <div class="day-leaves">
                          @for (leave of getLeavesForDay(day); track leave.id) {
                            <div [class]="'leave-dot status-' + leave.status.toLowerCase()"
                                 [title]="leave.userFullName + ': ' + leave.reason">
                            </div>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>

              @if (selectedDayLeaves().length > 0) {
                <div class="selected-day-leaves">
                  <h4>Leaves on {{ selectedDateDisplay() }}</h4>
                  @for (leave of selectedDayLeaves(); track leave.id) {
                    <div class="mini-leave-card">
                      <div class="leave-info">
                        <strong>{{ leave.userFullName }}</strong>
                        <span [class]="'status-badge status-' + leave.status.toLowerCase()">
                          {{ leave.status }}
                        </span>
                      </div>
                      <p>{{ leave.reason }}</p>
                    </div>
                  }
                </div>
              }
            </div>
          }
        }
      </div>
    </div>

    @if (showApprovalModal()) {
      <div class="modal-overlay" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ modalAction() === 'approve' ? 'Approve' : 'Reject' }} Leave Request</h3>
          <p>{{ selectedLeave()?.userFullName }} - {{ formatDate(selectedLeave()?.startDate) }} to {{ formatDate(selectedLeave()?.endDate) }}</p>
          
          <div class="form-group">
            <label>Comment (optional)</label>
            <textarea 
              [(ngModel)]="managerComment"
              rows="3"
              placeholder="Add a comment..."
              class="form-control"></textarea>
          </div>

          <div class="modal-actions">
            <button (click)="closeModal()" class="btn btn-secondary">Cancel</button>
            <button (click)="confirmAction()" class="btn btn-primary">
              {{ modalAction() === 'approve' ? 'Approve' : 'Reject' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background: #f7fafc;
    }

    .navbar {
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      padding: 16px 0;
    }

    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-content h2 {
      margin: 0;
      color: #1a202c;
    }

    .btn-back {
      background: none;
      border: none;
      color: #667eea;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .btn-back:hover {
      background: #f7fafc;
    }

    .main-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      background: white;
      padding: 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .filter-tabs {
      display: flex;
      gap: 8px;
    }

    .tab-btn {
      padding: 8px 16px;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .tab-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .view-toggle {
      display: flex;
      gap: 8px;
    }

    .view-btn {
      padding: 8px 16px;
      border: 2px solid #e2e8f0;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .view-btn.active {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .leave-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .leave-card {
      background: white;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
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

    .leave-actions {
      display: flex;
      gap: 8px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #e2e8f0;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
    }

    .btn-approve {
      background: #d1fae5;
      color: #065f46;
    }

    .btn-approve:hover {
      background: #a7f3d0;
    }

    .btn-reject {
      background: #fee2e2;
      color: #991b1b;
    }

    .btn-reject:hover {
      background: #fecaca;
    }

    .btn-delete {
      background: #e2e8f0;
      color: #2d3748;
    }

    .btn-delete:hover {
      background: #cbd5e0;
    }

    .calendar-view {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .calendar-header h3 {
      margin: 0;
      color: #1a202c;
    }

    .calendar-nav {
      background: #667eea;
      color: white;
      border: none;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      transition: all 0.2s;
    }

    .calendar-nav:hover {
      background: #5568d3;
      transform: scale(1.1);
    }

    .calendar-grid {
      margin-bottom: 20px;
    }

    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-bottom: 8px;
    }

    .weekday {
      text-align: center;
      font-weight: 600;
      color: #718096;
      font-size: 14px;
    }

    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
    }

    .calendar-day {
      aspect-ratio: 1;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
      min-height: 80px;
    }

    .calendar-day:hover {
      border-color: #667eea;
      background: #f7fafc;
    }

    .calendar-day.empty {
      border: none;
      cursor: default;
    }

    .calendar-day.today {
      background: #ebf4ff;
      border-color: #667eea;
    }

    .calendar-day.selected {
      background: #667eea;
      color: white;
      border-color: #667eea;
    }

    .day-number {
      display: block;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .day-leaves {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .leave-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .selected-day-leaves {
      background: #f7fafc;
      padding: 16px;
      border-radius: 8px;
      margin-top: 20px;
    }

    .selected-day-leaves h4 {
      margin: 0 0 12px 0;
      color: #1a202c;
    }

    .mini-leave-card {
      background: white;
      padding: 12px;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .leave-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal {
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 500px;
      width: 90%;
    }

    .modal h3 {
      margin: 0 0 16px 0;
      color: #1a202c;
    }

    .form-group {
      margin: 16px 0;
    }

    .form-group label {
      display: block;
      font-weight: 600;
      margin-bottom: 8px;
      color: #2d3748;
      font-size: 14px;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
    }

    .modal-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-primary:hover {
      background: #5568d3;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #2d3748;
    }

    .btn-secondary:hover {
      background: #cbd5e0;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 40px;
      color: #718096;
      background: white;
      border-radius: 12px;
    }
  `]
})
export class LeaveListComponent implements OnInit {
  leaves = signal<LeaveRequest[]>([]);
  loading = signal(true);
  filterStatus = signal<string>('all');
  viewMode = signal<'list' | 'calendar'>('list');
  
  // Calendar
  currentMonth = signal(new Date().getMonth());
  currentYear = signal(new Date().getFullYear());
  selectedDate = signal<Date | null>(null);
  weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Modal
  showApprovalModal = signal(false);
  selectedLeave = signal<LeaveRequest | null>(null);
  modalAction = signal<'approve' | 'reject'>('approve');
  managerComment = '';

  filteredLeaves = computed(() => {
    const status = this.filterStatus();
    if (status === 'all') {
      return this.leaves();
    }
    return this.leaves().filter(leave => leave.status === status);
  });

  calendarDays = computed(() => {
    const year = this.currentYear();
    const month = this.currentMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days: number[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(0);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  });

  currentMonthName = computed(() => {
    return new Date(this.currentYear(), this.currentMonth(), 1).toLocaleDateString('en-US', { month: 'long' });
  });

  selectedDayLeaves = computed(() => {
    const selected = this.selectedDate();
    if (!selected) return [];
    
    return this.leaves().filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return selected >= start && selected <= end;
    });
  });

  selectedDateDisplay = computed(() => {
    const selected = this.selectedDate();
    if (!selected) return '';
    return selected.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  });

  constructor(
    public authService: AuthService,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    const isManager = this.authService.isManager();
    const observable = isManager 
      ? this.leaveService.getTeamLeaveRequests(userId)
      : this.leaveService.getLeaveRequests(userId);

    observable.subscribe({
      next: (data) => {
        this.leaves.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
        this.loading.set(false);
      }
    });
  }

  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }

  approveLeave(leave: LeaveRequest): void {
    this.selectedLeave.set(leave);
    this.modalAction.set('approve');
    this.showApprovalModal.set(true);
  }

  rejectLeave(leave: LeaveRequest): void {
    this.selectedLeave.set(leave);
    this.modalAction.set('reject');
    this.showApprovalModal.set(true);
  }

  deleteLeave(leave: LeaveRequest): void {
    if (!confirm('Are you sure you want to delete this leave request?')) {
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId || !leave.id) return;

    this.leaveService.deleteLeaveRequest(leave.id, userId).subscribe({
      next: () => {
        this.loadLeaves();
      },
      error: (error) => {
        console.error('Error deleting leave:', error);
        alert('Failed to delete leave request');
      }
    });
  }

  closeModal(): void {
    this.showApprovalModal.set(false);
    this.selectedLeave.set(null);
    this.managerComment = '';
  }

  confirmAction(): void {
    const leave = this.selectedLeave();
    const managerId = this.authService.getCurrentUserId();
    if (!leave || !leave.id || !managerId) return;

    const status = this.modalAction() === 'approve' ? 'Approved' : 'Rejected';
    
    this.leaveService.updateLeaveStatus(leave.id, managerId, {
      status: status as 'Approved' | 'Rejected',
      managerComment: this.managerComment
    }).subscribe({
      next: () => {
        this.closeModal();
        this.loadLeaves();
      },
      error: (error) => {
        console.error('Error updating leave:', error);
        alert('Failed to update leave status');
      }
    });
  }

  previousMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.set(this.currentYear() - 1);
    } else {
      this.currentMonth.set(this.currentMonth() - 1);
    }
  }

  nextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.set(this.currentYear() + 1);
    } else {
      this.currentMonth.set(this.currentMonth() + 1);
    }
  }

  selectDate(day: number): void {
    if (day === 0) return;
    const date = new Date(this.currentYear(), this.currentMonth(), day);
    this.selectedDate.set(date);
  }

  getCalendarDayClass(day: number): string {
    if (day === 0) return 'calendar-day empty';
    
    const date = new Date(this.currentYear(), this.currentMonth(), day);
    const today = new Date();
    const selected = this.selectedDate();
    
    let classes = 'calendar-day';
    
    if (date.toDateString() === today.toDateString()) {
      classes += ' today';
    }
    
    if (selected && date.toDateString() === selected.toDateString()) {
      classes += ' selected';
    }
    
    return classes;
  }

  getLeavesForDay(day: number): LeaveRequest[] {
    const date = new Date(this.currentYear(), this.currentMonth(), day);
    return this.leaves().filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      return date >= start && date <= end;
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
