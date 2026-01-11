import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../store/slices/authSlice.js';
import { theme } from '../styles/theme.js';

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const fieldErrors = error?.errors || {};
  const generalError = error?.message || (typeof error === 'string' ? error : null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const result = await dispatch(loginUser({
        email: formData.email,
        password: formData.password,
      }));
      if (result.payload) {
        navigate('/');
      }
    } else {
      const result = await dispatch(registerUser(formData));
      if (result.payload) {
        navigate('/');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.xl,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '2.5rem 2.5rem 1.5rem',
          textAlign: 'center',
        }}>
          <div style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
          }}>
            GigFlow
          </div>
          <p style={{
            color: theme.colors.text.secondary,
            fontSize: theme.typography.fontSize.base,
            margin: 0,
          }}>
            {isLogin ? 'Welcome back! Sign in to continue' : 'Create your account to get started'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '0 2.5rem',
          marginBottom: '2rem',
          borderBottom: `2px solid ${theme.colors.gray[100]}`,
        }}>
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${isLogin ? theme.colors.primary : 'transparent'}`,
              color: isLogin ? theme.colors.primary : theme.colors.text.tertiary,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              cursor: 'pointer',
              transition: `all ${theme.transitions.base}`,
              marginBottom: '-2px',
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: 'transparent',
              border: 'none',
              borderBottom: `3px solid ${!isLogin ? theme.colors.primary : 'transparent'}`,
              color: !isLogin ? theme.colors.primary : theme.colors.text.tertiary,
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              cursor: 'pointer',
              transition: `all ${theme.transitions.base}`,
              marginBottom: '-2px',
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div style={{ padding: '0 2.5rem 2.5rem' }}>
          {generalError && (
            <div style={{
              padding: '1rem',
              marginBottom: '1.5rem',
              backgroundColor: `${theme.colors.error}10`,
              border: `1px solid ${theme.colors.error}30`,
              borderRadius: theme.borderRadius.lg,
              color: theme.colors.error,
              fontSize: theme.typography.fontSize.sm,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span>⚠</span>
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {!isLogin && (
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: theme.colors.text.primary,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '0.875rem 1rem',
                    fontSize: theme.typography.fontSize.base,
                    border: `2px solid ${fieldErrors.name ? theme.colors.error : theme.colors.border}`,
                    borderRadius: theme.borderRadius.lg,
                    backgroundColor: theme.colors.gray[50],
                    color: theme.colors.text.primary,
                    transition: `all ${theme.transitions.fast}`,
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.target.style.backgroundColor = theme.colors.white;
                    e.target.style.borderColor = fieldErrors.name ? theme.colors.error : theme.colors.primary;
                    e.target.style.boxShadow = `0 0 0 3px ${fieldErrors.name ? theme.colors.error : theme.colors.primary}15`;
                  }}
                  onBlur={(e) => {
                    e.target.style.backgroundColor = theme.colors.gray[50];
                    e.target.style.borderColor = fieldErrors.name ? theme.colors.error : theme.colors.border;
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {fieldErrors.name && (
                  <p style={{
                    color: theme.colors.error,
                    fontSize: theme.typography.fontSize.xs,
                    margin: '0.375rem 0 0 0',
                  }}>
                    {fieldErrors.name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
              }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: theme.typography.fontSize.base,
                  border: `2px solid ${fieldErrors.email ? theme.colors.error : theme.colors.border}`,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.gray[50],
                  color: theme.colors.text.primary,
                  transition: `all ${theme.transitions.fast}`,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = theme.colors.white;
                  e.target.style.borderColor = fieldErrors.email ? theme.colors.error : theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${fieldErrors.email ? theme.colors.error : theme.colors.primary}15`;
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = theme.colors.gray[50];
                  e.target.style.borderColor = fieldErrors.email ? theme.colors.error : theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              {fieldErrors.email && (
                <p style={{
                  color: theme.colors.error,
                  fontSize: theme.typography.fontSize.xs,
                  margin: '0.375rem 0 0 0',
                }}>
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
              }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  fontSize: theme.typography.fontSize.base,
                  border: `2px solid ${fieldErrors.password ? theme.colors.error : theme.colors.border}`,
                  borderRadius: theme.borderRadius.lg,
                  backgroundColor: theme.colors.gray[50],
                  color: theme.colors.text.primary,
                  transition: `all ${theme.transitions.fast}`,
                  boxSizing: 'border-box',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = theme.colors.white;
                  e.target.style.borderColor = fieldErrors.password ? theme.colors.error : theme.colors.primary;
                  e.target.style.boxShadow = `0 0 0 3px ${fieldErrors.password ? theme.colors.error : theme.colors.primary}15`;
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = theme.colors.gray[50];
                  e.target.style.borderColor = fieldErrors.password ? theme.colors.error : theme.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              {fieldErrors.password && (
                <p style={{
                  color: theme.colors.error,
                  fontSize: theme.typography.fontSize.xs,
                  margin: '0.375rem 0 0 0',
                }}>
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                marginTop: '0.5rem',
                background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryLight} 100%)`,
                color: theme.colors.white,
                border: 'none',
                borderRadius: theme.borderRadius.lg,
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: `all ${theme.transitions.base}`,
                boxShadow: theme.shadows.md,
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = theme.shadows.lg;
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = theme.shadows.md;
              }}
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
