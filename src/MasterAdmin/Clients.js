import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import KycModal from "./KycModal";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [kycDetails, setKycDetails] = useState(null);
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

  const toggleAgentDropdown = (agentUID) => {
    setExpandedAgents((prev) => ({
      ...prev,
      [agentUID]: !prev[agentUID],
    }));
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://trustcoinfx.trade/api/clients/${selectedClientId}`
      );
      setClients(clients.filter((client) => client._id !== selectedClientId));
      setShowModal(false);
      setSelectedClientId(null);
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const openModal = (id) => {
    setSelectedClientId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClientId(null);
  };

  const viewKycDetails = async (userId) => {
    try {
      const response = await axios.get(
        `https://trustcoinfx.trade/api/kyc/${userId}`
      );
      setKycDetails(response.data);
    } catch (error) {
      console.error("Error fetching KYC details:", error);
      setKycDetails(null);
    }
    setShowKycModal(true);
  };

  const closeKycModal = () => {
    setShowKycModal(false);
    setKycDetails(null);
  };

  const groupedClients = clients.reduce((acc, client) => {
    if (!acc[client.agentUID]) {
      acc[client.agentUID] = [];
    }
    acc[client.agentUID].push(client);
    return acc;
  }, {});

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Clients</h2>
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-2">Agent ID</th>
            <th className="py-2">Agent Name</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedClients).map((agentUID) => (
            <React.Fragment key={agentUID}>
              {/* Agent Row */}
              <tr
                className="bg-gray-100 cursor-pointer"
                onClick={() => toggleAgentDropdown(agentUID)}
              >
                <td className="py-3 px-6 text-left">{agentUID}</td>
                <td className="py-3 px-6 text-left">
                  {getAgentName(agentUID)}
                </td>
                <td className="py-3 px-6 text-left">Toggle Clients</td>
              </tr>
              {/* Client Rows */}
              {expandedAgents[agentUID] &&
                groupedClients[agentUID].map((client) => (
                  <tr key={client._id} className="border-t">
                    <td className="py-3 px-6 text-left">-</td>
                    <td className="py-3 px-6 text-left" colSpan={2}>
                      <div className="flex flex-col">
                        <span>
                          <strong style={{ color: "black" }}>User ID:</strong>{" "}
                          {client.userId}
                        </span>
                        {/* <span>
                          <strong style={{ color: "black" }}>Name:</strong>{" "}
                          {client.name}
                        </span> */}
                        <span>
                          <strong style={{ color: "black" }}>Email:</strong>{" "}
                          {client.email}
                        </span>
                        <span>
                          <strong style={{ color: "black" }}>
                            Created At:
                          </strong>{" "}
                          {client.createdAt
                            ? new Date(client.createdAt).toLocaleString()
                            : "N/A"}
                        </span>
                        <div className="mt-2">
                          <button
                            onClick={() => openModal(client._id)}
                            className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => viewKycDetails(client._id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            View KYC Details
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

      <Modal
        show={showModal}
        onClose={closeModal}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this user?"
      />

      <KycModal
        show={showKycModal}
        onClose={closeKycModal}
        kycDetails={kycDetails}
      />
    </div>
  );
};

export default Clients;
