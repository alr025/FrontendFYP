import React from "react";
import "./UserFaq.css";

export default function FAQ() {
  // Donor → Recipient compatibility list
  const bloodTypes = ["O−", "O+", "A−", "A+", "B−", "B+", "AB−", "AB+"];
  const recipients = ["O−", "O+", "A−", "A+", "B−", "B+", "AB−", "AB+"];

  // Compatibility matrix
  const compatibility = [
    [true, false, false, false, false, false, false, false], // O− recipient
    [true, true, false, false, false, false, false, false], // O+
    [true, false, true, false, false, false, false, false], // A−
    [true, true, true, true, false, false, false, false], // A+
    [true, false, false, false, true, false, false, false], // B−
    [true, true, false, false, true, true, false, false], // B+
    [true, false, true, false, true, false, true, false], // AB−
    [true, true, true, true, true, true, true, true], // AB+
  ];

  return (
    <div className="page1-wrapper">
      <h1 className="faq-title">FAQ</h1>

      <div className="faq-row">

        {/* LEFT CARD - BLOOD COMPATIBILITY CHART */}
        <div className="faq-container">
          <div className="faq-box blood-box">
            <h2 className="blood-title">Blood Type Compatibility</h2>

            <div className="blood-table">
              {/* Header Row */}
              <div className="header-row">
                <div className="corner-cell">
                  Recipient ↓ <br /> Donor →
                </div>

                {bloodTypes.map((type) => (
                  <div key={type} className="header-cell donor">
                    {type}
                  </div>
                ))}
              </div>

              {/* Data Rows */}
              {recipients.map((recipient, rowIndex) => (
                <div className="data-row" key={recipient}>
                  <div className="header-cell recipient">{recipient}</div>

                  {bloodTypes.map((_, colIndex) => (
                    <div className="data-cell" key={colIndex}>
                      {compatibility[rowIndex][colIndex] ? "🩸" : ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT CARD - DONOR ELIGIBILITY */}
        <div className="faq-container">
          <div className="faq-box">
            <h2>Eligibility Criteria for Blood Donation</h2>
            <ol className="eligibility-list">
              <li>The donor must be between 18 and 60 years old.</li>
              <li>The donor must weigh at least 45 kg.</li>
              <li>Normal temperature and pulse rate are required.</li>
              <li>Hemoglobin level must be at least 12.5 g/dl.</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
}
