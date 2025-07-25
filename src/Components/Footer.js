import React from "react";
import "./Footer.css"; // Importing the external CSS file
import logo from "./logo10.png";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Left Section */}
        <div className="footer-left">
          <img
            src={logo} // Replace with actual logo
            alt="TrustCoinFX Logo"
            className="footer-logo"
          />
          <p style={{ color: "rgb(210, 196, 196)", fontSize: "25px" }}>
            Trade, Trust and Triumph
          </p>
        </div>

        {/* Middle Section */}
        <div className="footer-links">
          <h4>Important Links</h4>
          <ul>
            <li>Home</li>
            <li>Trade</li>
            <li>Pricing</li>
            <li>Features</li>
          </ul>
        </div>

        {/* Right Section */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            {/* <li>Privacy Policy</li> */}
            <li>
              <a href="/termsandconditions">Terms & Conditions</a>
            </li>
            <li>
              {" "}
              <a href="/contactwithus">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Footer */}
      <div
        style={{
          width: "100%",
          color: "rgb(210, 196, 196)",
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
        }}
      >
        <p style={{ color: "rgb(210, 196, 196)", fontSize: "15px" }}>
          &copy; 2024 TrustCoinFX. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
