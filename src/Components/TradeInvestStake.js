import React from "react";
import "./TradeInvestStake.css"; // Ensure this CSS file exists
import {
  FaChartBar,
  FaDollarSign,
  FaChartLine,
  FaHandHoldingUsd,
} from "react-icons/fa"; // Importing React Icons

const TradeInvestStake = () => {
  return (
    <section className="trade-invest-stake">
      <div className="trade-box">
        {/* <h2 className="number">1</h2> */}
        <div className="trade-icon">
          <FaChartLine className="icon" />
        </div>

        <h3 style={{ marginBottom: "10px" }}>
          <span>
            {" "}
            <b style={{ fontSize: "20px" }}>1. Trade</b>
          </span>
        </h3>

        <p className="trade-description">
          Enhance your trading advantage in crypto pair markets with TrustCoinFX
          — a decentralized, Web3-enabled platform built for high-leverage
          futures trading, real-time analytics, and precision scalping. With
          deep liquidity, smart charting tools, and secure non-custodial
          integration, TrustCoinFX empowers traders to navigate volatility and
          optimize returns with confidence.
        </p>
      </div>

      <div className="trade-box">
        {/* <h2 className="number">2</h2> */}
        <div className="trade-icon">
          <FaHandHoldingUsd className="icon" />
        </div>

        <h3 style={{ marginBottom: "10px" }}>
          <span>
            {" "}
            <b style={{ fontSize: "20px" }}>2. Invest</b>
          </span>
        </h3>

        <p className="trade-description">
          Experience secure, stress-free investing where risk is minimized and
          profit potential is maximized. TrustCoinFX is built to support
          seamless, intelligent investment strategies in crypto, combining
          automation, transparency, and decentralized control. Whether you're a
          passive investor or a growth-driven strategist, our platform empowers
          you to navigate the digital asset space with confidence and clarity.
        </p>
      </div>
      <div className="trade-box">
        <div className="trade-icon">
          <FaDollarSign className="icon" />
        </div>

        <h3 style={{ marginBottom: "10px" }}>
          <span>
            {" "}
            <b style={{ fontSize: "20px" }}>3. Stake</b>
          </span>
        </h3>

        <p className="trade-description">
          Tap into community-driven growth with strategic staking on
          TrustCoinFX. Earn passive rewards while supporting network security in
          a secure, scalable ecosystem designed for both individual and
          institutional investors.
        </p>
      </div>
    </section>
  );
};

export default TradeInvestStake;
