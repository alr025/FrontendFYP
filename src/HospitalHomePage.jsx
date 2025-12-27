import React, { useEffect, useState } from "react";
import { ClipboardList, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./HospitalHomePage.css";

export default function HospitalHomePage() {
  const [activeUser, setActiveUser] = useState(null);
  const navigate = useNavigate();

  // Load active user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (storedUser) {
      setActiveUser(JSON.parse(storedUser));
    }
  }, []);

  const menuItems = [
    { label: "Request Blood", icon: <ClipboardList size={28} />, path: "/hospital/requests" },
    { label: "Donors", icon: <Users size={28} />, path: "/hospital/donors" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("activeUser");
    setActiveUser(null);
    navigate("/", { replace: true });
  };

  return (
    <div className="page2-wrapper">
      <div className="home-container">
        {/* Active User Banner */}
     {activeUser ? (
  <div className="active-user-banner hospital-banner">
    <h2>🏥 Welcome to the Hospital Dashboard, <span>{activeUser.name}</span>!</h2>
    <p>{activeUser.email}</p>
    <p>Blood Group: {activeUser.blood_type || "N/A"}</p>

    {/* Logout Button */}
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  </div>
) : (
  <div className="active-user-banner hospital-banner">
    <h2>🏥 Welcome to BloodLink for Hospitals!</h2>
    <p>Login or register your hospital to get started</p>
  </div>
)}


        {/* Top Image */}
        <div className="image-box">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png"
            alt="Hospital Dashboard"
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
