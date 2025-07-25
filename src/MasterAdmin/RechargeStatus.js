import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal"; // Assuming Modal component is already created

const RechargeStatus = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]); // State for filtered clients
  const [deposits, setDeposits] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [agents, setAgents] = useState([]);
  const [expandedAgents, setExpandedAgents] = useState({});
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchClientsAndAgents = async () => {
      try {
        const clientResponse = await axios.get(
          "https://trustcoinfx.trade/api/clients"
        );
        const agentResponse = await axios.get(
          "https://trustcoinfx.trade/api/agents"
        );
        setClients(clientResponse.data);
        setAgents(agentResponse.data);
        setFilteredClients(clientResponse.data);
      } catch (error) {
        console.error("Error fetching clients or agents:", error);
      }
    };
    fetchClientsAndAgents();
  }, []);
  const getAgentName = (agentUID) => {
    const agent = agents.find((a) => a.agentId === agentUID);
    return agent ? agent.name : "N/A";
  };

  const fetchDeposits = async (userId) => {
    try {
      const response = await axios.get(
        `https://trustcoinfx.trade/api/transactions/${userId}`
      );
      setDeposits(response.data.deposits);
      setSelectedUserId(userId);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const handleSearch = () => {
    const filtered = clients.filter((client) =>
      client.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClients(filtered);
  };

  const groupedClients = clients.reduce((acc, client) => {
    if (!acc[client.agentUID]) {
      acc[client.agentUID] = [];
    }
    acc[client.agentUID].push(client);
    return acc;
  }, {});

  return (
    <div className="admin-recharge-status p-4">
      <h2 className="text-2xl font-bold mb-4">Recharge Status</h2>

      {!selectedUserId ? (
        <div className="overflow-x-auto">
          <div className="mb-4">
            <div style={{ display: "flex" }}>
              <input
                style={{ width: "500px" }}
                type="text"
                placeholder="Search by User ID"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border rounded px-4 py-2 mr-2"
              />
              <button
                onClick={handleSearch}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Search
              </button>
            </div>
          </div>
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Agent ID</th>
                <th className="py-3 px-6 text-left">Agent Name</th>
                {/* 
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">Email</th> */}
                <th className="py-3 px-6 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {Object.keys(groupedClients).map((agentUID) => (
                <React.Fragment key={agentUID}>
                  <tr
                    className="bg-gray-100 cursor-pointer"
                    onClick={() =>
                      setExpandedAgents((prev) => ({
                        ...prev,
                        [agentUID]: !prev[agentUID],
                      }))
                    }
                  >
                    <td className="py-3 px-6 text-left">{agentUID}</td>
                    <td className="py-3 px-6 text-left">
                      {getAgentName(agentUID)}
                    </td>
                    <td className="py-3 px-6 text-left">Toggle Clients</td>
                  </tr>
                  {expandedAgents[agentUID] &&
                    groupedClients[agentUID].map((client) => (
                      <tr key={client._id} className="border-t">
                        <td className="py-3 px-6 text-left">-</td>
                        <td className="py-3 px-6 text-left" colSpan={2}>
                          <div className="flex flex-col">
                            <span>
                              <strong style={{ color: "black" }}>
                                User ID:
                              </strong>{" "}
                              {client.userId}
                            </span>
                            <span>
                              <strong style={{ color: "black" }}>Email:</strong>{" "}
                              {client.email}
                            </span>
                            <div className="mt-2">
                              <button
                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                onClick={() => fetchDeposits(client._id)}
                              >
                                Recharge Status
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="mb-4">
            <label className="mr-2">From:</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded px-4 py-2 mr-4"
            />

            <label className="mr-2">To:</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded px-4 py-2"
            />
          </div>

          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">User ID</th>
                <th className="py-3 px-6 text-left">Amount</th>
                <th className="py-3 px-6 text-left">Coin</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-left">Proof</th>
                <th className="py-3 px-6 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {deposits
                .filter((deposit) => {
                  const depositDate = new Date(deposit.createdAt);
                  return (
                    (!fromDate || depositDate >= new Date(fromDate)) &&
                    (!toDate || depositDate <= new Date(toDate))
                  );
                })
                .map((deposit) => (
                  <tr
                    key={deposit._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">{deposit.uid}</td>
                    <td className="py-3 px-6 text-left">
                      <b style={{ color: "black", fontWeight: "700" }}>
                        {deposit.amount}
                      </b>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {deposit.selectedSymbol}
                    </td>
                    <td className="py-3 px-6 text-left">{deposit.status}</td>
                    <td className="py-3 px-6 text-left">
                      <a
                        href={deposit.proof}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Proof
                      </a>
                    </td>
                    <td className="py-3 px-6 text-left">
                      {new Date(deposit.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <button
            className="mt-4 bg-gray-500 text-white py-1 px-3 rounded"
            onClick={() => setSelectedUserId(null)}
          >
            Back to Users
          </button>
        </div>
      )}
    </div>
  );
};

export default RechargeStatus;
