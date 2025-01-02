import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "../Styles/ForgetPassword.css";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(""); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    if (!email) {
      return setMessage("Please enter your email address.");
    }
    setLoading(true);
    try {
      // Call the API endpoint for forgot password
      const response = await axios.post("https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/users/forget-password", {
        email: email,
      });

      // Show success message or redirect the user
      setMessage(response.data.message || "Please check your email for further instructions.");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setMessage(error.response?.data?.message || "Error occurred, try again.");
    }
  };

  return (
    <div className="forget-password-container">
      <div className="forget-password-box">
        <button className="back-btn" onClick={() => navigate("/Login")}>
          &larr; Login
        </button>
        <h2 className="title">Forgot Password</h2>
        <p className="description">
          Please enter your email address. We’ll send you instructions to reset your password.
        </p>
        <div className="input-group">
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Enter your email"
            className="email-input"
          />
        </div>
        {message && <p className="message">{message}</p>}
        <button
          className="verify-btn"
          onClick={handleEmailSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </div>
    </div>
  );
};

export default ForgetPassword;
