import React, { useEffect, useState } from "react";
import {
  Droplet,
  ClipboardList,
  Users,
  FilePlus2,
  MapPin,
  HelpCircle,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./HospitalHomePage.css";

export default function HospitalHomePage() {
  const [activeHospital, setActiveHospital] = useState(null);

  // ✅ Load active hospital profile from localStorage
  useEffect(() => {
    const storedHospital = localStorage.getItem("activeHospital");
    if (storedHospital) {
      setActiveHospital(JSON.parse(storedHospital));
    }
  }, []);

  const menuItems = [
    { label: "Blood Inventory", icon: <Droplet size={28} />, path: "/hospital/inventory" },
    { label: "Requests", icon: <ClipboardList size={28} />, path: "/hospital/requests" },
    { label: "Donors", icon: <Users size={28} />, path: "/hospital/donors" },
    { label: "Add Stock", icon: <FilePlus2 size={28} />, path: "/hospital/add-stock" },
    { label: "Locations", icon: <MapPin size={28} />, path: "/hospital/locations" },
    { label: "Profile", icon: <User size={28} />, path: "/hospital/profile" },
  ];

  return (
    <div className="page2-wrapper">
      <div className="home-container">
        {/* ✅ Hospital header */}
        {activeHospital ? (
          <div className="active-user-banner hospital-banner">
            <h2>🏥 Welcome, <span>{activeHospital.name}</span>!</h2>
            <p>{activeHospital.email}</p>
            <p>Location: {activeHospital.location}</p>
          </div>
        ) : (
          <div className="active-user-banner hospital-banner">
            <h2>🏥 Welcome to BloodLink for Hospitals!</h2>
            <p>Login or register your hospital to get started</p>
          </div>
        )}

        {/* Top image */}
        <div className="image-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
            alt="Hospital Dashboard"
            className="blood-image"
          />
        </div>

        {/* Slider dots */}
        {/* <div className="slider-dots">
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

              {/* Example submenu for Blood Inventory */}
              {item.label === "Blood Inventory" && (
                <div className="submenu">
                  <Link to="/hospital/inventory/view" className="submenu-btn">
                    View
                  </Link>
                  <Link to="/hospital/inventory/update" className="submenu-btn">
                    Update
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
