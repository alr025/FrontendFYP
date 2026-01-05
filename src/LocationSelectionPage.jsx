import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./LocationSelectionPage.css";

export default function LocationSelectionPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentLocation, setCurrentLocation] = useState(null);
  const [destinationLocation, setDestinationLocation] = useState(null);
  const [recordId, setRecordId] = useState(null); // store backend record ID
  const [userId] = useState(1); // Example userId, replace with auth

  useEffect(() => {
    if (!location.state) return;
    const { type, coords, currentLocation, destinationLocation, recordId } = location.state;
    if (currentLocation) setCurrentLocation(currentLocation);
    if (destinationLocation) setDestinationLocation(destinationLocation);
    if (type === "current" && coords) setCurrentLocation(coords);
    if (type === "destination" && coords) setDestinationLocation(coords);
    if (recordId) setRecordId(recordId);
  }, [location.state]);

  const handleSaveLocations = async () => {
    if (!currentLocation || !destinationLocation) return;
    try {
      const res = await axios.post("http://localhost/webapi/api/user-location-bloodbank/save", {
        UserId: userId,
        SourceBloodBankId: 0, // optional, can select actual if needed
        DestinationBloodBankId: 0,
        SourceLat: currentLocation.lat,
        SourceLng: currentLocation.lng,
        DestinationLat: destinationLocation.lat,
        DestinationLng: destinationLocation.lng,
      });
      setRecordId(res.data.RecordId);
      alert("Locations saved ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to save locations!");
    }
  };

  return (
   <div className="location-page">
  <h2>Select Locations</h2>

  {/* Back Button */}
  <button
    className="back-button"
    onClick={() => navigate("/UserHomePage", { replace: true })}
  >
    ← Back to Home
  </button>

  <div className="location-box">
    <input
      readOnly
      placeholder="Select Current Location"
      value={currentLocation ? `${currentLocation.lat}, ${currentLocation.lng}` : ""}
    />
    <button onClick={() =>
      navigate("/map-modal", {
        state: { type: "current", currentLocation, destinationLocation, recordId }
      })
    }>Select on Map</button>
  </div>

  <div className="location-box">
    <input
      readOnly
      placeholder="Select Destination Location"
      value={destinationLocation ? `${destinationLocation.lat}, ${destinationLocation.lng}` : ""}
    />
    <button onClick={() =>
      navigate("/map-modal", {
        state: { type: "destination", currentLocation, destinationLocation, recordId }
      })
    }>Select on Map</button>
  </div>

  <button
    disabled={!currentLocation || !destinationLocation}
    onClick={handleSaveLocations}
  >
    Save Locations
  </button>

  {recordId && (
    <button
      onClick={() =>
        navigate("/nearby-bloodbanks", {
          state: { userId, recordId }
        })
      }
    >
      Search Nearby Blood Banks
    </button>
  )}
</div>

  );
}
