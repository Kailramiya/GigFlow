import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './store/slices/authSlice.js';
import { addNotification } from './store/slices/notificationsSlice.js';
import { connectSocket, disconnectSocket } from './services/socketService.js';
import Navbar from './components/Navbar.jsx';
import NotificationCenter from './components/NotificationCenter.jsx';
import AuthPage from './pages/AuthPage.jsx';
import GigFeedPage from './pages/GigFeedPage.jsx';
import GigDetailPage from './pages/GigDetailPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import CreateGigPage from './pages/CreateGigPage.jsx';
import EditGigPage from './pages/EditGigPage.jsx';
import BidsPage from './pages/BidsPage.jsx';
import SubmitBidPage from './pages/SubmitBidPage.jsx';
import { theme } from './styles/theme.js';

export default function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);

  useEffect(() => {
    // Check if user is already logged in
    dispatch(getCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect socket when user is authenticated
      const socket = connectSocket(user.id);

      // Listen for hiring notifications
      socket.on('bid_accepted', (data) => {
        dispatch(addNotification({
          type: 'success',
          title: data.message,
          message: `Gig: ${data.gigTitle}`,
          details: `Your bid of $${data.bidPrice} has been accepted!`,
        }));
      });

      return () => {
        socket.off('bid_accepted');
      };
    } else {
      // Disconnect socket when user logs out
      disconnectSocket();
    }
  }, [isAuthenticated, user, dispatch]);

  if (loading) {
    return <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: theme.colors.background,
      fontFamily: theme.typography.fontFamily.sans,
    }}>
      <div style={{
        textAlign: 'center',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: `4px solid ${theme.colors.gray[200]}`,
          borderTopColor: theme.colors.primary,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1rem',
        }}></div>
        <p style={{
          color: theme.colors.text.secondary,
          fontSize: theme.typography.fontSize.base,
        }}>Loading...</p>
      </div>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>;
  }

  return (
    <div style={{
      fontFamily: theme.typography.fontFamily.sans,
      backgroundColor: theme.colors.background,
      minHeight: '100vh',
    }}>
      <BrowserRouter>
      <Navbar />
      <NotificationCenter />
      <Routes>
        <Route path="/" element={<GigFeedPage />} />
        <Route path="/gig/:gigId" element={<GigDetailPage />} />
        <Route path="/bids/:gigId" element={isAuthenticated ? <BidsPage /> : <Navigate to="/auth" />} />
        <Route path="/submit-bid/:gigId" element={isAuthenticated ? <SubmitBidPage /> : <Navigate to="/auth" />} />
        <Route path="/create-gig" element={isAuthenticated ? <CreateGigPage /> : <Navigate to="/auth" />} />
        <Route path="/edit-gig/:gigId" element={isAuthenticated ? <EditGigPage /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={!isAuthenticated ? <AuthPage /> : <Navigate to="/" />} />
        <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/auth" />} />
        <Route path="*" element={<div style={{ padding: '20px', textAlign: 'center' }}><h1>404 - Page Not Found</h1></div>} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}
