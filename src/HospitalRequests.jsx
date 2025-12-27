import React, { useState } from "react";
import "./HospitalRequests.css";

export default function HospitalRequests() {
  const [formData, setFormData] = useState({
    hospitalName: "City Hospital",
    bloodGroup: "",
    units: 1,
    latitude: null,
    longitude: null,
  });

  const [locStatus, setLocStatus] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [bloodResults, setBloodResults] = useState([]);

  const bloodCompatibility = {
    "A+": ["A+", "A-", "O+", "O-"],
    "A-": ["A-", "O-"],
    "B+": ["B+", "B-", "O+", "O-"],
    "B-": ["B-", "O-"],
    "AB+": ["AB+", "AB-", "A+", "A-", "B+", "B-", "O+", "O-"],
    "AB-": ["AB-", "A-", "B-", "O-"],
    "O+": ["O+", "O-"],
    "O-": ["O-"]
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setBloodResults([]);
    setSearchMessage("");
  };

  const detectLocation = () => {
    setLocStatus("📍 Getting location...");
    if (!navigator.geolocation) return setLocStatus("❌ Geolocation not supported");

    navigator.geolocation.getCurrentPosition(
      pos => {
        setFormData(prev => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        }));
        setLocStatus(`📍 Location added (Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude})`);
      },
      () => setLocStatus("❌ Location permission denied")
    );
  };

  const searchBloodStock = async () => {
    if (!formData.bloodGroup) {
      setSearchMessage("Please select blood group first");
      return;
    }
    setSearchMessage("Searching blood availability...");
    try {
      const res = await fetch("http://localhost/webapi/api/BloodStock");
      const data = await res.json();
      const allowedGroups = bloodCompatibility[formData.bloodGroup] || [];
      const filtered = data.filter(
        item => allowedGroups.includes(item.BloodGroup?.toUpperCase()) && item.Status === "available"
      );
      setBloodResults(filtered);
      setSearchMessage(filtered.length === 0 ? "No compatible blood available" : "");
    } catch {
      setSearchMessage("Error searching blood");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        hospital_name: formData.hospitalName,
        blood_type: formData.bloodGroup,
        units: parseInt(formData.units),
        location: `${formData.latitude},${formData.longitude}`,
        status: "pending"
      };

      const res = await fetch("http://localhost/webapi/api/HospitalRequest/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        alert("Blood request submitted successfully!");
        setFormData(prev => ({ ...prev, bloodGroup: "", units: 1 }));
        setBloodResults([]);
      } else alert("Error: " + (data.Message || "Unable to submit"));
    } catch (err) {
      alert("Network error. Try again.");
    }
  };

  return (
    <div className="hospital-page">
      <h1>📝 Hospital Blood Request Form</h1>
      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Blood Group</label>
          <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required>
            <option value="">Select Blood Type</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
        </div>

        <button type="button" className="submit-btn" onClick={searchBloodStock}>
          🔍 Search Compatible Blood
        </button>
        {searchMessage && <p className="error-msg">{searchMessage}</p>}

        <div className="form-group">
          <label>Units</label>
          <input type="number" min="1" name="units" value={formData.units} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input type="text" readOnly value={locStatus || "Click to detect location"} onClick={detectLocation} style={{ cursor: "pointer" }} />
        </div>

        <button type="submit" className="submit-btn">Submit Request</button>

        {bloodResults.length > 0 && (
          <div className="results-list">
            <h3>🩸 Available & Compatible Blood</h3>
            {bloodResults.map(item => (
              <div key={item.Id} className="result-card">
                <p><strong>Blood Group:</strong> {item.BloodGroup}</p>
                <p><strong>Blood Bank ID:</strong> {item.BloodBankId}</p>
                <p><strong>Expiry:</strong> {item.ExpiryDate}</p>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
