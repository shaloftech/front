import React from "react";
import "./MainContent.css";
import { FaPlay, FaChartLine, FaShieldAlt, FaSync } from "react-icons/fa"; // Import icons
import bitcoinImage from "./bitcoin.png"; // Replace with actual image
import Header from "./Header";

import metamask from "./metamask.png"; // Replace with actual paths
import exodus from "./exodus.png";
import safepal from "./safepal.png";
import trustwallet from "./trustwallet.png";

const MainContentTrade = () => {
  //   const youtubeURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with actual video URL

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="text-section">
          <h1 style={{ color: "white" }}>Trade Oveview</h1>
          <p>Home/Trade Overview</p>
        </div>
      </div>
    </>
  );
};

export default MainContentTrade;
