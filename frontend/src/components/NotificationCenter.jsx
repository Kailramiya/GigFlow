import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../store/slices/notificationsSlice.js';
import { theme } from '../styles/theme.js';

export default function NotificationCenter() {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notifications);

  useEffect(() => {
    // Auto-remove notification after 5 seconds
    if (notifications.length > 0) {
      const timer = setTimeout(() => {
        dispatch(removeNotification(notifications[0].id));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications, dispatch]);

  const getNotificationStyles = (type) => {
    const baseStyles = {
      success: {
        background: `linear-gradient(135deg, ${theme.colors.success} 0%, ${theme.colors.secondaryLight} 100%)`,
        icon: '✓',
      },
      error: {
        background: `linear-gradient(135deg, ${theme.colors.error} 0%, #DC2626 100%)`,
        icon: '⚠',
      },
      info: {
        background: `linear-gradient(135deg, ${theme.colors.info} 0%, #2563EB 100%)`,
        icon: 'ℹ',
      },
      warning: {
        background: `linear-gradient(135deg, ${theme.colors.warning} 0%, #D97706 100%)`,
        icon: '!',
      },
    };
    return baseStyles[type] || baseStyles.info;
  };

  return (
    <div style={{
      position: 'fixed',
      top: '5rem',
      right: '1.5rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
    }}>
      {notifications.map((notification) => {
        const styles = getNotificationStyles(notification.type);
        return (
          <div
            key={notification.id}
            style={{
              background: styles.background,
              color: theme.colors.white,
              padding: '1rem 1.25rem',
              borderRadius: theme.borderRadius.xl,
              minWidth: '320px',
              maxWidth: '400px',
              boxShadow: theme.shadows.xl,
              position: 'relative',
              animation: 'slideIn 0.3s ease-out',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: theme.borderRadius.full,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.125rem',
                fontWeight: theme.typography.fontWeight.bold,
                flexShrink: 0,
              }}>
                {styles.icon}
              </div>
              
              <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                <h4 style={{
                  margin: '0 0 0.25rem 0',
                  fontSize: theme.typography.fontSize.base,
                  fontWeight: theme.typography.fontWeight.semibold,
                }}>
                  {notification.title}
                </h4>
                <p style={{
                  margin: '0',
                  fontSize: theme.typography.fontSize.sm,
                  opacity: 0.95,
                  lineHeight: 1.5,
                }}>
                  {notification.message}
                </p>
                {notification.details && (
                  <p style={{
                    margin: '0.5rem 0 0 0',
                    fontSize: theme.typography.fontSize.xs,
                    opacity: 0.85,
                    fontWeight: theme.typography.fontWeight.medium,
                  }}>
                    {notification.details}
                  </p>
                )}
              </div>
            </div>
            
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              style={{
                position: 'absolute',
                top: '0.75rem',
                right: '0.75rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                color: theme.colors.white,
                cursor: 'pointer',
                fontSize: '1.25rem',
                width: '1.5rem',
                height: '1.5rem',
                borderRadius: theme.borderRadius.full,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: `all ${theme.transitions.fast}`,
                padding: 0,
                lineHeight: 1,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              ×
            </button>
          </div>
        );
      })}
      
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
