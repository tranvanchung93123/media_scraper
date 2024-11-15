// src/components/MediaList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MediaList = () => {
  // State variables
  const [media, setMedia] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState('');
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);

  // Function to fetch media items based on page, type, and searchText
  const fetchMedia = async () => {
    setLoading(true);
    setError(null);
    // const apiUrl = process.env.REACT_APP_API_URL;
    console.log('API URL:', process.env.REACT_APP_API_URL);

    const apiUrl = 'http://localhost:4000'; // Temporary hardcoding

    if (!apiUrl) {
      console.error('REACT_APP_API_URL is not defined in .env file');
      return;
    }
    try {
      console.log('==========================');
      const response = await axios.get(`${apiUrl}/api/media`, {
        params: { page, type, search: searchText },
      });
      console.log(response)
  
      setMedia(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError("Failed to fetch media. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch media items when page, type, or search text changes
  useEffect(() => {
    fetchMedia();
  }, [page, type, searchText]);

  // Handler for changing media type filter
  const handleTypeChange = (e) => {
    setType(e.target.value);
    setPage(1); // Reset to page 1 when filter changes
  };

  // Handler for search input change
  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
    setPage(1); // Reset to page 1 when search text changes
  };

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-center">
        {/* Search Bar */}
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search media..."
          value={searchText}
          onChange={handleSearchChange}
        />
        
        {/* Filter by Type Dropdown */}
        <select
          className="form-select w-auto"
          value={type}
          onChange={handleTypeChange}
        >
          <option value="">All</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      {/* Display error message if API call fails */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Media Grid */}
      <div className="row g-4">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          media.map((item, index) => (
            <div key={index} className="col-md-3">
              <div className="card">
                {item.type === 'image' ? (
                  <img src={item.src} className="card-img-top" alt="Media" />
                ) : (
                  <video src={item.src} className="card-img-top" controls></video>
                )}
                <div className="card-body">
                  <p className="card-text text-center">
                    {item.type.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <button
          className="btn btn-primary"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MediaList;
