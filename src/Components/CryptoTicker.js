import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CryptoTicker.css";

const CryptoTicker = () => {
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: "bitcoin,ethereum,ripple,cardano,solana,dogecoin,polkadot,chainlink,polygon, litecoin, binancecoin",
              order: "market_cap_desc",
              per_page: 10,
              page: 1,
              sparkline: false,
            },
          }
        );

        const data = response.data.map((crypto) => ({
          id: crypto.id,
          name: crypto.symbol.toUpperCase(),
          price: crypto.current_price,
          change: crypto.price_change_percentage_24h.toFixed(2),
          logo: crypto.image,
        }));

        setCryptoData(data);
      } catch (error) {
        console.error("Error fetching crypto prices:", error);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="crypto-ticker">
      <div className="ticker-content">
        {cryptoData.map((crypto, index) => (
          <div
            key={index}
            className={`ticker-item ${crypto.change >= 0 ? "up" : "down"}`}
          >
            <img src={crypto.logo} alt={crypto.name} className="crypto-logo" />
            <span>
              {crypto.name}/USD: ${crypto.price} ({crypto.change}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CryptoTicker;
