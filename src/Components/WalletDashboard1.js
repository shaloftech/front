import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./WalletDashboard.css";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import walletInfos from "./wallet-info.json";
import Header from "./Header";
import usdt from "./USDT.png";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import InvestmentHistory from "./InvestmentHistory";
import Result from "./Result";
import Footer from "./Footer";
import QRCode from "react-qr-code"; // npm install react-qr-code

ChartJS.register(ArcElement, Tooltip, Legend);

const WalletDashboard1 = () => {
  const [walletData, setWalletData] = useState(null);
  const [addresses, setAddresses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeMainTab, setActiveMainTab] = useState("overview");
  const [showsend, setShowsend] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferModalU, setShowTransferModalU] = useState(false);
  const [expandedSymbol, setExpandedSymbol] = useState(null);
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const userId1 = localStorage.getItem("_id");
  // Fetch wallet balances, USD values, and child addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [detailRes, addrRes] = await Promise.all([
          axios.get(`https://trustcoinfx.trade/api/wallet/${userId}/details`),
          axios.get(
            `https://trustcoinfx.trade/api/wallet/${userId1}/child-addresses`
          ),
        ]);
        setWalletData(detailRes.data);
        setAddresses(addrRes.data.addresses || {});
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    if (userId) fetchData();
  }, [userId]);

  if (isLoading) return <div>Loading...</div>;
  if (!walletData) return <div>Error loading wallet.</div>;

  const { wallets, totalUsdBalance } = walletData;
  const futureUsd = wallets.future?.usdValue || 0;
  const stakeUsd = wallets.stake?.usdValue || 0;
  const mainUsd = totalUsdBalance - futureUsd - stakeUsd;
  const overallTotal = mainUsd + futureUsd + stakeUsd;

  const chartData = {
    datasets: [
      {
        data: [mainUsd, futureUsd, stakeUsd],
        backgroundColor: ["#4caf50", "#2196f3", "#ff9800"],
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.raw;
            const pct = overallTotal
              ? ((val / overallTotal) * 100).toFixed(2)
              : 0;
            return `${ctx.label}: ${val.toFixed(2)} USDT (${pct}%)`;
          },
        },
      },
    },
  };

  const handleAssetClick = (symbol) => {
    setExpandedSymbol(expandedSymbol === symbol ? null : symbol);
  };

  const handleCopy = (symbol) => {
    const addr = addresses[symbol] || "";
    navigator.clipboard
      .writeText(addr)
      .then(() => {
        setCopyButtonText("Copied!");
        setTimeout(() => setCopyButtonText("Copy"), 5000);
      })
      .catch((err) => {
        console.error("Copy failed", err);
        alert("Failed to copy address");
      });
  };

  // Logo mapping to public folder assets
  const logoMap = {
    ETH: `${process.env.PUBLIC_URL}/coin_logos/ETH.png`,
    BNB: `${process.env.PUBLIC_URL}/coin_logos/BNB.png`,
    BTC: `${process.env.PUBLIC_URL}/coin_logos/BTC.png`,
    SOL: `${process.env.PUBLIC_URL}/coin_logos/SOL.png`,
    TRON: `${process.env.PUBLIC_URL}/coin_logos/TRON.png`,
    future: `${process.env.PUBLIC_URL}/coin_logos/USDT.png`,
    stake: `${process.env.PUBLIC_URL}/coin_logos/USDT.png`,
  };

  return (
    <div className="container1">
      <Header />
      <div className="main-content1">
        {/* Tabs */}
        <div className="tabs">
          {["overview", "main", "futures", "investment"].map((tab) => (
            <button
              key={tab}
              className={activeMainTab === tab ? "active" : ""}
              onClick={() => setActiveMainTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Estimated Total Value */}
        <div className="value-display">
          <h1>Est. Total Value</h1>
          <div className="value-row">
            <h2>{overallTotal.toFixed(2)} USDT</h2>
            <i className="fa-regular fa-eye"></i>
          </div>
          {activeMainTab === "main" && (
            <div className="chart">
              <Doughnut data={chartData} options={chartOptions} />
            </div>
          )}
        </div>

        {/* Overview Actions */}
        {activeMainTab === "overview" && (
          <div className="actions-row">
            {["Receive", "Send"].map((act) => (
              <div
                key={act}
                className="action-item"
                onClick={() => setShowsend(true)}
              >
                <i
                  className={`fas fa-arrow-${
                    act === "Receive" ? "down" : "up"
                  }`}
                ></i>
                <span>{act}</span>
              </div>
            ))}
            <div
              className="action-item"
              onClick={() => setShowTransferModal(true)}
            >
              <i className="fas fa-exchange-alt"></i>
              <span>Transfer</span>
            </div>
          </div>
        )}

        {/* Futures & Investment Actions */}
        {(activeMainTab === "futures" || activeMainTab === "investment") && (
          <div className="invest-actions">
            <button onClick={() => setShowTransferModalU(true)}>
              Transfer
            </button>
            <Link to="/plan">Invest Now</Link>
          </div>
        )}

        {/* Main Tab Content: Wallet List */}
        <div className="market-list">
          {activeMainTab === "main" ? (
            <>
              {/* On-chain holdings with expandable sections */}
              {walletInfos
                .filter((c) => wallets[c.symbol]?.balance > 0)
                .map((c) => {
                  const sym = c.symbol;
                  const bal = wallets[sym].balance;
                  const usdVal = wallets[sym].usdValue;
                  const addr = addresses[sym] || "";
                  const isExpanded = expandedSymbol === sym;
                  return (
                    <div key={sym} style={{ width: "100%" }}>
                      <div
                        className="market-item"
                        onClick={() => handleAssetClick(sym)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          height: isExpanded ? "auto" : "80px",
                          padding: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <img src={logoMap[sym]} alt={sym} className="w-8 h-8" />
                        <div style={{ flex: 1, marginLeft: "10px" }}>
                          <div>
                            {c.cryptoName} ({sym})
                          </div>
                          <div>
                            {bal.toFixed(8)} / ${usdVal.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      {isExpanded && (
                        <div
                          className="wallet-qr"
                          style={{ padding: "20px", background: "#f9f9f9" }}
                        >
                          <p
                            className="text-sm font-mono break-all"
                            style={{ marginBottom: "10px" }}
                          >
                            {addr}
                          </p>
                          <div
                            style={{
                              background: "white",
                              display: "inline-block",
                              padding: "8px",
                            }}
                          >
                            <QRCode value={addr} size={150} />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginTop: "10px",
                            }}
                          >
                            <h3
                              className="copy-address"
                              onClick={() => handleCopy(sym)}
                              style={{ cursor: "pointer", marginRight: "6px" }}
                            >
                              {copyButtonText}
                            </h3>
                            <i className="fa fa-clone" aria-hidden="true"></i>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              {/* Futures Section */}
              <h2>Futures</h2>
              <div className="market-item">
                <img src={usdt} alt="USDT" /> USDT: {futureUsd.toFixed(2)}
              </div>

              {/* Investment/Stake Section */}
              <h2>Investment/Stake</h2>
              <div className="market-item">
                <img src={usdt} alt="USDT" /> USDT: {stakeUsd.toFixed(2)}
              </div>
            </>
          ) : activeMainTab === "futures" ? (
            <Result />
          ) : activeMainTab === "investment" ? (
            <InvestmentHistory />
          ) : null}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WalletDashboard1;
