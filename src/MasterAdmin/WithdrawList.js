import React, { useState, useEffect } from "react";
import axios from "axios";

const WithdrawList = () => {
  const [clients, setClients] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [withdraws, setWithdraws] = useState([]);
  const [loading, setLoading] = useState(false);
  const [agentUID, setAgentUID] = useState(""); // Add state for agentUID
  const [agents, setAgents] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [expandedAgents, setExpandedAgents] = useState({});

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

  const handleViewWithdraws = async (id) => {
    setLoading(true);
    try {
      const [withdrawResponse, clientResponse] = await Promise.all([
        axios.get(`https://trustcoinfx.trade/api/send1/${id}`),
        axios.get(`https://trustcoinfx.trade/api/agent-uid-by-user-id/${id}`),
      ]);

      setWithdraws(withdrawResponse.data);
      setAgentUID(clientResponse.data.agentUID); // Set the agentUID for the selected user
      setSelectedUserId(id);
    } catch (error) {
      console.error("Error fetching withdraws or agentUID:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedUserId(null);
    setWithdraws([]);
    setAgentUID(""); // Clear agentUID when going back
  };
  const groupedClients = clients.reduce((acc, client) => {
    if (!acc[client.agentUID]) {
      acc[client.agentUID] = [];
    }
    acc[client.agentUID].push(client);
    return acc;
  }, {});

  return (
    <div className="withdraw-list">
      {selectedUserId ? (
        <div>
          <h2>Withdraw Status For User</h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="min-w-full bg-white rounded-lg shadow">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Agent ID</th>
                  <th className="py-3 px-6 text-left">Agent Name</th>

                  <th className="py-3 px-6 text-left">Symbol</th>
                  <th className="py-3 px-6 text-left">Amount</th>
                  <th className="py-3 px-6 text-left">Address</th>
                  <th className="py-3 px-6 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {withdraws.map((withdraw) => (
                  <tr
                    key={withdraw._id}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 text-left">
                      {" "}
                      {agentUID || "Not assigned"}
                    </td>
                    <td>
                      {withdraw.userId && withdraw.userId.agentUID
                        ? getAgentName(withdraw.userId.agentUID)
                        : "N/A"}
                    </td>
                    <td className="py-3 px-6 text-left">{withdraw.symbol}</td>
                    <td className="py-3 px-6 text-left">{withdraw.amount}</td>
                    <td className="py-3 px-6 text-left">{withdraw.address}</td>
                    <td className="py-3 px-6 text-left">{withdraw.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            className="mt-4 bg-gray-500 text-white py-1 px-3 rounded"
            onClick={handleBack}
          >
            Back to Clients
          </button>
        </div>
      ) : (
        <div>
          <h2>Client List</h2>
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Agent ID</th>
                <th className="py-3 px-6 text-left">Agent Name</th>

                {/* <th className="py-3 px-6 text-left">User ID</th>
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
                                onClick={() => handleViewWithdraws(client._id)}
                              >
                                View Withdraw Status
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
      )}
    </div>
  );
};

export default WithdrawList;
