import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LeaveRequest, CreateLeaveRequest, UpdateLeaveStatus, Dashboard } from '../models/leave-request.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private apiUrl = `${environment.apiUrl}/leaverequests`;

  constructor(private http: HttpClient) {}

  getLeaveRequests(userId?: number, status?: string): Observable<LeaveRequest[]> {
    let params = new HttpParams();
    if (userId) params = params.set('userId', userId.toString());
    if (status) params = params.set('status', status);
    return this.http.get<LeaveRequest[]>(this.apiUrl, { params });
  }

  getLeaveRequest(id: number): Observable<LeaveRequest> {
    return this.http.get<LeaveRequest>(`${this.apiUrl}/${id}`);
  }

  getTeamLeaveRequests(managerId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.apiUrl}/team/${managerId}`);
  }

  createLeaveRequest(userId: number, request: CreateLeaveRequest): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.apiUrl}?userId=${userId}`, request);
  }

  updateLeaveStatus(id: number, managerId: number, update: UpdateLeaveStatus): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/status?managerId=${managerId}`, update);
  }

  deleteLeaveRequest(id: number, userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}?userId=${userId}`);
  }

  getDashboard(userId: number): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.apiUrl}/dashboard/${userId}`);
  }
}
