import React, { useState, useEffect } from "react";
import "../Styles/ReservationPage.css";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";

const PadelBooking = () => {
  const court1 = useParams();
  const court = court1.id;
  const [formData, setFormData] = useState({});
  const [courtData, setCourt] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsReserved, setSlots1] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const place = "on";
  const cookie = new Cookies();
  const token = cookie.get("JWT");
  const userId = jwtDecode(token);
  const [minDate, setMinDate] = useState("");
  console.log(userId);
  const user = userId.id;

  const bookduration = async () => {
    const { day, time, duration } = formData;
    setLoading(true);
    const isAvailable = () => {
      for (let i = 0; i < parseInt(duration); i++) {
        const currentSlot = parseInt(time) + i;
        const slotAvailable = slots.some(
          (slot) => slot.number === currentSlot && slot.day === day
        );

        if (!slotAvailable) {
          return false;
        }
      }
      return true;
    };

    if (!isAvailable) {
      alert("Selected slots are not all available");
      setLoading(false);
      return;
    }

    try {
      for (let i = 0; i < parseInt(duration); i++) {
        const payload = {
          user,
          court,
          day,
          place,
          slotNumber: parseInt(time) + i,
        };

        const response = await fetch(
          "https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/reservations",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error("Booking failed");
        }
      }

      alert(
        `Booking Successful!\nDate: ${day}\nTime: ${time}\nDuration: ${duration}`
      );
      setLoading(false);

      fetchCourt();
    } catch (error) {
      alert("Selected slots are not all available");
      // console.error("Booking error:", error);
      setLoading(false);
    }
  };

  const fetchCourt = async () => {
    const today = new Date();
    const formattedToday = today.toISOString().split("T")[0];
    setMinDate(formattedToday);

    fetch(
      `https://padelo-mohamed-hosams-projects-2e84c2a8.vercel.app/api/courts/${court}`
    )
      .then((response) => response.json())
      .then((data) => {
        setCourt(data.court);
        setSlots(getAvailableSlots(data.court.schedule));
        setSlots1(getReservedSlots(data.court.schedule));
      })
      .catch((error) => console.error("Error fetching court:"));
  };
  useEffect(() => {
    fetchCourt();
  }, [court]);

  const getAvailableSlots = (schedule) => {
    const availableSlots = [];
    schedule.forEach((daySchedule) => {
      daySchedule.slots.forEach((slot) => {
        if (!slot.reserved) {
          availableSlots.push({
            number: slot.number,
            day: daySchedule.day,
          });
        }
      });
    });
    return availableSlots;
  };
  const getReservedSlots = (schedule) => {
    const availableSlots = [];
    schedule.forEach((daySchedule) => {
      daySchedule.slots.forEach((slot) => {
        if (slot.reserved) {
          availableSlots.push({
            number: slot.number,
            day: daySchedule.day,
          });
        }
      });
    });
    return availableSlots;
  };

  const durations = [
    { value: 1, label: "1 Hours" },
    { value: 2, label: "2 Hours" },
    { value: 3, label: "3 Hours" },
    { value: 4, label: "4 Hours" },
    { value: 5, label: "5 Hours" },
    { value: 6, label: "6 Hours" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = { ...prev, [name]: value };

      if (name === "date" && value) {
        const selectedDay = new Date(value).toLocaleString("en-us", {
          weekday: "long",
        });
        updatedData.day = selectedDay;
      }

      return updatedData;
    });
  };

  const day = formData.day || "";

  const filteredSlots = slots.filter((slot) => slot.day === day);
  const filteredSlotsReserved = slotsReserved.filter(
    (slot) => slot.day === day
  );
  const imageUrl =
    courtData && courtData.image
      ? courtData.image
      : require("../assets/fotor-ai-2024120862244.jpg");
  return (
    <div
      className="padel-body"
      style={{
        backgroundImage: `url(${require("../assets/R.jpg")})`,
      }}
    >
      <div className="padel-page-container" style={{}}>
        <div className="padel-court-header">
          <div
            className="padel-court-contact-info"
            style={{
              // Check if court image exists

              backgroundImage: `url(${imageUrl})`,
              // backgroundImage: `url(${courtData &&courtData ? courtData.image : require("../assets/aichat-image-2024-12-04T21_03_30.190Z.jpg")})`,
              // backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <h2>{courtData ? courtData.name : "Loading..."}</h2>
            <p>{courtData ? courtData.place : "Loading location..."}</p>
            <p>+{courtData ? courtData.contactNumber : "Loading..."}</p>
          </div>
        </div>

        {/* Booking Section */}
        <section className="padel-booking-section">
          <h2>Book within one week</h2>
          <form
            className="padel-booking-form"
            onSubmit={(e) => {
              e.preventDefault();
              bookduration();
            }}
          >
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              min={minDate}
              value={formData.date}
              onChange={handleChange}
              required
            />

            <label htmlFor="time">Time</label>
            <select
              id="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
            >
              <option value="">Select time</option>
              {filteredSlots.length > 0 ? (
                filteredSlots.map((slot) => (
                  <option
                    key={slot.number}
                    value={slot.number}
                  >{` ${slot.number} clock`}</option>
                ))
              ) : (
                <option value="">No available slots</option>
              )}
            </select>

            <label htmlFor="duration">Duration</label>
            <select
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
            >
              <option value="">Select duration</option>
              {durations.map((duration, index) => (
                <option key={index} value={duration.value}>
                  {duration.label}
                </option>
              ))}
            </select>

            <p style={{ fontSize: "20px", color: "white" }}>
              Price:{" "}
              <strong style={{ color: "green" }}>
                {courtData ? courtData.price * formData.duration : "Loading..."} LE
              </strong>
            </p>
            <button type="submit">{isLoading ? "Loading..." : "Book"}</button>
          </form>
        </section>

        {/* Available Slots Section */}
        <section className="padel-slots-section">
          <h3 style={{ textAlign: "center", fontSize: "20px" }}>
            Available Slots
          </h3>
          <div className="padel-slots-grid">
            {filteredSlots.length > 0 ? (
              filteredSlots.map((slot) => (
                <div
                  key={slot.number}
                  className="padel-slot padel-slot-available"
                >
                  {` ${slot.number} clock (${slot.day})`}
                </div>
              ))
            ) : (
              <div
                style={{ textAlign: "center", color: "red", fontSize: "20px" }}
              ></div>
            )}
          </div>
        </section>

        {/* Reserved Slots Section */}
        <section className="padel-slots-section">
          <h3 style={{ textAlign: "center", color: "red", fontSize: "20px" }}>
            Reserved Slots
          </h3>
          <div className="padel-slots-grid">
            {filteredSlotsReserved.length > 0 ? (
              filteredSlotsReserved.map((slot) => (
                <div
                  key={slot.number}
                  className="padel-slot padel-slot-reserved"
                >
                  {` ${slot.number} clock (${slot.day})`}
                </div>
              ))
            ) : (
              <div
                style={{ textAlign: "center", fontSize: "20px", color: "blue" }}
              ></div>
            )}
          </div>
        </section>

        <section className="padel-ratings-section">
          <h3>Ratings & Comments</h3>
        </section>

        <section className="padel-map-section">
          <p className="padel-map-footer">
            <a
              href={courtData ? courtData.location : "https://maps.google.com"}
              target="_blank"
              rel="noopener noreferrer"
            >
              Get Location
            </a>
          </p>
        </section>
      </div>
    </div>
  );
};

export default PadelBooking;
