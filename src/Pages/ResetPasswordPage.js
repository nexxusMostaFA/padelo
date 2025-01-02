import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../Styles/ResetPasswordPage.css";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token } = useParams(); // Extract token from URL

  // Handle password change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Validate the form before submitting
  const validateForm = () => {
    let valid = true;
    let errors = {};

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (!password) {
      errors.password = "Password is required";
      valid = false;
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }

    if (confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(errors);
    return valid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.patch(
        `https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/users/reset-password/${token}`,
        { password }
      );

      setMessage(response.data.message || "Password reset successful.");
      setIsSuccess(true);
      setLoading(false);

      // Navigate to login page after a delay
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setLoading(false);
      setMessage(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <h2 className="title">Reset Password</h2>
        <p className="description">Enter your new password below.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="password" className="label">
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="email-input"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirm-password" className="label">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              className="email-input"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm your new password"
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          {message && (
            <p className={`message ${isSuccess ? "success" : "error"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="verify-btn"
            disabled={loading || isSuccess}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
