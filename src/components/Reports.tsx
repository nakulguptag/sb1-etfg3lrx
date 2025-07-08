import React, { useState, useMemo } from 'react';
import { FileText, Download, Filter, Calendar, Search } from 'lucide-react';
import { Request, Department, Priority, RequestStatus } from '../types';

interface ReportsProps {
  requests: Request[];
}

export const Reports: React.FC<ReportsProps> = ({ requests }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<Department | 'All'>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const departments: (Department | 'All')[] = ['All', 'Housekeeping', 'Engineering', 'F&B', 'Front Desk', 'Maintenance'];
  const priorities: (Priority | 'All')[] = ['All', 'Low', 'Medium', 'High'];
  const statuses: (RequestStatus | 'All')[] = ['All', 'Open', 'In Progress', 'Resolved'];

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      // Date range filter
      if (startDate) {
        const requestDate = new Date(request.createdAt);
        const start = new Date(startDate);
        if (requestDate < start) return false;
      }
      
      if (endDate) {
        const requestDate = new Date(request.createdAt);
        const end = new Date(endDate);
        end.setHours(23, 59, 59); // Include the entire end date
        if (requestDate > end) return false;
      }

      // Department filter
      if (departmentFilter !== 'All' && request.department !== departmentFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter !== 'All' && request.priority !== priorityFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'All' && request.status !== statusFilter) {
        return false;
      }

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          request.roomNumber.toLowerCase().includes(searchLower) ||
          request.description.toLowerCase().includes(searchLower) ||
          request.loggedBy.toLowerCase().includes(searchLower) ||
          (request.assignedTo && request.assignedTo.toLowerCase().includes(searchLower))
        );
      }

      return true;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, startDate, endDate, departmentFilter, priorityFilter, statusFilter, searchTerm]);

  const exportToCSV = () => {
    const headers = [
      'Request ID',
      'Room Number',
      'Department',
      'Priority',
      'Status',
      'Description',
      'Logged By',
      'Assigned To',
      'Created Date',
      'Updated Date',
      'Resolved Date',
      'Resolution Comments'
    ];

    const csvData = filteredRequests.map(request => [
      request.id,
      request.roomNumber,
      request.department,
      request.priority,
      request.status,
      `"${request.description.replace(/"/g, '""')}"`, // Escape quotes in description
      request.loggedBy,
      request.assignedTo || '',
      new Date(request.createdAt).toLocaleString(),
      new Date(request.updatedAt).toLocaleString(),
      request.resolvedAt ? new Date(request.resolvedAt).toLocaleString() : '',
      request.resolutionComments ? `"${request.resolutionComments.replace(/"/g, '""')}"` : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `hotel-requests-report-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setDepartmentFilter('All');
    setPriorityFilter('All');
    setStatusFilter('All');
    setSearchTerm('');
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Reports</h2>
              <p className="text-sm text-gray-600">Generate and export detailed request reports</p>
            </div>
          </div>
          
          <button
            onClick={exportToCSV}
            disabled={filteredRequests.length === 0}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Department Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value as Department | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Priority</label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority}>{priority}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row of Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'All')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Room, description, staff..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
            <button
              onClick={clearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
          <span>Showing {filteredRequests.length} of {requests.length} requests</span>
          <div className="flex items-center gap-4">
            {(startDate || endDate) && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Date Range Applied
              </span>
            )}
            {departmentFilter !== 'All' && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                {departmentFilter}
              </span>
            )}
            {priorityFilter !== 'All' && (
              <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(priorityFilter as Priority)}`}>
                {priorityFilter}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Request ID</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Room</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Logged By</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Created</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Resolved</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, index) => (
                <tr key={request.id} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                  <td className="py-3 px-4 text-sm font-mono text-gray-600">
                    #{request.id.slice(-6)}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {request.roomNumber}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {request.department}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 max-w-xs">
                    <div className="truncate" title={request.description}>
                      {request.description}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {request.loggedBy}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(request.createdAt).toLocaleDateString()}
                    <br />
                    <span className="text-xs text-gray-500">
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {request.resolvedAt ? (
                      <>
                        {new Date(request.resolvedAt).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-500">
                          {new Date(request.resolvedAt).toLocaleTimeString()}
                        </span>
                      </>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No requests found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more results</p>
          </div>
        )}
      </div>
    </div>
  );
};