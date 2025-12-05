import React from "react";
import { HelpCircle } from "lucide-react";
import "./FAQ.css";

export default function FAQ() {
  const faqs = [
    {
      q: "How can we register a new blood donation camp?",
      a: "Go to Manage Camps → Add New Camp and fill out the required details.",
    },
    {
      q: "How can we connect with hospitals?",
      a: "Use the Collaborations page to find and message partner hospitals.",
    },
  ];

  return (
    <div className="faq-page">
      <h2><HelpCircle size={24} /> Frequently Asked Questions</h2>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <div key={i} className="faq-item">
            <h4>{item.q}</h4>
            <p>{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
