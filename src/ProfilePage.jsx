import React, { useState, useEffect } from "react";
import { User, Mail, Droplet, Plus } from "lucide-react";
import "./ProfilePage.css";

export default function familymembers() {
  const defaultUsers = [
    { name: "Ahmad", email: "ahmad@gmail.com", bloodGroup: "O+" },
    { name: "Ali", email: "ali@gmail.com", bloodGroup: "A-" },
    { name: "Asad", email: "asad@gmail.com", bloodGroup: "B+" },
    { name: "Hammad", email: "hammad@gmail.com", bloodGroup: "AB+" },
    { name: "Haris", email: "haris@gmail.com", bloodGroup: "AB-" },
  ];

  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : defaultUsers;
  });

  const [showForm, setShowForm] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", bloodGroup: "" });
  const [activeUser, setActiveUser] = useState(null); // 👈 NEW: for current profile

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  const handleAddClick = () => setShowForm((prev) => !prev);

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newUser.name || !newUser.email || !newUser.bloodGroup) {
      alert("Please fill in all fields!");
      return;
    }

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setNewUser({ name: "", email: "", bloodGroup: "" });
    setShowForm(false);
  };

  const handleProfileClick = (user) => {
    setActiveUser(user);
  };

  return (
    <div className="profile-wrapper">
      {/* Global Add Profile Button */}
      <button className="global-add-btn" onClick={handleAddClick}>
        <Plus size={20} />
      </button>

      {/* Add Profile Form */}
      {showForm && (
        <form className="add-profile-form" onSubmit={handleSubmit}>
          <h3>Add New Profile</h3>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={newUser.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={newUser.email}
            onChange={handleChange}
          />
          <input
            type="text"
            name="bloodGroup"
            placeholder="Enter Blood Group"
            value={newUser.bloodGroup}
            onChange={handleChange}
          />
          <button type="submit">Add Profile</button>
        </form>
      )}

      {/* Profile Cards */}
      <div className="profile-list">
        {users.map((user, index) => (
          <div
            className={`profile-card ${activeUser?.email === user.email ? "active" : ""}`}
            key={index}
            onClick={() => handleProfileClick(user)}
          >
            <div className="profile-avatar">
              <User size={48} className="profile-icon" />
            </div>
            <h2 className="profile-name">{user.name}</h2>
            <div className="profile-details">
              <div className="profile-detail">
                <Mail size={18} />
                <span>{user.email}</span>
              </div>
              <div className="profile-detail">
                <Droplet size={18} />
                <span>Blood Group: {user.bloodGroup}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Profile Display */}
      {activeUser && (
        <div className="active-profile">
          <h3>Current Active Profile</h3>
          <div className="active-profile-card">
            <User size={48} />
            <div>
              <h4>{activeUser.name}</h4>
              <p>{activeUser.email}</p>
              <p>Blood Group: {activeUser.bloodGroup}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
