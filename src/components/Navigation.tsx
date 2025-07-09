import React from 'react';
import {
  Home,
  ClipboardList,
  BarChart3,
  Settings,
  User as UserIcon,
  FileText,
} from 'lucide-react';

import { Department, Request, User } from '../types';
import { NotificationService } from './NotificationService';

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  currentDepartment?: Department;
  onDepartmentChange: (department: Department | '') => void;
  requests: Request[];
  currentUser: User;
}

const departments: Department[] = [
  'Housekeeping',
  'Engineering',
  'F&B',
  'Front Desk',
  'Maintenance',
];

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  currentDepartment,
  onDepartmentChange,
  requests,
  currentUser,
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'requests', label: 'All Requests', icon: ClipboardList },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'reports', label: 'Reports', icon: FileText },
    // Show "Settings" only if user is Admin
    ...(currentUser.role === 'Admin'
      ? [{ id: 'settings', label: 'Settings', icon: Settings }]
      : []),
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Novotel CM</h1>
                <p className="text-xs text-gray-600">GRM by Nakul</p>
              </div>
            </div>

            <nav className="flex space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <NotificationService requests={requests} />
            <div className="text-sm text-gray-600">Department:</div>
            <select
              value={currentDepartment || ''}
              onChange={(e) =>
                onDepartmentChange(e.target.value as Department)
              }
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
