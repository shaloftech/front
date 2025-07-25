import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminReferralLink = () => {
  const [referralLink, setReferralLink] = useState("");
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  // Fetch current referral link on page load
  useEffect(() => {
    fetchReferral();
  }, []);

  // Update countdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!expiresAt) return;

      const diff = new Date(expiresAt) - new Date();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const fetchReferral = async () => {
    try {
      const res = await axios.post(
        "https://trustcoinfx.trade/api/admin/generate-referral"
      );
      setReferralLink(res.data.referralLink);
      setExpiresAt(new Date(Date.now() + 15 * 60 * 1000)); // Set expiry for countdown
    } catch (err) {
      console.error("Error fetching referral:", err);
      alert("Failed to generate referral link.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>🔗 Generate Protected Signup Referral Link</h2>
      <button style={styles.button} onClick={fetchReferral}>
        Generate New Referral Link
      </button>

      {referralLink && (
        <div style={styles.linkContainer}>
          <p>
            <strong>Referral Link:</strong>{" "}
            <a href={referralLink} target="_blank" rel="noopener noreferrer">
              {referralLink}
            </a>
          </p>
          <p style={styles.timer}>
            <strong>Expires in:</strong> {timeLeft}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    maxWidth: "600px",
    margin: "40px auto",
    border: "1px solid #ccc",
    borderRadius: "12px",
    background: "#f9f9f9",
    textAlign: "center",
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    background: "#4caf50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
  linkContainer: {
    marginTop: "20px",
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  },
  timer: {
    marginTop: "10px",
    color: "#ff5722",
    fontWeight: "bold",
  },
};

export default AdminReferralLink;
