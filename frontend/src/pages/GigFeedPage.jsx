import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { fetchAllGigs } from '../store/slices/gigsSlice.js';

export default function GigFeedPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { allGigs, loading, error, pagination } = useSelector(state => state.gigs);
  const [searchTitle, setSearchTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAllGigs({ title: searchTitle, page: currentPage }));
  }, [dispatch, searchTitle, currentPage]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1>Available Gigs</h1>
      
      <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search gigs by title..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          style={{ padding: '10px', width: '300px', marginRight: '10px' }}
        />
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </form>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
      
      {loading ? (
        <p>Loading gigs...</p>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            {allGigs.length === 0 ? (
              <p>No gigs found.</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}>
                {allGigs.map(gig => (
                  <div
                    key={gig._id}
                    style={{
                      border: '1px solid #ddd',
                      padding: '15px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/gig/${gig._id}`)}
                  >
                    <h3>{gig.title}</h3>
                    <p>{gig.description.substring(0, 100)}...</p>
                    <p><strong>Budget:</strong> ${gig.budget}</p>
                    <p><strong>Owner:</strong> {gig.ownerId?.name || 'Unknown Owner'}</p>
                    <p><strong>Status:</strong> {gig.status}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {pagination.pages > 1 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{ marginRight: '10px', padding: '5px 10px' }}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {pagination.pages}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === pagination.pages}
                style={{ marginLeft: '10px', padding: '5px 10px' }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
