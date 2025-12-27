import React, { useState } from "react";
import "./HospitalRequests.css";

export default function HospitalRequests() {
  const [bloodType, setBloodType] = useState("");
  const [units, setUnits] = useState("");
  const [location, setLocation] = useState("Click to detect location...");
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      hospital_name: "City Hospital", // You can make this dynamic later
      blood_type: bloodType,
      units: parseInt(units),
      location: location,
    };

    try {
      setLoading(true);

      const res = await fetch("http://localhost/webapi/api/HospitalRequest/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (res.ok) {
        alert("Blood request submitted successfully!");
        resetForm();
      } else {
        alert("Error: " + (data.message || "Unable to save request"));
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("Failed to send request. Check backend.");
    }

    setLoading(false);
  };

  const resetForm = () => {
    setBloodType("");
    setUnits("");
    setLocation("Click to detect location...");
  };

  /** 📍 Auto-Fill GPS Location */
  const detectLocation = () => {
    setLoadingLocation(true);

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          const address =
            data?.display_name || `${latitude}, ${longitude}`;

          setLocation(address);
        } catch (error) {
          alert("Unable to fetch location details.");
          setLocation(`${latitude}, ${longitude}`);
        }

        setLoadingLocation(false);
      },
      () => {
        alert("Unable to retrieve your location.");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="hospital-page">
      <h1>📝 Create Blood Request</h1>
      <p>Submit a new blood request to notify donors or organizations.</p>

      <form className="request-form" onSubmit={handleSubmit}>
        {/* Blood Type */}
        <div className="form-group">
          <label>Blood Type</label>
          <select
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Blood Type
            </option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        {/* Units */}
        <div className="form-group">
          <label>Units Needed (bags)</label>
          <input
            type="number"
            min="1"
            placeholder="Enter number of units"
            value={units}
            onChange={(e) => setUnits(e.target.value)}
            required
          />
        </div>

        {/* Detectable Location */}
        <div className="form-group">
          <label>Current Location</label>
          <input
            type="text"
            readOnly
            value={loadingLocation ? "Detecting location..." : location}
            onClick={detectLocation}
            style={{ cursor: "pointer", background: "#3b3b3bff" }}
            required
          />
          <small style={{ color: "#b91c1c" }}>
            (Click to auto-detect your location)
          </small>
        </div>

        {/* Buttons */}
        <div className="button-row">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>

          <button type="button" className="reset-btn" onClick={resetForm}>
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
}
