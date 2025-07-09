import React, { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast'; // ✅ Import toast
import { Department, Priority } from '../types';

interface RequestFormProps {
  onSubmit: (request: {
    title: string;
    roomNumber: string;
    department: Department;
    priority: Priority;
    description: string;
    loggedBy: string;
    status: 'Open';
  }) => void;
}

const departments: Department[] = ['Housekeeping', 'Engineering', 'F&B', 'Front Desk', 'Maintenance'];
const priorities: Priority[] = ['Low', 'Medium', 'High'];

export const RequestForm: React.FC<RequestFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    roomNumber: '',
    department: 'Housekeeping' as Department,
    priority: 'Medium' as Priority,
    description: '',
    loggedBy: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      status: 'Open'
    });

    // ✅ Show toast notification
    toast.success('🎉 Request submitted successfully!');

    // ✅ Reset form
    setFormData({
      title: '',
      roomNumber: '',
      department: 'Housekeeping',
      priority: 'Medium',
      description: '',
      loggedBy: ''
    });
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Low': return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-blue-100 p-2 rounded-lg">
          <Plus className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">Log New Request</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Short title of request"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Number
            </label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 301"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value as Department })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logged By
            </label>
            <input
              type="text"
              value={formData.loggedBy}
              onChange={(e) => setFormData({ ...formData, loggedBy: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Staff name or role"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Describe the request or complaint..."
            required
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <AlertCircle className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            Priority: <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(formData.priority)}`}>
              {formData.priority}
            </span>
          </span>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Log Request
        </button>
      </form>
    </div>
  );
};
