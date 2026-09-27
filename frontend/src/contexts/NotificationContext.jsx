import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';


const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications] = useState([]);
  const noop = () => {};
  return <NotificationContext.Provider value={{ notifications, loading: false, unreadCount: 0, addNotification: noop, markAsRead: noop, markAllAsRead: noop, removeNotification: noop, clearAllNotifications: noop }}>{children}</NotificationContext.Provider>;
}
NotificationProvider.propTypes = { children: PropTypes.node.isRequired };
export function useNotifications() { const context = useContext(NotificationContext); if (!context) throw new Error('useNotifications must be used within a NotificationProvider'); return context; }
