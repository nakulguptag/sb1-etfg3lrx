// User roles used in the system
export type UserRole = 'Admin' | 'Manager' | 'Staff' | '';

// Departments used in the hotel
export type Department =
  | 'Front Office'
  | 'Housekeeping'
  | 'Engineering'
  | 'F&B'
  | 'Security'
  | 'IT'
  | '';

// User object model (used across app and Firestore)
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

// Used for the dashboard stats
export interface DashboardMetrics {
  totalRequests: number;
  openRequests: number;
  inProgressRequests: number;
  resolvedRequests: number;
}
