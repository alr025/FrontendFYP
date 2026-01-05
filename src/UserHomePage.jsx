import React, { useEffect, useState } from "react";
import {
  Droplet,
  UserPlus,
  HelpCircle,
  Tent,
  User,
  LogOut,
  Bell,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserHomePage.css";

export default function HomePage() {
  const [activeUser, setActiveUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  // --- Fetch user & notifications (single useEffect) ---
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
        console.log("[DEBUG] Notifications:", res.data);
        setNotifications(res.data);
      } catch (err) {
        console.error("Notification error:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  // --- Logout ---
  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setActiveUser(null);
    navigate("/", { replace: true });
  };
// Step 2a: Accept disease notification
const handleAcceptDisease = async (n) => {
  try {
    await axios.post(
      `http://localhost/webapi/api/Notifications/accept-disease-notification/${n.Id}/${activeUser.id}`
    );

    setNotifications((prev) =>
      prev.map((x) =>
        x.Id === n.Id ? { ...x, Status: "Accepted" } : x
      )
    );

    alert("Accepted! Blood reserved (if Thalassemia).");
  } catch (err) {
    console.error(err);
  }
};

// Step 2b: Cancel disease notification
const handleCancelDisease = async (n) => {
  try {
    await axios.post(
      `http://localhost/webapi/api/Notifications/cancel-disease-notification/${n.Id}`
    );

    setNotifications((prev) =>
      prev.map((x) =>
        x.Id === n.Id ? { ...x, Status: "Cancelled" } : x
      )
    );

    alert("Notification cancelled.");
  } catch (err) {
    console.error(err);
  }
};

  // --- Notification actions ---
  const handleNotificationClick = async (n) => {
    try {
      await axios.post(
        `http://localhost/webapi/api/Notifications/mark-read/${n.Id}`
      );
      setNotifications((prev) =>
        prev.map((x) => (x.Id === n.Id ? { ...x, IsRead: true } : x))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleAccept = async (n) => {
    try {
      await axios.post(
        `http://localhost/webapi/api/Notifications/accept/${n.Id}/${activeUser.id}`
      );
      setNotifications((prev) =>
        prev.map((x) => (x.Id === n.Id ? { ...x, Status: "Accepted" } : x))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (n) => {
    try {
      await axios.post(
        `http://localhost/webapi/api/Notifications/reject/${n.Id}/${activeUser.id}`
      );
      setNotifications((prev) =>
        prev.map((x) => (x.Id === n.Id ? { ...x, Status: "Rejected" } : x))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkDonated = async (n) => {
    try {
      await axios.post(
        `http://localhost/webapi/api/Notifications/donated/${n.Id}`
      );
      setNotifications((prev) =>
        prev.map((x) => (x.Id === n.Id ? { ...x, Status: "Donated" } : x))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // --- Menu items ---
  const menuItems = [
    { label: "Donor", icon: <Droplet size={26} />, path: "/donor" },
    { label: "Request", icon: <UserPlus size={26} />, path: "/request" },
    { label: "F.A.Q", icon: <HelpCircle size={26} />, path: "/Userfaq" },
    { label: "Camp", icon: <Tent size={26} />, path: "/camp" },
    { label: "Family Members", icon: <User size={26} />, path: "/familymembers" },
    { label: "Find Blood Bank", icon: <Tent size={26} />, path: "/select-location" },
    { label: "My Reserved Blood", icon: <Droplet size={26} />, path: "/reserved-blood" },
  ];

  return (
    <div className="home-container" style={{ position: "relative" }}>
      {/* 🔔 Notification Bell */}
      <div className="notification-wrapper">
        <Bell
          size={28}
          className="bell-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        />
        {notifications.filter((n) => !n.IsRead).length > 0 && (
          <span className="notification-badge">
            {notifications.filter((n) => !n.IsRead).length}
          </span>
        )}

      {showDropdown && (
  <div
    className="notification-dropdown"
    style={{
      position: "absolute",
      top: "40px",
      right: "0",
      width: "300px",
      maxHeight: "400px",
      overflowY: "auto",
      background: "#fff",
      border: "1px solid #ccc",
      zIndex: 9999,
      padding: "5px",
    }}
  >
    {notifications.length === 0 ? (
      <p className="no-notification">No notifications</p>
    ) : (
      notifications.map((n) => {
        const status = n.Status || "Pending";

        // Step 1a: Only show disease notifications for Thalassemia or Polycythemia
        const isDiseaseNotification =
          n.Type === "ThalassemiaBloodRequest" || n.Type === "PolycythemiaDonationRequest";

        return (
        <div
  key={n.Id}
  className={`notification-item ${n.IsRead ? "" : "unread"} ${isDiseaseNotification ? "disease" : ""}`}
  onClick={() => handleNotificationClick(n)}
>

            <strong>{n.Title}</strong>
            <p>{n.Message}</p>

            {/* Step 1b: If it’s a disease notification, show Yes / Cancel */}
            {isDiseaseNotification && status.toLowerCase() === "pending" && (
              <div className="notification-actions">
                <button onClick={() => handleAcceptDisease(n)}>Yes</button>
                <button onClick={() => handleCancelDisease(n)}>Cancel</button>
              </div>
            )}

            {/* Existing status labels */}
            {!isDiseaseNotification && status === "Accepted" && <span>✅ Accepted</span>}
            {!isDiseaseNotification && status === "Rejected" && <span>❌ Rejected</span>}
            {!isDiseaseNotification && status === "Donated" && <span>🎉 Donated</span>}
          </div>
        );
      })
    )}
  </div>
)}
</div>
      {/* 👤 User Banner */}
      {activeUser && (
        <div className="active-user-banner">
          <h2>
            👋 Welcome, <span>{activeUser.name}</span>!
          </h2>
          <p>{activeUser.email}</p>
          <p>Blood Group: {activeUser.blood_type}</p>

          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      )}

      {/* 🧱 Menu Grid */}
      <div className="menu-grid">
        {menuItems.map((item, idx) => (
          <Link key={idx} to={item.path} className="menu-card">
            <div className="menu-icon">{item.icon}</div>
            <p className="menu-label">{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
