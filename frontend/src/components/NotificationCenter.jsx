import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeNotification } from '../store/slices/notificationsSlice.js';

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

  return (
    <div style={{ position: 'fixed', top: '70px', right: '20px', zIndex: 1000 }}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            backgroundColor: notification.type === 'success' ? '#28a745' : '#dc3545',
            color: 'white',
            padding: '15px',
            borderRadius: '4px',
            marginBottom: '10px',
            minWidth: '300px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <h4 style={{ margin: '0 0 5px 0' }}>{notification.title}</h4>
          <p style={{ margin: '0' }}>{notification.message}</p>
          {notification.details && (
            <p style={{ margin: '5px 0 0 0', fontSize: '0.9em' }}>
              {notification.details}
            </p>
          )}
          <button
            onClick={() => dispatch(removeNotification(notification.id))}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '18px',
              position: 'absolute',
              right: '10px',
              top: '10px',
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
