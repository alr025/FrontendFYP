import React, { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaMapMarkerAlt,
  FaTint,
  FaHospital,
  FaBuilding,
  FaVirus,
} from "react-icons/fa";
import axios from "axios";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost/webapi/api";

export default function Login() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const [hasDisease, setHasDisease] = useState(false);
const [disease, setDisease] = useState("");


  // Login states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState("");

  // Register states
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [isCovidVaccinated, setIsCovidVaccinated] = useState(false);

  // Load saved login credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
              params: {
                format: "json",
                lat: latitude,
                lon: longitude,
              },
            }
          );

          setLocation(res.data.display_name);
        } catch (err) {
          console.error("Location error:", err);
        }
      });
    }
  }, []);

  // ------------------------------------------
  // LOGIN FUNCTION
  // ------------------------------------------
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE}/Login`, {
        Email: email,
        Password: password,
      });

      setMessage(`✅ Login successful! Welcome, ${response.data.Name}`);

      // Save login credentials if Remember Me is checked
      if (rememberMe) {
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("password");
      }

      // Save active user for dashboards
      localStorage.setItem(
        "activeUser",
        JSON.stringify({
           id: response.data.UserId,  
          name: response.data.Name,
          email: response.data.Email,
          bloodGroup: response.data.BloodType,
          role: response.data.Role,
        })
      );

      // Navigate by role
      switch (response.data.Role) {
        case "Person":
          navigate("/UserHomePage");
          break;
        case "Hospital":
          navigate("/HospitalHomePage");
          break;
        case "bloodBank":
          navigate("/OrganizationHomePage");
          break;
        default:
          alert("Unknown role: " + response.data.Role);
      }
    } catch (error) {
      setMessage(
        "❌ " + (error.response?.data?.Message || "Server error occurred")
      );
    }
  };

  // ------------------------------------------
  // REGISTER FUNCTION
  // ------------------------------------------
  const handleRegister = async () => {
  try {
    const payload = {
      Name: registerName,
      Email: registerEmail,
      Password: registerPassword,
      Type: category || "Person",
      BloodType: bloodType,
      Location: location,    // FIXED
       Disease: hasDisease ? disease : null,
    };

    const response = await axios.post(`${API_BASE}/Signup`, payload);

    alert("Registration successful! Welcome " + response.data.Name);

    localStorage.setItem(
      "activeUser",
      JSON.stringify({
        id: response.data.UserId,
        name: response.data.Name,
        email: response.data.Email,
        bloodGroup: response.data.BloodType,
        role: response.data.Role,
        location: response.data.Location,    // OPTIONAL SAVE
      })
    );

    switch (response.data.Role) {
      case "Person":
        navigate("/UserHomePage");
        break;
      case "Hospital":
        navigate("/HospitalHomePage");
        break;
      case "bloodBank":
        navigate("/OrganizationHomePage");
        break;
      default:
        setActiveTab("login");
    }

    // Reset fields
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
    setCategory("");
    setBloodType("");
    setLocation("");

  } catch (error) {
    alert(
      "❌ Registration Error: " +
        (error.response?.data?.Message || "Server error")
    );
  }
};

  return (
    <div className="login-container">
      {/* Left Section */}
      <div className="left-section">
        <div className="brand-content">
          <h1>Blood Donation & Emergency Health Services</h1>
          <p>
            Connect with donors and save lives. <br />
            Join our community of lifesavers today.
          </p>

          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🩸</span>
              <span>Connect with blood donors instantly</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🚑</span>
              <span>Emergency health services</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">❤</span>
              <span>Save lives in your community</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="login-card">
          <div className="logo-section">
            <div className="logo-placeholder">
              <span className="logo-icon">🩸</span>
            </div>

            <div className="tab-buttons">
              <button
                className={activeTab === "login" ? "active" : ""}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={activeTab === "register" ? "active" : ""}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {activeTab === "login" ? (
            <>
              <div className="form-section">
                <h2>Welcome Back</h2>
                <p className="form-subtitle">Sign in to your account</p>

                <div className="input-group">
                  <div className="input-field">
                    <FaEnvelope className="icon" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <FaLock className="icon" />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Remember me
                  </label>

                  <a href="#" className="forgot-password">
                    Forgot password?
                  </a>
                </div>

                <button className="login-btn" onClick={handleLogin}>
                  Sign In
                </button>

                {message && (
                  <div
                    className={`message ${
                      message.includes("✅") ? "success" : "error"
                    }`}
                  >
                    {message}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* REGISTER FORM */}
              <div className="form-section">
                <h2>Create Account</h2>
                <p className="form-subtitle">Join our lifesaving community</p>

                <div className="input-group">
                  <div className="input-field">
                    <FaUser className="icon" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <FaEnvelope className="icon" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <FaLock className="icon" />
                    <input
                      type="password"
                      placeholder="Create Password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    {category === "Hospital" ? (
                      <FaHospital className="icon" />
                    ) : category === "Organization" ? (
                      <FaBuilding className="icon" />
                    ) : (
                      <FaUser className="icon" />
                    )}

                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="category-select"
                    >
                      <option value="" disabled hidden>
                        Select Category
                      </option>
                      <option value="Person">👤 Person</option>
                      <option value="Hospital">🏥 Hospital</option>
                      <option value="bloodBank">🏢 Organization</option>
                    </select>
                  </div>

                  <div className="input-field">
                    <FaMapMarkerAlt className="icon" />
                    <input
                      type="text"
                      placeholder="Enter Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>

                  <div className="input-field">
                    <FaTint className="icon" />
                    <select
                      value={bloodType}
                      onChange={(e) => setBloodType(e.target.value)}
                      className="category-select"
                    >
                      <option value="" disabled hidden>
                        Select Blood Type
                      </option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  {/* Disease Checkbox */}
<div className="input-field checkbox-field">
  <label className="checkbox-label">
    <input
      type="checkbox"
      checked={hasDisease}
      onChange={(e) => {
        setHasDisease(e.target.checked);
        if (!e.target.checked) setDisease("");
      }}
    />
    <span className="checkmarkk"></span>
    Do you suffer from any disease?
  </label>
</div>

{/* Disease Dropdown (only if checked) */}
{hasDisease && (
  <div className="input-field">
    <FaVirus className="icon" />
    <select
      value={disease}
      onChange={(e) => setDisease(e.target.value)}
      className="category-select"
    >
      <option value="" disabled hidden>
        Select Disease
      </option>
      <option value="Thalassemia">Thalassemia</option>
      <option value="Polycythemia">Polycythemia</option>
    </select>
  </div>
)}


                  <div className="input-field checkbox-field">
                    <FaVirus className="icon" />
                    <label className="checkbox-label covid-label">
                      <input
                        type="checkbox"
                        checked={isCovidVaccinated}
                        onChange={(e) =>
                          setIsCovidVaccinated(e.target.checked)
                        }
                      />
                      <span className="checkmark"></span>
                      Vaccinated for COVID-19
                    </label>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span className="checkmark"></span>
                    I agree to the Terms & Conditions
                  </label>
                </div>

                <button className="login-btn" onClick={handleRegister}>
                  Create Account
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
