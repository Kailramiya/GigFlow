import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice.js';

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
      backgroundColor: '#333',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
    }}>
      <div style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>
        <span onClick={() => navigate('/')}>ServiceHive</span>
      </div>
      
      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: '20px' }}>{user?.name}</span>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                marginRight: '10px',
                padding: '5px 10px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Dashboard
            </button>
            <button
              onClick={handleLogout}
              style={{
                padding: '5px 10px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '5px 10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
