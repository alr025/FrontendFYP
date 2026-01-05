import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./ReservedBloodPage.css";

export default function ReservedBloodPage() {
  const [activeUser, setActiveUser] = useState(null);
  const [bloodBanks, setBloodBanks] = useState([]);
  const [selectedBank, setSelectedBank] = useState(null);

  const [reservedBlood, setReservedBlood] = useState([]);
  const [availableBlood, setAvailableBlood] = useState([]);

  const navigate = useNavigate();

  /* =============================
     Load Active User
  ============================= */
  useEffect(() => {
    const storedUser = localStorage.getItem("activeUser");
    if (!storedUser) {
      navigate("/");
      return;
    }
    setActiveUser(JSON.parse(storedUser));
  }, [navigate]);

  /* =============================
     Load Blood Banks
  ============================= */
  useEffect(() => {
    setBloodBanks([
      { id: 1, name: "City Blood Bank" },
      { id: 2, name: "Central Blood Bank" },
    ]);
    setSelectedBank(1);
  }, []);

  /* =============================
     Fetch Reserved + Available
  ============================= */
  const fetchData = async () => {
    if (!activeUser || !selectedBank) return;

    try {
      const res = await axios.get(
        `http://localhost/webapi/api/BloodStock/AvailableForUser/${activeUser.id}/Bank/${selectedBank}`
      );

      const now = new Date();

      const reserved = res.data.filter(
        b =>
          b.ReservedUserId === activeUser.id &&
          new Date(b.ReservationExpiry) > now
      );

      const available = res.data.filter(
        b =>
          !b.ReservedUserId ||
          (b.ReservedUserId === activeUser.id &&
            new Date(b.ReservationExpiry) <= now)
      );

      setReservedBlood(reserved);
      setAvailableBlood(available);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeUser, selectedBank]);

  /* =============================
     Actions
  ============================= */
  const reserveBlood = async (bloodId) => {
    try {
      await axios.post(
        `http://localhost/webapi/api/BloodStock/Reserve/${bloodId}/${activeUser.id}`
      );
      alert("Blood reserved for 2 days!");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.Message || "Error reserving blood");
    }
  };

  const cancelReservation = async (bloodId) => {
    try {
      await axios.post(
        `http://localhost/webapi/api/BloodStock/CancelReservation/${bloodId}/${activeUser.id}`
      );
      alert("Reservation cancelled.");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.Message || "Error cancelling reservation");
    }
  };

  /* =============================
     UI
  ============================= */
  return (
    <div className="reserved-blood-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ⬅ Back
      </button>

      <h2>🩸 Blood Reservations</h2>

      {/* Blood Bank Selector */}
      <div className="bank-selector">
        <label>Select Blood Bank:</label>
        <select
          value={selectedBank || ""}
          onChange={(e) => setSelectedBank(Number(e.target.value))}
        >
          {bloodBanks.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Reserved Blood */}
      <div className="reserved-blood-section">
        <h3>Your Reserved Blood</h3>

        {reservedBlood.length === 0 ? (
          <p>No reserved blood at the moment.</p>
        ) : (
          reservedBlood.map((b) => (
            <div key={b.Id} className="reserved-card">
              <strong>{b.BloodGroup}</strong>
              <p>Status: {b.Status}</p>
              <p>
                Expires:{" "}
                {new Date(b.ReservationExpiry).toLocaleString()}
              </p>
              <button onClick={() => cancelReservation(b.Id)}>
                Cancel Reservation
              </button>
            </div>
          ))
        )}
      </div>

      {/* Available Blood */}
      <div className="available-blood-section">
        <h3>Available Blood</h3>

        {availableBlood.length === 0 ? (
          <p>No blood available right now.</p>
        ) : (
          availableBlood.map((b) => (
            <div key={b.Id} className="available-card">
              <strong>{b.BloodGroup}</strong>
              <p>Status: {b.Status}</p>
              <p>
                Expires: {new Date(b.ExpiryDate).toLocaleString()}
              </p>
              <button onClick={() => reserveBlood(b.Id)}>
                Reserve
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
