import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Users,
  User,
  Building2,
  Droplet,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./OrganizationHomePage.css";

export default function OrganizationHomePage() {
  const [activeOrg, setActiveOrg] = useState(null);

  // ✅ Load active organization profile from localStorage
  useEffect(() => {
    try {
      const storedOrg = localStorage.getItem("activeOrganization");
      if (storedOrg) {
        setActiveOrg(JSON.parse(storedOrg));
      }
    } catch (error) {
      console.error("Error loading organization data:", error);
    }
  }, []);

  // ✅ Centralized menu configuration
  const menuItems = [
    { label: "Manage Camps", icon: <CalendarDays size={28} />, path: "/org/camps" },
    { label: "View Requests", icon: <User size={28} />, path: "/org/requests" },
    { label: "Blood Bank", icon: <Droplet size={28} />, path: "/org/bloodbank" }
  ];

  return (
    <div className="page2-wrapper">
      <div className="home-container">
        {/* ✅ Organization header */}
        {activeOrg ? (
          <div className="active-user-banner org-banner">
            <h2>
              <Building2 className="inline-icon" size={26} /> Welcome,&nbsp;
              <span>{activeOrg.orgName}</span>!
            </h2>
            <p>{activeOrg.email}</p>
            <p>📍 Location: {activeOrg.location}</p>
          </div>
        ) : (
          <div className="active-user-banner org-banner">
            <h2>🏢 Welcome to BloodLink for Organizations!</h2>
            <p>Login or register your organization to begin.</p>
          </div>
        )}

        {/* ✅ Top image */}
        <div className="image-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
            alt="Organization Management"
            className="blood-image"
          />
        </div>

        {/* ✅ Slider dots */}
        {/* <div className="slider-dots">
          <span className="dot active"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div> */}

        {/* ✅ Menu grid */}
        <div className="menu-grid">
          {menuItems.map((item, idx) => (
            <div key={idx} className="menu-card">
              <Link to={item.path} className="menu-main">
                <div className="menu-icon">{item.icon}</div>
                <p className="menu-label">{item.label}</p>
              </Link>

              {/* 🔹 Submenu only for Manage Camps
              {item.label === "Manage Camps" && (
                <div className="submenu">
                  <Link to="/org/camps/create" className="submenu-btn">
                    ➕ Create
                  </Link>
                  <Link to="/org/camps/active" className="submenu-btn">
                    📅 Active
                  </Link>
                </div>
              )} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
