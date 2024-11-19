import React, { useState, useEffect } from "react";
import axios from "axios";

const CSRMediaPage = () => {
  const [urls, setUrls] = useState(""); // Input for URLs
  const [media, setMedia] = useState([]); // Media results
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error message
  const [type, setType] = useState(""); // Filter by type
  const [searchText, setSearchText] = useState(""); // Search text
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages
  const pageSize = 8; // Items per page

  // Function to fetch paginated media from `/api/media`
  const fetchMedia = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      const response = await axios.get(`${apiUrl}/api/media`, {
        params: {
          page: parseInt(page, 10),
          pageSize,
          type,
          search: searchText,
        },
        headers: {
          Authorization: `Basic ${btoa("admin:secret_password")}`, // Replace with your credentials
        },
      });

      setMedia(response.data.items || []);
      setTotalPages(response.data.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error fetching media:", err.message);
      setError(
        err.response?.data?.message ||
          "Failed to fetch media. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to scrape new media from `/api/scrape`
  const scrapeMedia = async () => {
    setLoading(true);
    setError(null);
  
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  
      const urlArray = urls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url);
  
      if (urlArray.length === 0) {
        setError("Please provide at least one valid URL.");
        setLoading(false);
        return;
      }
  
      // Call the `/api/scrape` endpoint
      const response = await axios.post(
        `${apiUrl}/api/scrape`,
        { urls: urlArray },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa("admin:secret_password")}`,
          },
        }
      );
  
      // Process scraped data
      const scrapedData = response.data.data || [];
      if (scrapedData.length === 0) {
        throw new Error("No media found in the scraped data.");
      }
  
      const newMedia = scrapedData.flatMap((item) => {
        const images = item.images.map((src) => ({
          type: "image",
          src,
          url: item.url,
        }));
        const videos = item.videos.map((src) => ({
          type: "video",
          src,
          url: item.url,
        }));
        return [...images, ...videos];
      });
  
      setMedia(newMedia); // Update media with scraped results
      setTotalPages(1); // Reset pagination
      setCurrentPage(1);
    } catch (err) {
      console.error("Error scraping media:", err.message);
      setError(
        err.response?.data?.message ||
          "Failed to scrape media. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch media when the component mounts or when filters change
  useEffect(() => {
    fetchMedia(1);
  }, [type, searchText]);

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
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Client-Side Rendered Media Gallery</h1>
        <a href="/ssr-media" className="btn btn-link">
          Switch to SSR
        </a>
      </div>

      {/* Textarea for entering URLs */}
      <div className="mb-4">
        <label className="form-label">Enter URLs (one per line):</label>
        <textarea
          className="form-control"
          rows="5"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={`https://example.com\nhttps://another-example.com`}
        ></textarea>
      </div>

      {/* Scrape Media Button */}
      <div className="mb-4 text-center">
        <button
          className="btn btn-primary"
          onClick={scrapeMedia}
          disabled={loading}
        >
          {loading ? "Scraping..." : "Scrape Media"}
        </button>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label className="form-label">Filter by Type:</label>
          <select
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">All</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Search:</label>
          <input
            type="text"
            className="form-control"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search by keyword"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

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
                    {item.type?.toUpperCase() || "UNKNOWN"}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center">No media found.</div>
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

export default CSRMediaPage;
