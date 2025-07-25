import React from "react";
import "./MainContent.css";

import Header from "./Header";

const MainContentPlans = () => {
  //   const youtubeURL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"; // Replace with actual video URL

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="text-section">
          <h1 style={{ color: "white" }}>Plans</h1>
          <p>Home/ Plans</p>
        </div>
      </div>
    </>
  );
};

export default MainContentPlans;
