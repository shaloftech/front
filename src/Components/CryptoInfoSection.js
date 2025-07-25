import React, { useEffect, useState } from "react";
import "./CryptoInfoSection.css";
import bitcoinBubbles from "./bitcoin-bubble.png";

const CryptoInfoSection = () => {
  const [stats, setStats] = useState({
    tradingPairs: 161,
    happyClients: 268862,
    investors: 91264,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prevStats) => ({
        tradingPairs:
          prevStats.tradingPairs + Math.floor(Math.random() * 2) + 1, // +1 to +2
        happyClients:
          prevStats.happyClients + Math.floor(Math.random() * 11) + 10, // +10 to +20
        investors: prevStats.investors + Math.floor(Math.random() * 2) + 5, // +5 to +6
      }));
    }, 120000); // Every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <section className="crypto-info-section">
      <div className="crypto-info-content">
        <h1>Pioneers of the Next-Gen Digital Finance</h1>
        <p>
          At TrustCoinFX, we don’t just follow trends , we build the
          infrastructure that powers the digital asset revolution. Our platform
          fuses advanced blockchain architecture with institutional-grade
          trading tools, delivering a high-performance ecosystem engineered for
          serious traders, yield strategists, and crypto-native investors. Built
          on Laravel and fortified for scale, TrustCoinFX is where precision
          meets triumph.
        </p>

        <ul
          class="aligned-list"
          style={{ marginTop: "20px", marginBottom: "20px" }}
        >
          <li>
            <span>✔</span>
            <div>
              <div class="heading">On-Chain Intelligence & Market Signals</div>
              <div class="desc">
                Real-time data forecast and market sentiment tracking at your
                fingertips.
              </div>
            </div>
          </li>
          <li>
            <span>✔</span>
            <div>
              <div class="heading">Enterprise-Grade Laravel Infrastructure</div>
              <div class="desc">
                Secure, modular, and globally scalable — performance meets
                reliability.
              </div>
            </div>
          </li>
          <li>
            <span>✔</span>
            <div>
              <div class="heading">DeFi-Infused UX</div>
              <div class="desc">
                Fast and intuitive interfaces designed for both CEX speed and
                Web3 functionality.
              </div>
            </div>
          </li>
          <li>
            <span>✔</span>
            <div>
              <div class="heading">24/7 Support & Learning Hub</div>
              <div class="desc">
                Always-on support backed by tutorials, updates, and crypto
                literacy resources.
              </div>
            </div>
          </li>
          <li>
            <span>✔</span>
            <div>
              <div class="heading">Regionally Tuned, Globally Deployed</div>
              <div class="desc">
                We combine global liquidity with local compliance and fiat
                onramps.
              </div>
            </div>
          </li>
          <li>
            <span>✔</span>
            <div>
              <div class="heading">
                Futures-Ready. Staking-Savvy. Yield-Focused.
              </div>
              <div class="desc">
                Trade with leverage, farm rewards, and build serious long-term
                crypto wealth. TrustCoinFX isn’t just a platform — it’s a
                mission.
              </div>
            </div>
          </li>
        </ul>
        <div className="crypto-stats">
          <div className="stat-box">
            <h2>{stats.tradingPairs}</h2>
            <p>Trading Pair</p>
          </div>
          <div className="stat-box">
            <h2>{stats.happyClients.toLocaleString()}</h2>
            <p>Happy Client</p>
          </div>
          <div className="stat-box">
            <h2>{stats.investors.toLocaleString()}</h2>
            <p>Investor</p>
          </div>
        </div>
      </div>

      <div className="crypto-info-image">
        <img src={bitcoinBubbles} alt="Bitcoin Bubbles" />
      </div>
    </section>
  );
};

export default CryptoInfoSection;
