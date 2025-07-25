import React, { useEffect, useState } from "react";
import axios from "axios";
import { AdvancedChart } from "react-tradingview-embed";
import TradeBox from "./TradeBox";
import Header from "./Header";
import "./TradingDashboard.css";
import Select from "react-select";
import Result from "./Result";
import { useSearchParams } from "react-router-dom";
import Result1 from "./Result1";
const TradingDashboard = () => {
  const [coin, setCoin] = useState(null);
  const [marketPairs, setMarketPairs] = useState([]);
  const [trades, setTrades] = useState([]);
  const [activeTab, setActiveTab] = useState("orderbook");
  const [tradeMode, setTradeMode] = useState("buy");
  const [chartSymbol, setChartSymbol] = useState("BITSTAMP:BTCUSD");
  const [showMarketTrades, setShowMarketTrades] = useState(true);
  const [reloadResult, setReloadResult] = useState(Date.now());
  const [searchParams] = useSearchParams();
  const initialSymbol = searchParams.get("symbol") || "bitcoin";
  const [selectedCoin, setSelectedCoin] = useState(initialSymbol);
  const API_KEY = "CG-abdEKxm7HXgBnnG2D2eexnmq";

  const fetchMainCoin = async () => {
    const res = await axios.get(
      "https://pro-api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          ids: selectedCoin,
        },
        headers: {
          "X-Cg-Pro-Api-Key": API_KEY,
        },
      }
    );
    setCoin(res.data[0]);
    if (res.data[0]) {
      setChartSymbol(`BINANCE:${res.data[0].symbol.toUpperCase()}USDT`);
    }
  };

  const fetchMarketPairs = async () => {
    const res = await axios.get(
      "https://pro-api.coingecko.com/api/v3/coins/markets",
      {
        params: {
          vs_currency: "usd",
          order: "volume_desc",
          per_page: 20,
          page: 1,
        },
        headers: {
          "X-Cg-Pro-Api-Key": API_KEY,
        },
      }
    );
    setMarketPairs(res.data);
  };

  const fetchTrades = async () => {
    const tradesData = Array.from({ length: 10 }).map((_, i) => ({
      price: (86500 + Math.random() * 100).toFixed(2),
      amount: (Math.random() * 0.01).toFixed(4),
      time: new Date().toLocaleTimeString(),
    }));
    setTrades(tradesData);
  };
  useEffect(() => {
    const sym = searchParams.get("symbol");
    if (sym && sym !== selectedCoin) {
      setSelectedCoin(sym);
    }
  }, [searchParams]);
  useEffect(() => {
    fetchMainCoin();
    fetchMarketPairs();
    fetchTrades();
  }, []);

  // useEffect(() => {
  //   fetchMainCoin();
  // }, [selectedCoin]);

  return (
    <>
      <Header />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Select
            isSearchable={true} // ✅ Ensures search is enabled
            options={marketPairs.map((pair) => ({
              value: pair.id,
              label: {
                name: pair.name,
                symbol: pair.symbol.toUpperCase(),
                price: `$${pair.current_price.toLocaleString()}`,
                change: pair.price_change_percentage_24h,
              },
            }))}
            getOptionLabel={(e) => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <span>
                  {e.label.name} ({e.label.symbol})
                </span>
                <span
                  style={{
                    color: e.label.change >= 0 ? "#10b981" : "#ef4444",
                    fontWeight: "bold",
                  }}
                >
                  {e.label.change >= 0
                    ? `+${e.label.change.toFixed(2)}%`
                    : `${e.label.change.toFixed(2)}%`}
                </span>
              </div>
            )}
            value={
              marketPairs
                .filter((p) => p.id === selectedCoin)
                .map((pair) => ({
                  value: pair.id,
                  label: {
                    name: pair.name,
                    symbol: pair.symbol.toUpperCase(),
                    price: `$${pair.current_price.toLocaleString()}`,
                    change: pair.price_change_percentage_24h,
                  },
                }))[0]
            }
            onChange={(option) => setSelectedCoin(option.value)}
            styles={{
              control: (base) => ({
                ...base,
                backgroundColor: "#1a1a1a",
                color: "#fff",
                borderColor: "#333",
                width: "100%",
                maxWidth: 400,
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#121212",
                color: "#fff",
                zIndex: 9999,
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#2c2c2c" : "#121212",
                color: "#fff",
                cursor: "pointer",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#fff",
              }),
              input: (base) => ({
                ...base,
                color: "#fff",
              }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 5,
              colors: {
                ...theme.colors,
                primary25: "#2c2c2c",
                primary: "#10b981",
              },
            })}
          />

          {coin && (
            <div className="coin-stats">
              <span>Symbol: {coin.symbol.toUpperCase()} / USDT</span>
              <span className="green">
                ${coin.current_price.toLocaleString()}
              </span>
              <span>
                24h Change: {coin.price_change_percentage_24h.toFixed(2)}%
              </span>
              <span>High: ${coin.high_24h}</span>
              <span>Low: ${coin.low_24h}</span>
              <span>Volume: {coin.total_volume.toLocaleString()}</span>
            </div>
          )}
        </div>

        <div className="main-content3">
          <div className="chart-area">
            <AdvancedChart
              widgetProps={{
                symbol: chartSymbol,
                interval: "1",
                timezone: "Etc/UTC",
                theme: "dark",
                style: "1",
                locale: "en",
                allow_symbol_change: false,
                autosize: false,
                hide_top_toolbar: false,
                height: 400,
              }}
            />
          </div>

          <div className="order-market-toggle" style={{ overflowY: "hidden" }}>
            <div className="tab-buttons">
              <button
                className={activeTab === "orderbook" ? "active" : ""}
                onClick={() => setActiveTab("orderbook")}
              >
                Order Book
              </button>
              <button
                className={activeTab === "marketpairs" ? "active" : ""}
                onClick={() => setActiveTab("marketpairs")}
              >
                Market Pairs
              </button>
            </div>

            <div className="tab-content">
              {activeTab === "orderbook" && (
                <div className="order-book" style={{ overflowY: "hidden" }}>
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="order-row">
                      <span className="red">{(86590 + i).toFixed(2)}</span>
                      <span>{(Math.random() * 0.01).toFixed(4)}</span>
                      <span>{(Math.random() * 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "marketpairs" && (
                <div className="market-pairs" style={{ overflowY: "hidden" }}>
                  {marketPairs.map((pair) => (
                    <div key={pair.id} className="pair-row">
                      <span>{pair.symbol.toUpperCase()}/USDT</span>
                      <span
                        className={
                          pair.price_change_percentage_24h >= 0
                            ? "green"
                            : "red"
                        }
                      >
                        {pair.price_change_percentage_24h.toFixed(2)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="trade-box-area" style={{ overflowY: "hidden" }}>
            <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
              {selectedCoin.toUpperCase()} / USDT
            </div>
            <div className="tab-buttons">
              <button
                className={`buy-toggle ${tradeMode === "buy" ? "active" : ""}`}
                onClick={() => setTradeMode("buy")}
                style={{
                  backgroundColor: tradeMode === "buy" ? "#198754" : "#0f5132",
                  color: "#fff",
                }}
              >
                Buy
              </button>
              <button
                className={`sell-toggle ${
                  tradeMode === "sell" ? "active" : ""
                }`}
                onClick={() => setTradeMode("sell")}
                style={{
                  backgroundColor: tradeMode === "sell" ? "#dc3545" : "#842029",
                  color: "#fff",
                }}
              >
                Sell
              </button>
            </div>
            <div className="tab-content">
              {tradeMode === "buy" && (
                <TradeBox
                  selectedCoin={selectedCoin}
                  mode="buy"
                  onTradeSuccess={() => setReloadResult(Date.now())}
                />
              )}
              {tradeMode === "sell" && (
                <TradeBox
                  selectedCoin={selectedCoin}
                  mode="sell"
                  onTradeSuccess={() => setReloadResult(Date.now())}
                />
              )}
            </div>
          </div>
        </div>
        <div className="bottom-section">
          <Result1 reloadSignal={reloadResult} />
          <div className="trade-history">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => setShowMarketTrades((prev) => !prev)}
            >
              <h3 style={{ margin: 0 }}>Market Trades</h3>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#10b981",
                }}
              >
                {showMarketTrades ? "−" : "+"}
              </span>
            </div>

            <hr style={{ borderColor: "#2c2c2c", margin: "10px 0" }} />

            {showMarketTrades && (
              <div>
                {trades.map((trade, idx) => (
                  <div key={idx} className="trade-row">
                    <span className="green">${trade.price}</span>
                    <span>{trade.amount} BTC</span>
                    <span>{trade.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TradingDashboard;
