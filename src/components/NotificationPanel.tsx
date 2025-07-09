import { X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export const NotificationPanel = () => {
  const { notifications, panelOpen, closePanel } = useNotification();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 transform transition-transform duration-300 z-50 ${
        panelOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Notifications</h2>
        <button onClick={closePanel}>
          <X className="w-5 h-5 text-gray-600 hover:text-gray-900" />
        </button>
      </div>

      <div className="p-4 space-y-3 overflow-y-auto h-[calc(100%-60px)]">
        {notifications.length === 0 ? (
          <p className="text-sm text-gray-500">No notifications.</p>
        ) : (
          notifications.map((note, index) => (
            <div
              key={index}
              className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded-md text-sm shadow-sm"
            >
              <div>{note.message}</div>
              <div className="text-xs text-gray-500 mt-1">
                {note.timestamp.toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
