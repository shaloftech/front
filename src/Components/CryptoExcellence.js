import React, { useState } from "react";
import "./CryptoExcellence.css";
import first from "./wallet/first.jpg";
import second from "./wallet/second.jpg";
import third from "./wallet/third.jpg";

// Import different images for hover effect
const images = {
  default: first, // Default image (Bitcoin)
  payout: first, // ETH for "Best Payout"
  access: second, // BNB for "Fund Access"
  support: third, // XRP for "Amazing Support"
};

const CryptoExcellence = () => {
  const [activeImage, setActiveImage] = useState(images.default);
  const [activeInfo, setActiveInfo] = useState(null);

  return (
    <section className="crypto-excellence">
      <div className="content">
        <h1 style={{ color: "black", fontSize: "25px" }}>
          Expertise in Crypto Excellence
        </h1>
        <p>
          Unleash the Full Power of Your Digital Assets We offer a comprehensive
          suite of trading and staking services tailored to every investor —
          from first-time crypto users to experienced market movers. Our mission
          is to make your journey seamless, profitable, and secure.
        </p>

        {/* Hoverable Text Fields */}
        <div className="options">
          <div
            className="option"
            onMouseEnter={() => setActiveImage(images.payout)}
            onMouseLeave={() => setActiveImage(images.default)}
            onClick={() =>
              setActiveInfo(activeInfo === "payout" ? null : "payout")
            }
          >
            <span>
              01. <strong className="blue-text">BEST PAYOUT</strong>
            </span>
            <span className="arrow">➝</span>
            {activeInfo === "payout" && (
              <p className="click-description">
                Maximize your ROI with competitive and transparent earning
                structures.
              </p>
            )}
          </div>

          <div
            className="option"
            onMouseEnter={() => setActiveImage(images.access)}
            onMouseLeave={() => setActiveImage(images.default)}
            onClick={() =>
              setActiveInfo(activeInfo === "access" ? null : "access")
            }
          >
            <span>02. FUND ACCESS</span>
            <span className="arrow">➝</span>
            {activeInfo === "access" && (
              <p className="click-description">
                Enjoy fast withdrawals and full control over your capital,
                anytime.
              </p>
            )}
          </div>

          <div
            className="option"
            onMouseEnter={() => setActiveImage(images.support)}
            onMouseLeave={() => setActiveImage(images.default)}
            onClick={() =>
              setActiveInfo(activeInfo === "support" ? null : "support")
            }
          >
            <span>03. AMAZING SUPPORT</span>
            <span className="arrow">➝</span>
            {activeInfo === "support" && (
              <p className="click-description">
                Real humans. Real help. Always here to guide you.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Changing Image on Hover */}
      <div className="image-container">
        <img src={activeImage} alt="Crypto" className="crypto-image" />
      </div>
    </section>
  );
};

export default CryptoExcellence;
