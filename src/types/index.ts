// Roles available in the system
export type UserRole = 'Admin' | 'Manager' | 'Supervisor' | 'Staff';

// Departments used in the hotel
export type Department =
  | 'Front Desk'
  | 'Housekeeping'
  | 'Engineering'
  | 'F&B'
  | 'Security'
  | 'IT'
  | 'Maintenance';

// Full User object (used across app and Firestore)
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: Department;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin: Date | null;
}

// For creating a new user (before ID and updatedAt are set)
export type NewUser = Omit<User, 'id' | 'updatedAt'>;

// Used for dashboard summaries
export interface DashboardMetrics {
  totalRequests: number;
  openRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
}
