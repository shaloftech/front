// Final Updated Result.js — full table with expandable rows, filters, logos, download PDF (with all fields in export)
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Header from "./Header";
import Countdown from "./Countdown"; // adjust path if needed
import "./Result.css";
const Result1 = ({ reloadSignal }) => {
  const [predictions, setPredictions] = useState([]);
  const [logos, setLogos] = useState({});
  const [selectedTab, setSelectedTab] = useState("wait");
  const [expandedId, setExpandedId] = useState(null);
  const fullTableRef = useRef();
  const navigate = useNavigate();
  const userId = localStorage.getItem("_id");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [reloadToggle, setReloadToggle] = useState(false);
  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
    if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w`;
    return `${Math.floor(seconds / 2592000)}mo`;
  };

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await axios.get(
          `https://trustcoinfx.trade/api/predictions/user/${userId}`
        );
        const sorted = response.data.sort(
          (a, b) => new Date(b.predictedAt) - new Date(a.predictedAt)
        );
        setPredictions(sorted);
      } catch (err) {
        console.error("Error fetching predictions:", err);
      }
    };
    fetchPredictions();
  }, [userId, reloadSignal, reloadToggle]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await axios.get(
          "https://pro-api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 250,
              page: 1,
              sparkline: false,
            },
            headers: {
              "X-Cg-Pro-Api-Key": "CG-abdEKxm7HXgBnnG2D2eexnmq",
            },
          }
        );

        const logoMap = {};
        for (const coin of response.data) {
          const imageUrl = coin.image;
          const imageResponse = await axios.get(
            "https://trustcoinfx.trade/api/fetch-image",
            {
              params: { imageUrl },
            }
          );
          logoMap[
            coin.id
          ] = `data:image/jpeg;base64,${imageResponse.data.image}`;
        }
        setLogos(logoMap);
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };
    fetchLogos();
  }, []);

  const isCountdownOver = (prediction) => {
    const elapsed = Math.floor(
      (Date.now() - new Date(prediction.predictedAt)) / 1000
    );
    return elapsed >= prediction.deliveryTime;
  };

  const downloadPDF = async () => {
    const canvas = await html2canvas(fullTableRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("prediction_results.pdf");
  };

  const filteredAll = predictions.filter((p) => {
    const isOver = isCountdownOver(p);
    return selectedTab === "wait" ? !isOver : isOver;
  });

  const totalPages = Math.ceil(filteredAll.length / 10);
  const startIdx = (currentPage - 1) * 10;
  const filteredPredictions =
    selectedTab === "wait"
      ? filteredAll
      : filteredAll.slice(startIdx, startIdx + 10);

  return (
    <>
      {/* <Header /> */}
      <div style={{ padding: "20px" }}>
        {/* <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <h2
            style={{
              borderBottom: "2px solid green",
              display: "inline-block",
              paddingBottom: "4px",
            }}
          >
            Contract
          </h2>
        </div> */}
        <div
          className="result-tabs"
          style={{
            marginBottom: "20px",
          }}
        >
          <button
            style={filterButtonStyle(selectedTab === "wait")}
            onClick={() => setSelectedTab("wait")}
          >
            Orders
          </button>
          <button
            style={filterButtonStyle(selectedTab === "finished")}
            onClick={() => setSelectedTab("finished")}
          >
            Position History
          </button>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={downloadPDF}
            // style={{ downloadButtonStyle }}
            className="download-btn"
          >
            Download PDF
          </button>
        </div>

        <div ref={fullTableRef} className="table-responsive">
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: "#fdfdfd",
            }}
          >
            <thead>
              <tr style={{ background: "black", textAlign: "left" }}>
                {" "}
                <th style={thStyle}>Order Time</th>
                <th style={thStyle}>Pair</th> <th style={thStyle}>Direction</th>
                <th style={thStyle}>Amount</th>
                <th style={thStyle}>PNL</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "black" }}>
              {filteredPredictions.map((p) => {
                const symbol = p.symbol?.toLowerCase();
                const logo = logos[symbol];
                const isOver = isCountdownOver(p);
                const isProfit = p.result && p.result.success;
                // const resultText = !p.result
                //   ? "Pending"
                //   : isProfit
                //   // ? `+${p.result.profit} USDT`
                //   // : `-${p.amount} USDT`;
                let resultText;
                if (!p.result) {
                  resultText = "Pending";
                } else {
                  // compute a signed number, then format
                  const signedPnL = isProfit ? p.result.profit : -p.amount;
                  resultText = `${signedPnL >= 0 ? "+" : ""}${signedPnL.toFixed(
                    2
                  )} USDT`;
                }
                return (
                  <React.Fragment key={p._id}>
                    <tr
                      onClick={() =>
                        setExpandedId(expandedId === p._id ? null : p._id)
                      }
                      style={{
                        borderBottom: "1px solid #ddd",
                        background: isOver ? "black" : "black",
                        cursor: "pointer",
                      }}
                    >
                      <td style={tdStyle}>
                        {new Date(p.predictedAt).toLocaleString()}
                      </td>
                      <td style={tdStyle}>
                        <img
                          src={logo || "https://via.placeholder.com/20"}
                          alt="logo"
                          style={{
                            width: "20px",
                            height: "20px",
                            marginRight: "10px",
                            verticalAlign: "middle",
                          }}
                        />
                        {symbol?.toUpperCase()}/USDT
                      </td>{" "}
                      <td style={tdStyle}>
                        {p.direction === "up" ? "Bullish 📈" : "Bearish 📉"}
                      </td>
                      <td style={tdStyle}>{p.amount} USDT</td>
                      <td
                        style={{
                          ...tdStyle,
                          color: !p.result
                            ? "gray"
                            : isProfit
                            ? "green"
                            : "red",
                        }}
                      >
                        {resultText}
                      </td>
                    </tr>
                    {expandedId === p._id && (
                      <tr>
                        <td
                          colSpan="5"
                          style={{ padding: "15px", background: "black" }}
                        >
                          <div>
                            <strong>Purchase Price:</strong> {p.currentPrice}{" "}
                            USD
                          </div>
                          <div>
                            <strong>Contract Duration:</strong>{" "}
                            {formatDuration(p.deliveryTime)}
                            {/* seconds */}
                            {" | "}
                            <Countdown
                              deliveryTime={p.deliveryTime}
                              predictedAt={p.predictedAt}
                              onComplete={() =>
                                setReloadToggle((prev) => !prev)
                              }
                            />
                          </div>

                          <div>
                            <strong>Delivery Time:</strong>{" "}
                            {new Date(
                              new Date(p.predictedAt).getTime() +
                                p.deliveryTime * 1000
                            ).toLocaleString()}
                          </div>
                          <div>
                            <strong>Status:</strong>{" "}
                            {!p.result ? "Pending" : isProfit ? "Won" : "Lost"}
                          </div>
                          {p.result && (
                            <div>
                              <strong>Profit/Loss:</strong>{" "}
                              <span
                                style={{ color: isProfit ? "green" : "red" }}
                              >
                                {`${isProfit ? "+" : ""}${(isProfit
                                  ? p.result.profit
                                  : -p.amount
                                ).toFixed(2)} USDT`}
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          {selectedTab === "finished" && (
            <div style={{ marginTop: "20px", textAlign: "center" }}>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                // style={{
                //   ...paginationButtonStyle,
                //   opacity: currentPage === 1 ? 0.5 : 1,
                // }}
                className="pagination-btn"
              >
                ⬅ Prev
              </button>

              <span style={{ color: "white", margin: "0 15px" }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                // style={{
                //   ...paginationButtonStyle,
                //   opacity: currentPage === totalPages ? 0.5 : 1,
                // }}
                className="pagination-btn"
              >
                Next ➡
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const tableStyles = {
  width: "100%",
  borderCollapse: "collapse",
  backgroundColor: "#0d1117", // Dark background
  color: "#e6e6e6", // Light text
};

const thStyle = {
  padding: "10px",
  borderBottom: "2px solid #30363d",
  fontWeight: "bold",
  backgroundColor: "#161b22",
  color: "#ffffff",
};

const tdStyle = {
  padding: "10px",
  verticalAlign: "middle",
  borderBottom: "1px solid #2c2c2c",
  backgroundColor: "black",
};

const filterButtonStyle = (active) => ({
  padding: "10px 20px",
  margin: "0 5px",
  background: active ? "#198754" : "#21262d",
  border: "1px solid #198754",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: active ? "bold" : "normal",
  color: "#ffffff",
});

const downloadButtonStyle = {
  padding: "8px 16px",
  background: "#198754",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};
const paginationButtonStyle = {
  padding: "8px 16px",
  margin: "0 5px",
  background: "#198754",
  color: "white",
  border: "1px solid #198754",
  borderRadius: "5px",
  cursor: "pointer",
};

export default Result1;
