import React from "react";
import { Handshake } from "lucide-react";
import "./Collaborations.css";

export default function Collaborations() {   // ✅ must use `export default`
  return (
    <div className="collab-page">
      <h2><Handshake size={24} /> Collaborations</h2>
      <p>Partner with other NGOs or hospitals to enhance blood donation efforts.</p>

      <div className="partner-list">
        <div className="partner-card">
          <h3>City Hospital</h3>
          <p>Ongoing blood donation collaboration.</p>
          <button className="connect-btn">View Details</button>
        </div>
        <div className="partner-card">
          <h3>Red Cross</h3>
          <p>Organizing quarterly camps with your NGO.</p>
          <button className="connect-btn">Contact</button>
        </div>
      </div>
    </div>
  );
}
