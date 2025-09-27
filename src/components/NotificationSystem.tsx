import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Bell, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Report, ReportStatus } from '@/types/report';

interface Notification {
  id: string;
  type: 'status_change' | 'new_report' | 'priority_alert';
  title: string;
  message: string;
  reportId: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  reports: Report[];
}

export const NotificationSystem = ({ reports }: NotificationSystemProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Generate notifications based on reports
  useEffect(() => {
    const newNotifications: Notification[] = [];
    
    reports.forEach(report => {
      // Critical priority alerts
      if (report.priority === 'critical' && report.status === 'pending') {
        newNotifications.push({
          id: `critical-${report.id}`,
          type: 'priority_alert',
          title: 'Critical Report Alert',
          message: `A critical priority report has been submitted: ${report.description.substring(0, 50)}...`,
          reportId: report.id,
          timestamp: new Date(report.createdAt),
          read: false
        });
      }

      // Status change notifications
      if (report.status === 'resolved') {
        newNotifications.push({
          id: `resolved-${report.id}`,
          type: 'status_change',
          title: 'Report Resolved',
          message: `Your report has been resolved: ${report.description.substring(0, 50)}...`,
          reportId: report.id,
          timestamp: new Date(report.updatedAt),
          read: false
        });
      }
    });

    setNotifications(prev => {
      const existingIds = new Set(prev.map(n => n.id));
      const newOnes = newNotifications.filter(n => !existingIds.has(n.id));
      return [...prev, ...newOnes].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });
  }, [reports]);

  // Update unread count
  useEffect(() => {
    const unread = notifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'priority_alert':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-blue-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'status_change':
        return 'border-green-200 bg-green-50';
      case 'priority_alert':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-blue-200 bg-blue-50';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <Card className="absolute right-0 top-12 w-80 max-h-96 overflow-y-auto z-50 shadow-lg">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 hover:bg-muted/50 transition-colors ${
                    !notification.read ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-foreground">
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleString()}
                        </span>
                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-xs h-6 px-2"
                            >
                              Mark read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeNotification(notification.id)}
                            className="text-xs h-6 px-2 text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
