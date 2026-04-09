import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import deviceService from '../services/deviceService';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  // Check for expiring warranties and add notifications
  useEffect(() => {
    const checkWarranties = async () => {
      try {
        // Get devices from API
        const devices = await deviceService.getAllDevices();
        
        // Find devices with warranties expiring in 30 days
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        
        const expiringDevices = devices.filter(device => {
          const warrantyEnd = new Date(device.warrantyEndDate);
          return warrantyEnd > today && warrantyEnd <= thirtyDaysFromNow;
        });
        
        // Create notifications for expiring devices
        const warrantyNotifications = expiringDevices.map(device => ({
          id: `warranty-${device.id}`,
          type: 'warning',
          title: 'Warranty Expiring Soon',
          message: `${device.manufacturer} ${device.model} warranty expires on ${new Date(device.warrantyEndDate).toLocaleDateString()}`,
          read: false,
          date: new Date().toISOString()
        }));
        
        // Add seasonal maintenance reminders
        const currentMonth = today.getMonth();
        let seasonalNotifications = [];
        
        // Summer AC maintenance reminder (May)
        if (currentMonth === 4) {
          seasonalNotifications.push({
            id: 'seasonal-summer-ac',
            type: 'info',
            title: 'Summer is Coming!',
            message: 'Time to clean your AC filters for optimal performance.',
            read: false,
            date: new Date().toISOString()
          });
        }
        
        // Winter heating system reminder (October)
        if (currentMonth === 9) {
          seasonalNotifications.push({
            id: 'seasonal-winter-heating',
            type: 'info',
            title: 'Winter is Coming!',
            message: 'Schedule maintenance for your heating system before winter arrives.',
            read: false,
            date: new Date().toISOString()
          });
        }
        
        // Combine all notifications
        setNotifications(prev => {
          // Filter out duplicates by ID
          const existingIds = prev.map(n => n.id);
          const newNotifications = [...warrantyNotifications, ...seasonalNotifications]
            .filter(n => !existingIds.includes(n.id));
          
          return [...prev, ...newNotifications];
        });
        
      } catch (error) {
        console.error('Error checking warranties:', error);
      }
    };
    
    checkWarranties();
    
    // Check for new notifications daily
    const interval = setInterval(checkWarranties, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  // Add a new notification
  const addNotification = (notification) => {
    setNotifications(prev => [
      {
        id: `notification-${Date.now()}`,
        read: false,
        date: new Date().toISOString(),
        ...notification
      },
      ...prev
    ]);
  };
  
  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Remove a notification
  const removeNotification = (id) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Get unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        addNotification, 
        markAsRead, 
        markAllAsRead, 
        removeNotification, 
        clearAllNotifications,
        unreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 