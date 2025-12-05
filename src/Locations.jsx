import React, { useState } from "react";
import { MapPin, PlusCircle } from "lucide-react";
import "./Locations.css";

export default function Locations() {
  const [locations, setLocations] = useState([
    { id: 1, name: "Main Branch", address: "Downtown, Lahore" },
  ]);
  const [newLocation, setNewLocation] = useState("");

  const handleAdd = () => {
    if (!newLocation.trim()) return;
    const newLoc = { id: Date.now(), name: newLocation, address: "Unknown" };
    setLocations([...locations, newLoc]);
    setNewLocation("");
  };

  return (
    <div className="locations-page">
      <h2><MapPin size={24} /> Organization Locations</h2>
      <div className="add-location">
        <input
          type="text"
          value={newLocation}
          onChange={(e) => setNewLocation(e.target.value)}
          placeholder="Add new branch name"
        />
        <button onClick={handleAdd}><PlusCircle size={18} /> Add</button>
      </div>

      <ul className="location-list">
        {locations.map((loc) => (
          <li key={loc.id} className="location-card">
            <h3>{loc.name}</h3>
            <p>{loc.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
