import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchGigById } from '../store/slices/gigsSlice.js';

export default function GigDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { gigId } = useParams();
  const { currentGig, loading, error } = useSelector(state => state.gigs);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (gigId) {
      dispatch(fetchGigById(gigId));
    }
  }, [dispatch, gigId]);

  if (loading) {
    return <div style={{ padding: '20px' }}>Loading gig details...</div>;
  }

  if (error) {
    return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  }

  if (!currentGig) {
    return <div style={{ padding: '20px' }}>Gig not found.</div>;
  }

  const isOwner = user?.id === currentGig.ownerId._id;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        ← Back
      </button>

      <h1>{currentGig.title}</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <p><strong>Description:</strong></p>
        <p>{currentGig.description}</p>
        
        <p><strong>Budget:</strong> ${currentGig.budget}</p>
        <p><strong>Status:</strong> {currentGig.status}</p>
        <p><strong>Owner:</strong> {currentGig.ownerId.name} ({currentGig.ownerId.email})</p>
        <p><strong>Posted:</strong> {new Date(currentGig.createdAt).toLocaleDateString()}</p>
      </div>

      {!isOwner && currentGig.status === 'open' && user && (
        <button
          onClick={() => navigate(`/submit-bid/${gigId}`)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
          }}
        >
          Submit Bid
        </button>
      )}

      {isOwner && (
        <div>
          <p><strong>Your gig</strong></p>
          <button
            onClick={() => navigate(`/edit-gig/${gigId}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ffc107',
              color: 'black',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          >
            Edit
          </button>
          <button
            onClick={() => navigate(`/bids/${gigId}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            View Bids
          </button>
        </div>
      )}

      {!user && (
        <p style={{ color: 'blue', marginTop: '20px' }}>
          <Link to="/auth" style={{ color: 'blue', textDecoration: 'underline' }}>Login</Link> to submit a bid
        </p>
      )}
    </div>
  );
}
