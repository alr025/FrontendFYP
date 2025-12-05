import React from "react";
import "./HospitalInventory.css";

export default function HospitalInventory() {
  return (
    <div className="hospital-page">
      <h1 >🩸 Blood Inventory</h1>
      <p>View and manage available blood units here.</p>

      <div className="inventory-container">
        <div className="inventory-card">
          <h3>A+</h3>
          <p>120 Units</p>
        </div>
        <div className="inventory-card">
          <h3>B+</h3>
          <p>98 Units</p>
        </div>
        <div className="inventory-card">
          <h3>O+</h3>
          <p>150 Units</p>
        </div>
      </div>
    </div>
  );
}
