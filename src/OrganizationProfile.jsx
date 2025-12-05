import React, { useEffect, useState } from "react";
import { Building2 } from "lucide-react";
import "./OrganizationProfile.css";

export default function OrganizationProfile() {
  const [org, setOrg] = useState({
    orgName: "LifeLine Foundation",
    email: "lifeline@gmail.com",
    location: "Karachi, Pakistan",
  });

  const [editMode, setEditMode] = useState(false);

  return (
    <div className="org-profile-page">
      <h2><Building2 size={24} /> Organization Profile</h2>

      {editMode ? (
        <div className="profile-form">
          <input
            type="text"
            value={org.orgName}
            onChange={(e) => setOrg({ ...org, orgName: e.target.value })}
          />
          <input
            type="email"
            value={org.email}
            onChange={(e) => setOrg({ ...org, email: e.target.value })}
          />
          <input
            type="text"
            value={org.location}
            onChange={(e) => setOrg({ ...org, location: e.target.value })}
          />
          <button onClick={() => setEditMode(false)}>Save</button>
        </div>
      ) : (
        <div className="profile-details">
          <p><strong>Name:</strong> {org.orgName}</p>
          <p><strong>Email:</strong> {org.email}</p>
          <p><strong>Location:</strong> {org.location}</p>
          <button onClick={() => setEditMode(true)}>Edit</button>
        </div>
      )}
    </div>
  );
}
