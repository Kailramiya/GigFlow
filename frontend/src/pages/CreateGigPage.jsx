import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../store/slices/gigsSlice.js';

export default function CreateGigPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { loading, error } = useSelector(state => state.gigs);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
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
    const result = await dispatch(createGig({
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget),
    }));
    
    if (createGig.fulfilled.match(result)) {
      // Navigate to the specific gig page or feed instead of dashboard
      navigate('/');
    }
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h1>Create a New Gig</h1>

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
        <div style={{ marginBottom: '15px' }}>
          <label><strong>Gig Title</strong></label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Write a professional resume"
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderColor: fieldErrors.title ? 'red' : '#ccc',
              border: `1px solid ${fieldErrors.title ? 'red' : '#ccc'}`,
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {fieldErrors.title && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
              {fieldErrors.title}
            </div>
          )}
          <small style={{ color: '#666' }}>Minimum 5 characters, maximum 100</small>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label><strong>Description</strong></label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you need done in detail..."
            required
            rows="6"
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderColor: fieldErrors.description ? 'red' : '#ccc',
              border: `1px solid ${fieldErrors.description ? 'red' : '#ccc'}`,
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontFamily: 'Arial, sans-serif',
            }}
          />
          {fieldErrors.description && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
              {fieldErrors.description}
            </div>
          )}
          <small style={{ color: '#666' }}>Minimum 10 characters, maximum 2000</small>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label><strong>Budget ($)</strong></label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g., 50.00"
            step="0.01"
            min="0"
            required
            style={{
              width: '100%',
              padding: '8px',
              marginTop: '5px',
              borderColor: fieldErrors.budget ? 'red' : '#ccc',
              border: `1px solid ${fieldErrors.budget ? 'red' : '#ccc'}`,
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
          {fieldErrors.budget && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
              {fieldErrors.budget}
            </div>
          )}
          <small style={{ color: '#666' }}>Must be greater than 0</small>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              fontSize: '16px',
            }}
          >
            {loading ? 'Creating...' : 'Create Gig'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
