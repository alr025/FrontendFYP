import React, { useEffect, useState } from "react";
import axios from "axios";
import { AlertTriangle, Droplet, Clock, MapPin, FlaskRound, Edit2, Trash2 } from "lucide-react";
import "./ViewRequests.css";

export default function ViewRequests() {
  const [requests, setRequests] = useState([]);
  const [editingRequest, setEditingRequest] = useState(null);
  const [formData, setFormData] = useState({ BloodGroup: "", Quantity: 0, Status: "" });
  const statusColor = {
  pending: "orange",
  working: "green",  // approved
  given: "red"      // rejected
};


  const org = JSON.parse(localStorage.getItem("activeUser"));
  console.log("Active org from localStorage:", org);

  useEffect(() => {
    if (!org) {
      console.warn("No active organization found!");
      return;
    }
    fetchRequests();
  }, []);

const fetchRequests = async () => {
  try {
    console.log("Fetching nearby requests for org id:", org.id);
    const res = await axios.get(
      `http://localhost/webapi/api/BloodRequest/nearby-for-user/${org.id}`
    );
    console.log("Nearby requests API response:", res.data);
    setRequests(res.data);
  } catch (err) {
    console.error(err);
  }
};


  const handleDelete = async (id) => {
    console.log("Deleting request id:", id);
    if (!window.confirm("Delete this request?")) return;

    try {
      await axios.delete(`http://localhost/webapi/api/BloodRequest/${id}`);
      setRequests((prev) => prev.filter((r) => r.Id !== id));
      console.log("Request deleted, remaining:", requests.length - 1);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete request.");
    }
  };

  const handleEditClick = (req) => {
    console.log("Editing request:", req);
    setEditingRequest(req);
    setFormData({ BloodGroup: req.BloodGroup, Quantity: req.Quantity, Status: req.Status });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const statusDisplay = {
  pending: "Pending",
  working: "Approved",
  given: "Rejected"
};

const handleUpdate = async () => {
  if (!formData.BloodGroup || formData.Quantity <= 0 || !formData.Status) {
    alert("Please fill all fields correctly.");
    return;
  }

  // Map frontend-friendly values to DB values
  let mappedStatus;
  switch (formData.Status.toLowerCase()) {
    case "pending":
      mappedStatus = "pending";
      break;
    case "approved":
      mappedStatus = "approved"; // will be mapped by backend to 'working'
      break;
    case "rejected":
      mappedStatus = "rejected"; // will be mapped by backend to 'given'
      break;
    default:
      alert("Invalid status selected");
      return;
  }

  try {
    const updatedData = {
      BloodGroup: formData.BloodGroup.trim().toUpperCase(),
      Quantity: parseInt(formData.Quantity),
      Status: mappedStatus
    };

    const res = await axios.put(
      `http://localhost/webapi/api/BloodRequest/${editingRequest.Id}`,
      updatedData
    );

    console.log("Update response:", res.data);
    alert("Request updated successfully!");
    fetchRequests();
    setEditingRequest(null);
  } catch (err) {
    console.error("Update failed:", err.response?.data || err);
    alert("Failed to update request. See console for details.");
  }
};



  return (
    <div className="req-page-wrapper">
      <h1 className="req-header">Blood Requests</h1>

      <div className="req-list">
        {requests.length === 0 ? (
          <p className="no-requests">No blood requests found.</p>
        ) : (
          requests.map((req) => (
            <div key={req.Id} className="req-card">
              <div className="req-row">
                <Droplet className="req-icon" />
                <span>Blood: <strong>{req.BloodGroup}</strong></span>
              </div>

              <div className="req-row">
                <FlaskRound className="req-icon" />
                <span>Qty: {req.Quantity} units</span>
              </div>

              <div className="req-row">
                <Clock className="req-icon" />
                <span>{new Date(req.RequestDate).toLocaleString()}</span>
              </div>

              <div className="req-row">
                <MapPin className="req-icon" />
                <span>{req.Location}</span>
              </div>

              <div className="req-row">
                <strong>User:</strong> {req.UserName} ({req.UserEmail})
              </div>

           <div className="req-row status-row">
  <AlertTriangle className="req-icon warn" />
<span 
  className="req-status"
  style={{ color: statusColor[req.Status] || "black", fontWeight: "bold" }}
>
  {statusDisplay[req.Status]}
</span>

</div>


              <div className="req-actions">
                <button className="edit-btn" onClick={() => handleEditClick(req)}>
                  <Edit2 size={16} /> Edit
                </button>
                <button className="respond-btn" onClick={() => handleDelete(req.Id)}>
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {editingRequest && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h3>Edit Request for {editingRequest.UserName}</h3>
            <label>
              Blood Group:
              <input
                type="text"
                name="BloodGroup"
                value={formData.BloodGroup}
                onChange={handleFormChange}
              />
            </label>
            <label>
              Quantity:
              <input
                type="number"
                name="Quantity"
                value={formData.Quantity}
                onChange={handleFormChange}
              />
            </label>
  <label>
  Status:
  <select name="Status" value={formData.Status} onChange={handleFormChange}>
    <option value="pending">Pending</option>
    <option value="approved">Approved</option>
    <option value="rejected">Rejected</option>
  </select>
</label>

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleUpdate}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingRequest(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
