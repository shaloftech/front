import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CryptoConversions.css";

const CryptoConversions = () => {
  const [conversions, setConversions] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: "bitcoin,ethereum,binancecoin,ripple,solana,staked-ether,toncoin,usd-coin",
          vs_currencies: "usd",
        },
      })
      .then((response) => {
        const data = response.data;

        // Ensure each coin exists in the response before trying to access it
        const cryptoList = [
          {
            id: "bitcoin",
            symbol: "BTC",
            image:
              "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
          },
          {
            id: "ethereum",
            symbol: "ETH",
            image:
              "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
          },
          {
            id: "binancecoin",
            symbol: "BNB",
            image:
              "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
          },
          {
            id: "ripple",
            symbol: "XRP",
            image:
              "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
          },
          {
            id: "solana",
            symbol: "SOL",
            image:
              "https://assets.coingecko.com/coins/images/4128/large/solana.png",
          },
          {
            id: "staked-ether",
            symbol: "STETH",
            image:
              "https://assets.coingecko.com/coins/images/16569/large/steth_logo.png",
          },
          {
            id: "toncoin",
            symbol: "TON",
            image:
              "https://assets.coingecko.com/coins/images/17980/large/toncoin.png",
          },
          {
            id: "usd-coin",
            symbol: "USDC",
            image:
              "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
          },
        ];

        const formattedData = cryptoList
          .map((coin) => ({
            ...coin,
            price: data[coin.id]?.usd || "N/A", // Handle missing data
          }))
          .filter((coin) => coin.price !== "N/A"); // Remove missing ones

        setConversions(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <section className="crypto-conversions">
      <h1 style={{ color: "white", fontSize: "25px" }}>
        Top Crypto Conversions at Your Fingertips
      </h1>
      <p className="pText">
        Explore the most popular cryptocurrency conversions on TrustCoinFX. Our
        platform delivers real-time, high-demand exchange rates to keep you
        informed on top-performing digital assets. Fast, precise, and built for
        crypto-savvy traders who move with the market
      </p>

      <div className="conversion-grid">
        {conversions.map((coin) => (
          <div className="conversion-card" key={coin.id}>
            <div className="conversion-info">
              <span className="crypto-symbol">{coin.symbol} → USDT</span>
              <p>
                1 {coin.symbol} = {coin.price.toLocaleString()} USDT
              </p>
            </div>
            <div className="conversion-icons">
              <img src={coin.image} alt={coin.symbol} className="crypto-icon" />
              <img
                src="https://assets.coingecko.com/coins/images/325/large/Tether-logo.png"
                alt="USDT"
                className="usdt-icon"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CryptoConversions;
