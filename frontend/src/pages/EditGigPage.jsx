import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById, updateGig } from '../store/slices/gigsSlice.js';
import { validateGigTitle, validateDescription, validateBudget } from '../utils/validation.js';

export default function EditGigPage() {
  let { gigId } = useParams();
  // Clean up gigId in case it has `:1` or other artifacts
  gigId = gigId?.split(':')[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentGig, loading, error } = useSelector(state => state.gigs);
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    status: 'open',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (gigId) {
      dispatch(fetchGigById(gigId));
    }
  }, [gigId, dispatch]);

  useEffect(() => {
    if (currentGig) {
      setFormData({
        title: currentGig.title,
        description: currentGig.description,
        budget: currentGig.budget,
        status: currentGig.status,
      });
    }
  }, [currentGig]);

  // Check if user is the gig owner
  if (currentGig && user && user.id !== currentGig.ownerId?._id) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h2>Unauthorized</h2>
        <p>You can only edit your own gigs.</p>
        <button onClick={() => navigate(-1)}>← Back</button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all fields
    const errors = {};

    const titleError = validateGigTitle(formData.title);
    if (titleError) errors.title = titleError;

    const descError = validateDescription(formData.description);
    if (descError) errors.description = descError;

    const budgetError = validateBudget(formData.budget);
    if (budgetError) errors.budget = budgetError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsSubmitting(false);
      return;
    }

    const result = await dispatch(updateGig({
      gigId,
      title: formData.title,
      description: formData.description,
      budget: parseFloat(formData.budget),
      status: formData.status,
    }));

    setIsSubmitting(false);

    // Check if the update was successful
    if (result.payload && result.payload._id) {
      // Success - navigate to gig detail page
      navigate(`/gig/${gigId}`);
    } else if (result.payload?.errors) {
      // Error - show field errors if available
      setFieldErrors(result.payload.errors);
    } else if (typeof result.payload === 'string') {
      // Server returned an error message
      setFieldErrors({ general: result.payload });
    }
  };

  if (loading && !currentGig) {
    return <div style={{ padding: '20px' }}>Loading gig...</div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          padding: '10px 20px',
          marginBottom: '20px',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        ← Back
      </button>

      <h1>Edit Gig</h1>

      {error && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Gig Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Create a professional logo"
            style={{
              width: '100%',
              padding: '10px',
              border: fieldErrors.title ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          {fieldErrors.title && (
            <p style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px', margin: '5px 0 0 0' }}>
              {fieldErrors.title}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
            5-100 characters
          </p>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you need..."
            rows="6"
            style={{
              width: '100%',
              padding: '10px',
              border: fieldErrors.description ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          {fieldErrors.description && (
            <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
              {fieldErrors.description}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
            10-2000 characters ({formData.description.length}/2000)
          </p>
        </div>

        {/* Budget */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Budget ($) *
          </label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="e.g., 100"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '10px',
              border: fieldErrors.budget ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          {fieldErrors.budget && (
            <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
              {fieldErrors.budget}
            </p>
          )}
        </div>

        {/* Status */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Status *
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? 'Updating...' : 'Update Gig'}
        </button>
      </form>
    </div>
  );
}
