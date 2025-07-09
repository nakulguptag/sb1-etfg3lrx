import React, { createContext, useContext, useState } from 'react';

type Notification = {
  message: string;
  timestamp: Date;
};

interface NotificationContextProps {
  notifications: Notification[];
  addNotification: (message: string) => void;
  panelOpen: boolean;
  openPanel: () => void;
  closePanel: () => void;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [panelOpen, setPanelOpen] = useState(false);

  const addNotification = (message: string) => {
    setNotifications(prev => [
      { message, timestamp: new Date() },
      ...prev,
    ]);
  };

  const openPanel = () => setPanelOpen(true);
  const closePanel = () => setPanelOpen(false);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, panelOpen, openPanel, closePanel }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
