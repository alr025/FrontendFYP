import React from "react";
import "./HospitalProfile.css";

export default function HospitalProfile() {
  return (
    <div className="hospital-page">
      <h1>👤 Hospital Profile</h1>
      <p>View or edit hospital profile details.</p>

      <div className="profile-card">
        <p><strong>Name:</strong> City Hospital</p>
        <p><strong>Email:</strong> cityhospital@example.com</p>
        <p><strong>Location:</strong> Karachi, Pakistan</p>
      </div>
    </div>
  );
}
