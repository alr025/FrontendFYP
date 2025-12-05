import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Phone, Droplet, Users, ClipboardCheck } from "lucide-react";
import "./BloodCampPage.css";

export default function BloodCampPage() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 FETCH CAMPS FROM BACKEND (GET ONLY)
  useEffect(() => {
    fetch("http://localhost/webapi/api/bloodcamp/GetCamps")
      .then((res) => res.json())
      .then((data) => {
        setCamps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading camps:", err);
        setLoading(false);
      });
  }, []);

  // 🟢 REGISTER BUTTON HANDLER
  const handleRegister = (index) => {
    const updated = [...camps];

    if (updated[index].registered < updated[index].slots) {
      updated[index].registered += 1;
      alert(`You are registered for ${updated[index].name}!`);
    } else {
      alert("Sorry, this camp is full.");
    }

    setCamps(updated);
  };

  if (loading) return <h2>Loading camps...</h2>;

  return (
    <div className="camp-wrapper">
      <div className="camp-header">
        <h1>🩸 Blood Camps</h1>
      </div>

      <div className="camp-grid">
        {camps.map((camp, index) => (
          <div className="camp-card" key={camp.id || index}>
            <h2>{camp.name}</h2>

            <p><Calendar size={16}/> {camp.date} | {camp.time}</p>
            <p><MapPin size={16}/> {camp.location}</p>
            <p><Droplet size={16}/> Needed: {camp.blood_groups}</p>
            <p><Phone size={16}/> {camp.contact}</p>
            <p><Users size={16}/> Slots: {camp.registered}/{camp.slots}</p>
            <p><ClipboardCheck size={16}/> Status: <strong>{camp.status}</strong></p>
            <p><strong>Organizer:</strong> {camp.organizer}</p>

            {/* 🟦 Register Button */}
            <button 
              className="register-btn" 
              onClick={() => handleRegister(index)}
            >
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
