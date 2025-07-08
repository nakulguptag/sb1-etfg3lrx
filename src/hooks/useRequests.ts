import { useState, useEffect } from 'react';
import { Request, Department, Priority, RequestStatus } from '../types';

// Mock data for demonstration
const mockRequests: Request[] = [
  {
    id: '1',
    roomNumber: '301',
    department: 'Housekeeping',
    priority: 'High',
    description: 'Air conditioning not working properly',
    loggedBy: 'Sarah Johnson',
    createdAt: new Date('2025-01-10T10:30:00'),
    updatedAt: new Date('2025-01-10T10:30:00'),
    status: 'Open',
    assignedTo: 'Maria Rodriguez'
  },
  {
    id: '2',
    roomNumber: '205',
    department: 'Engineering',
    priority: 'Medium',
    description: 'Bathroom faucet dripping',
    loggedBy: 'Mike Chen',
    createdAt: new Date('2025-01-10T09:15:00'),
    updatedAt: new Date('2025-01-10T11:00:00'),
    status: 'In Progress',
    assignedTo: 'Tom Wilson'
  },
  {
    id: '3',
    roomNumber: '412',
    department: 'F&B',
    priority: 'Low',
    description: 'Room service menu missing',
    loggedBy: 'Lisa Park',
    createdAt: new Date('2025-01-10T08:45:00'),
    updatedAt: new Date('2025-01-10T10:15:00'),
    status: 'Resolved',
    resolutionComments: 'New menu delivered to room',
    resolvedAt: new Date('2025-01-10T10:15:00'),
    assignedTo: 'James Brown'
  },
  {
    id: '4',
    roomNumber: '156',
    department: 'Maintenance',
    priority: 'High',
    description: 'Elevator making unusual noises',
    loggedBy: 'David Kim',
    createdAt: new Date('2025-01-10T07:20:00'),
    updatedAt: new Date('2025-01-10T07:20:00'),
    status: 'Open',
    assignedTo: 'Robert Garcia'
  }
];

export const useRequests = () => {
  const [requests, setRequests] = useState<Request[]>(mockRequests);

  const addRequest = (newRequest: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>) => {
    const request: Request = {
      ...newRequest,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setRequests(prev => [request, ...prev]);
  };

  const updateRequestStatus = (id: string, status: RequestStatus, comments?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === id 
        ? { 
            ...req, 
            status, 
            updatedAt: new Date(),
            resolutionComments: comments || req.resolutionComments,
            resolvedAt: status === 'Resolved' ? new Date() : req.resolvedAt
          }
        : req
    ));
  };

  const getRequestsByDepartment = (department: Department) => {
    return requests.filter(req => req.department === department);
  };

  const getOverdueRequests = () => {
    const now = new Date();
    return requests.filter(req => {
      if (req.status === 'Resolved') return false;
      
      const minutesElapsed = (now.getTime() - req.createdAt.getTime()) / (1000 * 60);
      return minutesElapsed > 15; // Consider overdue after 15 minutes
    });
  };

  return {
    requests,
    addRequest,
    updateRequestStatus,
    getRequestsByDepartment,
    getOverdueRequests
  };
};