import React, { useState } from 'react';
import { Clock, User, MapPin, AlertCircle, CheckCircle, PlayCircle } from 'lucide-react';
import { Request, RequestStatus } from '../types';

interface RequestCardProps {
  request: Request;
  onStatusUpdate: (id: string, status: RequestStatus, comments?: string) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onStatusUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState('');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: RequestStatus) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'In Progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusIcon = (status: RequestStatus) => {
    switch (status) {
      case 'Open': return <AlertCircle className="w-4 h-4" />;
      case 'In Progress': return <PlayCircle className="w-4 h-4" />;
      case 'Resolved': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getTimeElapsed = () => {
    const now = new Date();
    const created = new Date(request.createdAt);
    const diffMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));
    
    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else {
      const hours = Math.floor(diffMinutes / 60);
      return `${hours}h ago`;
    }
  };

  const isOverdue = () => {
    if (request.status === 'Resolved') return false;
    const now = new Date();
    const minutesElapsed = (now.getTime() - request.createdAt.getTime()) / (1000 * 60);
    return minutesElapsed > 15;
  };

  const handleStatusChange = (newStatus: RequestStatus) => {
    if (newStatus === 'Resolved') {
      setShowComments(true);
    } else {
      onStatusUpdate(request.id, newStatus);
    }
  };

  const handleResolve = () => {
    onStatusUpdate(request.id, 'Resolved', comments);
    setShowComments(false);
    setComments('');
  };

  return (
    <div className={`bg-white rounded-xl shadow-md border ${isOverdue() ? 'border-red-200 bg-red-50' : 'border-gray-200'} p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 p-2 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Room {request.roomNumber}</h3>
            <p className="text-sm text-gray-600">{request.department}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.priority)}`}>
            {request.priority}
          </span>
          {isOverdue() && (
            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              OVERDUE
            </span>
          )}
        </div>
      </div>

      <p className="text-gray-700 mb-4">{request.description}</p>

      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span>By {request.loggedBy}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-4 h-4" />
          <span>{getTimeElapsed()}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(request.status)}`}>
            {getStatusIcon(request.status)}
            {request.status}
          </span>
          {request.assignedTo && (
            <span className="text-xs text-gray-500">
              Assigned to {request.assignedTo}
            </span>
          )}
        </div>

        {request.status !== 'Resolved' && (
          <div className="flex gap-2">
            {request.status === 'Open' && (
              <button
                onClick={() => handleStatusChange('In Progress')}
                className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full hover:bg-orange-200 transition-colors"
              >
                Start Work
              </button>
            )}
            <button
              onClick={() => handleStatusChange('Resolved')}
              className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full hover:bg-green-200 transition-colors"
            >
              Resolve
            </button>
          </div>
        )}
      </div>

      {request.resolutionComments && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-800">
            <strong>Resolution:</strong> {request.resolutionComments}
          </p>
          {request.resolvedAt && (
            <p className="text-xs text-green-600 mt-1">
              Resolved on {new Date(request.resolvedAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      {showComments && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resolution Comments
          </label>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="Describe how this request was resolved..."
          />
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleResolve}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              Mark Resolved
            </button>
            <button
              onClick={() => setShowComments(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};