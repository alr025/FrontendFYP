import React, { useEffect, useState } from "react";
import {
  Droplet,
  UserPlus,
  HelpCircle,
  Tent,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./UserHomePage.css";
import { Bell } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function HomePage() {
  const [activeUser, setActiveUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();


  // --- Fetch notifications for logged-in user ---
  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (!storedUser) return;

    const user = JSON.parse(storedUser);
    setActiveUser(user);

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `http://localhost/webapi/api/Notifications/user/${user.id}`
        );
        console.log("Notifications fetched:", res.data); // debug
        setNotifications(res.data);
      } catch (err) {
        console.error("Notification error:", err);
      }
    };

    fetchNotifications(); // initial fetch
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s

    return () => clearInterval(interval);
  }, []);

const handleNotificationClick = async (n) => {
  try {
    await axios.post(
      `http://localhost/webapi/api/Notifications/mark-read/${n.Id}`
    );

    setNotifications((prev) =>
      prev.map((x) => (x.Id === n.Id ? { ...x, IsRead: true } : x))
    );

    // Navigate to map if coordinates exist
    if (n.Latitude && n.Longitude) {
      navigate("/map-modal", {
        state: {
          coords: { lat: n.Latitude, lng: n.Longitude },
          name: n.Title,
        },
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
    <div className="page2-wrapper">
      <div className="home-container">
        {/* Notification Bell */}
        <div className="notification-wrapper">
          <Bell
            size={28}
            className="bell-icon"
            onClick={() => setShowDropdown(!showDropdown)}
          />

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

        {/* Show active user profile */}
        {activeUser ? (
          <div className="active-user-banner">
            <h2>
              👋 Welcome, <span>{activeUser.name}</span>!
            </h2>
            <p>{activeUser.email}</p>
            <p>Blood Group: {activeUser.blood_type}</p>
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
