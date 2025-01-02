import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../Styles/AdminPage.css"; // Import styles

const AdminPage = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [activeSection, setActiveSection] = useState("add"); // Active section for tabs
  const [courts, setCourts] = useState([]);
  const [newCourt, setNewCourt] = useState({
    name: "",
    location: "",
    price: "",
    email: "",
    contactNumber: "",
    image: "",
    place: "",
  });
  const [editingCourt, setEditingCourt] = useState(null); 
  const [updatedCourt, setUpdatedCourt] = useState({
    name: "",
    location: "",
    price: "",
    email: "",
    contactNumber: "",
    image: "",
    place: "",
  });
  const [search, setSearch] = useState("");
  const cookie = new Cookies();

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      const response = await fetch(
        "https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/courts"
      );
      const data = await response.json();
      setCourts(data.courts);
    } catch (error) {
      console.error("Error fetching courts:", error);
    }
  };
  const handleUpdate = async (courtId) => {
    const { name, location, price, email, contactNumber, image } = updatedCourt;

    // Perform validation checks
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const isValidLink = /^https:\/\/(www\.)?google\.com\/maps\/.+/.test(
      location
    );
    const isValidNumber = /^01\d{9}$/.test(contactNumber || "");
    const isValidPrice = /^\d+$/.test(price);

    if (!name.trim()) {
      alert("Court name cannot be empty.");
      return;
    }
    if (!isValidEmail) {
      alert("Invalid email format. Please provide a valid email.");
      return;
    }
    if (!isValidLink) {
      alert("Invalid Google Maps link. Please provide a valid link.");
      return;
    }
    if (!isValidNumber) {
      alert(
        "Invalid phone number. Must start with '01' and be exactly 11 digits."
      );
      return;
    }
    if (!isValidPrice) {
      alert("Price must be a valid number.");
      return;
    }

    console.log("Updating court:", courtId, updatedCourt);
    const token = cookie.get("JWT");
    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    try {
      await fetch(
        `https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/admin/courts/${courtId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedCourt),
        }
      );

      alert("Court updated successfully!");
      fetchCourts();
      setEditingCourt(null);
      setUpdatedCourt({
        name: "",
        location: "",
        price: "",
        email: "",
        contactNumber: "",
        image: "",
        place: "",
      });
    } catch (error) {
      console.error("Error updating court:", error);
    }
  };
  const handleEdit = (court) => {
    setEditingCourt(court._id);
    setUpdatedCourt({
      name: court.name,
      location: court.location,
      price: court.price,
      email: court.email || "",
      contactNumber: court.contactNumber || "",
      image: court.image || "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourt((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddCourt = async (e) => {
    e.preventDefault(); // Prevent the form from submitting

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newCourt.email);
    const isValidLink = /^https:\/\/(www\.)?google\.com\/maps\/.+/.test(
      newCourt.location
    );
    const isValidNumber = /^01\d{9}$/.test(newCourt.contactNumber || "");
    const isValidPrice = /^\d+$/.test(newCourt.price);

    // Display error messages or focus on the invalid field
    if (!isValidEmail) {
      alert("Invalid email format. Please provide a valid email.");
      return;
    }
    if (!isValidLink) {
      alert("Invalid Google Maps link. Please provide a valid link.");
      return;
    }
    if (!isValidNumber) {
      alert(
        "Invalid phone number. Must start with '01' and be exactly 11 digits."
      );
      return;
    }
    if (!isValidPrice) {
      alert("Price must be a valid number.");
      return;
    }

    // Proceed with adding the court
    console.log("Court added successfully!", newCourt);
    const token = cookie.get("JWT");
    if (!token) {
      alert("You are not authorized. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        "https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/admin/courts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...newCourt,
          }),
        }
      );

      if (response.ok) {
        alert("Court added successfully!");
        setNewCourt({
          name: "",
          description: "",
          price: "",
          location: "",
          email: "",
          contactNumber: "",
          image: "",
          place: "",
        });
        fetchCourts();
      } else {
        const errorData = await response.json();
        alert(`Failed to add court: ${errorData.message}`);
      }
    } catch (error) {
      alert("An unexpected error occurred.");
    }
  };

  const handleDeleteCourt = async (courtId) => {
    try {
      const token = cookie.get("JWT");
      const response = await fetch(
        `https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/admin/courts/${courtId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Court deleted successfully!");
        fetchCourts();
      } else {
        alert("Failed to delete court.");
      }
    } catch (error) {
      console.error("Error deleting court:", error);
    }
  };

  const filteredCourts = courts.filter((court) =>
    court.name.toLowerCase().includes(search.toLowerCase())
  );
  const handleCancelEdit = () => {
    // Reset the updatedCourt state to avoid partial or invalid changes
    setUpdatedCourt({});
    // Exit the editing mode
    setEditingCourt(null);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "add":
        return (
          <div className="active-section">
            <h2>Add New Court</h2>
            <form onSubmit={handleAddCourt}>
              <input
                type="text"
                name="name"
                placeholder="Court Name"
                value={newCourt.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="place"
                placeholder="city Name"
                value={newCourt.place}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price per hour"
                value={newCourt.price}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value)) handleInputChange(e);
                }}
                required
              />
              <div style={{ position: "relative", marginBottom: "1em" }}>
                <input
                  type="text"
                  name="email"
                  placeholder="Contact Email"
                  value={newCourt.email}
                  onChange={handleInputChange}
                  onBlur={(e) => {
                    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                      e.target.value
                    );
                    e.target.style.border = isValidEmail
                      ? "2px solid green"
                      : "2px solid red";
                  }}
                  required
                />
              </div>
              <div style={{ position: "relative", marginBottom: "1em" }}>
                <input
                  type="text"
                  name="location"
                  placeholder="Google Maps Link"
                  value={newCourt.location}
                  onChange={handleInputChange}
                  onBlur={(e) => {
                    const isValidLink =
                      /^https:\/\/(www\.)?google\.com\/maps\/.+/.test(
                        e.target.value
                      );
                    e.target.style.border = isValidLink
                      ? "2px solid green"
                      : "2px solid red";
                  }}
                  required
                />
              </div>
              <div style={{ position: "relative", marginBottom: "1em" }}>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Phone Number"
                  value={newCourt.contactNumber || ""}
                  onChange={(e) => {
                    if (/^\d*$/.test(e.target.value)) {
                      setNewCourt((prev) => ({
                        ...prev,
                        contactNumber: e.target.value,
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    const isValidNumber = /^01\d{9}$/.test(e.target.value);
                    e.target.style.border = isValidNumber
                      ? "2px solid green"
                      : "2px solid red";
                  }}
                  required
                />
              </div>
              <input
                type="text"
                name="imageURL"
                placeholder="Enter Image URL"
                value={newCourt.image || ""}
                onChange={(e) => {
                  setNewCourt((prev) => ({ ...prev, image: e.target.value }));
                }}
              />

              <button type="submit" className="save-button">
                Add Court
              </button>
            </form>
          </div>
        );

      case "manage":
        return (
          <div className="active-section">
            <h2>Manage Courts</h2>
            <input
              type="text"
              placeholder="Search by Court Name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="table-responsive">
              <table className="court-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>City</th>
                    <th>Location</th>
                    <th>Price</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCourts.map((court) => (
                    <tr key={court._id}>
                      <td>
                        {editingCourt === court._id ? (
                          <input
                            type="text"
                            value={updatedCourt.name}
                            onChange={(e) =>
                              setUpdatedCourt({
                                ...updatedCourt,
                                name: e.target.value,
                              })
                            }
                          />
                        ) : (
                          court.name
                        )}
                      </td>
                      <td className="city-column">
                        {editingCourt === court._id ? (
                          <input
                            type="text"
                            value={updatedCourt.place}
                            onChange={(e) =>
                              setUpdatedCourt({
                                ...updatedCourt,
                                place: e.target.value,
                              })
                            }
                          />
                        ) : (
                          court.place // City
                        )}
                      </td>
                      <td>
                        {editingCourt === court._id ? (
                          <input
                            type="text"
                            value={updatedCourt.location}
                            onChange={(e) =>
                              setUpdatedCourt({
                                ...updatedCourt,
                                location: e.target.value,
                              })
                            }
                          />
                        ) : (
                          court.location.split(",")[0]
                        )}
                      </td>
                      <td>
                        {editingCourt === court._id ? (
                          <input
                            type="number"
                            value={updatedCourt.price}
                            onChange={(e) =>
                              /^\d*$/.test(e.target.value) &&
                              setUpdatedCourt({
                                ...updatedCourt,
                                price: e.target.value,
                              })
                            }
                          />
                        ) : (
                          `$${court.price}`
                        )}
                      </td>
                      <td>
                        {editingCourt === court._id ? (
                          <input
                            type="email"
                            value={updatedCourt.email}
                            onChange={(e) =>
                              setUpdatedCourt({
                                ...updatedCourt,
                                email: e.target.value,
                              })
                            }
                          />
                        ) : (
                          court.email || "Not Provided"
                        )}
                      </td>
                      <td>
                        {editingCourt === court._id ? (
                          <input
                            type="tel"
                            value={updatedCourt.contactNumber}
                            onChange={(e) =>
                              setUpdatedCourt({
                                ...updatedCourt,
                                contactNumber: e.target.value,
                              })
                            }
                          />
                        ) : (
                          court.contactNumber || "Not Provided"
                        )}
                      </td>
                      <td>
                        {editingCourt === court._id ? (
                          <input
                            type="text"
                            value={updatedCourt.image}
                            onChange={(e) =>
                              setUpdatedCourt({
                                ...updatedCourt,
                                image: e.target.value,
                              })
                            }
                          />
                        ) : (
                          court.image && (
                            <img
                              src={court.image}
                              alt={court.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          )
                        )}
                      </td>
                      <td>
                        {editingCourt === court._id ? (
                          <>
                            <button
                              className="save-button"
                              onClick={() => handleUpdate(court._id)}
                            >
                              Save
                            </button>
                            <button
                              className="cancel-button"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            className="edit-button"
                            onClick={() => handleEdit(court)}
                          >
                            <FaEdit />
                          </button>
                        )}
                        <button
                          className="delete-button"
                          onClick={() => handleDeleteCourt(court._id)}
                        >
                          <FaTrashAlt />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="sidebar">
          <ul>
            <li
              className={activeSection === "add" ? "active" : ""}
              onClick={() => setActiveSection("add")}
            >
              Add Court
            </li>
            <li
              className={activeSection === "manage" ? "active" : ""}
              onClick={() => setActiveSection("manage")}
            >
              Manage Courts
            </li>
          </ul>
        </div>

        <div className="content">{renderSection()}</div>
      </div>
    </div>
  );
};

export default AdminPage;
