import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBidsForGig, hireBid, updateBidStatus, clearBidsError } from '../store/slices/bidsSlice.js';
import { fetchGigById } from '../store/slices/gigsSlice.js';

export default function BidsPage() {
  const { gigId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { selectedGigBids, loading, error } = useSelector(state => state.bids);
  const { currentGig } = useSelector(state => state.gigs);
  const { user } = useSelector(state => state.auth);

  useEffect(() => {
    if (gigId) {
      dispatch(fetchGigById(gigId));
      dispatch(fetchBidsForGig(gigId));
    }
  }, [gigId, dispatch]);

  const handleHireBid = (bidId) => {
    if (window.confirm('Are you sure you want to hire this freelancer?')) {
      dispatch(hireBid(bidId));
    }
  };

  const handleAcceptBid = (bidId) => {
    dispatch(updateBidStatus({ bidId, status: 'accepted' }));
  };

  const handleRejectBid = (bidId) => {
    dispatch(updateBidStatus({ bidId, status: 'rejected' }));
  };

  const isGigOwner = user && currentGig && user.id === currentGig.ownerId?._id;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      {/* Back Button */}
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

      {/* Header */}
      <h1>Bids for Gig</h1>
      {currentGig && (
        <p style={{ color: '#666', marginBottom: '20px' }}>
          <strong>{currentGig.title}</strong> - Budget: ${currentGig.budget}
        </p>
      )}

      {/* Error Message */}
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

      {/* Loading State */}
      {loading && <p>Loading bids...</p>}

      {/* No Bids */}
      {!loading && selectedGigBids.length === 0 && (
        <p style={{ color: '#999', fontSize: '16px', padding: '20px', textAlign: 'center' }}>
          No bids yet for this gig
        </p>
      )}

      {/* Bids List */}
      {!loading && selectedGigBids.length > 0 && (
        <div>
          <p style={{ color: '#666', marginBottom: '20px' }}>
            Total bids: <strong>{selectedGigBids.length}</strong>
          </p>

          {selectedGigBids.map((bid) => (
            <div
              key={bid._id}
              style={{
                padding: '20px',
                marginBottom: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              {/* Bidder Info */}
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>
                  {bid.postedBy.name}
                </h3>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  Email: {bid.postedBy.email}
                </p>
              </div>

              {/* Bid Details */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '15px',
                marginBottom: '15px',
              }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                    Proposed Price
                  </p>
                  <p style={{ margin: '0', fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
                    ${bid.price}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
                    Status
                  </p>
                  <p style={{
                    margin: '0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: bid.status === 'accepted' ? '#28a745' : bid.status === 'rejected' ? '#dc3545' : '#17a2b8'
                  }}>
                    {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div style={{
                backgroundColor: 'white',
                padding: '10px',
                borderRadius: '4px',
                marginBottom: '15px',
                borderLeft: '4px solid #17a2b8',
              }}>
                <p style={{ margin: '0', color: '#333' }}>
                  {bid.message}
                </p>
              </div>

              {/* Action Buttons (Only for Gig Owner) */}
              {isGigOwner && bid.status === 'pending' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => handleAcceptBid(bid._id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Accept & Hire
                  </button>
                  <button
                    onClick={() => handleRejectBid(bid._id)}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Reject
                  </button>
                </div>
              )}

              {isGigOwner && bid.status === 'accepted' && (
                <p style={{
                  padding: '10px',
                  backgroundColor: '#d4edda',
                  color: '#155724',
                  borderRadius: '4px',
                  margin: '0',
                  fontWeight: 'bold',
                }}>
                  ✓ This freelancer has been hired
                </p>
              )}

              {isGigOwner && bid.status === 'rejected' && (
                <p style={{
                  padding: '10px',
                  backgroundColor: '#f8d7da',
                  color: '#721c24',
                  borderRadius: '4px',
                  margin: '0',
                  fontWeight: 'bold',
                }}>
                  ✗ This bid was rejected
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
