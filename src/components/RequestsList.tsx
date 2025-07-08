import React, { useState } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';
import { Request, Department, RequestStatus, Priority } from '../types';
import { RequestCard } from './RequestCard';

interface RequestsListProps {
  requests: Request[];
  onStatusUpdate: (id: string, status: RequestStatus, comments?: string) => void;
  currentDepartment?: Department;
}

export const RequestsList: React.FC<RequestsListProps> = ({ 
  requests, 
  onStatusUpdate, 
  currentDepartment 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority'>('createdAt');

  const filteredRequests = requests
    .filter(request => {
      // Filter by department if specified
      if (currentDepartment && request.department !== currentDepartment) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !request.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !request.roomNumber.includes(searchTerm)) {
        return false;
      }
      
      // Filter by status
      if (statusFilter !== 'All' && request.status !== statusFilter) {
        return false;
      }
      
      // Filter by priority
      if (priorityFilter !== 'All' && request.priority !== priorityFilter) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'createdAt') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
    });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <Filter className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {currentDepartment ? `${currentDepartment} Requests` : 'All Requests'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Status</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="All">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'createdAt' | 'priority')}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="createdAt">Recent First</option>
              <option value="priority">Priority</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
          <span>Showing {filteredRequests.length} of {requests.length} requests</span>
          {currentDepartment && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
              {currentDepartment}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRequests.map(request => (
          <RequestCard
            key={request.id}
            request={request}
            onStatusUpdate={onStatusUpdate}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">No requests found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};