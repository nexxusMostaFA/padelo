import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Courts.css";
import defaultCourtImage from "../assets/OIP.jpg";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { FaSpinner } from "react-icons/fa";

function Courts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true); // Set loading to true before fetching
    fetch(
      "https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/courts"
    )
      .then((response) => response.json())
      .then((data) => {
        setCourts(data.courts);
        setLoading(false); // Set loading to false after fetching
      })
      .catch((error) => {
        console.error("Error fetching courts:", error);
        setLoading(false); // Set loading to false even on error
      });
  }, []);

  // Filter courts based on the search query
  const filteredCourts = searchQuery
    ? courts.filter((court) => {
        const query = searchQuery.trim().toLowerCase();
        return (
          court.name.toLowerCase().includes(query) ||
          court.place.toLowerCase().includes(query)
        );
      })
    : courts;

  // Navigate to the reservation page with the selected court's id
  const handleCourtClick = (courtId) => {
    navigate(`/reservation/${courtId}`);
  };

  return (
    <div className="courts-page">
      {/* Image Section */}
      <div className="image-container">
        <div className="main-text">Book now in 3 steps with:</div>
        <div className="padelo-text">PADELO</div>
        <div className="steps-text">
          <span className="step">1 - Choose court</span>
          <span className="step">2 - Select duration</span>
          <span className="step">3 - Confirmation</span>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by Court name, Location"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={() => setSearchQuery("")}>
            Clear
          </button>
        </div>
      </div>

      {/* Courts List */}
      <div className="courts-container">
        {loading ? (
          <div className="main-spinner-container">
            <FaSpinner className="main-spinner" />
            <p>Loading courts...</p>
          </div>
        ) : filteredCourts.length > 0 ? (
          filteredCourts.map((court) => (
            <div
              key={court._id}
              className="Courts-court-card"
              onClick={() => handleCourtClick(court._id)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={court.image || defaultCourtImage}
                alt={court.name}
                className="court-image"
              />
              <div className="reviews-island">
                <span className="average-rating">
                  {court.averageRating.toFixed(1)}
                </span>
                <i className="fas fa-star reviews-icon"></i>
                <span className="reviews-count">
                  ({court.reviews.length || 0})
                </span>
              </div>
              <div className="court-info">
                <h3 className="court-name">{court.name}</h3>
                <p className="court-location">Location: {court.place}</p>
                <p className="court-phone">Phone: {court.contactNumber}</p>
                <p className="court-price">
                  Price: <strong>{court.price} EGP</strong>
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">
            No courts found. Please try a different search.
          </p>
        )}
      </div>
    </div>
  );
}

export default Courts;
