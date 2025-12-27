import React, { useEffect, useState } from "react";
import "./HospitalDonors.css";

export default function HospitalDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/webapi/api/user/donors") // API endpoint
      .then((res) => res.json())
      .then((data) => {
        // Only show donors who are eligible or hospital users
        const filteredDonors = data.filter(
          (d) => !d.blocked || d.type === "Hospital"
        );
        setDonors(filteredDonors);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching donors:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading donors...</h2>;

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
          {donors.map((donor, idx) => (
            <tr key={idx}>
              <td>{donor.name}</td>
              <td>
                {donor.type === "Hospital"
                  ? "Hospital"
                  : donor.blood ?? "Unknown"}
              </td>
              <td>
                {donor.type === "Hospital"
                  ? "-"
                  : donor.lastDonate
                  ? donor.lastDonate.split("T")[0]
                  : "Never Donated"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
