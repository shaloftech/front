import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserDashboard.css";
import { FaKey } from "react-icons/fa";
import Header from "./Header";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [showChange, setShowChange] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const storageId = localStorage.getItem("_id");

  useEffect(() => {
    if (!storageId) return;
    axios
      .get(`https://trustcoinfx.trade/api/user1s/${storageId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Failed to load user →", err));
  }, [storageId]);

  if (!user) {
    return <div className="loading">Loading your heroic profile…</div>;
  }

  const {
    id,
    email,
    userId: businessUID,
    wallets,
    agentUID,
    defaultTradeResult,
    createdAt,
  } = user;

  const handleChangeSubmit = async (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setError("New passwords don’t match");
      return;
    }
    try {
      const res = await axios.post(
        "https://trustcoinfx.trade/api/change-password",
        { userId: id, oldPassword: oldPass, newPassword: newPass }
      );
      setSuccess(res.data.message);
      setError("");
      // auto-close after a moment
      setTimeout(() => {
        setShowChange(false);
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
        setSuccess("");
      }, 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Change failed");
      setSuccess("");
    }
  };

  return (
    <>
      <Header />
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>🚀 Welcome back!</h1>
          <p className="sub" style={{ color: "white" }}>
            <strong>Email:</strong> {email}
            <br />
            <strong>Mongo ID:</strong> {id}
            <br />
            <strong>Business UID:</strong> {businessUID}
          </p>
          <small>Member since {new Date(createdAt).toLocaleDateString()}</small>
        </header>

        <div className="dashboard-grid">
          <div className="card">
            <h2>Account</h2>
            <button className="btn-change" onClick={() => setShowChange(true)}>
              <FaKey /> Change Password
            </button>
          </div>

          {Object.entries(wallets || {}).map(([chain, info]) => (
            <div key={chain} className="card">
              <h2>{chain} Wallet</h2>
              {info.address && (
                <p className="address" style={{ color: "white" }}>
                  <strong>Address:</strong>
                  <span className="mono">{info.address}</span>
                </p>
              )}
              <p style={{ color: "white" }}>
                <strong>Balance:</strong> {info.balance.toLocaleString()}{" "}
                {chain}
              </p>
            </div>
          ))}
        </div>
      </div>

      {showChange && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <button
              className="modal-close"
              onClick={() => {
                setShowChange(false);
                setError("");
                setSuccess("");
              }}
            >
              &times;
            </button>
            <h2>Change Password</h2>
            {error && <p className="text-error">{error}</p>}
            {success && <p className="text-success">{success}</p>}
            <form onSubmit={handleChangeSubmit}>
              <label>
                Old Password
                <input
                  type="password"
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  required
                />
              </label>
              <label>
                New Password
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  required
                />
              </label>
              <label>
                Confirm New
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn-submit">
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserDashboard;
