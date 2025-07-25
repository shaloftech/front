import React, { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./AdminPanel.css";

const AdminDepositApproval = () => {
  const [agents, setAgents] = useState([]);
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDeposits = async () => {
      try {
        const response = await axios.get(
          "https://trustcoinfx.trade/api/deposits"
        );
        setPendingDeposits(response.data);
        setFilteredDeposits(response.data);
      } catch (error) {
        console.error("Error fetching all deposits:", error);
      }
    };

    fetchDeposits();
  }, []);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const agentResponse = await axios.get(
          "https://trustcoinfx.trade/api/agents"
        );
        setAgents(agentResponse.data);
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const getAgentName = (agentUID) => {
    const agent = agents.find((a) => a.agentId === agentUID);
    return agent ? agent.name : "N/A";
  };

  const handleSearch = () => {
    const filtered = pendingDeposits.filter(
      (deposit) =>
        (deposit.uid &&
          deposit.uid.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (deposit.userId?.agentUID &&
          deposit.userId.agentUID
            .toLowerCase()
            .includes(searchQuery.toLowerCase()))
    );
    setFilteredDeposits(filtered);
  };

  const handleApprove = async (id, updatedAmount) => {
    setIsLoading(true);
    try {
      await axios.post(`https://trustcoinfx.trade/api/deposits/${id}/approve`, {
        amount: updatedAmount,
      });
      alert("Deposit approved successfully");
      setPendingDeposits(pendingDeposits.filter((d) => d._id !== id));
      setFilteredDeposits(filteredDeposits.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error approving deposit:", error);
      alert("Failed to approve deposit");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async (id) => {
    try {
      await axios.delete(`https://trustcoinfx.trade/api/deposits/${id}`);
      alert("Deposit declined successfully");
      setPendingDeposits(pendingDeposits.filter((d) => d._id !== id));
      setFilteredDeposits(filteredDeposits.filter((d) => d._id !== id));
    } catch (error) {
      console.error("Error declining deposit:", error);
      alert("Failed to decline deposit");
    } finally {
      setShowDeclineModal(false);
    }
  };

  const handleActionClick = (deposit) => {
    setCurrentDeposit(deposit);
    setShowModal(true);
  };

  const handleDeclineClick = (deposit) => {
    setCurrentDeposit(deposit);
    setShowDeclineModal(true);
  };

  const handleConfirmAction = async () => {
    await handleApprove(currentDeposit._id, currentDeposit.amount);
    try {
      await axios.post(
        `https://trustcoinfx.trade/api/deposits/${currentDeposit._id}/complete`
      );
    } catch (error) {
      console.error("Error updating deposit status:", error);
    }
    setShowModal(false);
  };

  const handleCancelAction = () => {
    setShowModal(false);
    setShowDeclineModal(false);
  };

  const handleAmountChange = (e) => {
    setCurrentDeposit({
      ...currentDeposit,
      amount: parseFloat(e.target.value),
    });
  };

  return (
    <div className="admin-panel">
      <h2>
        <b style={{ color: "black", fontSize: "18px" }}>
          All Recharge Requests
        </b>
      </h2>

      <div className="mb-4">
        <div style={{ display: "flex" }}>
          <input
            style={{ width: "500px" }}
            type="text"
            placeholder="Search by User ID or Agent ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded px-4 py-2 mr-2"
          />
          <button
            onClick={handleSearch}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Agent ID</th>
            <th>Agent Name</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Coin</th>
            <th>Proof</th>
            <th>Date and Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDeposits.map((deposit) => (
            <tr key={deposit._id}>
              <td>{deposit.userId?.agentUID || "N/A"}</td>
              <td>
                {deposit.userId?.agentUID
                  ? getAgentName(deposit.userId.agentUID)
                  : "N/A"}
              </td>
              <td>{deposit.uid}</td>
              <td>
                {deposit.amount} {deposit.selectedSymbol}
              </td>
              <td>{deposit.selectedSymbol.toUpperCase()}</td>
              <td>
                <a
                  href={deposit.proof}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Proof
                </a>
              </td>
              <td>{format(new Date(deposit.createdAt), "PPpp")}</td>
              <td>
                <button onClick={() => handleActionClick(deposit)}>
                  Approve
                </button>
                <button
                  onClick={() => handleDeclineClick(deposit)}
                  style={{ marginLeft: "10px" }}
                >
                  Decline
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{currentDeposit.selectedSymbol.toUpperCase()} Recharge</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleConfirmAction();
              }}
            >
              <div className="form-group">
                <label>Currency</label>
                <input
                  type="text"
                  value={currentDeposit.selectedSymbol.toUpperCase()}
                  readOnly
                />
              </div>
              <div className="form-group">
                <label>Amount:</label>
                <input
                  type="number"
                  value={currentDeposit.amount}
                  onChange={handleAmountChange}
                  required
                />
              </div>
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Approve"}
              </button>
              <button type="button" onClick={handleCancelAction}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showDeclineModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Decline Confirmation</h2>
            <p>Are you sure you want to decline this deposit?</p>
            <button
              onClick={() => handleDecline(currentDeposit._id)}
              style={{ backgroundColor: "red", color: "white" }}
            >
              Confirm Decline
            </button>
            <button type="button" onClick={handleCancelAction}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepositApproval;
