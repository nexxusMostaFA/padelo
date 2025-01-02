import React, { useContext, useState } from "react";
import LoginForm from "../../Components/Auth/LoginForm";
import { User } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const userNow = useContext(User);
  const navigate = useNavigate();
  const [emailInput, setEmailInput] = useState(""); // State to manage the email input

  return (
    <div className="container">
      <div className="auth-box">
        <div className="box-content">
          <div className="form">
            <button className="back-to-home" onClick={() => navigate("/")}>
              <FontAwesomeIcon icon={faLeftLong} />
              Home
            </button>

            <h2>Login</h2>
            {/* Pass setEmailInput to LoginForm to track the email input */}
            <LoginForm userNow={userNow} setEmailInput={setEmailInput} />

            {/* Forgot Password Link */}
            <div className="forgot-password">
              <p>
                <span
                  className="forgot-link"
                  onClick={() =>
                    navigate("/ForgetPassword", {
                      state: { email: emailInput },
                    })
                  }
                >
                  Forgot Password?
                </span>
              </p>
            </div>
          </div>

          <div className="auth-switch">
            <h2>
              Welcome back to <span className="main-logo">Padelo</span>
            </h2>
            <p>Don't have an account yet?</p>
            <button className="main-btn" onClick={() => navigate("/Register")}>
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
