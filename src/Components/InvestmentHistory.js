import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InvestmentHistory.css";
import Header from "./Header";
import MainContentInvestment from "./MainContentInvestment";

const InvestmentHistory = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("_id");

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        const res = await axios.get(
          `https://trustcoinfx.trade/api/investments/${userId}`
        );
        setInvestments(res.data || []);
      } catch (err) {
        console.error("Failed to fetch investments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInvestments();
  }, [userId]);

  const getTimeLeft = (startDate, durationDays) => {
    if (!startDate || durationDays == null) return "—";
    const end = new Date(startDate);
    end.setDate(end.getDate() + durationDays);
    const diff = end - new Date();
    if (diff <= 0) return "Completed ✅";

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    return `${d}d ${h}h ${m}m`;
  };

  if (loading) {
    return <div className="loader">Loading investment history…</div>;
  }

  return (
    <>
      <MainContentInvestment />
      <div className="history-container">
        {/* <h2 className="history-title">📈 Investment & Staking History</h2> */}
        <div className="table-responsive">
          <table className="history-table">
            <thead>
              <tr>
                <th>Start Date</th>
                <th>Plan</th>
                <th>Capital (USDT)</th>
                <th>Interest Rate</th>
                <th>Duration</th>
                <th>Withdrawn</th>
                <th>Limit</th>
                <th>Status</th>
                <th>Time Left</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv) => {
                const start = inv.createdAt || inv.startDate;
                const dateStr = start
                  ? new Date(start).toLocaleDateString()
                  : "—";
                const ratePct = inv.interestRate
                  ? `${(inv.interestRate * 100).toFixed(2)}%`
                  : "—";
                const dur =
                  inv.durationDays != null ? `${inv.durationDays}d` : "—";
                const withdrawn = inv.withdrawalCount ?? 0;
                const limit = inv.withdrawalLimit ?? "-";
                const status =
                  inv.status === "completed" ? "Done ✅" : "Active";
                const timeLeft = getTimeLeft(start, inv.durationDays);

                return (
                  <tr key={inv._id}>
                    <td data-label="Start Date">{dateStr}</td>
                    <td data-label="Plan">{inv.plan}</td>
                    <td data-label="Capital">
                      {inv.amount?.toLocaleString() ?? "0"}
                    </td>
                    <td data-label="Interest Rate">{ratePct}</td>
                    <td data-label="Duration">{dur}</td>
                    <td data-label="Withdrawn">{withdrawn}</td>
                    <td data-label="Limit">{limit}</td>
                    <td data-label="Status">{status}</td>
                    <td data-label="Time Left">{timeLeft}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default InvestmentHistory;
