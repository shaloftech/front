import React, { useEffect, useState } from "react";
// import "../wallet/WalletDashboard.css";
import axios from "axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const symbolMap = {
  bitcoin: "BTC",
  ethereum: "ETH",
  binancecoin: "BNB",
  solana: "SOL",
  "usd-coin": "USDC",
  "staked-ether": "stETH",
  ripple: "XRP",
  "the-open-network": "TON",
  dogecoin: "DOGE",
  cardano: "ADA",
  tron: "TRX",
  "avalanche-2": "AVAX",
  "shiba-inu": "SHIB",
  "wrapped-bitcoin": "WBTC",
  polkadot: "DOT",
  chainlink: "LINK",
  "bitcoin-cash": "BCH",
  uniswap: "UNI",
  "leo-token": "LEO",
  dai: "DAI",
};

const timePeriods = {
  "5M": { limit: 5, interval: "minute" },
  "15M": { limit: 15, interval: "minute" },
  "30M": { limit: 30, interval: "minute" },
  "1H": { limit: 60, interval: "minute" },
  "8H": { limit: 8, interval: "hour" },
  "1D": { limit: 24, interval: "hour" },
  "7D": { limit: 7, interval: "day" },
  "1M": { limit: 30, interval: "day" },
};

const CryptoChart = ({ symbol }) => {
  const [chartData, setChartData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("5M");

  useEffect(() => {
    const fetchData = async () => {
      const tickerSymbol = symbolMap[symbol];
      if (!tickerSymbol) {
        console.error(`Ticker symbol not found for ${symbol}`);
        return;
      }

      const { limit, interval } = timePeriods[selectedPeriod];

      try {
        const response = await axios.get(
          `https://min-api.cryptocompare.com/data/v2/histo${interval}`,
          {
            params: {
              fsym: tickerSymbol,
              tsym: "USD",
              limit,
              api_key: "YOUR_CRYPTO_COMPARE_API_KEY", // Replace with your CryptoCompare API key
            },
          }
        );

        if (response.data && response.data.Data && response.data.Data.Data) {
          const prices = response.data.Data.Data.map((price) => ({
            time: new Date(price.time * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            value: price.close,
          }));

          setChartData(prices);
        } else {
          console.error("Unexpected API response structure:", response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [symbol, selectedPeriod]);

  // Determine chart color based on whether the cryptocurrency is in profit or loss
  const isProfit =
    chartData.length > 1 &&
    chartData[chartData.length - 1].value >= chartData[0].value;

  const chartColor = isProfit ? "#81c784" : "red"; // Green for profit, red for loss

  const topPeriods = ["5M", "15M", "30M", "1H"];
  const bottomPeriods = ["8H", "1D", "7D", "1M"];

  return (
    <div style={{ width: "100%" }}>
      <ResponsiveContainer
        width="100%"
        height={300}
        style={{ margin: 0, padding: 0 }}
      >
        <AreaChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chartColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            className="yaxis-graph"
            // tick={{ fill: "white" }}
          />
          <YAxis
            className="yaxis-graph"
            domain={["auto", "auto"]}
            // tick={{ fill: "white" }} // Y-axis tick text color
            // axisLine={{ stroke: "white" }} // Optional: Y-axis line color
            // tickLine={{ stroke: "white" }} // Optional: Tick line color
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              color: "white",
              borderRadius: "5px",
              border: "none",
              fontSize: "12px",
            }}
            itemStyle={{
              color: "white",
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={chartColor} // Stroke color based on profit/loss
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: 10,
        }}
      >
        {topPeriods.map((period) => (
          <button
            className={`period-button ${
              selectedPeriod === period ? "selected" : ""
            }`}
            key={period}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginTop: 10,
        }}
      >
        {bottomPeriods.map((period) => (
          <button
            className={`period-button ${
              selectedPeriod === period ? "selected" : ""
            }`}
            key={period}
            onClick={() => setSelectedPeriod(period)}
          >
            {period}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CryptoChart;
