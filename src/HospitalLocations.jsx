import React from "react";
import "./HospitalLocations.css";

export default function HospitalLocations() {
  return (
    <div className="hospital-page">
      <h1>📍 Hospital Branches</h1>
      <p>Manage or view hospital branch locations.</p>

      <ul className="location-list">
        <li>🏥 Central City Hospital - Karachi</li>
        <li>🏥 North Health Center - Lahore</li>
      </ul>
    </div>
  );
}
