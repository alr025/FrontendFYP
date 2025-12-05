import React, { useState } from "react";
import "./BloodRequestForm.css";

const BloodRequestForm = () => {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [caseDetails, setCaseDetails] = useState("");
  const [bloodGroup, setBloodGroup] = useState("A+");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    const requestData = {
      name,
      area,
      phone,
      date,
      caseDetails,
      bloodGroup,
      quantity,
    };
    console.log("Submitted request:", requestData);
    // You can perform further actions here, like sending the data to an API
  };

  return (
    <div className="blood-request-form">
      <div className="header">
        <h1>Add Request</h1>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label>Select Area</label>
        <select value={area} onChange={(e) => setArea(e.target.value)} required>
          <option value="">Select Area</option>
          <option value="Area 1">Area 1</option>
          <option value="Area 2">Area 2</option>
          <option value="Area 3">Area 3</option>
        </select>

        <label>Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <label>Case</label>
        <textarea
          value={caseDetails}
          onChange={(e) => setCaseDetails(e.target.value)}
          required
        />

        <div className="blood-group">
          <label>Blood Group</label>
          <select
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            required
          >
            <option value="A+">A+</option>
            <option value="B+">B+</option>
            <option value="O+">O+</option>
            <option value="AB+">AB+</option>
            <option value="A-">A-</option>
            <option value="B-">B-</option>
            <option value="O-">O-</option>
            <option value="AB-">AB-</option>
          </select>

          <label>Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            max="10"
            required
          />
        </div>

        <button type="submit" className="post-button">Post</button>
      </form>
    </div>
  );
};

export default BloodRequestForm;
