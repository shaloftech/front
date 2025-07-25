import React from "react";
import "./MainContent.css";
import { FaPlay, FaChartLine, FaShieldAlt, FaSync } from "react-icons/fa"; // Import icons
import bitcoinImage from "./bitcoin.png"; // Replace with actual image
import Header from "./Header";

import metamask from "./wallet/metamask2.png"; // Replace with actual paths
import exodus from "./wallet/exodus2.png";
import safepal from "./safepal.png";
import trustwallet from "./wallet/trustwallet.png";
import binance from "./wallet/binance.png";
import coinbase from "./wallet/coinbase.png";
import web3 from "./wallet/web31.png";

const MainContent = () => {
  const youtubeURL =
    "https://www.youtube.com/watch?time_continue=14&v=eJfN9bR1Ox0&embeds_referring_euri=https%3A%2F%2Ftrustcoinfx.com%2F"; // Replace with actual video URL

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="text-section">
          <h1 style={{ color: "white", fontSize: "1.5em" }}>
            Explore the Power of Staking, Investing, and Futures Trading
          </h1>
          <p>
            At TrustCoinFX, your journey to financial growth begins with
            seamless staking for steady earnings, strategic investment tools for
            long-term value, and a powerful futures trading engine built for
            speed and precision. Whether you're maximizing market momentum or
            securing gains through leveraged positions, our platform equips you
            with the tools to trade smart, grow faster, and stay ahead in a
            dynamic crypto landscape.
          </p>

          <div className="info-section">
            <a
              href={youtubeURL}
              target="_blank"
              rel="noopener noreferrer"
              className="video-button"
            >
              <FaPlay className="play-icon" />
            </a>
            <div className="user-count">
              <span>510K+</span>
              <p>Users from the WorldWide</p>
            </div>
          </div>

          {/* Features Section */}
          <div className="features">
            <div className="feature-item">
              <div className="icon-wrapper">
                <FaChartLine className="feature-icon" />
              </div>
              <p>Fast Trading</p>
            </div>
            <div className="feature-item">
              <div className="icon-wrapper">
                <FaShieldAlt className="feature-icon" />
              </div>
              <p>Secure & Reliable</p>
            </div>
            <div className="feature-item">
              <div className="icon-wrapper">
                <FaSync className="feature-icon" />
              </div>
              <p>Continuous Market Updates</p>
            </div>
          </div>

          {/* Wallets Section */}
        </div>

        <div className="wallet-grid">
          <img src={web3} alt="Web3" />
          <img src={metamask} alt="Metamask" />
          <img src={exodus} alt="Exodus" />
          <img src={binance} alt="Binance" />
          <img src={coinbase} alt="Coinbase" />
          <img src={trustwallet} alt="Trust Wallet" />
        </div>
      </div>
    </>
  );
};

export default MainContent;
