import React, { useState, useEffect } from "react";
import axios from "axios";

const MediaList = () => {
  // State variables
  const [urls, setUrls] = useState(""); // Input for URLs
  const [media, setMedia] = useState([]); // Media results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error message
  const [type, setType] = useState(""); // Filter by type
  const [searchText, setSearchText] = useState(""); // Search text
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const pageSize = 8; // Items per page

  // Handler for text area input change
  const handleUrlsChange = (e) => {
    setUrls(e.target.value);
  };

  // Fetch media data from API
  const fetchMedia = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";

      if (!apiUrl) {
        setError("API URL is not configured. Check your environment variables.");
        setLoading(false);
        return;
      }

      // Send GET request with pagination, type, and search parameters
      const response = await axios.get(`${apiUrl}/api/media`, {
        params: {
          page,
          pageSize,
          type,
          search: searchText,
        },
        headers: {
          Authorization: `Basic ${btoa("admin:secret_password")}`, // Replace with your credentials
        },
      });

      setMedia(response.data.items); // Update media state with the fetched data
      setTotalPages(response.data.totalPages || 1); // Update total pages
      setCurrentPage(page); // Update current page
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch media. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Scrape media from URLs
  const scrapeMedia = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:4000";

      if (!apiUrl) {
        setError("API URL is not configured. Check your environment variables.");
        setLoading(false);
        return;
      }

      // Parse URLs from the text area
      const urlArray = urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url);

      if (urlArray.length === 0) {
        setError("Please provide at least one valid URL.");
        setLoading(false);
        return;
      }

      // Send POST request to scrape URLs
      const response = await axios.post(
        `${apiUrl}/api/scrape`,
        { urls: urlArray },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa("admin:secret_password")}`, // Replace with your credentials
          },
        }
      );

      setMedia(response.data.data); // Update media state with the scraped data
      setTotalPages(response.data.totalPages || 1); // Update total pages
      setCurrentPage(1); // Reset to the first page
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to scrape media. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetchMedia when type or searchText changes
  useEffect(() => {
    fetchMedia(1);
  }, [type, searchText]);

  // Pagination Handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchMedia(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchMedia(currentPage + 1);
    }
  };

  return (
    <div>
      {/* Text area for entering URLs */}
      <div className="mb-4">
        <label className="form-label">Enter URLs (one per line):</label>
        <textarea
          className="form-control"
          rows="5"
          value={urls}
          onChange={handleUrlsChange}
          placeholder={`https://example.com\nhttps://another.com`}
        ></textarea>
      </div>

      {/* Submit Button to Scrape URLs */}
      <div className="mb-4">
        <button
          className="btn btn-primary"
          onClick={scrapeMedia}
          disabled={loading}
        >
          {loading ? "Scraping..." : "Scrape Media"}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <label className="form-label">Filter by Type:</label>
        <select
          className="form-control"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All</option>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="form-label">Search:</label>
        <input
          type="text"
          className="form-control"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by keyword"
        />
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Media Grid */}
      <div className="row g-4">
        {media.length > 0 ? (
          media.map((item, index) => (
            <div key={index} className="col-md-3">
              <div className="card">
                {item.type === "image" ? (
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
        ) : (
          <div>No media found.</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-primary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || loading}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MediaList;
