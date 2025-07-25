import React, { useState, useEffect } from "react";
import "./StakingInvestments.css";

const termsAndConditions = `


TrustCoinFX offers a suite of fixed-return investment plans tailored to meet the needs of both retail and institutional crypto investors. Each plan is governed by the following terms and conditions to ensure transparency, consistency, and security throughout the investment lifecycle.

1. Plan Structure & ROI  
Each investment plan provides a predefined Return on Investment (ROI) for a fixed duration. Both returns and principal are included in the final payout unless stated otherwise. The plans currently offered are:  
- Spark Yield: 10% ROI — 15 Days  
- CoreRise: 15% ROI — 30 Days  
- PowerVault: 20% ROI — 45 Days  
- MomentumX: 25% ROI — 60 Days  
- Quantum Surge: 30% ROI — 75 Days  
- Titan Apex: 40% ROI — 90 Days  

These plans are designed to offer scalable returns based on investment size and holding period.

2. Capital Limits
Each plan has specified minimum and maximum investment thresholds, which must be strictly followed:  
- Capital limits are listed per plan during the onboarding process.  
- Investments that fall outside the specified limits may be automatically rejected or refunded.  
- TrustCoinFX reserves the right to review and adjust these thresholds at its discretion.

3. Withdrawal Policy
- Withdrawals are permitted only once the full plan duration has been completed.  
- Early or partial withdrawals during an active plan cycle are not supported.  
- Upon maturity, both the ROI and the initial capital are transferred in full to the investor’s wallet balance.  
- The withdrawal process may take up to 24 hours after maturity for security and verification purposes.

4. Network & Platform Fees  
- A network fee (blockchain gas cost) and a platform commission fee may apply during both deposit and withdrawal stages.  
- These fees are transparently displayed prior to final confirmation of any transaction.  
- Fees are adjusted dynamically based on network congestion and coin-specific protocol requirements.

5. ROI Distribution & Payouts  
- ROI is calculated daily, accrued silently, and paid out in full at the end of the investment cycle.  
- Payouts are made in the same cryptocurrency used for the original investment unless otherwise requested or defined by the plan.  
- All transactions are securely logged on the blockchain and viewable via transaction hash.

6. Wallet Integration & Supported Assets  
Only non-custodial Web3 wallets are supported on TrustCoinFX to ensure users retain full control over their funds and maintain decentralized ownership.

Supported decentralized wallets:  
- MetaMask  
- Trust Wallet  
- SafePal  
- Exodus  
- Coin98  
- Rabby Wallet  
- Frame Wallet  
- Argent Wallet  
- ONTO Wallet  
- Zerion Wallet  
- Taho (formerly TallyHo)  
- BitKeep  
- Brave Wallet  
- Rainbow Wallet  
- Math Wallet  
- imToken  
- TokenPocket  
- 1inch Wallet  

Supported cryptocurrencies:  
- Ethereum (ETH)  
- Bitcoin (BTC)  
- USD Coin (USDC)  
- Tether (USDT)  
- Ripple (XRP)  
- Solana (SOL)  
- Binance Coin (BNB)  
- Polygon (MATIC)  
- Avalanche (AVAX)  
- Tron (TRX)  
- Cardano (ADA)  
- Polkadot (DOT)  
- Shiba Inu (SHIB)  
- Litecoin (LTC)  
- Other whitelisted assets listed on the platform  

7. Reinvestment Options  
- Upon plan maturity, investors can:  
  - Withdraw the total balance to their connected wallet  
  - Reinvest capital and earnings into another available plan directly from their dashboard  
- Auto-compounding is currently not supported, but manual reinvestment can be done with zero additional fees.

8. Account Verification & KYC  
- While TrustCoinFX operates in a decentralized Web3 environment, certain features (such as higher-tier investment limits or institutional onboarding) may require identity verification (KYC).  
- All user data is securely encrypted and stored in compliance with international data protection standards (GDPR, ISO/IEC 27001).

9. Plan Amendments & Modifications  
TrustCoinFX reserves the right to modify plan terms, including ROI rates, durations, and capital thresholds, in response to:  
- Market volatility  
- Blockchain network conditions  
- Security protocol upgrades  
- Regulatory changes  

Any changes will be communicated on the platform in advance or reflected in the live plan documentation.

10. Risk Acknowledgment  
- All crypto investments are inherently volatile and carry risk.  
- While ROI rates are fixed within each plan, external factors such as regulatory shifts, smart contract risks, or network-level disruptions may impact overall performance.  
- TrustCoinFX does not provide investment advice, and all users are encouraged to conduct due diligence (DYOR) before committing capital.

11. Security & Fund Protection  
- All transactions are handled through non-custodial wallets, ensuring users retain full control over their assets at all times.  
- Smart contracts governing investment plans are regularly audited for safety and performance.  
- Internal security protocols include multi-layer verification, rate-limit protections, and fraud detection algorithms.

`;

const StakingInvestments = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const userId = localStorage.getItem("_id");
  const [showTerms, setShowTerms] = useState(false);
  const [stakeBalance, setStakeBalance] = useState(0);

  const stakingPlans = [
    {
      title: "Spark Yield",
      interest: "10",
      duration: "15 Days",
      capital: "$1,000 – $10,000",
      min: 1000,
      max: 10000,
      tagline: "Quick gains, low entry — perfect for momentum starters.",
    },
    {
      title: "CoreRise",
      interest: "15",
      duration: "30 Days",
      capital: "$10,000 – $30,000",
      min: 10000,
      max: 30000,
      tagline: "Solid monthly growth designed for consistent returns.",
    },
    {
      title: "PowerVault",
      interest: "20",
      duration: "45 Days",
      capital: "$10,000 – $100,000",
      min: 10000,
      max: 100000,
      tagline: "Accelerated earnings with mid-term confidence.",
    },
    {
      title: "MomentumX",
      interest: "25",
      duration: "60 Days",
      capital: "$10,000 – $100,000",
      min: 10000,
      max: 100000,
      tagline: "Harness the rhythm of returns — double down on momentum.",
    },
    {
      title: "Quantum Surge",
      interest: "30",
      duration: "75 Days",
      capital: "$20,000 – $100,000",
      min: 20000,
      max: 100000,
      tagline: "High-octane growth built for serious capital play.",
    },
    {
      title: "Titan Apex",
      interest: "40",
      duration: "90 Days",
      capital: "$20,000 – $1,000,000",
      min: 20000,
      max: 1000000,
      tagline: "Elite-level returns for crypto's boldest investors.",
    },
  ];

  const handleInvestClick = (plan) => {
    setSelectedPlan(plan);
    setAmount("");
    setError("");
    setMessage("");
  };

  const handleCloseModal = () => {
    setSelectedPlan(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User not logged in.");
      return;
    }

    const investmentAmount = parseFloat(amount);
    if (
      investmentAmount < selectedPlan.min ||
      investmentAmount > selectedPlan.max
    ) {
      setError(
        `Amount should be between ${selectedPlan.min} - ${selectedPlan.max}`
      );
      return;
    }

    try {
      const response = await fetch(
        "https://trustcoinfx.trade/api/cryptostake",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            plan: selectedPlan.title,
            interestRate: selectedPlan.interest,
            duration: selectedPlan.duration,
            amount: investmentAmount,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setMessage("Investment successful!");
        setSelectedPlan(null);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
  };
  useEffect(() => {
    if (!userId) return;
    fetch(`https://trustcoinfx.trade/api/user/${userId}/wallet`)
      .then((res) => res.json())
      .then((data) => {
        setStakeBalance(data.balances.stake ?? 0);
      })
      .catch(() => console.warn("Could not load stake balance"));
  }, [userId]);

  return (
    <section className="staking-section">
      <div className="staking-header">
        <h1 style={{ fontSize: "25px" }}>
          Plan Your Crypto Journey with Staking Investment Plans
        </h1>
        <p>
          Unlock passive income and sustainable growth through secure,
          high-yield staking options — crafted for both new and experienced
          crypto investors.
        </p>
      </div>

      <div
        className="staking-plans"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {stakingPlans.map((plan, index) => (
          <div
            key={index}
            className="staking-card"
            style={{ marginLeft: "20px" }}
          >
            <div className="interest-circle">
              <span>{plan.interest}%</span>
              <small>ROI</small>
            </div>
            <div className="staking-details">
              <div
                className="staking-title"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  marginLeft: "20px",
                }}
              >
                <p style={{ fontSize: "20px", marginTop: "10px" }}>
                  <b>{plan.title}</b>
                </p>
              </div>
              <p>Duration: {plan.duration}</p>
              <p>Capital Limit: {plan.capital}</p>
              <p className="staking-tagline">🧠 {plan.tagline}</p>
              <button
                className="invest-btn"
                onClick={() => handleInvestClick(plan)}
              >
                🔵 Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="terms-btn" onClick={() => setShowTerms(true)}>
        📜 Terms & Conditions
      </button>

      {showTerms && (
        <div className="modal">
          <div className="modal-content terms-scroll">
            <span className="close-modal" onClick={() => setShowTerms(false)}>
              &times;
            </span>
            <h2 className="terms-title">
              TrustCoinFX Investment Plans — Terms & Conditions
            </h2>
            <div className="terms-body">
              {termsAndConditions.split("\n").map((line, idx) => {
                const trimmed = line.trim();

                if (/^\d+\./.test(trimmed)) {
                  return (
                    <p key={idx} className="numbered-section">
                      {trimmed}
                    </p>
                  );
                } else if (trimmed.startsWith("-")) {
                  return (
                    <p key={idx} className="bullet-line">
                      {trimmed}
                    </p>
                  );
                } else if (trimmed === "") {
                  return <br key={idx} />;
                } else {
                  return <p key={idx}>{trimmed}</p>;
                }
              })}
            </div>
          </div>
        </div>
      )}

      {selectedPlan && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-modal" onClick={handleCloseModal}>
              &times;
            </button>

            <div className="modal-header">
              <h3>Invest in {selectedPlan.title}</h3>
              <span className="modal-subtitle">{selectedPlan.title} Plan</span>
            </div>

            <div className="balance-display">
              Stake balance:{" "}
              <strong>{stakeBalance.toLocaleString()} USDT</strong>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <label>Amount</label>
                <input
                  type="number"
                  min="0"
                  placeholder={`Max ${selectedPlan.max}`}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="form-grid">
                <div>
                  <label>Range</label>
                  <p>
                    {selectedPlan.min} – {selectedPlan.max} USDT
                  </p>
                </div>
                <div>
                  <label>ROI</label>
                  <p>{selectedPlan.interest}%</p>
                </div>
                <div>
                  <label>Duration</label>
                  <p>{selectedPlan.duration}</p>
                </div>
              </div>

              {error && <p className="error">{error}</p>}
              {message && <p className="success">{message}</p>}

              <button type="submit" className="submit-order">
                Confirm Investment
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default StakingInvestments;
