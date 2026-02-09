export interface LeaveRequest {
  id?: number;
  userId: number;
  userFullName?: string;
  userEmail?: string;
  startDate: Date | string;
  endDate: Date | string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  managerComment?: string;
  createdAt?: Date | string;
  reviewedAt?: Date | string;
  reviewedBy?: number;
  totalDays?: number;
}

export interface CreateLeaveRequest {
  startDate: Date | string;
  endDate: Date | string;
  reason: string;
}

export interface UpdateLeaveStatus {
  status: 'Approved' | 'Rejected';
  managerComment?: string;
}

export interface Dashboard {
  totalLeaves: number;
  pendingLeaves: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  recentLeaves: LeaveRequest[];
}
