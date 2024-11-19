import React, { useState } from "react";
import axios from "axios";

const SSRMediaPage = ({
  initialMedia = [],
  totalPages = 1,
  currentPage = 1,
  initialType = "",
  initialSearchText = "",
  error = null,
}) => {
  const [type, setType] = useState(initialType);
  const [searchText, setSearchText] = useState(initialSearchText);

  const handleFilterChange = () => {
    // Redirect to a new URL with updated filters
    const url = `/ssr-media?page=1&pageSize=8&type=${type}&search=${searchText}`;
    window.location.href = url;
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Server-Side Rendered Media Gallery</h1>
        <a href="/csr-media" className="btn btn-link">
          Switch to CSR
        </a>
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
        <div className="col-12 text-end mt-3">
          <button className="btn btn-primary" onClick={handleFilterChange}>
            Apply Filters
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {/* Media Grid */}
      <div className="row g-4">
        {initialMedia.length > 0 ? (
          initialMedia.map((item, index) => (
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
          <div className="text-center">No media found.</div>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between mt-4">
        <a
          href={`/ssr-media?page=${
            currentPage > 1 ? currentPage - 1 : 1
          }&pageSize=8&type=${type}&search=${searchText}`}
          className={`btn btn-primary ${currentPage === 1 ? "disabled" : ""}`}
        >
          Previous
        </a>
        <a
          href={`/ssr-media?page=${
            currentPage < totalPages ? currentPage + 1 : totalPages
          }&pageSize=8&type=${type}&search=${searchText}`}
          className={`btn btn-primary ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          Next
        </a>
      </div>
    </div>
  );
};

// Server-side rendering logic
export async function getServerSideProps(context) {
  const { query } = context;

  // Extract query parameters
  const page = parseInt(query.page, 10) || 1;
  const pageSize = parseInt(query.pageSize, 10) || 8;
  const type = query.type || "";
  const searchText = query.search || "";

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  try {
    console.log(
      `Fetching media: ${apiUrl}/api/media?page=${page}&pageSize=${pageSize}&type=${type}&search=${searchText}`
    );

    const response = await axios.get(`${apiUrl}/api/media`, {
      params: { page, pageSize, type, search: searchText },
      headers: {
        Authorization: `Basic ${Buffer.from("admin:secret_password").toString(
          "base64"
        )}`, // Replace with your backend credentials
      },
    });

    console.log("Media fetched successfully:", response.data);

    return {
      props: {
        initialMedia: response.data.items || [],
        totalPages: response.data.totalPages || 1,
        currentPage: page,
        initialType: type,
        initialSearchText: searchText,
        error: null,
      },
    };
  } catch (error) {
    console.error("Error fetching media in SSR:", error.message);

    return {
      props: {
        initialMedia: [],
        totalPages: 1,
        currentPage: page,
        initialType: type,
        initialSearchText: searchText,
        error: error.response?.data?.message || "Failed to fetch media.",
      },
    };
  }
}

export default SSRMediaPage;
