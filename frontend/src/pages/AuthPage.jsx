import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../store/slices/authSlice.js';

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

  // Extract field errors if available
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
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px' }}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      
      {/* Display general error message */}
      {generalError && (
        <div style={{ 
          color: 'red', 
          marginBottom: '10px', 
          padding: '10px', 
          backgroundColor: '#ffe6e6',
          borderRadius: '4px' 
        }}>
          {generalError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '10px' }}>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              style={{ 
                width: '100%', 
                padding: '5px',
                borderColor: fieldErrors.name ? 'red' : '#ccc'
              }}
            />
            {fieldErrors.name && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {fieldErrors.name}
              </div>
            )}
          </div>
        )}
        
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '5px',
              borderColor: fieldErrors.email ? 'red' : '#ccc'
            }}
          />
          {fieldErrors.email && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
              {fieldErrors.email}
            </div>
          )}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '5px',
              borderColor: fieldErrors.password ? 'red' : '#ccc'
            }}
          />
          {fieldErrors.password && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
              {fieldErrors.password}
            </div>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px' }}>
        {isLogin ? 'No account? ' : 'Have an account? '}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setFormData({ name: '', email: '', password: '' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#007bff',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {isLogin ? 'Register here' : 'Login here'}
        </button>
      </p>
    </div>
  );
}
