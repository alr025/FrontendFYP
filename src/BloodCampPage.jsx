import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Phone, Droplet, Users, ClipboardCheck } from "lucide-react";
import "./BloodCampPage.css";

export default function BloodCampPage() {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredCampIds, setRegisteredCampIds] = useState([]);
 const [activeUser, setActiveUser] = useState(
  JSON.parse(localStorage.getItem("activeUser"))
);

useEffect(() => {
  const handleStorageChange = () => {
    setActiveUser(JSON.parse(localStorage.getItem("activeUser")));
  };

  window.addEventListener("storage", handleStorageChange);

  return () => window.removeEventListener("storage", handleStorageChange);
}, []);

const userId = activeUser?.id || null;
console.log("activeUser:", activeUser);
console.log("userId:", userId);


  // Fetch all camps
  useEffect(() => {
    fetch("http://localhost/webapi/api/bloodcamp/GetCamps")
      .then((res) => res.json())
      .then((data) => {
        setCamps(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Fetch registered camps for logged-in user
  useEffect(() => {
    if (!userId) return;

    const fetchRegisteredCamps = async () => {
      try {
        const res = await fetch(
          `http://localhost/webapi/api/bloodcamp/user-registrations/${userId}`
        );
        const data = await res.json();
        setRegisteredCampIds(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRegisteredCamps();
  }, [userId]);

  // Register button handler
  const handleRegister = async (campId, index) => {
    if (!userId) {
      alert("Please login first to register for camps.");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost/webapi/api/bloodcamp/register/${userId}/${campId}`,
        { method: "POST" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.Message || "Registration failed");
        return;
      }

      // Update local state
      const updatedCamps = [...camps];
      updatedCamps[index].registered += 1;
      setCamps(updatedCamps);

      setRegisteredCampIds([...registeredCampIds, campId]);

      alert("✅ You are registered for this camp!");
    } catch (err) {
      console.error(err);
      alert("❌ Network error, please try again.");
    }
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

            <button
              className="register-btn"
              disabled={!userId || registeredCampIds.includes(camp.id)}
              onClick={() => handleRegister(camp.id, index)}
            >
              {!userId
                ? "Login to register"
                : registeredCampIds.includes(camp.id)
                ? "Registered ✔"
                : "Register"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
