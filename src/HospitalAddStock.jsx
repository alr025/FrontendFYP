import React, { useState } from "react";
import "./HospitalAddStock.css";

export default function HospitalAddStock() {
  const [formData, setFormData] = useState({ bloodType: "", units: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Added ${formData.units} units of ${formData.bloodType} blood!`);
  };

  return (
    <div className="hospital-page">
      <h1>➕ Add Blood Stock</h1>
      <form className="stock-form" onSubmit={handleSubmit}>
        <select
          onChange={(e) => setFormData({ ...formData, bloodType: e.target.value })}
        >
          <option value="">Select Blood Type</option>
          <option>A+</option>
          <option>B+</option>
          <option>O+</option>
          <option>AB+</option>
        </select>

        <input
          type="number"
          placeholder="Units"
          onChange={(e) => setFormData({ ...formData, units: e.target.value })}
        />

        <button type="submit">Add Stock</button>
      </form>
    </div>
  );
}
