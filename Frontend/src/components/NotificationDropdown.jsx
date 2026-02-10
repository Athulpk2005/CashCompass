import { useRef, useEffect } from 'react';
import {
  MdNotifications,
  MdNotificationsActive,
  MdClose,
  MdCheckCircle,
  MdDelete,
  MdTrendingUp,
  MdTrendingDown,
  MdFlag,
  MdShowChart,
  MdInfo,
} from 'react-icons/md';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'transaction':
      return <MdTrendingUp className="text-emerald-500" />;
    case 'budget':
      return <MdTrendingDown className="text-orange-500" />;
    case 'goal':
      return <MdFlag className="text-primary" />;
    case 'investment':
      return <MdShowChart className="text-blue-500" />;
    default:
      return <MdInfo className="text-slate-500" />;
  }
};

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return date.toLocaleDateString();
};

export default function NotificationDropdown({ darkMode }) {
  const {
    notifications,
    unreadCount,
    loading,
    dropdownOpen,
    setDropdownOpen,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();
  
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, setDropdownOpen]);

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    if (notification.link) {
      navigate(notification.link);
      setDropdownOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30 rounded-lg transition-colors"
        title="Notifications"
      >
        {unreadCount > 0 ? (
          <MdNotificationsActive className="text-xl text-primary" />
        ) : (
          <MdNotifications className="text-xl" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 size-4 bg-red-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center min-w-[16px]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-[#0a140d] border border-slate-200 dark:border-emerald-900/30 rounded-xl shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-emerald-900/30 bg-slate-50 dark:bg-emerald-900/10">
            <div className="flex items-center gap-2">
              <MdNotificationsActive className="text-primary" />
              <h3 className="font-bold text-slate-800 dark:text-emerald-100">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-500 text-xs font-bold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                <MdNotifications className="text-4xl text-slate-300 dark:text-emerald-500/30 mb-2" />
                <p className="text-slate-500 dark:text-emerald-500/60 text-sm">No notifications yet</p>
                <p className="text-xs text-slate-400 dark:text-emerald-500/40 mt-1">We'll notify you when something happens</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-emerald-900/20">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`flex items-start gap-3 p-4 hover:bg-slate-50 dark:hover:bg-emerald-900/10 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-primary/5 dark:bg-emerald-900/20' : ''
                    }`}
                  >
                    <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${
                      !notification.read 
                        ? 'bg-primary/10 dark:bg-emerald-900/30' 
                        : 'bg-slate-100 dark:bg-emerald-900/20'
                    }`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm font-medium truncate ${
                          !notification.read 
                            ? 'text-slate-800 dark:text-emerald-100' 
                            : 'text-slate-600 dark:text-emerald-100/70'
                        }`}>
                          {notification.title}
                        </p>
                        <span className="text-xs text-slate-400 dark:text-emerald-500/50 shrink-0">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-emerald-500/60 mt-0.5 line-clamp-2">
                        {notification.message}
                      </p>
                      {!notification.read && (
                        <span className="inline-block mt-1.5 size-2 bg-primary rounded-full"></span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification._id);
                      }}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors shrink-0"
                      title="Delete"
                    >
                      <MdClose className="text-sm" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-3 border-t border-slate-100 dark:border-emerald-900/30 bg-slate-50 dark:bg-emerald-900/10">
              <button
                onClick={() => {
                  // Navigate to notifications settings or mark all deleted
                  deleteNotification(notifications.map(n => n._id));
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-emerald-500/60 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <MdDelete className="text-lg" />
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
