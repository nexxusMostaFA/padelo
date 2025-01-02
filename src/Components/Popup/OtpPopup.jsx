import React, { useState } from "react";
import "./Popup.css"; // Add styles for the popup
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const OtpPopup = ({ email, message, onClose }) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const cookie = new Cookies();
  console.log(otp);

  async function verify() {
    try {
      setError("");
      const res = await axios.post(
        "https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/users/verify_email",
        {
          email: email,
          code: otp.trim(),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        cookie.set("JWT", res.data.token);
        onClose();
        setSuccess(res.message);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      setError("Invalid or expired verification code");
    }
  }

  async function resendVerification() {
    try {
      await axios.post(
        "https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/users/resend_verification",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Verification code resent successfully!");
    } catch (err) {
      setError("Failed to resend verification code. Please try again.");
    }
  }

  return (
    <div className={`popup-container ${onClose ? "active" : ""}`}>
      <div className="popup">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h3>{message}</h3>
        <div className="wrapper">
          <p>Enter verification code for ({email})</p>
          <div className="field">
            <input
              maxLength={6}
              type="text"
              placeholder="..."
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
              }}
            />
            <button onClick={verify}>Verify</button>
          </div>
          <button className="resend" onClick={() => resendVerification()}>
            Resend Code
          </button>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default OtpPopup;
