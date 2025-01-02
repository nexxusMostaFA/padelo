import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import Cookies from "universal-cookie";

export default function History() {
  const [bookingHistory, setBookingHistory] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [comment, setComment] = useState("");
  const [ratings, setRatings] = useState({});
  const [hoverRatings, setHoverRatings] = useState({});
  const cookie = new Cookies();
  const token = cookie.get("JWT");
  const decodedToken = jwtDecode(token);

  const userId = decodedToken.id;
  const fetchBookingHistory = async () => {
    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/reservations/user/${userId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setBookingHistory(data.reservations);
        console.log(data.reservations);
      } else {
        console.error("Failed to fetch booking history.");
      }
    } catch (error) {
      console.error("Error fetching booking history:", error);
    }
  };

  const handleRatingChange = (bookingId, value) => {
    setRatings((prev) => ({ ...prev, [bookingId]: value }));
  };

  const openCommentPopup = (bookingId) => {
    setSelectedBooking(bookingId);
  };

  const closeCommentPopup = () => {
    setSelectedBooking(null);
    setComment("");
  };

  const handleCommentSubmit = async () => {
    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/reservations/comment/${selectedBooking}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment, rating: ratings[selectedBooking] }),
        }
      );

      if (response.ok) {
        alert("Comment and rating submitted successfully!");
        fetchBookingHistory(); // Refresh booking history
        closeCommentPopup();
      } else {
        alert("Failed to submit comment and rating.");
      }
    } catch (error) {
      console.error("Error submitting comment and rating:", error);
    }
  };

  useEffect(() => {
    fetchBookingHistory();
  }, []);

  return (
    <div className="history-page">
      <h2>Your Booking History</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Booking No.</th>
            <th>Date</th>
            <th>Court</th>
            <th>Status</th>
            <th>Rating</th>
            <th>Add Comment</th>
          </tr>
        </thead>
        <tbody>
          {bookingHistory.map((booking) => {
            const court = booking.court || {}; // Handle null court
            console.log(court);

            return (
              <tr key={booking._id}>
                <td>{booking._id}</td>
                <td>{booking.day || "N/A"}</td>{" "}
                {/* Assuming `date` is a property in `booking` */}
                <td>{court.name || "Padeloooo"}</td>
                <td>{booking.status || "Reserved"}</td>
                <td>
                  <div className="rating">
                    {[...Array(5)].map((_, index) => {
                      const value = index + 1;
                      return (
                        <FaStar
                          key={index}
                          size={20}
                          className="star"
                          color={
                            value <=
                            (hoverRatings[booking._id] ||
                              ratings[booking._id] ||
                              0)
                              ? "#ffc107"
                              : "#e4e5e9"
                          }
                          onClick={() => handleRatingChange(booking._id, value)}
                          onMouseEnter={() =>
                            setHoverRatings((prev) => ({
                              ...prev,
                              [booking._id]: value,
                            }))
                          }
                          onMouseLeave={() =>
                            setHoverRatings((prev) => ({
                              ...prev,
                              [booking._id]: 0,
                            }))
                          }
                        />
                      );
                    })}
                  </div>
                </td>
                <td>
                  <button
                    className="comment-button"
                    onClick={() => openCommentPopup(booking._id)}
                  >
                    Add Comment
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedBooking && (
        <div className="comment-popup">
          <div className="popup-content">
            <h3>Add Comment for Booking #{selectedBooking}</h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here..."
            />
            <button onClick={handleCommentSubmit} className="save-button">
              Submit
            </button>
            <button onClick={closeCommentPopup} className="cancel-button">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
