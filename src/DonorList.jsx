import React, { useEffect, useState } from "react";
import { Users } from "lucide-react";
import "./DonorList.css";

export default function DonorList() {
  const [donors, setDonors] = useState([]);

  useEffect(() => {
    // Example local data; replace with API call later
    const storedDonors = localStorage.getItem("donors");
    if (storedDonors) {
      setDonors(JSON.parse(storedDonors));
    } else {
      setDonors([
        { id: 1, name: "Ayesha Khan", bloodGroup: "B+", contact: "ayesha@gmail.com" },
        { id: 2, name: "Ali Raza", bloodGroup: "O+", contact: "ali.raza@gmail.com" },
      ]);
    }
  }, []);

  return (
    <div className="donor-list-page">
      <h2><Users size={24} /> Donor List</h2>
      <div className="donor-grid">
        {donors.map((donor) => (
          <div key={donor.id} className="donor-card">
            <h3>{donor.name}</h3>
            <p><strong>Blood Group:</strong> {donor.bloodGroup}</p>
            <p><strong>Email:</strong> {donor.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
