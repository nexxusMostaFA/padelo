import React, { useContext } from "react";
import RegisterForm from "../../Components/Auth/RegisterForm";
import { User } from "../../Context/UserContext";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";

const RegisterPage = () => {
  const userNow = useContext(User);

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="auth-box">
        <div className="box-content">
          <div className="form">
            <button className="back-to-home" onClick={() => navigate("/")}>
              <FontAwesomeIcon icon={faLeftLong} />
              Home
            </button>

            <h2>Create Account</h2>
            <RegisterForm userNow={userNow} />
          </div>

          <div className="auth-switch">
            <h2>
              Hello! Welcome to <span className="main-logo">Padelo</span> <br />{" "}
              padel booking platform.
            </h2>
            <p>Already have an account?</p>
            <button className="main-btn" onClick={() => navigate("/Login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
