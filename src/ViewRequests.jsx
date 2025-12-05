import React, { useEffect, useState } from "react";
import { AlertTriangle, Droplet, Clock, MapPin, FlaskRound } from "lucide-react";
import "./ViewRequests.css";

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Load requests (replace with API later)
    const stored = localStorage.getItem("bloodRequests");
    if (stored) {
      setRequests(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="req-page-wrapper">
      <h1 className="req-header">Blood Requests</h1>

      <div className="req-list">
        {requests.length === 0 ? (
          <p className="no-requests">No blood requests found.</p>
        ) : (
          requests.map((req, idx) => (
            <div key={idx} className="req-card">
              <div className="req-row">
                <Droplet className="req-icon" />
                <span>Blood: <strong>{req.bloodType}</strong></span>
              </div>

              <div className="req-row">
                <FlaskRound className="req-icon" />
                <span>Qty: {req.quantity} units</span>
              </div>

              <div className="req-row">
                <Clock className="req-icon" />
                <span>{req.dateTime}</span>
              </div>

              <div className="req-row">
                <MapPin className="req-icon" />
                <span>
                  {req.location ? req.location : "Location not provided"}
                </span>
              </div>

              <div className="req-row status-row">
                <AlertTriangle className="req-icon warn" />
                <span className="req-status">Status: PENDING</span>
              </div>

              <button className="respond-btn">Respond</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
