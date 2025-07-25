import React, { useState, useEffect } from "react";
import "./CryptoPlan.css";

import TermsModal from "./TermsModal"; // your existing modal for T&Cs

const plans = [
  {
    title: "Flash Yield",
    duration: "🕒 Duration: 1 Day",
    limit: 10000, // use a number, not a string with commas
    interestRate: "10%",
    termsType: "flash",
    best: "🔑 Quick returns on large moves",
  },
  {
    title: "Momentum Boost",
    duration: "🕒 Duration: 2 Months",
    limit: 3000,
    interestRate: "5%",
    termsType: "momentum",
    best: "🧠 Smart compounding for steady growth",
  },
  {
    title: "Alpha Vault",
    duration: "🕒 Duration: 1 Month",
    limit: 10000,
    interestRate: "20%",
    termsType: "alpha",
    best: "🔥 Aggressive returns with calculated risk",
  },
  {
    title: "FlexGrow",
    duration: "🕒 Duration: 1 Day",
    limit: 500,
    interestRate: "5%",
    termsType: "flex",
    best: "🔄 Liquidity with lower commitment",
  },
  {
    title: "Titan Plan",
    duration: "🕒 Duration: 3 Months",
    limit: 50000,
    interestRate: "40%",
    termsType: "titan",
    best: "💎 VIP-grade returns + exclusive perks",
  },
];

const CryptoPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [activeTerms, setActiveTerms] = useState(null);
  const [stakeBalance, setStakeBalance] = useState(0);
  const userId = localStorage.getItem("_id");
  useEffect(() => {
    if (!userId) return;
    fetch(`https://trustcoinfx.trade/api/user/${userId}/wallet`)
      .then((res) => res.json())
      .then((data) => {
        setStakeBalance(data.balances.stake ?? 0);
      })
      .catch(() => {
        console.warn("Could not load stake balance");
      });
  }, [userId]);
  const handleInvestClick = (plan) => {
    setSelectedPlan(plan);
    setAmount("");
    setError("");
  };

  const handleCloseModal = () => setSelectedPlan(null);
  const handleOpenTerms = (type) => setActiveTerms(type);
  const handleCloseTerms = () => setActiveTerms(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User not logged in.");
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      return setError("Enter a valid amount.");
    }
    if (num > selectedPlan.limit) {
      return setError(`Amount exceeds plan limit of $${selectedPlan.limit}`);
    }

    try {
      const res = await fetch("https://trustcoinfx.trade/api/stake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          plan: selectedPlan.title,
          amount: num,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Investment successful!");
        setSelectedPlan(null);
        setAmount("");
        setError("");
      } else {
        setError(data.message || "Failed to invest.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <section className="crypto-plan">
      <h1>Plan Your Crypto Journey with Strategic Investment Plans</h1>
      <p style={{ margin: "10px 0 20px" }}>
        Take control of your financial future with tailored ROI options designed
        for every level of trader.
      </p>

      <div className="investment-plans">
        {plans.map((plan) => (
          <div className="plan-card" key={plan.title}>
            <div className="plan-header">
              <h2>{plan.title}</h2>
              <ul>
                <li>{plan.duration}</li>
                <li>💰 Min Investment: ${plan.limit.toLocaleString()}</li>
                <li>📈 Return: {plan.interestRate}</li>
                <li>{plan.best}</li>
                <li>
                  <span
                    className="terms-link"
                    onClick={() => handleOpenTerms(plan.termsType)}
                  >
                    ℹ Terms & Conditions
                  </span>
                </li>
              </ul>
            </div>
            <button
              className="invest-btn"
              onClick={() => handleInvestClick(plan)}
            >
              Invest Now
            </button>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <div className="modal">
          <div className="modal-content">
            <button
              className="close-modal"
              onClick={() => setSelectedPlan(null)}
            >
              ×
            </button>

            {/* ——— NEW: header like 2nd image ——— */}
            <div className="modal-header">
              <h3>Invest in {selectedPlan.title}</h3>
              {/* <span className="modal-subtitle">{selectedPlan.title} Plan</span> */}
            </div>

            {/* ——— NEW: stake balance display ——— */}
            <div className="balance-display">
              Investment balance:{" "}
              <strong>{stakeBalance.toLocaleString()} USDT</strong>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* amount input */}
              <div className="form-row">
                <label>Amount</label>
                <input
                  type="number"
                  min="0"
                  placeholder={`Max $${selectedPlan.limit.toLocaleString()}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              {/* plan details grouped */}
              <div className="form-grid">
                <div>
                  <label>Limit</label>
                  <p>${selectedPlan.limit.toLocaleString()}</p>
                </div>
                <div>
                  <label>Return</label>
                  <p>{selectedPlan.interestRate}</p>
                </div>
                <div>
                  <label>Duration</label>
                  <p>{selectedPlan.duration}</p>
                </div>
              </div>

              {error && <p className="error">{error}</p>}

              <button type="submit" className="submit-order">
                Confirm Investment
              </button>
            </form>
          </div>
        </div>
      )}
      {activeTerms && (
        <TermsModal planType={activeTerms} onClose={handleCloseTerms} />
      )}
    </section>
  );
};

export default CryptoPlan;
