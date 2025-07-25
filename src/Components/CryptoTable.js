import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./CryptoTable.css";
import CryptoChart from "./CryptoChart";
import usdtImg from "./usdtImg.png";
import { useNavigate } from "react-router-dom";
const CryptoTable = ({ setShowLoginModal }) => {
  const COINGECKO_API_KEY = "CG-abdEKxm7HXgBnnG2D2eexnmq"; // Replace with the correct Pro API key
  const API_URL = "https://pro-api.coingecko.com/api/v3/coins/markets";
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [direction, setDirection] = useState("up");
  const [amount, setAmount] = useState("");
  const [deliveryTime, setDeliveryTime] = useState(60);
  const [interest, setInterest] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const userId = localStorage.getItem("_id");
  const uid = localStorage.getItem("userId");
  const deliveryTimes = [
    { time: 60, interest: 0.1, minAmount: 50 },
    { time: 120, interest: 0.35, minAmount: 1000 },
    { time: 129600, interest: 2.15, minAmount: 50000 },
    { time: 604800, interest: 3.15, minAmount: 100000 },
    { time: 2592000, interest: 5.2, minAmount: 200000 },
  ];

  useEffect(() => {
    const storedUserID = localStorage.getItem("_id");
    if (storedUserID) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        console.log("Fetching data with API Key:", COINGECKO_API_KEY);

        const response = await axios.get(API_URL, {
          params: {
            vs_currency: "usd",
            order: "market_cap_desc",
            per_page: 10,
            page: 1,
            sparkline: false,
          },
          headers: {
            "X-Cg-Pro-Api-Key": COINGECKO_API_KEY,
          },
        });

        setCoins(response.data);
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
        console.error("Error fetching data:", error);
      }
    };

    fetchCryptoData();
  }, []);

  useEffect(() => {
    if (userId) {
      const fetchWalletBalance = async () => {
        try {
          const response = await axios.get(
            `https://trustcoinfx.trade/api/wallet/${userId}`
          );
          setWalletBalance(response.data.balances.tether || 0);
        } catch (error) {
          console.error("Error fetching wallet balance:", error);
        }
      };
      fetchWalletBalance();
    }
  }, [userId]);

  useEffect(() => {
    const selectedTime = deliveryTimes.find(
      (dt) => dt.time === Number(deliveryTime)
    );
    if (selectedTime) {
      setInterest(selectedTime.interest);
    }
  }, [deliveryTime]);

  const handleTradeClick = (coin) => {
    // slam the old modal shut and go to dashboard with symbol query
    navigate(`/trade?symbol=${coin.id}`);
  };

  const handleSubmit = async (e) => {
    const userId = localStorage.getItem("_id");
    e.preventDefault();
    if (!selectedCoin) return;

    try {
      const priceResponse = await axios.get(
        "https://api.coingecko.com/api/v3/coins/markets",
        {
          params: {
            vs_currency: "usd",
            ids: selectedCoin.id,
            order: "market_cap_desc",
            per_page: 1,
            page: 1,
            sparkline: false,
          },
        }
      );
      const currentPrice = priceResponse.data[0].current_price;

      await axios.post("https://trustcoinfx.trade/api/predict", {
        symbol: selectedCoin.id,
        direction,
        amount: Number(amount),
        deliveryTime,
        // currentPrice,
        uid,
        userId,
      });

      alert("Trade successfully placed!");
      setShowModal(false);
    } catch (error) {
      console.error("Error submitting prediction:", error);
      alert("Error placing trade.");
    }
  };

  return (
    <div className="crypto-table-container">
      <h2>Crypto Market Prices</h2>
      {error ? (
        <p style={{ color: "red", textAlign: "center" }}>
          ⚠️ Error: {error.message || "API request failed. Check console logs."}
        </p>
      ) : (
        <table className="crypto-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Pair Price</th>
              <th>Daily Change</th>
              <th>Daily High</th>
              <th>Daily Low</th>
              <th>Total Volume</th>
              <th>Market Cap</th>
              <th>Total Supply</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => (
              <tr key={coin.id}>
                <td data-label="Name" className="coin-info">
                  <img src={coin.image} alt={coin.name} />
                  <div>
                    <strong>{coin.name}</strong>
                    <span>{coin.symbol.toUpperCase()} Coin</span>
                  </div>
                </td>
                <td data-label="Pair Price">
                  ${coin.current_price.toLocaleString()}
                </td>
                <td
                  data-label="Daily Change"
                  className={
                    coin.price_change_percentage_24h >= 0
                      ? "positive"
                      : "negative"
                  }
                >
                  {coin.price_change_percentage_24h.toFixed(2)}%
                </td>
                <td data-label="Daily High">
                  {coin.high_24h ? `$${coin.high_24h.toLocaleString()}` : "N/A"}
                </td>
                <td data-label="Daily Low">
                  {coin.low_24h ? `$${coin.low_24h.toLocaleString()}` : "N/A"}
                </td>
                <td data-label="Total Volume">
                  {coin.total_volume.toLocaleString()}
                </td>
                <td data-label="Market Cap">
                  {coin.market_cap.toLocaleString()}
                </td>
                <td data-label="Total Supply">
                  {coin.total_supply
                    ? coin.total_supply.toLocaleString()
                    : "N/A"}
                </td>
                <td data-label="Action">
                  {isLoggedIn ? (
                    <button
                      className="trade-button"
                      onClick={() => handleTradeClick(coin)}
                    >
                      Trade & Practice Now
                    </button>
                  ) : (
                    <button
                      className="trade-button"
                      onClick={() => (window.location.href = "/")}
                    >
                      Login to Trade & Practice
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Trade Modal */}
      {/* Trade Modal */}
      {showModal && selectedCoin && (
        <div
          id="entrustModal"
          className="modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "1000",
          }}
        >
          <div
            id="modalBack"
            className="modal-content"
            style={{
              margin: "5% auto",
              padding: "10px 30px 10px 30px",
              border: "1px solid #888",
              width: "90%",
              maxWidth: "500px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "80px",
            }}
          >
            <span
              className="close"
              onClick={() => setShowModal(false)}
              style={{
                color: "#aaa",
                float: "right",
                fontSize: "28px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              &times;
            </span>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <h1
                className="main-balance-text"
                style={{
                  fontSize: "18px",
                  marginBottom: "10px",
                  borderBottom: "2px solid #7d9aea",
                }}
              >
                <b>{selectedCoin.symbol.toUpperCase()} Coin Delivery</b>
              </h1>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "10px",
              }}
            >
              <img
                src={selectedCoin.image}
                alt={selectedCoin.symbol}
                style={{ width: "30px", height: "30px", marginRight: "10px" }}
              />
              <p className="main-balance-text">
                {selectedCoin?.symbol.toUpperCase()} / USDT
              </p>
            </div>

            {/* Bullish / Bearish Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setDirection("up")}
                style={{
                  backgroundColor: direction === "up" ? "green" : "white",
                  color: direction === "up" ? "white" : "black",
                  border: "1px solid green",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "45%",
                  marginRight: "5px",
                }}
              >
                Bullish
              </button>
              <button
                type="button"
                onClick={() => setDirection("down")}
                style={{
                  backgroundColor: direction === "down" ? "red" : "white",
                  color: direction === "down" ? "white" : "black",
                  border: "1px solid red",
                  padding: "10px",
                  borderRadius: "5px",
                  width: "45%",
                }}
              >
                Bearish
              </button>
            </div>

            {/* Form Section */}
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                {/* Delivery Time */}
                <label className="labels23">Delivery Time</label>
                <select
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(Number(e.target.value))}
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    height: "35px",
                    textAlign: "center",
                  }}
                >
                  {deliveryTimes.map((dt) => (
                    <option key={dt.time} value={dt.time}>
                      {`${dt.time} sec - ${dt.interest * 100}%`}
                    </option>
                  ))}
                </select>

                {/* Amount with USDT and Max Button */}
                <label className="labels23">Amount</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    className="usdtIconss"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      marginRight: "10px",
                    }}
                  >
                    <img
                      src={usdtImg}
                      alt="USDT"
                      style={{
                        width: "20px",
                        height: "20px",
                        marginRight: "5px",
                      }}
                    />
                    <span>USDT</span>
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    max={walletBalance}
                    style={{
                      width: "100%",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      height: "35px",
                      textAlign: "center",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setAmount(walletBalance)}
                    style={{
                      marginLeft: "10px",
                      padding: "5px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                    }}
                  >
                    Max
                  </button>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={(amount / walletBalance) * 100 || 0}
                  onChange={(e) =>
                    setAmount((walletBalance * e.target.value) / 100)
                  }
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                    cursor: "pointer",
                  }}
                />
                {/* <p style={{ textAlign: "center" }}>
                  {((amount / walletBalance) * 100).toFixed(0)}%
                </p> */}

                {/* Rate of Return */}
                <label className="labels23">Rate of Return</label>
                <input
                  type="text"
                  value={`${interest * 100}%`}
                  readOnly
                  style={{
                    width: "100%",
                    padding: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    height: "35px",
                    textAlign: "center",
                  }}
                />

                {/* Fee and Minimum Amount */}
                <p style={{ textAlign: "center", marginTop: "10px" }}>
                  Fee: {amount * 0.001} USDT
                </p>
                <p style={{ textAlign: "center", marginBottom: "10px" }}>
                  Minimum Amount:{" "}
                  {
                    deliveryTimes.find((dt) => dt.time === Number(deliveryTime))
                      ?.minAmount
                  }{" "}
                  USDT
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: "#7d9aea",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    fontSize: "16px",
                    cursor: "pointer",
                  }}
                >
                  Submit Order
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoTable;
