import React, { useEffect, useState } from "react";
import {
  Droplet,
  UserPlus,
  HelpCircle,
  Tent,
  User,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./UserHomePage.css";
import { Bell } from "lucide-react";
import axios from "axios";

export default function HomePage() {
  const [activeUser, setActiveUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // --- Fetch notifications for logged-in user ---
 // --- Fetch notifications for logged-in user ---
useEffect(() => {
  const storedUser = localStorage.getItem("activeUser");
  if (!storedUser) return; // exit if no logged-in user

  const user = JSON.parse(storedUser);
  setActiveUser(user);

  const fetchNotifications = async () => {
    try {
      if (!user) return; // safeguard
      const res = await axios.get(
        `http://localhost/webapi/api/Notifications/user/${user.id}`
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Notification error:", err);
    }
  };

  fetchNotifications();
  const interval = setInterval(fetchNotifications, 30000);

  return () => clearInterval(interval);
}, []); // <-- run only once on mount

const handleLogout = () => {
  // Clear local storage
  localStorage.removeItem("activeUser");

  // Clear state
  setActiveUser(null);
  setNotifications([]);

  // Redirect and replace history
  navigate("/", { replace: true });
};


  const handleNotificationClick = async (n) => {
    try {
      await axios.post(
        `http://localhost/webapi/api/Notifications/mark-read/${n.Id}`
      );

      setNotifications((prev) =>
        prev.map((x) => (x.Id === n.Id ? { ...x, IsRead: true } : x))
      );

      if (n.Latitude && n.Longitude) {
        navigate("/map-modal", {
          state: { coords: { lat: n.Latitude, lng: n.Longitude }, name: n.Title },
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { label: "Donor", icon: <Droplet size={28} />, path: "/donor" },
    { label: "Request", icon: <UserPlus size={28} />, path: "/request" },
    { label: "F.A.Q", icon: <HelpCircle size={28} />, path: "/Userfaq" },
    { label: "Camp", icon: <Tent size={28} />, path: "/camp" },
    { label: "Family Members", icon: <User size={28} />, path: "/familymembers" },
  ];

  return (
    <div className="page2-wrapper" style={{ position: "relative" }}>
      
      {/* Notification Bell */}
      <div className="notification-wrapper">
        <Bell
          size={28}
          className="bell-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {notifications.filter(n => !n.IsRead).length > 0 && (
          <span className="notification-badge">
            {notifications.filter(n => !n.IsRead).length}
          </span>
        )}
        {showDropdown && (
          <div className="notification-dropdown">
            {notifications.length === 0 ? (
              <p className="no-notification">No notifications</p>
            ) : (
              notifications.map((n, idx) => (
                <div
                  key={idx}
                  className={`notification-item ${n.IsRead ? "" : "unread"}`}
                  onClick={() => handleNotificationClick(n)}
                >
                  <strong>{n.Title}</strong>
                  <p>{n.Message}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="home-container">

        {/* Active User Banner */}
        {activeUser ? (
          <div className="active-user-banner">
            <h2>👋 Welcome, <span>{activeUser.name}</span>!</h2>
            <p>{activeUser.email}</p>
            <p>Blood Group: {activeUser.blood_type}</p>

            {/* Logout Button */}
            <button className="logout-button" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div className="active-user-banner">
            <h2>👋 Welcome to BloodLink!</h2>
            <p>Select a profile to get started</p>
          </div>
        )}

        {/* Top image */}
        <div className="image-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
            alt="Blood Donation"
            className="blood-image"
          />
        </div>

        {/* Menu Grid */}
        <div className="menu-grid">
          {menuItems.map((item, idx) => (
            <div key={idx} className="menu-card">
              <Link to={item.path} className="menu-main">
                <div className="menu-icon">{item.icon}</div>
                <p className="menu-label">{item.label}</p>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
