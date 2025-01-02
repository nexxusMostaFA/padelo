import React from "react";
import "./Popup.css"; // Make sure to add your styles in a separate CSS file

const Popup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // Don't render the popup if it is not open

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Popup;
