import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById } from '../store/slices/gigsSlice.js';
import { createBid, fetchMyBids } from '../store/slices/bidsSlice.js';
import { validatePrice, validateBidMessage } from '../utils/validation.js';

export default function SubmitBidPage() {
  let { gigId } = useParams();
  // Clean up gigId in case it has `:1` or other artifacts
  gigId = gigId?.split(':')[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentGig, loading: gigLoading, error: gigError } = useSelector(state => state.gigs);
  const { myBids, loading, error } = useSelector(state => state.bids);
  const { user } = useSelector(state => state.auth);

  const [formData, setFormData] = useState({
    price: '',
    message: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});

  // Check if user has already submitted a bid for this gig
  const existingBid = myBids?.find(bid => 
    bid?.gigId?._id === gigId || bid?.gigId === gigId
  );

  useEffect(() => {
    if (gigId) {
      dispatch(fetchGigById(gigId));
      dispatch(fetchMyBids());
    }
  }, [gigId, dispatch]);

  // Check if user is the gig owner
  if (currentGig && user && user.id === currentGig.ownerId?._id) {
    return (
      <div style={{ padding: '20px', color: 'red', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Cannot Submit Bid</h2>
        <p>You cannot submit a bid on your own gig.</p>
        <button onClick={() => navigate(`/gig/${gigId}`)}>← Back to Gig</button>
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

    // Validate all fields
    const errors = {};

    const priceError = validatePrice(formData.price);
    if (priceError) errors.price = priceError;

    const messageError = validateBidMessage(formData.message);
    if (messageError) errors.message = messageError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    const result = await dispatch(createBid({
      gigId,
      price: parseFloat(formData.price),
      message: formData.message,
    }));

    if (createBid.fulfilled.match(result)) {
      // Success - redirect to gig page
      navigate(`/gig/${gigId}`);
    } else if (createBid.rejected.match(result)) {
      // Handle errors from backend
      if (result.payload?.errors) {
        setFieldErrors(result.payload.errors);
      }
    }
  };

  if (gigLoading && !currentGig) {
    return <div style={{ padding: '20px' }}>Loading gig details...</div>;
  }

  if (gigError) {
    return <div style={{ padding: '20px', color: 'red' }}>Error loading gig: {gigError}</div>;
  }

  if (!currentGig) {
    return <div style={{ padding: '20px' }}>Gig not found.</div>;
  }

  // If user already submitted a bid, show the existing bid
  if (existingBid) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
        <button
          onClick={() => navigate(`/gig/${gigId}`)}
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
          ← Back to Gig
        </button>

        <h1>Your Bid</h1>

        <div style={{
          backgroundColor: '#d4edda',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #c3e6cb',
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#155724', fontWeight: 'bold' }}>
            ✓ You have already submitted a bid for this gig
          </p>
        </div>

        {/* Gig Info */}
        <div style={{
          backgroundColor: '#f5f5f5',
          padding: '15px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{currentGig.title}</h3>
          <p style={{ margin: '5px 0', color: '#666' }}>
            <strong>Budget:</strong> ${currentGig.budget}
          </p>
        </div>

        {/* Existing Bid Details */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white',
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Your Bid Details</h3>
          
          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
              <strong>Your Price:</strong>
            </p>
            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#28a745' }}>
              ${existingBid.price}
            </p>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
              <strong>Status:</strong>
            </p>
            <p style={{
              margin: '0',
              fontSize: '16px',
              fontWeight: 'bold',
              color: existingBid.status === 'accepted' ? '#28a745' : existingBid.status === 'rejected' ? '#dc3545' : '#17a2b8'
            }}>
              {existingBid.status.charAt(0).toUpperCase() + existingBid.status.slice(1)}
            </p>
          </div>

          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '4px',
            borderLeft: '4px solid #17a2b8',
          }}>
            <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
              <strong>Your Message:</strong>
            </p>
            <p style={{ margin: '0', color: '#333', whiteSpace: 'pre-wrap' }}>
              {existingBid.message}
            </p>
          </div>

          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
            <p style={{ margin: '0', color: '#999', fontSize: '12px' }}>
              Submitted on {new Date(existingBid.createdAt).toLocaleDateString()} at {new Date(existingBid.createdAt).toLocaleTimeString()}
            </p>
          </div>
        </div>

        {existingBid.status === 'pending' && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#fff3cd',
            borderRadius: '4px',
            border: '1px solid #ffeeba',
          }}>
            <p style={{ margin: '0', color: '#856404', fontSize: '14px' }}>
              Your bid is pending review by the gig owner. You will be notified if your bid is accepted.
            </p>
          </div>
        )}

        {existingBid.status === 'accepted' && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#d4edda',
            borderRadius: '4px',
            border: '1px solid #c3e6cb',
          }}>
            <p style={{ margin: '0', color: '#155724', fontSize: '14px', fontWeight: 'bold' }}>
              🎉 Congratulations! Your bid has been accepted. The gig owner will contact you soon.
            </p>
          </div>
        )}

        {existingBid.status === 'rejected' && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8d7da',
            borderRadius: '4px',
            border: '1px solid #f5c6cb',
          }}>
            <p style={{ margin: '0', color: '#721c24', fontSize: '14px' }}>
              Unfortunately, your bid was not accepted for this gig.
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <button
        onClick={() => navigate(`/gig/${gigId}`)}
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
        ← Back to Gig
      </button>

      <h1>Submit Your Bid</h1>

      {/* Gig Info */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px',
      }}>
        <h3 style={{ margin: '0 0 10px 0' }}>{currentGig.title}</h3>
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Budget:</strong> ${currentGig.budget}
        </p>
        <p style={{ margin: '5px 0', color: '#666' }}>
          <strong>Status:</strong> {currentGig.status}
        </p>
      </div>

      {/* Error Message */}
      {error && typeof error === 'object' && error.message && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#f8d7da',
          color: '#721c24',
          borderRadius: '4px',
          border: '1px solid #f5c6cb'
        }}>
          {error.message}
        </div>
      )}

      {error && typeof error === 'string' && (
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

      {/* GigId-specific errors (duplicate bid, ownership, etc) */}
      {fieldErrors.gigId && (
        <div style={{
          padding: '15px',
          marginBottom: '20px',
          backgroundColor: '#fff3cd',
          color: '#856404',
          borderRadius: '4px',
          border: '1px solid #ffeeba'
        }}>
          {fieldErrors.gigId}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Price */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Your Proposed Price ($) *
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g., 75"
            step="0.01"
            min="0"
            style={{
              width: '100%',
              padding: '10px',
              border: fieldErrors.price ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
            }}
          />
          {fieldErrors.price && (
            <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
              {fieldErrors.price}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
            Gig budget: ${currentGig.budget}
          </p>
        </div>

        {/* Message */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Cover Letter / Message *
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Explain why you're the best fit for this gig..."
            rows="8"
            style={{
              width: '100%',
              padding: '10px',
              border: fieldErrors.message ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
            }}
          />
          {fieldErrors.message && (
            <p style={{ color: '#dc3545', fontSize: '12px', margin: '5px 0 0 0' }}>
              {fieldErrors.message}
            </p>
          )}
          <p style={{ fontSize: '12px', color: '#666', margin: '5px 0 0 0' }}>
            10-500 characters ({formData.message.length}/500)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Submitting...' : 'Submit Bid'}
        </button>
      </form>
    </div>
  );
}
