import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice.js';
import { theme } from '../styles/theme.js';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector(state => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
  };

  return (
    <nav style={{
      backgroundColor: theme.colors.white,
      borderBottom: `1px solid ${theme.colors.border}`,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: theme.shadows.sm,
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
      }}>
        <div
          onClick={() => navigate('/')}
          style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          GigFlow
        </div>
        
        {isAuthenticated && (
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <span
              onClick={() => navigate('/')}
              style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                cursor: 'pointer',
                transition: `color ${theme.transitions.fast}`,
              }}
              onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
              onMouseLeave={(e) => e.target.style.color = theme.colors.text.secondary}
            >
              Browse Gigs
            </span>
            <span
              onClick={() => navigate('/create-gig')}
              style={{
                color: theme.colors.text.secondary,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                cursor: 'pointer',
                transition: `color ${theme.transitions.fast}`,
              }}
              onMouseEnter={(e) => e.target.style.color = theme.colors.primary}
              onMouseLeave={(e) => e.target.style.color = theme.colors.text.secondary}
            >
              Post a Gig
            </span>
          </div>
        )}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              backgroundColor: theme.colors.gray[50],
              borderRadius: theme.borderRadius.full,
            }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: theme.borderRadius.full,
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: theme.colors.white,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.semibold,
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
              }}>
                {user?.name}
              </span>
            </div>
            
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: theme.colors.primary,
                color: theme.colors.white,
                border: 'none',
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                transition: `all ${theme.transitions.base}`,
                boxShadow: theme.shadows.sm,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.colors.primaryDark;
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = theme.shadows.md;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = theme.colors.primary;
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = theme.shadows.sm;
              }}
            >
              Dashboard
            </button>
            
            <button
              onClick={handleLogout}
              style={{
                padding: '0.625rem 1.25rem',
                backgroundColor: 'transparent',
                color: theme.colors.text.secondary,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                transition: `all ${theme.transitions.base}`,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = theme.colors.gray[50];
                e.target.style.borderColor = theme.colors.error;
                e.target.style.color = theme.colors.error;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = theme.colors.border;
                e.target.style.color = theme.colors.text.secondary;
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '0.625rem 1.5rem',
              background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
              color: theme.colors.white,
              border: 'none',
              borderRadius: theme.borderRadius.lg,
              cursor: 'pointer',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              transition: `all ${theme.transitions.base}`,
              boxShadow: theme.shadows.md,
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = theme.shadows.lg;
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = theme.shadows.md;
            }}
          >
            Get Started
          </button>
        )}
      </div>
    </nav>
  );
}
