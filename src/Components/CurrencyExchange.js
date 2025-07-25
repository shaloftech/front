import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // <-- Import useNavigate
import "./CurrencyExchange.css";

const CurrencyExchange = () => {
  const navigate = useNavigate(); // <-- Hook for navigation

  const handleExploreClick = () => {
    navigate("/trade");
  };

  return (
    <section className="currency-exchange">
      <div className="exchange-content">
        <h1 className="exchange-heading">🔁 Advanced Currency Exchange</h1>
        <h2 className="exchange-subheading">
          Trade Smarter. <br /> Move Faster. <br /> Stay Ahead.
        </h2>
        <p>
          Navigate the ever-evolving crypto market with confidence. Whether
          you're swapping assets or strategizing your next move, our exchange
          tools are built to give you the edge in every trade.
        </p>
      </div>

      <div className="explore-trades" onClick={handleExploreClick}>
        <span>Explore Trades</span>
        <div className="explore-btn">
          <FaArrowRight />
        </div>
      </div>
    </section>
  );
};

export default CurrencyExchange;
