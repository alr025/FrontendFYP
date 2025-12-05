import React from "react";
import "./HospitalRequests.css";

export default function HospitalRequests() {
  return (
    <div className="hospital-page">
      <h1>📋 Blood Requests</h1>
      <p>See incoming blood requests from donors or organizations.</p>

      <div className="request-list">
        <div className="request-card">
          <h3>Request #1001</h3>
          <p>Blood Type: A+</p>
          <p>Urgency: High</p>
          <button>View Details</button>
        </div>
      </div>
    </div>
  );
}
