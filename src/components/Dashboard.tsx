import React from 'react';
import { BarChart3, Clock, AlertTriangle, CheckCircle, Users, TrendingUp } from 'lucide-react';
import { Request, Department } from '../types';

interface DashboardProps {
  requests: Request[];
}

export const Dashboard: React.FC<DashboardProps> = ({ requests }) => {
  const getMetrics = () => {
    const totalRequests = requests.length;
    const openRequests = requests.filter(r => r.status === 'Open').length;
    const inProgressRequests = requests.filter(r => r.status === 'In Progress').length;
    const resolvedRequests = requests.filter(r => r.status === 'Resolved').length;
    
    const resolvedWithTime = requests.filter(r => r.status === 'Resolved' && r.resolvedAt);
    const avgResolutionTime = resolvedWithTime.length > 0 
      ? resolvedWithTime.reduce((acc, r) => {
          const timeTaken = (new Date(r.resolvedAt!).getTime() - new Date(r.createdAt).getTime()) / (1000 * 60);
          return acc + timeTaken;
        }, 0) / resolvedWithTime.length
      : 0;

    const now = new Date();
    const overdueRequests = requests.filter(r => {
      if (r.status === 'Resolved') return false;
      const minutesElapsed = (now.getTime() - new Date(r.createdAt).getTime()) / (1000 * 60);
      return minutesElapsed > 15;
    }).length;

    const requestsByDepartment = requests.reduce((acc, r) => {
      acc[r.department] = (acc[r.department] || 0) + 1;
      return acc;
    }, {} as Record<Department, number>);

    return {
      totalRequests,
      openRequests,
      inProgressRequests,
      resolvedRequests,
      avgResolutionTime,
      overdueRequests,
      requestsByDepartment
    };
  };

  const metrics = getMetrics();

  const MetricCard = ({ title, value, icon: Icon, color, subtitle }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    subtitle?: string;
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Operations Dashboard</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Requests"
            value={metrics.totalRequests}
            icon={Users}
            color="bg-blue-500"
          />
          <MetricCard
            title="Open Requests"
            value={metrics.openRequests}
            icon={AlertTriangle}
            color="bg-orange-500"
          />
          <MetricCard
            title="In Progress"
            value={metrics.inProgressRequests}
            icon={Clock}
            color="bg-yellow-500"
          />
          <MetricCard
            title="Resolved"
            value={metrics.resolvedRequests}
            icon={CheckCircle}
            color="bg-green-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Average Resolution Time</span>
              <span className="text-lg font-bold text-gray-800">
                {metrics.avgResolutionTime.toFixed(1)} min
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-red-600">Overdue Requests</span>
              <span className="text-lg font-bold text-red-800">
                {metrics.overdueRequests}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-600">Resolution Rate</span>
              <span className="text-lg font-bold text-green-800">
                {metrics.totalRequests > 0 ? ((metrics.resolvedRequests / metrics.totalRequests) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Requests by Department</h3>
          <div className="space-y-3">
            {Object.entries(metrics.requestsByDepartment).map(([department, count]) => {
              const percentage = metrics.totalRequests > 0 ? (count / metrics.totalRequests) * 100 : 0;
              return (
                <div key={department} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{department}</span>
                    <span className="text-gray-500">{count} requests</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {metrics.overdueRequests > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Escalation Alert</h3>
          </div>
          <p className="text-red-700">
            {metrics.overdueRequests} request{metrics.overdueRequests !== 1 ? 's' : ''} overdue ({'>'}15 minutes). Supervisor notification has been triggered.
          </p>
        </div>
      )}
    </div>
  );
};