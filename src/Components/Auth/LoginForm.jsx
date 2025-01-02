/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faCircleCheck,
  faCircleXmark,
  faEnvelope,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import OtpPopup from "../Popup/OtpPopup";
import { FaGoogle } from "react-icons/fa";

const LoginForm = ({ userNow }) => {
  const navigate = useNavigate();

  // set cookies to save user's token in
  const cookie = new Cookies();

  // data which will be sent to the API
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // capture errors
  const [errors, setErrors] = useState({});

  // capture res message
  const [message, setMessage] = useState({});

  // indicate user's first touch to the input field
  const [touched, setTouched] = useState({});

  // show and hide password
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(faEyeSlash);

  const toggleVisibility = () => {
    setType(type === "password" ? "text" : "password");
    setIcon(icon === faEyeSlash ? faEye : faEyeSlash);
  };

  // inputs validation
  const validateInputs = () => {
    const { email, password } = formData;
    const validationErrors = {};

    if (email.trim() === "") validationErrors.email = "Email is required.";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
      validationErrors.email = "Enter a valid email. ex: example@gmail.com";

    if (password.trim() === "")
      validationErrors.password = "Password is required.";
    else if (password.length < 8)
      validationErrors.password = "Password must be at least 8 characters.";

    setErrors(validationErrors);
  };

  useEffect(() => {
    validateInputs();
  }, [formData]);

  const isFormValid =
    Object.keys(errors).length === 0 &&
    Object.values(formData).every((value) => value.trim() !== "");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // control verification popup
  const [isOtpPopupOpen, setIsOtpPopupOpen] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      const res = await axios.post(
        "https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/users/login",
        formData
      );
      console.log(res);
      // check whether user is verified or not
      if (!res.data.user.isVerified) {
        setMessage("Email is not verified");
        setIsOtpPopupOpen(true);
      } else {
        cookie.set("JWT", res.data.token);
        userNow.setAuth({ token: res.data.token, userDetails: res.data.user });
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (err) {
      if (err.response?.status) {
        setErrors((prev) => ({ ...prev, email: err.response.status }));
      } else {
        setErrors((prev) => ({
          ...prev,
          general: "An error occurred. Please try again later.",
        }));
      }
    }
  }

  async function googleLogin() {
    try {
      const res = await axios.get(
        "https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/auth/google"
      );

      if (res.status === 200) {
        cookie.set("JWT", res.token);
        navigate("/");
      }
    } catch (err) {}
  }

  const closeOtpPopup = () => {
    setIsOtpPopupOpen(false); // Close OTP popup
  };

  return (
    <div style={{ width: "100%" }}>
      <form className="form-control" onSubmit={submit}>
        <div className="input-container">
          <div className="icon">
            <FontAwesomeIcon icon={faEnvelope} />
          </div>

          <div className="col">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
            />
          </div>
          {touched.email && (
            <FontAwesomeIcon
              icon={
                errors.email
                  ? faCircleXmark
                  : formData.email && !errors.email
                  ? faCircleCheck
                  : null
              }
              className={`validation-icon ${
                errors.email ? "error" : "success"
              }`}
            />
          )}
        </div>

        <div className="input-container">
          <div className="icon">
            <FontAwesomeIcon icon={faLock} />
          </div>

          <div className="col">
            <label htmlFor="password">Password</label>
            <div className="row">
              <input
                id="password"
                name="password"
                type={type}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleBlur}
              />
              <FontAwesomeIcon
                icon={icon}
                className="show-password"
                onClick={toggleVisibility}
              />
            </div>
          </div>
          {touched.password && (
            <FontAwesomeIcon
              icon={
                errors.password && errors.email
                  ? faCircleXmark
                  : formData.password && !errors.password
                  ? faCircleCheck
                  : null
              }
              className={`validation-icon ${
                errors.password ? "error" : "success"
              }`}
              title={errors.password || ""}
            />
          )}
        </div>

        <button type="submit" className="main-btn" disabled={!isFormValid}>
          Login
        </button>
        <FaGoogle className="google" onClick={googleLogin} />

        {errors.email && (
          <span
            className={`error-general ${errors.email === 401 ? "visible" : ""}`}
          >
            Invalid email or password.
          </span>
        )}
      </form>
      {isOtpPopupOpen && (
        <OtpPopup
          email={formData.email}
          message={message}
          onClose={closeOtpPopup}
        />
      )}
    </div>
  );
};

export default LoginForm;
