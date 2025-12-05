import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NearbyBloodBank.css";

// Example blood banks
const bloodBanks = [
  { name: "City Blood Bank", lat: 28.614, lng: 77.209 },
  { name: "Red Cross Blood Center", lat: 28.6155, lng: 77.211 },
  { name: "Community Blood Bank", lat: 28.622, lng: 77.205 },
  { name: "Metro Hospital Blood Bank", lat: 28.605, lng: 77.199 },
  { name: "Central Blood Bank", lat: 28.618, lng: 77.215 },
  { name: "Emergency Blood Center", lat: 28.610, lng: 77.203 },
];

// Haversine formula to calculate distance
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const NearbyBloodBank = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyBanks, setNearbyBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showManualLocation, setShowManualLocation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedLocation = localStorage.getItem("userLocation");
    if (savedLocation) {
      try {
        const coords = JSON.parse(savedLocation);
        setUserLocation(coords);
        filterNearby(coords);
        setLoading(false);
      } catch (err) {
        console.error("Error parsing saved location:", err);
        requestLocation();
      }
    } else {
      requestLocation();
    }
  }, []);

  const getLocationErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return "Location access denied. Please enable location permissions in your browser settings.";
      case error.POSITION_UNAVAILABLE:
        return "Location information is unavailable. Please check your device's location settings.";
      case error.TIMEOUT:
        return "Location request timed out. Please try again.";
      default:
        return "An unknown error occurred while retrieving your location.";
    }
  };

  const requestLocation = () => {
    setLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser. Please use a modern browser or enable location services."
      );
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        localStorage.setItem("userLocation", JSON.stringify(coords));
        filterNearby(coords);
        setLoading(false);
      },
      (err) => {
        console.error("Location error details:", {
          code: err.code,
          message: err.message,
          errorType: err.constructor.name,
        });
        const errorMessage = getLocationErrorMessage(err);
        setError(errorMessage);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 }
    );
  };

  const filterNearby = (coords) => {
    const nearby = bloodBanks
      .map((bank) => ({
        ...bank,
        distance: getDistance(coords.lat, coords.lng, bank.lat, bank.lng),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
    setNearbyBanks(nearby);
  };

  const handleChangeLocation = () => {
    localStorage.removeItem("userLocation");
        navigate("/map-modal"); // Navigation intact

  };

  const handleRefresh = () => {
    requestLocation();
  };

  const useDefaultLocation = () => {
    const defaultCoords = { lat: 28.6139, lng: 77.2090 };
    setUserLocation(defaultCoords);
    localStorage.setItem("userLocation", JSON.stringify(defaultCoords));
    filterNearby(defaultCoords);
    setError(null);
    setShowManualLocation(false);
  };

  if (loading) {
    return (
      <div className="nearby-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">📍 Detecting your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="nearby-container">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p className="error-text">{error}</p>
          <div className="error-actions">
            <button className="retry-button" onClick={requestLocation}>
              Try Again
            </button>
            <button className="manual-location-button" onClick={useDefaultLocation}>
              Use Default Location
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!userLocation) {
    return (
      <div className="nearby-container">
        <div className="error-container">
          <div className="error-icon">📍</div>
          <p className="error-text">Location not available.</p>
          <button className="retry-button" onClick={requestLocation}>
            Enable Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nearby-container">
      <div className="header">
        <h1 className="title">🩸 Nearby Blood Banks</h1>
        <p className="subtitle">Find blood banks near your location</p>
      </div>

      <div className="controls">
        <button className="location-button" onClick={handleChangeLocation}>
          🔄 Change Location
        </button>
        {/* <button className="refresh-button" onClick={handleRefresh}>
          ↻ Refresh
        </button> */}
      </div>

      <div className="content">
        {nearbyBanks.length > 0 ? (
          <div className="banks-grid">
            {nearbyBanks.map((bank, idx) => (
              <div key={`${bank.name}-${idx}`} className="bank-card">
                <div className="bank-header">
                  <div className="bank-icon">🏥</div>
                  <h3 className="bank-name">{bank.name}</h3>
                </div>
                <div className="bank-details">
                  <div className="distance-info">
                    <span className="distance-icon">📍</span>
                    <span className="distance-text">
                      {bank.distance?.toFixed(2) || '0.00'} km away
                    </span>
                  </div>
                  <div className="bank-status">
                    <span className="status-indicator"></span>
                    <span className="status-text">Open</span>
                  </div>
                </div>
                <div className="bank-actions">
                  <button
                    className="directions-button"
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${bank.lat},${bank.lng}`;
                      window.open(url, '_blank');
                    }}
                  >
                    🗺️ Get Directions
                  </button>
                  <button
                    className="contact-button"
                    onClick={() => alert(`Contact ${bank.name} for more information.`)}
                  >
                    📞 Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <p className="no-results-text">No blood banks found in your area.</p>
            <button className="expand-search-button" onClick={handleRefresh}>
              Expand Search
            </button>
          </div>
        )}
      </div>

      <div className="footer">
        <p className="footer-text">
          Emergency? Call <strong>108</strong> for immediate assistance
        </p>
      </div>
    </div>
  );
};

export default NearbyBloodBank;
