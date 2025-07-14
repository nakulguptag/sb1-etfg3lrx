import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { startOfDay, endOfDay } from 'date-fns';
import { BarChart3, Clock, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import { useRequests } from '../hooks/useRequests';
import { Request } from '../types';
import { Timestamp } from 'firebase/firestore';

export const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filteredRequests, setFilteredRequests] = useState<Request[]>([]);
  const { requests } = useRequests();

  useEffect(() => {
    const start = startOfDay(selectedDate);
    const end = endOfDay(selectedDate);

    const filtered = (requests || []).filter((req) => {
      let createdDate: Date | null = null;

      if (req.createdAt instanceof Timestamp) {
        createdDate = req.createdAt.toDate();
      } else if (req.createdAt instanceof Date) {
        createdDate = req.createdAt;
      }

      return createdDate && createdDate >= start && createdDate <= end;
    });

    setFilteredRequests(filtered);
  }, [requests, selectedDate]);

  const getMetrics = () => {
    const total = filteredRequests.length;
    const open = filteredRequests.filter((r) => r.status === 'Open').length;
    const inProgress = filteredRequests.filter((r) => r.status === 'In Progress').length;
    const resolved = filteredRequests.filter((r) => r.status === 'Resolved').length;

    return { total, open, inProgress, resolved };
  };

  const metrics = getMetrics();

  const MetricCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
  }) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Operations Dashboard</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Date:</span>
          <DatePicker
            selected={selectedDate}
            onChange={(date: Date | null) => setSelectedDate(date ?? new Date())}
            dateFormat="dd/MM/yyyy"
            className="border px-2 py-1 rounded text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Requests" value={metrics.total} icon={Users} color="bg-blue-500" />
        <MetricCard title="Open Requests" value={metrics.open} icon={AlertTriangle} color="bg-orange-500" />
        <MetricCard title="In Progress" value={metrics.inProgress} icon={Clock} color="bg-yellow-500" />
        <MetricCard title="Resolved" value={metrics.resolved} icon={CheckCircle} color="bg-green-500" />
      </div>
    </div>
  );
};