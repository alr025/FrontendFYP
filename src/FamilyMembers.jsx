import React, { useState, useEffect } from "react";
import { User, Mail, Droplet, Plus, Users, Trash } from "lucide-react";
import "./FamilyMembers.css";

export default function FamilyMembers() {
const loggedInUser = JSON.parse(localStorage.getItem("activeUser"));

if (!loggedInUser) {
  alert("Please login again");
  window.location.href = "/login";
  return null;
}

const USER_ID = loggedInUser.id; // ✅ REAL USER ID

  const [users, setUsers] = useState([]);       // Family relations from backend
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [newRelation, setNewRelation] = useState({
    RelatedUserEmail: "",
    RelationType: "",
  });

  const [activeUser, setActiveUser] = useState(null);

  // 🚀 FETCH FAMILY RELATIONS FROM BACKEND
  useEffect(() => {
    fetch(`http://localhost/webapi/api/user/relations/${USER_ID}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.relations || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading relations:", err);
        setLoading(false);
      });
  }, []);

  // FORM INPUT HANDLER
  const handleChange = (e) => {
    setNewRelation({ ...newRelation, [e.target.name]: e.target.value });
  };

  // ➕ ADD FAMILY RELATION (POST)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newRelation.RelatedUserEmail || !newRelation.RelationType) {
      alert("Please fill all fields");
      return;
    }

    const res = await fetch("http://localhost/webapi/api/user/add-relation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        UserId: USER_ID,
        RelationType: newRelation.RelationType,
        RelatedUserEmail: newRelation.RelatedUserEmail,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Failed to add relation");
      return;
    }

    alert("Relation added successfully!");

    // Refresh list
    setUsers([
      ...users,
      {
        relationId: result.relationId,
        relationType: result.relationType,
        relatedUser: result.relatedUser,
        createdAt: result.createdAt,
      },
    ]);

    setShowForm(false);
    setNewRelation({ RelatedUserEmail: "", RelationType: "" });
  };

  // 🗑 REMOVE RELATION
  const handleDelete = async (relationId) => {
    if (!window.confirm("Delete this family member?")) return;

    const res = await fetch(
      `http://localhost/webapi/api/user/remove-relation/${USER_ID}/${relationId}`,
      { method: "DELETE" }
    );

    const result = await res.json();

    if (!res.ok) {
      alert(result.message || "Error removing relation");
      return;
    }

    alert("Relation removed!");

    // Remove from UI
    setUsers(users.filter((u) => u.relationId !== relationId));
  };

  if (loading) return <h2>Loading Family Members...</h2>;

  return (
    <div className="family-wrapper">
      {/* Header */}
      <div className="family-header">
        <Users size={32} />
        <h2>Family Members</h2>

        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} /> Add Member
        </button>
      </div>

      {/* Add Relation Form */}
      {showForm && (
        <form className="family-form" onSubmit={handleSubmit}>
          <h3>Add Family Member</h3>

          <input
            type="email"
            name="RelatedUserEmail"
            placeholder="Enter member email"
            value={newRelation.RelatedUserEmail}
            onChange={handleChange}
          />

          <select
            name="RelationType"
            value={newRelation.RelationType}
            onChange={handleChange}
          >
            <option value="">Select Relation</option>
            <option>Father</option>
            <option>Mother</option>
            <option>Brother</option>
            <option>Sister</option>
            <option>Son</option>
            <option>Daughter</option>
            <option>Uncle</option>
            <option>Aunt</option>
            <option>Friend</option>
            <option>EmergencyContact</option>
          </select>

          <button type="submit">Add Member</button>
        </form>
      )}

      {/* Family Members List */}
      <div className="family-list">
        {users.map((user) => (
          <div
            key={user.relationId}
            className="family-card"
            onClick={() => setActiveUser(user)}
          >
            <User size={48} />

            <h2>{user.relatedUser.name}</h2>

            <div className="details">
              <p><Mail size={18} /> {user.relatedUser.email}</p>
              <p><Droplet size={18} /> Blood: {user.relatedUser.bloodType}</p>
              <p><Users size={18} /> Relation: {user.relationType}</p>
            </div>

            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(user.relationId);
              }}
            >
              <Trash size={18} /> Remove
            </button>
          </div>
        ))}
      </div>

      {/* ACTIVE USER PANEL */}
      {activeUser && (
        <div className="active-profile">
          <h3>Active Member</h3>
          <div className="active-profile-card">
            <User size={48} />
            <div>
              <h4>{activeUser.relatedUser.name}</h4>
              <p>Email: {activeUser.relatedUser.email}</p>
              <p>Blood: {activeUser.relatedUser.bloodType}</p>
              <p>Relation: {activeUser.relationType}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
