import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WorkflowNotification } from '@/store/api';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: WorkflowNotification[];
  unreadCount: number;
  addNotification: (notification: Omit<WorkflowNotification, 'id' | 'created_at' | 'is_read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  removeNotification: (notificationId: string) => void;
  getNotificationsByType: (type: WorkflowNotification['type']) => WorkflowNotification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<WorkflowNotification[]>([]);

  // Mock notifications for demonstration
  useEffect(() => {
    if (user) {
      const mockNotifications: WorkflowNotification[] = [
        {
          id: '1',
          type: 'draft_ready',
          title: 'New Timetable Ready for Review',
          message: 'Dr. John Smith has finalized a new timetable for Computer Science department.',
          timetable_id: 1,
          from_user_id: 2,
          to_user_id: parseInt(user.id),
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          is_read: false
        },
        {
          id: '2',
          type: 'published',
          title: 'Timetable Published',
          message: 'The Computer Science Semester 1 timetable has been approved and published.',
          timetable_id: 2,
          from_user_id: 3,
          to_user_id: parseInt(user.id),
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
          is_read: true
        },
        {
          id: '3',
          type: 'updated',
          title: 'Timetable Updated',
          message: 'A published timetable has been modified. Please review the changes.',
          timetable_id: 3,
          from_user_id: 2,
          to_user_id: parseInt(user.id),
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          is_read: false
        },
        {
          id: '4',
          type: 'conflict_detected',
          title: 'Conflicts Detected',
          message: 'New conflicts have been detected in the Mechanical Engineering timetable.',
          timetable_id: 4,
          from_user_id: 1, // System notification
          to_user_id: parseInt(user.id),
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
          is_read: false
        }
      ];

      // Filter notifications based on user role and permissions
      const filteredNotifications = mockNotifications.filter(notification => {
        if (user.role === 'admin') return true;
        
        // Publisher mentors get draft_ready notifications
        if (user.role === 'mentor' && user.mentor_type === 'publisher') {
          return ['draft_ready', 'conflict_detected'].includes(notification.type);
        }
        
        // Creator mentors get published/updated notifications
        if (user.role === 'mentor' && user.mentor_type === 'creator') {
          return ['published', 'updated', 'conflict_detected'].includes(notification.type);
        }
        
        return false;
      });

      setNotifications(filteredNotifications);
    }
  }, [user]);

  const addNotification = (notificationData: Omit<WorkflowNotification, 'id' | 'created_at' | 'is_read'>) => {
    const newNotification: WorkflowNotification = {
      ...notificationData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      is_read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, is_read: true }))
    );
  };

  const removeNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationsByType = (type: WorkflowNotification['type']) => {
    return notifications.filter(notification => notification.type === type);
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    getNotificationsByType
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Notification service functions
export const NotificationService = {
  // Send notification when Creator finalizes a draft
  sendDraftReadyNotification: (creatorId: number, publisherId: number, timetableId: number, timetableName: string) => {
    return {
      type: 'draft_ready' as const,
      title: 'New Timetable Ready for Review',
      message: `A new timetable "${timetableName}" has been finalized and is ready for your review.`,
      timetable_id: timetableId,
      from_user_id: creatorId,
      to_user_id: publisherId
    };
  },

  // Send notification when Publisher publishes a timetable
  sendPublishedNotification: (publisherId: number, creatorId: number, timetableId: number, timetableName: string) => {
    return {
      type: 'published' as const,
      title: 'Timetable Published',
      message: `Your timetable "${timetableName}" has been approved and published successfully.`,
      timetable_id: timetableId,
      from_user_id: publisherId,
      to_user_id: creatorId
    };
  },

  // Send notification when timetable is updated after publication
  sendUpdatedNotification: (modifierId: number, recipientId: number, timetableId: number, timetableName: string) => {
    return {
      type: 'updated' as const,
      title: 'Timetable Updated',
      message: `The published timetable "${timetableName}" has been modified. Please review the changes.`,
      timetable_id: timetableId,
      from_user_id: modifierId,
      to_user_id: recipientId
    };
  },

  // Send notification when conflicts are detected
  sendConflictNotification: (timetableId: number, recipientId: number, conflictCount: number, timetableName: string) => {
    return {
      type: 'conflict_detected' as const,
      title: 'Conflicts Detected',
      message: `${conflictCount} conflicts have been detected in "${timetableName}". Please review and resolve them.`,
      timetable_id: timetableId,
      from_user_id: 1, // System notification
      to_user_id: recipientId
    };
  }
};