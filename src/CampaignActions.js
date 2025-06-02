import React from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDnLujRCu2O8GvE0U7aX7SI2WnkMVaEqq4";

function CampaignActions({ message, setMessage, customers, saveSegment, segmentRules }) {
  const generateMessageWithAI = async () => {
    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const segmentContext = segmentRules
        .map((rule, index) => {
          const fieldName =
            rule.field === "totalSpend"
              ? "Total Spend (₹)"
              : rule.field === "visits"
              ? "Visits"
              : "Inactive Days";
          return `${index > 0 ? rule.condition || "AND" : ""} ${fieldName} ${rule.operator} ${rule.value}`;
        })
        .join(" ");

      const segmentDescription = segmentRules.length
        ? `This segment is defined by: ${segmentContext}. Craft a message that aligns with these criteria, e.g., rewarding high spenders, engaging frequent buyers, or re-engaging inactive customers.`
        : "This is a general marketing campaign.";

      const prompt = `
        Generate a personalized email message for a marketing campaign targeting the following customers: ${customers
          .map((c) => c.name)
          .join(", ")}.
        ${segmentDescription}
        The message should be engaging, concise (under 150 words), professional, and relevant to their interests.
        Include a clear call-to-action (e.g., shop now, claim discount).
        Use a friendly tone and personalize where possible.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const aiMessage = response.text();

      setMessage(aiMessage);
    } catch (err) {
      console.error("AI error:", err);
      alert("Gemini AI failed to generate message.");
    }
  };

  const sendEmailCampaign = async () => {
    try {
      await axios.post("http://localhost:5000/send-campaign", {
        message,
        recipients: customers.map((c) => c.email),
      });
      saveSegment();
      alert("Emails sent successfully!");
    } catch (err) {
      console.error("Email error:", err);
      alert("Failed to send email campaign.");
    }
  };

  return (
    <div className="campaign-actions">
      <button onClick={generateMessageWithAI} style={{ color: "white" }} className="btn btn-ai">
        ✨ Suggest Message (Gemini AI)
      </button>
      <button onClick={sendEmailCampaign} style={{ color: "white" }} className="btn btn-send">
        📧 Send Email Campaign
      </button>
    </div>
  );
}

export default CampaignActions;
