import React, { useState, useMemo } from 'react';
import { Calendar, BarChart3, TrendingUp, Clock, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { Request, Department } from '../types';

interface AnalyticsProps {
  requests: Request[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ requests }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredRequests = useMemo(() => {
    const selected = new Date(selectedDate);
    const startOfDay = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
    const endOfDay = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate(), 23, 59, 59);

    return requests.filter(request => {
      const requestDate = new Date(request.createdAt);
      return requestDate >= startOfDay && requestDate <= endOfDay;
    });
  }, [requests, selectedDate]);

  const getMetrics = () => {
    const totalRequests = filteredRequests.length;
    const openRequests = filteredRequests.filter(r => r.status === 'Open').length;
    const inProgressRequests = filteredRequests.filter(r => r.status === 'In Progress').length;
    const resolvedRequests = filteredRequests.filter(r => r.status === 'Resolved').length;
    
    const resolvedWithTime = filteredRequests.filter(r => r.status === 'Resolved' && r.resolvedAt);
    const avgResolutionTime = resolvedWithTime.length > 0 
      ? resolvedWithTime.reduce((acc, r) => {
          const timeTaken = (new Date(r.resolvedAt!).getTime() - new Date(r.createdAt).getTime()) / (1000 * 60);
          return acc + timeTaken;
        }, 0) / resolvedWithTime.length
      : 0;

    const selectedDateObj = new Date(selectedDate);
    const overdueRequests = filteredRequests.filter(r => {
      if (r.status === 'Resolved') return false;
      const minutesElapsed = (selectedDateObj.getTime() - new Date(r.createdAt).getTime()) / (1000 * 60);
      return minutesElapsed > 15;
    }).length;

    const requestsByDepartment = filteredRequests.reduce((acc, r) => {
      acc[r.department] = (acc[r.department] || 0) + 1;
      return acc;
    }, {} as Record<Department, number>);

    const requestsByHour = Array.from({ length: 24 }, (_, hour) => {
      const count = filteredRequests.filter(r => {
        const requestHour = new Date(r.createdAt).getHours();
        return requestHour === hour;
      }).length;
      return { hour, count };
    });

    const requestsByPriority = {
      High: filteredRequests.filter(r => r.priority === 'High').length,
      Medium: filteredRequests.filter(r => r.priority === 'Medium').length,
      Low: filteredRequests.filter(r => r.priority === 'Low').length
    };

    return {
      totalRequests,
      openRequests,
      inProgressRequests,
      resolvedRequests,
      avgResolutionTime,
      overdueRequests,
      requestsByDepartment,
      requestsByHour,
      requestsByPriority
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header with Date Picker */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Analytics Dashboard</h2>
              <p className="text-sm text-gray-600">
                {isToday ? 'Today\'s Performance' : `Performance for ${formatDate(selectedDate)}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Key Metrics */}
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

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Performance Metrics
          </h3>
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

        {/* Requests by Department */}
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

        {/* Requests by Priority */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Requests by Priority</h3>
          <div className="space-y-3">
            {Object.entries(metrics.requestsByPriority).map(([priority, count]) => {
              const percentage = metrics.totalRequests > 0 ? (count / metrics.totalRequests) * 100 : 0;
              const colorClass = priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500';
              return (
                <div key={priority} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-700">{priority}</span>
                    <span className="text-gray-500">{count} requests</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${colorClass} h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Hourly Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hourly Request Distribution</h3>
          <div className="space-y-2">
            {metrics.requestsByHour.filter(h => h.count > 0).map(({ hour, count }) => {
              const maxCount = Math.max(...metrics.requestsByHour.map(h => h.count));
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={hour} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-gray-600 w-12">
                    {hour.toString().padStart(2, '0')}:00
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-8">{count}</span>
                </div>
              );
            })}
            {metrics.requestsByHour.every(h => h.count === 0) && (
              <p className="text-center text-gray-500 py-4">No requests for this date</p>
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {metrics.totalRequests === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">No Data Available</h3>
          <p className="text-gray-600">
            No requests were logged on {formatDate(selectedDate)}. 
            {!isToday && ' Try selecting a different date or check today\'s data.'}
          </p>
        </div>
      )}
    </div>
  );
};