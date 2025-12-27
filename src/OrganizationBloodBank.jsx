import React, { useEffect, useState } from "react";
import { Droplet, ClipboardCheck, Plus } from "lucide-react";
import "./OrganizationBloodBank.css";

const BLOOD_TYPES = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];

export default function OrganizationBloodBank() {
  const [camps, setCamps] = useState([]);
  const [selectedCampId, setSelectedCampId] = useState("");
  const [donors, setDonors] = useState([]);
  const [bloodBankId, setBloodBankId] = useState(null);
  const [loading, setLoading] = useState(false);

  // manual stock
  const [selectedBloodType, setSelectedBloodType] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");

  // Load camps
  useEffect(() => {
    fetch("http://localhost/webapi/api/organization/camps")
      .then(res => res.json())
      .then(setCamps)
      .catch(console.error);
  }, []);

  // Set blood bank
  useEffect(() => {
    if (!selectedCampId) return;
    const camp = camps.find(c => c.id === parseInt(selectedCampId));
    setBloodBankId(camp?.bloodBankId || null);
  }, [selectedCampId, camps]);

  // Load donors
  useEffect(() => {
    if (!selectedCampId) return;
    setLoading(true);

    fetch(`http://localhost/webapi/api/organization/camp-donors/${selectedCampId}`)
      .then(res => res.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedCampId]);

  // Normal donate (unchanged)
  const handleDonate = async (donor) => {
    const payload = {
      UserId: donor.userId,
      CampId: parseInt(selectedCampId),
      BloodBankId: bloodBankId,
      DonationDate: new Date(),
      Bags: 1
    };

    const res = await fetch("http://localhost/webapi/api/organization/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) return alert("Donation failed");

    setDonors(prev =>
      prev.map(d =>
        d.userId === donor.userId ? { ...d, status: "Donated" } : d
      )
    );

    alert("✅ Donation successful");
  };

  // 🔥 MANUAL STOCK ADD (MAIN LOGIC)
  const handleManualAdd = async () => {
    if (!selectedBloodType || !selectedUserId) {
      return alert("Select blood type and user");
    }

    const payload = {
      UserId: parseInt(selectedUserId),
      CampId: parseInt(selectedCampId),
      BloodBankId: bloodBankId,
      DonationDate: new Date(),
      Bags: 1
    };

    const res = await fetch("http://localhost/webapi/api/organization/donate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) return alert("Stock add failed");

    // mark user donated in FE
    setDonors(prev =>
      prev.map(d =>
        d.userId === parseInt(selectedUserId)
          ? { ...d, status: "Donated" }
          : d
      )
    );

    setSelectedBloodType("");
    setSelectedUserId("");
    alert("✅ Stock added & user marked Donated");
  };

  // Eligible users = registered but not donated
  const eligibleUsers = donors.filter(d => d.status !== "Donated");

  return (
    <div className="bloodbank-wrapper">
      <div className="bloodbank-header">
        <h1><Droplet size={28}/> Camp Donations</h1>
      </div>

      {/* Camp selector */}
      <select
        className="camp-select"
        value={selectedCampId}
        onChange={e => setSelectedCampId(e.target.value)}
      >
        <option value="">-- Select Camp --</option>
        {camps.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} ({c.date})
          </option>
        ))}
      </select>

      {/* MANUAL STOCK */}
      {selectedCampId && (
        <div className="manual-stock">
          <h3><Plus size={16}/> Add Camp Stock</h3>

          <select
            value={selectedBloodType}
            onChange={e => setSelectedBloodType(e.target.value)}
          >
            <option value="">Select Blood Type</option>
            {BLOOD_TYPES.map(bt => (
              <option key={bt} value={bt}>{bt}</option>
            ))}
          </select>

          <select
            value={selectedUserId}
            onChange={e => setSelectedUserId(e.target.value)}
          >
            <option value="">Select Registered User</option>
            {eligibleUsers.map(u => (
              <option key={u.userId} value={u.userId}>
                {u.name} ({u.bloodGroup})
              </option>
            ))}
          </select>

          <button className="add-btn" onClick={handleManualAdd}>
            Add Stock
          </button>
        </div>
      )}

      {/* TABLE */}
      {loading && <p>Loading donors...</p>}

      {selectedCampId && !loading && (
        <div className="bloodbank-table">
          <div className="table-header">
            <span>Donor</span>
            <span>Blood</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {donors.length === 0 ? (
            <p className="empty-msg">No registered donors</p>
          ) : donors.map(d => (
            <div key={d.userId} className="table-row">
              <span>{d.name}</span>
              <span>{d.bloodGroup}</span>
              <span><ClipboardCheck size={16}/> {d.status}</span>
              <button
                className="add-btn"
                disabled={d.status === "Donated"}
                onClick={() => handleDonate(d)}
              >
                {d.status === "Donated" ? "Donated ✔" : "Donate"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
