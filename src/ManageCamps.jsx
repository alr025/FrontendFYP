import React, { useEffect, useState } from "react";
import axios from "axios";
import { PlusCircle, CalendarDays, MapPin, Edit, Trash2 } from "lucide-react";
import "./ManageCamps.css";

const API_URL = "http://localhost/webapi/api/bloodcamp";

export default function ManageCamps() {
  const [camps, setCamps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locStatus, setLocStatus] = useState("");
  const [editingCamp, setEditingCamp] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    location: "",
    organizer: "",
    contact: "",
    blood_groups: "",
    latitude: null,
    longitude: null,
    description: "",
  });

  // ===============================
  // FETCH CAMPS
  // ===============================
  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/GetCamps`);
      setCamps(res.data);
    } catch (err) {
      console.error("Failed to load camps", err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // GET CURRENT LOCATION
  // ===============================
  const getLocation = () => {
    setLocStatus("📍 Getting location...");

    if (!navigator.geolocation) {
      setLocStatus("❌ Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }));

        setLocStatus(
          `📍 Location added (Lat: ${pos.coords.latitude.toFixed(
            4
          )}, Lng: ${pos.coords.longitude.toFixed(4)})`
        );
      },
      () => setLocStatus("❌ Location permission denied")
    );
  };

  // ===============================
  // HANDLE ADD CAMP
  // ===============================
  const handleAddCamp = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.date || !formData.location) {
      alert("Please fill all required fields");
      return;
    }

    const newCamp = {
      organization_id: 1,
      name: formData.name,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      organizer: formData.organizer,
      contact: formData.contact,
      blood_groups: formData.blood_groups,
      latitude: formData.latitude,
      longitude: formData.longitude,
      slots: 50,
      registered: 0,
      status: "Active",
      description: formData.description,
    };

    try {
      if (editingCamp) {
        // ===============================
        // UPDATE CAMP
        // ===============================
        await axios.put(`${API_URL}/update/${editingCamp.id}`, newCamp);
        setEditingCamp(null);
      } else {
        await axios.post(`${API_URL}/add`, newCamp);
      }

      fetchCamps();
      setFormData({
        name: "",
        date: "",
        time: "",
        location: "",
        organizer: "",
        contact: "",
        blood_groups: "",
        latitude: null,
        longitude: null,
        description: "",
      });
      setLocStatus("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to save camp", err);
      alert("Failed to save camp");
    }
  };

  // ===============================
  // HANDLE EDIT CLICK
  // ===============================
  const handleEditClick = (camp) => {
    setEditingCamp(camp);
    setFormData({
      name: camp.name,
      date: camp.date.split("T")[0],
      time: camp.time || "",
      location: camp.location,
      organizer: camp.organizer || "",
      contact: camp.contact || "",
      blood_groups: camp.blood_groups || "",
      latitude: camp.latitude || null,
      longitude: camp.longitude || null,
      description: camp.description || "",
    });
    setShowForm(true);
  };

  // ===============================
  // DELETE CAMP
  // ===============================
  const handleDeleteCamp = async (id) => {
    if (!window.confirm("Are you sure you want to delete this camp?")) return;

    try {
      await axios.delete(`${API_URL}/delete/${id}`);
      fetchCamps();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  // ===============================
  // UI
  // ===============================
  return (
    <div className="manage-camps-page">
      <div className="header">
        <h2>🏕 Manage Blood Donation Camps</h2>
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          <PlusCircle size={20} />
          {showForm ? " Cancel" : " Add New Camp"}
        </button>
      </div>

      {/* ADD / EDIT CAMP FORM */}
      {showForm && (
        <form className="camp-form" onSubmit={handleAddCamp}>
          <input
            type="text"
            placeholder="Camp Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            required
          />

          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            required
          />

          <input
            type="time"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Location (Area / City)"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            required
          />

          <input
            type="text"
            placeholder="Organizer Name"
            value={formData.organizer}
            onChange={(e) =>
              setFormData({ ...formData, organizer: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Contact Number"
            value={formData.contact}
            onChange={(e) =>
              setFormData({ ...formData, contact: e.target.value })
            }
          />

          <input
            type="text"
            placeholder="Blood Groups (A+, O-, etc)"
            value={formData.blood_groups}
            onChange={(e) =>
              setFormData({ ...formData, blood_groups: e.target.value })
            }
          />

          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button type="button" className="save-btn" onClick={getLocation}>
            📍 Get Current Location
          </button>

          {locStatus && <p className="loc-msg">{locStatus}</p>}

          <button type="submit" className="save-btn">
            {editingCamp ? "Update Camp" : "Save Camp"}
          </button>
        </form>
      )}

      {/* CAMP LIST */}
      <div className="camp-list">
        {loading ? (
          <p>Loading camps...</p>
        ) : camps.length === 0 ? (
          <p className="no-camps">No camps added yet.</p>
        ) : (
          camps.map((camp) => (
            <div key={camp.id} className="camp-card">
              <div className="camp-header">
                <h3>
                  <CalendarDays size={18} /> {camp.name}
                </h3>
                <div className="camp-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditClick(camp)}
                  >
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

              <p>
                <strong>Date:</strong>{" "}
                {new Date(camp.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Time:</strong> {camp.time}
              </p>
              <p>
                <MapPin size={16} /> {camp.location}
              </p>
              <p>
                <strong>Organizer:</strong> {camp.organizer}
              </p>
              <p>
                <strong>Contact:</strong> {camp.contact}
              </p>
              <p>
                <strong>Blood Groups:</strong> {camp.blood_groups}
              </p>
              {camp.latitude && camp.longitude && (
                <p className="coords">
                  📍 {camp.latitude}, {camp.longitude}
                </p>
              )}
              <p>
                <strong>Slots:</strong> {camp.registered}/{camp.slots}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
