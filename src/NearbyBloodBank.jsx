import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./NearbyBloodBank.css";

export default function NearbyBloodBank() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [nearbySource, setNearbySource] = useState([]);
  const [nearbyDestination, setNearbyDestination] = useState([]);

  const userId = state?.userId;
  const recordId = state?.recordId;

  useEffect(() => {
    if (!userId) return;
    const fetchNearby = async () => {
      try {
        const res = await axios.get(`http://localhost/webapi/api/user-location-bloodbank/nearby/${userId}`);
        setNearbySource(res.data.Source);
        setNearbyDestination(res.data.Destination);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch nearby blood banks.");
      }
    };
    fetchNearby();
  }, [userId]);

  const donateBlood = async (bankId) => {
    try {
      await axios.post("http://localhost/webapi/api/user-location-bloodbank/donate", { RecordId: recordId });
      alert("Blood donated ✅");
      setNearbySource((prev) => prev.map(b => b.id === bankId ? {...b, donated:true} : b));
    } catch (err) {
      console.error(err);
      alert("Donation failed!");
    }
  };

  const receiveBlood = async (bankId) => {
    try {
      await axios.post("http://localhost/webapi/api/user-location-bloodbank/receive", { RecordId: recordId });
      alert("Blood received ✅");
      setNearbyDestination((prev) => prev.map(b => b.id === bankId ? {...b, received:true} : b));
    } catch (err) {
      console.error(err);
      alert("Failed to receive blood!");
    }
  };

  return (
    <div className="nearby-container">
      <h1>🩸 Nearby Blood Banks</h1>

      <h2>Near Source (Donate)</h2>
      {nearbySource.length === 0 && <p>No blood banks nearby source.</p>}
      {nearbySource.map(b => (
        <div key={b.id} className="bank-card">
          <h3>{b.name}</h3>
          <p>{b.Distance.toFixed(2)} km away</p>
          <button onClick={() => donateBlood(b.id)} disabled={b.donated}>🩸 Donate Here</button>
          <button
            onClick={() =>
              window.open(`https://www.google.com/maps/dir/${b.Latitude},${b.Longitude}`, "_blank")
            }
          >
            🗺 Directions
          </button>
        </div>
      ))}

      <h2>Near Destination (Receive)</h2>
      {nearbyDestination.length === 0 && <p>No blood banks nearby destination.</p>}
      {nearbyDestination.map(b => (
        <div key={b.id} className="bank-card">
          <h3>{b.name}</h3>
          <p>{b.Distance.toFixed(2)} km away</p>
          <button onClick={() => receiveBlood(b.id)} disabled={b.received}>📦 Receive Here</button>
          <button
            onClick={() =>
              window.open(`https://www.google.com/maps/dir/${b.Latitude},${b.Longitude}`, "_blank")
            }
          >
            🗺 Directions
          </button>
        </div>
      ))}
    </div>
  );
}
