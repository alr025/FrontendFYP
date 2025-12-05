import React, { useState } from "react";
import "./RequestPage.css";

export default function RequestPage() {
  const [formData, setFormData] = useState({
    userId: 1, // you can replace with actual logged-in user ID
    organizationId: 1,
    bloodGroup: "",
    quantity: 1,
    newLatitude: null,
    newLongitude: null,
  });

  const [message, setMessage] = useState("");
  const [locStatus, setLocStatus] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"



  const getLocation = () => {
  setLocStatus("Getting location...");

  if (!navigator.geolocation) {
    setLocStatus("❌ Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setFormData((prev) => ({
        ...prev,
        newLatitude: position.coords.latitude,
        newLongitude: position.coords.longitude,
      }));

      setLocStatus("📍 Location added!");
    },
    (error) => {
      setLocStatus("❌ Permission denied or unavailable");
    }
  );
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost/webapi/api/BloodRequest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserId: formData.userId,
        OrganizationId: formData.organizationId,
        BloodGroup: formData.bloodGroup,
        Quantity: formData.quantity,
        Status: "pending",
        NewLatitude: formData.newLatitude,
        NewLongitude: formData.newLongitude,
      }),
    });

    const data = await response.json();

    if (response.ok) {
  setMessage("✅ Request Submitted Successfully!");
  setMessageType("success");
} else {
  setMessage("❌ Error: " + (data.Message || "Something went wrong"));
  setMessageType("error");
}
} catch(error) {
  setMessage("❌ Network error: " + error.message);
  setMessageType("error");
}

};


  return (
    <div className="request-wrapper">
      <div className="request-card">
        <h2 className="request-title">Blood Request Form</h2>

       {message && (
  <p className={messageType === "success" ? "success-msg" : "error-msg"}>
    {message}
  </p>
)}


        <form onSubmit={handleSubmit} className="request-form">
          {/* Blood Type */}
          <div className="form-group">
            <label>Blood Type:</label>
            <select
              name="bloodGroup"
              value={formData.bloodGroup}
              onChange={handleChange}
              required
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label>Quantity (Bags):</label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
  <label>Location (Optional):</label>

  <button
    type="button"
    className="submit-btn"
    onClick={getLocation}
  >
    Get My Location
  </button>

  {locStatus && <p className="loc-msg">{locStatus}</p>}
</div>


          <button type="submit" className="submit-btn">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
}
