import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { Reports } from './components/Reports';
import { RequestsList } from './components/RequestsList';
import { RequestForm } from './components/RequestForm';
import { UserManagement } from './components/UserManagement';
import { NotificationSettings } from './components/NotificationSettings';
import { NotificationPanel } from './components/NotificationPanel'; // ✅ slide-in panel
import { useNotification } from './context/NotificationContext'; // ✅ hook from context
import { useRequests } from './hooks/useRequests';
import { Department, User } from './types';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentDepartment, setCurrentDepartment] = useState<Department | undefined>();
  const { requests, addRequest, updateRequestStatus, getRequestsByDepartment } = useRequests();

  const { addNotification, openPanel } = useNotification(); // ✅ access context

  // ✅ Mock user
  const currentUser: User = {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@hotel.com',
    role: 'Admin',
    department: 'Front Desk',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
    lastLogin: new Date('2025-01-10T08:30:00')
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
  };

  const handleDepartmentChange = (department: Department | '') => {
    setCurrentDepartment(department || undefined);
  };

  const displayRequests = currentDepartment
    ? getRequestsByDepartment(currentDepartment)
    : requests;

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard requests={displayRequests} />;
      case 'requests':
        return (
          <RequestsList
            requests={displayRequests}
            onStatusUpdate={updateRequestStatus}
            currentDepartment={currentDepartment}
          />
        );
      case 'analytics':
        return <Analytics requests={displayRequests} />;
      case 'reports':
        return <Reports requests={requests} />;
      case 'settings':
        return (
          <div className="space-y-6">
            {currentUser.role === 'Admin' && (
              <UserManagement currentUser={currentUser} />
            )}
            <NotificationSettings currentUser={currentUser} />
          </div>
        );
      default:
        return <Dashboard requests={displayRequests} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ✅ Global Toasts */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* ✅ Top Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={handleViewChange}
        currentDepartment={currentDepartment}
        onDepartmentChange={handleDepartmentChange}
        requests={requests}
        currentUser={currentUser}
      />

      {/* ✅ Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {renderContent()}
          </div>

          {/* ✅ Right Side: Form + Stats */}
          <div className="space-y-6">
            <RequestForm
              onSubmit={(formData) => {
                addRequest({
                  ...formData,
                  title: formData.title || 'Untitled',
                });

                toast.success('✅ New request submitted!');
                addNotification(`📝 Request from ${formData.loggedBy} added`);
                openPanel(); // 👈 Opens the right-side panel
              }}
            />

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Requests</span>
                  <span className="text-sm font-medium">{requests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Open</span>
                  <span className="text-sm font-medium text-orange-600">
                    {requests.filter(r => r.status === 'Open').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">In Progress</span>
                  <span className="text-sm font-medium text-blue-600">
                    {requests.filter(r => r.status === 'In Progress').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Resolved</span>
                  <span className="text-sm font-medium text-green-600">
                    {requests.filter(r => r.status === 'Resolved').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Slide-in Notifications Panel */}
      <NotificationPanel />
    </div>
  );
}

export default App;
