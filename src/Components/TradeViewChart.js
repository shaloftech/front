import React, { useState } from "react";
import { AdvancedChart } from "react-tradingview-embed";

const TradeViewChart = () => {
  const [symbol, setSymbol] = useState("BITSTAMP:BTCUSD");
  const [interval, setInterval] = useState("60");

  return (
    <div style={styles.container}>
      {/* Controls Section */}
      <div style={styles.controls}>
        <label style={styles.label}>Symbol:</label>
        <select
          onChange={(e) => setSymbol(e.target.value)}
          value={symbol}
          style={styles.select}
        >
          <option value="BITSTAMP:BTCUSD">Bitcoin (BTC/USD)</option>
          <option value="BITSTAMP:ETHUSD">Ethereum (ETH/USD)</option>
          <option value="BITSTAMP:XRPUSD">Ripple (XRP/USD)</option>
        </select>

        <label style={styles.label}>Interval:</label>
        <select
          onChange={(e) => setInterval(e.target.value)}
          value={interval}
          style={styles.select}
        >
          <option value="1">1m</option>
          <option value="5">5m</option>
          <option value="60">1h</option>
          <option value="D">1D</option>
        </select>
      </div>

      {/* TradingView Widget (Wrapped in a Fixed Height Container) */}
      <div style={styles.chartContainer}>
        <div style={styles.chartWrapper}>
          <AdvancedChart
            widgetProps={{
              height: "300",
              theme: "dark",
              //   autosize: true,
              symbol: symbol,
              interval: interval,
              timezone: "Etc/UTC",
              hide_top_toolbar: false,
              hide_side_toolbar: false,
              allow_symbol_change: true,
            }}
          />
        </div>
      </div>
    </div>
  );
};

// ✅ Styled Components (Inline CSS)
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#121212",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.5)",
    maxWidth: "98%",
    margin: "auto",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },
  label: {
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
  },
  select: {
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #10b9f3",
    backgroundColor: "#1c1c1c",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    outline: "none",
  },
  chartContainer: {
    borderRadius: "10px",
    overflow: "hidden",
    border: "1px solid #10b9f3",
    height: "400px", // Set fixed height for the entire chart container
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chartWrapper: {
    width: "100%",
    height: "300px", // ✅ Ensuring AdvancedChart gets the proper height
  },
};

export default TradeViewChart;
