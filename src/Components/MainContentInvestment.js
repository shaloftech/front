import React from "react";
import "./MainContent.css";
import Header from "./Header";

const MainContentInvestment = () => {
  //   const youtubeURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with actual video URL

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="text-section">
          <h1 style={{ color: "white" }}>Investment History</h1>
          <p>Home/ Investment History</p>
        </div>
      </div>
    </>
  );
};

export default MainContentInvestment;
