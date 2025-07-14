import React from 'react';
import { Department, Request, User } from '../types'; // ✅ Adjust the import path if needed

interface NavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  currentDepartment?: Department | '';
  onDepartmentChange: (dept: Department | '') => void;
  requests: Request[];
  currentUser: User;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  currentDepartment,
  onDepartmentChange,
  requests,
  currentUser,
}) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex space-x-6">
          <button
            onClick={() => onViewChange('dashboard')}
            className={`text-sm font-medium ${
              currentView === 'dashboard' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => onViewChange('requests')}
            className={`text-sm font-medium ${
              currentView === 'requests' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            All Requests
          </button>

          <button
            onClick={() => onViewChange('reports')}
            className={`text-sm font-medium ${
              currentView === 'reports' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Reports
          </button>

          <button
            onClick={() => onViewChange('settings')}
            className={`text-sm font-medium ${
              currentView === 'settings' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            Settings
          </button>
        </div>

        <div>
          <label className="text-sm text-gray-500 mr-2">Department:</label>
          <select
            value={currentDepartment || ''}
            onChange={(e) => onDepartmentChange(e.target.value as Department | '')}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="Front Desk">Front Desk</option>
            <option value="Housekeeping">Housekeeping</option>
            <option value="Engineering">Engineering</option>
            <option value="F&B">F&B</option>
            <option value="Security">Security</option>
            {/* Add more if needed */}
          </select>
        </div>
      </div>
    </nav>
  );
};
