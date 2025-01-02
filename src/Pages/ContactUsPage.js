import React from "react";
import "../Styles/ContactUs.css";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhoneAlt,
} from "react-icons/fa";

function ContactUs() {
  // Function to copy the phone number to the clipboard
  const copyToClipboard = (phoneNumber) => {
    navigator.clipboard.writeText(phoneNumber).then(
      () => {
        alert("Phone number copied to clipboard!");
      },
      (err) => {
        console.error("Failed to copy text: ", err);
      }
    );
  };

  // Function to open a URL in a new tab
  const openLink = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Function to open the default mail app for email
  const openEmail = (email) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <div className="contact-us-page">
      <div className="contact-us-content">
        <h1>Get in touch</h1>
        <p>
          <FaPhoneAlt
            size={35}
            style={{ color: "#008000", marginRight: "8px" }}
          />
          Give us a ring
        </p>
        <p
          className="contact-detail phone-number"
          onClick={() => copyToClipboard("+201555948232")}
          style={{ cursor: "pointer" }}
        >
          +201555948232
        </p>
        <p
          className="contact-detail email-link"
          onClick={() => openEmail("Padeloteamcs@gmail.com")}
          style={{ cursor: "pointer" }}
        >
          Padeloteamcs@gmail.com
        </p>
      </div>
      <footer className="contact-us-footer">
        <p>Follow us on social media</p>
        <div className="social-links">
          <span
            onClick={() => openLink("https://www.facebook.com/fcbarcelona")}
            style={{ cursor: "pointer" }}
          >
            <FaFacebook size={50} />
          </span>
          <span
            onClick={() =>
              openLink("https://www.instagram.com/p/DAydzSROozb/?img_index=1")
            }
            style={{ cursor: "pointer" }}
          >
            <FaInstagram size={50} />
          </span>
          <span
            onClick={() =>
              openLink(
                "https://www.linkedin.com/company/scitechtalent/?viewAsMember=true"
              )
            }
            style={{ cursor: "pointer" }}
          >
            <FaLinkedin size={50} />
          </span>
        </div>
      </footer>
    </div>
  );
}

export default ContactUs;
