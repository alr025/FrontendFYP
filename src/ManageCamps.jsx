import React, { useEffect, useState } from "react";
import { PlusCircle, CalendarDays, MapPin, Edit, Trash2 } from "lucide-react";
import "./ManageCamps.css";

export default function ManageCamps() {
  const [camps, setCamps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });

  // ✅ Load camps from localStorage on mount
  useEffect(() => {
    const storedCamps = localStorage.getItem("camps");
    if (storedCamps) {
      setCamps(JSON.parse(storedCamps));
    }
  }, []);

  // ✅ Save camps to localStorage whenever updated
  useEffect(() => {
    localStorage.setItem("camps", JSON.stringify(camps));
  }, [camps]);

  // ✅ Handle adding new camp
  const handleAddCamp = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.location) return;
    const newCamp = { ...formData, id: Date.now() };
    setCamps([...camps, newCamp]);
    setFormData({ name: "", date: "", location: "", description: "" });
    setShowForm(false);
  };

  // ✅ Delete camp
  const handleDeleteCamp = (id) => {
    if (window.confirm("Are you sure you want to delete this camp?")) {
      setCamps(camps.filter((camp) => camp.id !== id));
    }
  };

  return (
    <div className="manage-camps-page">
      <div className="header">
        <h2>🏕 Manage Blood Donation Camps</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={20} /> {showForm ? "Cancel" : "Add New Camp"}
        </button>
      </div>

      {/* ✅ Add New Camp Form */}
      {showForm && (
        <form className="camp-form" onSubmit={handleAddCamp}>
          <input
            type="text"
            placeholder="Camp Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
          <button type="submit" className="save-btn">Save Camp</button>
        </form>
      )}

      {/* ✅ List of Camps */}
      <div className="camp-list">
        {camps.length === 0 ? (
          <p className="no-camps">No camps added yet. Click “Add New Camp” to start.</p>
        ) : (
          camps.map((camp) => (
            <div key={camp.id} className="camp-card">
              <div className="camp-header">
                <h3><CalendarDays size={20} /> {camp.name}</h3>
                <div className="camp-actions">
                  <button className="edit-btn">
                    <Edit size={18} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteCamp(camp.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p><strong>Date:</strong> {camp.date}</p>
              <p><MapPin size={16} className="inline-icon" /> {camp.location}</p>
              {camp.description && <p>{camp.description}</p>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
