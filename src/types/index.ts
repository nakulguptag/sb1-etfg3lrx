export interface Request {
  id: string;
  roomNumber: string;
  department: Department;
  priority: Priority;
  description: string;
  loggedBy: string;
  createdAt: Date;
  updatedAt: Date;
  status: RequestStatus;
  resolutionComments?: string;
  resolvedAt?: Date;
  assignedTo?: string;
}

export type Department = 'Housekeeping' | 'Engineering' | 'F&B' | 'Front Desk' | 'Maintenance';

export type Priority = 'Low' | 'Medium' | 'High';

export type RequestStatus = 'Open' | 'In Progress' | 'Resolved';

export type UserRole = 'Staff' | 'Supervisor' | 'Manager' | 'Admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  isActive: boolean;
  createdAt: Date;
  lastLogin: Date | null;
}

export interface DashboardMetrics {
  totalRequests: number;
  openRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
  averageResolutionTime: number;
  overdueRequests: number;
  requestsByDepartment: Record<Department, number>;
}