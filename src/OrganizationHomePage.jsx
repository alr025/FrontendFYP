import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  User,
  Building2,
  Droplet,
  Bell,
  LogOut
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./OrganizationHomePage.css";

export default function OrganizationHomePage() {
  const [activeOrg, setActiveOrg] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // Load active organization profile
  useEffect(() => {
    const storedOrg = localStorage.getItem("activeUser");
    if (storedOrg) {
      const org = JSON.parse(storedOrg);
      setActiveOrg(org);

      const fetchNotifications = async () => {
        try {
          const res = await axios.get(
            `http://localhost/webapi/api/Notifications/user/${org.id}`
          );
          setNotifications(res.data);
        } catch (err) {
          console.error("Error fetching notifications:", err);
        }
      };

      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
      return () => clearInterval(interval);
    }
  }, []);

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

  // --- Logout handler ---
  const handleLogout = async () => {
    if (activeOrg) {
      try {
        // Optional: mark all notifications as read in backend
        await axios.post(`http://localhost/webapi/api/Notifications/mark-read-all/${activeOrg.id}`);
      } catch (err) {
        console.error("Error marking notifications read:", err);
      }
    }

    // Clear frontend
    localStorage.removeItem("activeUser");
    setActiveOrg(null);
    setNotifications([]);
    setShowDropdown(false);

    navigate("/", { replace: true }); // go back to login
  };

  const menuItems = [
    { label: "Manage Camps", icon: <CalendarDays size={28} />, path: "/org/camps" },
    { label: "View Requests", icon: <User size={28} />, path: "/org/requests" },
    { label: "Blood Bank", icon: <Droplet size={28} />, path: "/org/bloodbank" },
  ];

  return (
    <div className="page2-wrapper">
      {/* Notification Bell */}
      <div className="notification-wrapper">
        <Bell
          size={28}
          className="bell-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {notifications.filter((n) => n.Type === "UserRequest" && !n.IsRead).length > 0 && (
          <span className="notification-badge">
            {notifications.filter((n) => n.Type === "UserRequest" && !n.IsRead).length}
          </span>
        )}
        {showDropdown && (
          <div className="notification-dropdown">
            {notifications.length === 0 ? (
              <p className="no-notification">No notifications</p>
            ) : (
              notifications
                .filter((n) => n.Type !== "Camp")
                .map((n, idx) => (
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
   {/* Organization header */}
<div className="active-user-banner org-banner">
  {activeOrg ? (
    <>
      <h2>
        <Building2 className="inline-icon" size={26} /> Welcome to the Organization Dashboard,&nbsp;
        <span>{activeOrg.orgName}</span>!
      </h2>
      <p>{activeOrg.email}</p>
      <p>📍 Location: {activeOrg.location || "Not provided"}</p>
      {/* Logout button */}
      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={16} /> Logout
      </button>
    </>
  ) : (
    <>
      <h2>🏢 Welcome to BloodLink for Organizations!</h2>
      <p>Login or register your organization to begin.</p>
    </>
  )}
</div>


        {/* Top image */}
        <div className="image-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
            alt="Organization Management"
            className="blood-image"
          />
        </div>

        {/* Menu grid */}
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
