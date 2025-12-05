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

export default function HomePage() {
  const [activeUser, setActiveUser] = useState(null);

  // ✅ Load active profile name from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    }
  }, []);

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
        {/* ✅ Show active profile name */}
        {activeUser ? (
          <div className="active-user-banner">
            <h2>👋 Welcome, <span>{activeUser.name}</span>!</h2>
            <p>{activeUser.email}</p>
            <p>Blood Group: {activeUser.bloodGroup}</p>
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

        {/* Slider dots
        <div className="slider-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div> */}

        {/* Menu grid */}
        <div className="menu-grid">
          {menuItems.map((item, idx) => (
            <div key={idx} className="menu-card">
              <Link to={item.path} className="menu-main">
                <div className="menu-icon">{item.icon}</div>
                <p className="menu-label">{item.label}</p>
              </Link>

              {/* Extra buttons for Blood Bank */}
              {item.label === "Blood Bank" && (
                <div className="submenu">
                  <Link to="/blood-bank/add" className="submenu-btn">
                    Add
                  </Link>
                  <Link to="/blood-bank/nearby" className="submenu-btn">
                    Nearby
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
