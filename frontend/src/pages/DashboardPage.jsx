import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMyGigs, createGig } from '../store/slices/gigsSlice.js';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const { myGigs, loading, error } = useSelector(state => state.gigs);

  useEffect(() => {
    if (user) {
      dispatch(fetchMyGigs());
    } else {
      navigate('/auth');
    }
  }, [dispatch, user, navigate]);

  const handleCreateNewGig = () => {
    navigate('/create-gig');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Dashboard</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>Welcome, {user?.name}!</h2>
        <p>Email: {user?.email}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>My Gigs</h2>
        <button
          onClick={handleCreateNewGig}
          style={{
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          + Create New Gig
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {loading ? (
        <p>Loading your gigs...</p>
      ) : (
        <>
          {myGigs.length === 0 ? (
            <p>You haven't created any gigs yet.</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {myGigs.map(gig => (
                <div
                  key={gig._id}
                  style={{
                    border: '1px solid #ddd',
                    padding: '15px',
                    borderRadius: '8px',
                  }}
                >
                  <h3>{gig.title}</h3>
                  <p>{gig.description.substring(0, 100)}...</p>
                  <p><strong>Budget:</strong> ${gig.budget}</p>
                  <p><strong>Status:</strong> {gig.status}</p>
                  <div style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => navigate(`/gig/${gig._id}`)}
                      style={{
                        padding: '5px 10px',
                        marginRight: '5px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      View
                    </button>
                    <button
                      onClick={() => navigate(`/bids/${gig._id}`)}
                      style={{
                        padding: '5px 10px',
                        backgroundColor: '#17a2b8',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Bids
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
