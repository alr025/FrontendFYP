import React from "react";
import "./HospitalDonors.css";

export default function HospitalDonors() {
  return (
    <div className="hospital-page">
      <h1>👥 Donor List</h1>
      <p>Access the donor database linked to your hospital.</p>

      <table className="donor-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Blood Group</th>
            <th>Last Donation</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Ali Khan</td><td>A+</td><td>May 2025</td></tr>
          <tr><td>Sara Ahmed</td><td>O+</td><td>June 2025</td></tr>
        </tbody>
      </table>
    </div>
  );
}
