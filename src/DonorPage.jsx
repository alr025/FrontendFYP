import React, { useEffect, useState } from "react";
import { Phone, Droplet } from "lucide-react";
import "./Donor.css";

export default function DonorPage() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost/webapi/api/user/donors")   // 🔥 change URL to your API endpoint
      .then((res) => res.json())
      .then((data) => {
        setDonors(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching donors:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <h2>Loading donors...</h2>;

  return (
    <div className="Page">
      <div className="page-container">
        <h1 className="page-title">Donors</h1>

        <div className="donor-list">
          {donors.map((donor, idx) => (
            <div key={idx} className="donor-card">
              <div className="donor-info">
                <p className="donor-name">{donor.name}</p>
                <p className="donor-phone"><Phone size={16} /> {donor.phone}</p>
                <p className="donor-blood"><Droplet size={16} /> {donor.blood}</p>
              </div>
              <div className="donor-date">
                <p className="label">Last Donate Date</p>
                <p className="date">
                  {donor.lastDonate ? donor.lastDonate.split("T")[0] : "Never Donated"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
