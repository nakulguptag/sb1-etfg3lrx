import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Clock, X } from 'lucide-react';
import { Request } from '../types';

interface NotificationServiceProps {
  requests: Request[];
}

interface Notification {
  id: string;
  type: 'trigger' | 'escalation' | 'resolved';
  requestId: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const NotificationService: React.FC<NotificationServiceProps> = ({ requests }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Simulate notification checking
  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      
      requests.forEach(request => {
        if (request.status === 'Resolved') return;
        
        const minutesElapsed = (now.getTime() - request.createdAt.getTime()) / (1000 * 60);
        
        // Check for trigger notifications (15 minutes)
        if (minutesElapsed >= 15 && minutesElapsed < 16) {
          const existingNotification = notifications.find(
            n => n.requestId === request.id && n.type === 'trigger'
          );
          
          if (!existingNotification) {
            const newNotification: Notification = {
              id: `trigger-${request.id}-${Date.now()}`,
              type: 'trigger',
              requestId: request.id,
              message: `Request in Room ${request.roomNumber} (${request.department}) has been open for 15 minutes`,
              timestamp: now,
              isRead: false,
              priority: request.priority.toLowerCase() as 'low' | 'medium' | 'high'
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            
            // Simulate sending notifications
            sendNotification(newNotification, request);
          }
        }
        
        // Check for escalation notifications (30 minutes)
        if (minutesElapsed >= 30 && minutesElapsed < 31) {
          const existingNotification = notifications.find(
            n => n.requestId === request.id && n.type === 'escalation'
          );
          
          if (!existingNotification) {
            const newNotification: Notification = {
              id: `escalation-${request.id}-${Date.now()}`,
              type: 'escalation',
              requestId: request.id,
              message: `ESCALATION: Request in Room ${request.roomNumber} (${request.department}) has been open for 30 minutes`,
              timestamp: now,
              isRead: false,
              priority: 'high'
            };
            
            setNotifications(prev => [newNotification, ...prev]);
            
            // Simulate sending escalation notifications
            sendNotification(newNotification, request);
          }
        }
      });
    };

    const interval = setInterval(checkNotifications, 60000); // Check every minute
    checkNotifications(); // Initial check

    return () => clearInterval(interval);
  }, [requests, notifications]);

  const sendNotification = async (notification: Notification, request: Request) => {
    console.log('🔔 Sending notification:', notification.message);
    
    // Simulate different notification methods
    const methods = {
      email: () => sendEmail(notification, request),
      sms: () => sendSMS(notification, request),
      push: () => sendPushNotification(notification, request),
      slack: () => sendSlackMessage(notification, request),
      teams: () => sendTeamsMessage(notification, request),
      webhook: () => sendWebhook(notification, request)
    };

    // In a real implementation, you would check the notification rules
    // and send via the configured methods
    try {
      await methods.email();
      await methods.push();
      
      if (notification.priority === 'high') {
        await methods.sms();
        await methods.slack();
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const sendEmail = async (notification: Notification, request: Request) => {
    // Simulate email sending
    console.log('📧 Email sent:', {
      to: 'supervisor@hotel.com',
      subject: `Hotel Operations Alert - Room ${request.roomNumber}`,
      body: notification.message,
      priority: notification.priority
    });
    
    // In a real implementation, you would use an email service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const sendSMS = async (notification: Notification, request: Request) => {
    // Simulate SMS sending
    console.log('📱 SMS sent:', {
      to: '+1234567890',
      message: `HOTEL ALERT: ${notification.message}`,
      priority: notification.priority
    });
    
    // In a real implementation, you would use services like:
    // - Twilio
    // - AWS SNS
    // - Vonage (Nexmo)
    
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const sendPushNotification = async (notification: Notification, request: Request) => {
    // Simulate push notification
    console.log('🔔 Push notification sent:', {
      title: 'Hotel Operations Alert',
      body: notification.message,
      data: { requestId: request.id, roomNumber: request.roomNumber }
    });
    
    // In a real implementation, you would use:
    // - Firebase Cloud Messaging (FCM)
    // - Apple Push Notification Service (APNs)
    // - Web Push API
    
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const sendSlackMessage = async (notification: Notification, request: Request) => {
    // Simulate Slack webhook
    console.log('💬 Slack message sent:', {
      channel: '#hotel-operations',
      text: notification.message,
      attachments: [{
        color: notification.priority === 'high' ? 'danger' : 'warning',
        fields: [
          { title: 'Room', value: request.roomNumber, short: true },
          { title: 'Department', value: request.department, short: true },
          { title: 'Priority', value: request.priority, short: true },
          { title: 'Logged By', value: request.loggedBy, short: true }
        ]
      }]
    });
    
    // In a real implementation:
    // const response = await fetch(SLACK_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(slackMessage)
    // });
    
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const sendTeamsMessage = async (notification: Notification, request: Request) => {
    // Simulate Microsoft Teams webhook
    console.log('👥 Teams message sent:', {
      title: 'Hotel Operations Alert',
      text: notification.message,
      themeColor: notification.priority === 'high' ? 'FF0000' : 'FFA500'
    });
    
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const sendWebhook = async (notification: Notification, request: Request) => {
    // Simulate custom webhook
    console.log('🔗 Webhook sent:', {
      url: 'https://api.hotel.com/notifications',
      payload: {
        event: 'request_notification',
        notification,
        request,
        timestamp: new Date().toISOString()
      }
    });
    
    // In a real implementation:
    // const response = await fetch(WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'X-Webhook-Secret': WEBHOOK_SECRET
    //   },
    //   body: JSON.stringify(payload)
    // });
    
    return new Promise(resolve => setTimeout(resolve, 100));
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'trigger': return <Clock className="w-4 h-4" />;
      case 'escalation': return <AlertTriangle className="w-4 h-4" />;
      case 'resolved': return <CheckCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (type === 'escalation' || priority === 'high') {
      return 'border-red-200 bg-red-50';
    } else if (priority === 'medium') {
      return 'border-yellow-200 bg-yellow-50';
    } else {
      return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">{unreadCount} unread notifications</p>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 ${getNotificationColor(notification.type, notification.priority)} ${
                    !notification.isRead ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-1 rounded ${
                        notification.type === 'escalation' ? 'text-red-600' : 
                        notification.priority === 'high' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 mb-1">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {notification.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded text-xs"
                          title="Mark as read"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={() => dismissNotification(notification.id)}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded"
                        title="Dismiss"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setNotifications([])}
                className="w-full text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};