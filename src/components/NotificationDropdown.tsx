import React, { useState } from 'react';
import { Bell, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserRole } from '@/components/LoginSignup';

interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

interface NotificationDropdownProps {
  userRole: UserRole;
}

const getNotificationsForRole = (role: UserRole): Notification[] => {
  const baseTime = new Date();
  
  const roleNotifications: Record<UserRole, Notification[]> = {
    farmer: [
      {
        id: '1',
        title: 'Payment Received',
        message: 'Payment of ₹15,000 received for batch HB-TUR001',
        timestamp: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'success'
      },
      {
        id: '2',
        title: 'Batch Collected',
        message: 'Your turmeric batch has been collected by aggregator',
        timestamp: new Date(baseTime.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'info'
      },
      {
        id: '3',
        title: 'Upload Reminder',
        message: 'Remember to upload your harvest details',
        timestamp: new Date(baseTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'warning'
      }
    ],
    aggregator: [
      {
        id: '1',
        title: 'New Batch Available',
        message: '5 new batches available for collection in Karnataka',
        timestamp: new Date(baseTime.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'info'
      },
      {
        id: '2',
        title: 'Quality Check Passed',
        message: 'Batch HB-TUR001 passed quality inspection',
        timestamp: new Date(baseTime.getTime() - 3 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'success'
      }
    ],
    distributor: [
      {
        id: '1',
        title: 'Shipment Update',
        message: 'Delivery scheduled for tomorrow morning',
        timestamp: new Date(baseTime.getTime() - 30 * 60 * 1000).toISOString(),
        read: false,
        type: 'info'
      },
      {
        id: '2',
        title: 'Route Optimized',
        message: 'New optimal route calculated for your deliveries',
        timestamp: new Date(baseTime.getTime() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'success'
      }
    ],
    processor: [
      {
        id: '1',
        title: 'Certificate Expiring',
        message: 'Quality certificate for batch HB-TUR001 expires in 3 days',
        timestamp: new Date(baseTime.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'warning'
      },
      {
        id: '2',
        title: 'Processing Complete',
        message: 'Turmeric powder processing completed successfully',
        timestamp: new Date(baseTime.getTime() - 6 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'success'
      }
    ],
    admin: [
      {
        id: '1',
        title: 'Fraud Alert',
        message: 'Duplicate QR code detected in Karnataka region',
        timestamp: new Date(baseTime.getTime() - 15 * 60 * 1000).toISOString(),
        read: false,
        type: 'error'
      },
      {
        id: '2',
        title: 'Approval Needed',
        message: '3 batches require your approval',
        timestamp: new Date(baseTime.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'warning'
      },
      {
        id: '3',
        title: 'System Update',
        message: 'Platform maintenance scheduled for tonight',
        timestamp: new Date(baseTime.getTime() - 4 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'info'
      }
    ]
  };

  return roleNotifications[role] || [];
};

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ userRole }) => {
  const [notifications, setNotifications] = useState(getNotificationsForRole(userRole));

  const unreadCount = notifications.filter(n => !n.read).length;

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

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-primary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 bg-popover">
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              <Check className="w-3 h-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="h-80">
          {notifications.length === 0 ? (
            <div className="px-3 py-6 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <DropdownMenuItem
                  className={`px-3 py-3 cursor-pointer ${!notification.read ? 'bg-accent/50' : ''}`}
                  onSelect={() => markAsRead(notification.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className={`text-sm font-medium ${getTypeColor(notification.type)}`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full mt-1 ml-2 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTimestamp(notification.timestamp)}
                    </p>
                  </div>
                </DropdownMenuItem>
                {index < notifications.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;