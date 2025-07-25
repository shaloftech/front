import React, { useState, useEffect } from "react";
import "./TradingJourney.css";
import img1 from "./img1.png";
import img2 from "./img2.png";
import img3 from "./img3.png";
import img4 from "./img4.png";
import img5 from "./img5.png";
// Image slider data
const sliderImages = [img1, img2, img3, img4, img5];

const TradingJourney = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Handle click to change image manually
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === sliderImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="trading-journey">
      {/* Left Side Content */}
      <div className="trading-content">
        <h1 style={{ color: "white" }}>
          Elevate Your Trading <br /> Journey with{" "}
          <span className="highlight">TrustcoinFX</span>
        </h1>
        <p className="subheading">
          Exceptional Trading Conditions Tailored for Your Success
        </p>

        <ul
          className="features"
          style={{ display: "flex", flexDirection: "column" }}
        >
          <li>
            <span className="checkmark">✔</span> Optimized Balance Base Draw
            Down
          </li>
          <li>
            <span className="checkmark">✔</span> Strategic Balance Base
            Management
          </li>
          <li>
            <span className="checkmark">✔</span> 20% Profit Share in Challenge
            Phase
          </li>
          <li>
            <span className="checkmark">✔</span> Unlimited Trading Opportunities
          </li>
          <li>
            <span className="checkmark">✔</span> Exclusive Limited-Time Offers
          </li>
        </ul>
      </div>

      {/* Right Side Image Slider */}
      <div className="image-slider" onClick={nextImage}>
        <img
          src={sliderImages[currentImageIndex]}
          alt="Crypto Slide"
          className="slider-image"
        />
      </div>
    </section>
  );
};

export default TradingJourney;
