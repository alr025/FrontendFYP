import React, { useState } from "react";
import "./RequestPage.css";

export default function RequestPage() {
  
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));

  const [formData, setFormData] = useState({
    userId: activeUser?.id, // TODO: replace with logged-in user
    organizationId: 1,
    bloodGroup: "",
    quantity: 1,
    newLatitude: null,
    newLongitude: null,
  });


  const [relationType, setRelationType] = useState("");
  const [familyMembers, setFamilyMembers] = useState([]);
  const [selectedRelationId, setSelectedRelationId] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [locStatus, setLocStatus] = useState("");
const [bloodResults, setBloodResults] = useState([]);
const [searchMessage, setSearchMessage] = useState("");

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


const searchBloodStock = async () => {
  if (!formData.bloodGroup) {
    setSearchMessage("Please select blood group first");
    return;
  }

  setSearchMessage("Searching blood availability...");

  try {
    const res = await fetch("http://localhost/webapi/api/BloodStock");
    const data = await res.json();

    const allowedGroups =
      bloodCompatibility[formData.bloodGroup] || [];

    const filtered = data.filter(
      (item) =>
        allowedGroups.includes(item.BloodGroup?.toUpperCase()) &&
        item.Status === "available"
    );

    if (filtered.length === 0) {
      setSearchMessage("No compatible blood available");
    } else {
      setSearchMessage("");
    }

    setBloodResults(filtered);
  } catch (err) {
    setSearchMessage("Error searching blood");
  }
};

  
  // ================= LOCATION =================
  const getLocation = () => {
    setLocStatus("📍 Getting location...");

    if (!navigator.geolocation) {
      setLocStatus("❌ Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          newLatitude: pos.coords.latitude,
          newLongitude: pos.coords.longitude,
        }));

        setLocStatus(
          `📍 Location added (Lat: ${pos.coords.latitude}, Lng: ${pos.coords.longitude})`
        );
      },
      () => setLocStatus("❌ Location permission denied")
    );
  };

  // ================= INPUT CHANGE =================
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  setBloodResults([]);
  setSearchMessage("");
};

  // ================= RELATION CHANGE =================
  const handleRelationChange = async (e) => {
    const value = e.target.value;
    setRelationType(value);
    setFamilyMembers([]);
    setSelectedRelationId("");

    if (!value) return;

    try {
      const res = await fetch(
        `http://localhost/webapi/api/user/relations-by-type/${formData.userId}/${value}`
      );

      if (res.status === 204) {
        setFamilyMembers([]);
        return;
      }

      const data = await res.json();
      setFamilyMembers(data);
    } catch (err) {
      console.error("Error loading relations", err);
    }
  };

  // ================= MEMBER SELECT =================
  const handleMemberSelect = (e) => {
    const relationId = e.target.value;
    setSelectedRelationId(relationId);

    const member = familyMembers.find(
      (m) => m.RelationId.toString() === relationId
    );

    if (member?.BloodGroup) {
      setFormData((prev) => ({
        ...prev,
        bloodGroup: member.BloodGroup,
      }));
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost/webapi/api/BloodRequest", {
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
          RelationId: selectedRelationId || null, // ✅ IMPORTANT
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Blood request submitted successfully");
        setMessageType("success");
      } else {
        setMessage("❌ " + (data.Message || "Request failed"));
        setMessageType("error");
      }
    } catch (err) {
      setMessage("❌ Network error");
      setMessageType("error");
    }
  };

  return (
    <div className="request-page">
      <h1>📝 Blood Request Form</h1>

      {message && (
        <p className={messageType === "success" ? "success-msg" : "error-msg"}>
          {message}
        </p>
      )}

      <form className="request-form" onSubmit={handleSubmit}>

        {/* RELATION */}
        <div className="form-group">
          <label>Request For:</label>
          <select value={relationType} onChange={handleRelationChange} required>
            <option value="">Select relation</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Spouse">Spouse</option>
            <option value="Friend">Friend</option>
          </select>
        </div>

        {/* FAMILY / FRIEND NAME */}
        {familyMembers.length > 0 && (
          <div className="form-group">
            <label>Name:</label>
            <select value={selectedRelationId} onChange={handleMemberSelect} required>
              <option value="">Select person</option>
              {familyMembers.map((m) => (
                <option key={m.RelationId} value={m.RelationId}>
                  {m.Name} ({m.BloodGroup || "Unknown"})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* BLOOD GROUP */}
        <div className="form-group">
          <label>Blood Type:</label>
          <select
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleChange}
            required
          >
            <option value="">Select blood type</option>
            {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

<button
  type="button"
  className="submit-btn"
  onClick={searchBloodStock}
>
  🔍 Search Compatible Blood
</button>

{searchMessage && <p className="error-msg">{searchMessage}</p>}


        {/* QUANTITY */}
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

        {/* LOCATION */}
        <div className="form-group">
          <label>Location:</label>
          <button type="button" className="submit-btn" onClick={getLocation}>
            Get My Location
          </button>
          {locStatus && <p className="loc-msg">{locStatus}</p>}
        </div>

        <button type="submit" className="submit-btn">
          Submit Request
        </button>

        {bloodResults.length > 0 && (
  <div className="results-list">
    <h3>🩸 Available & Compatible Blood</h3>

    {bloodResults.map((item) => (
      <div key={item.Id} className="result-card">
        <p><strong>Blood Group:</strong> {item.BloodGroup}</p>
        <p><strong>Blood Bank ID:</strong> {item.BloodBankId}</p>
        <p><strong>Expiry:</strong> {item.ExpiryDate}</p>

        {item.BloodGroup !== formData.bloodGroup && (
          <p className="alt-blood">
            ⚠ Alternative for {formData.bloodGroup}
          </p>
        )}
      </div>
    ))}
  </div>
)}

      </form>
    </div>
  );
}
