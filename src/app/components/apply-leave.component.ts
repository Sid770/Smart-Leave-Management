import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LeaveService } from '../services/leave.service';
import { CreateLeaveRequest } from '../models/leave-request.model';

@Component({
  selector: 'app-apply-leave',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <nav class="navbar">
        <div class="nav-content">
          <button (click)="goBack()" class="btn-back">← Back</button>
          <h2>Apply for Leave</h2>
        </div>
      </nav>

      <div class="main-content">
        <div class="form-card">
          @if (successMessage()) {
            <div class="alert alert-success">
              {{ successMessage() }}
            </div>
          }
          @if (errorMessage()) {
            <div class="alert alert-error">
              {{ errorMessage() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="leave-form">
            <div class="form-row">
              <div class="form-group">
                <label for="startDate">Start Date *</label>
                <input 
                  type="date" 
                  id="startDate"
                  [(ngModel)]="startDate" 
                  name="startDate"
                  [min]="minDate"
                  required
                  class="form-control">
              </div>

              <div class="form-group">
                <label for="endDate">End Date *</label>
                <input 
                  type="date" 
                  id="endDate"
                  [(ngModel)]="endDate" 
                  name="endDate"
                  [min]="startDate || minDate"
                  required
                  class="form-control">
              </div>
            </div>

            @if (totalDays() > 0) {
              <div class="days-info">
                📅 Total Days: <strong>{{ totalDays() }}</strong>
              </div>
            }

            <div class="form-group">
              <label for="reason">Reason for Leave *</label>
              <textarea 
                id="reason"
                [(ngModel)]="reason" 
                name="reason"
                rows="4"
                placeholder="Please provide a reason for your leave request"
                required
                class="form-control"></textarea>
            </div>

            <div class="form-actions">
              <button type="button" (click)="goBack()" class="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="loading()">
                @if (loading()) {
                  <span>Submitting...</span>
                } @else {
                  <span>Submit Request</span>
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
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
      max-width: 1200px;
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
      max-width: 800px;
      margin: 0 auto;
      padding: 32px 24px;
    }

    .form-card {
      background: white;
      border-radius: 12px;
      padding: 32px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .leave-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      margin-bottom: 8px;
      color: #2d3748;
      font-size: 14px;
    }

    .form-control {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    textarea.form-control {
      resize: vertical;
      min-height: 100px;
    }

    .days-info {
      background: #ebf4ff;
      padding: 12px 16px;
      border-radius: 8px;
      color: #2c5282;
      font-size: 14px;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      padding-top: 16px;
    }

    .btn {
      padding: 12px 24px;
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

    .btn-primary:hover:not(:disabled) {
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

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
    }

    .alert-success {
      background: #d1fae5;
      color: #065f46;
      border: 1px solid #a7f3d0;
    }

    .alert-error {
      background: #fee;
      color: #c33;
      border: 1px solid #fcc;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ApplyLeaveComponent {
  startDate = '';
  endDate = '';
  reason = '';
  loading = signal(false);
  successMessage = signal('');
  errorMessage = signal('');
  minDate = new Date().toISOString().split('T')[0];

  constructor(
    private authService: AuthService,
    private leaveService: LeaveService,
    private router: Router
  ) {}

  totalDays = signal(0);

  ngOnInit(): void {
    // Watch for date changes
  }

  ngDoCheck(): void {
    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      if (end >= start) {
        const days = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        this.totalDays.set(days);
      } else {
        this.totalDays.set(0);
      }
    } else {
      this.totalDays.set(0);
    }
  }

  onSubmit(): void {
    if (!this.startDate || !this.endDate || !this.reason) {
      this.errorMessage.set('Please fill in all required fields');
      return;
    }

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const request: CreateLeaveRequest = {
      startDate: this.startDate,
      endDate: this.endDate,
      reason: this.reason
    };

    this.leaveService.createLeaveRequest(userId, request).subscribe({
      next: () => {
        this.successMessage.set('Leave request submitted successfully!');
        this.loading.set(false);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage.set(error.error?.message || 'Failed to submit leave request');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
