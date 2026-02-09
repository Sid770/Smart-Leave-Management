export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  managerId?: number;
  token?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  managerId?: number;
  token: string;
}
