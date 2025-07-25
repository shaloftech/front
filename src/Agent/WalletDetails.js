import React, { useEffect, useState } from "react";
import axios from "axios";

const WalletDetails = () => {
  const [wallets, setWallets] = useState([]);

  useEffect(() => {
    const fetchWallets = async () => {
      const agentId = localStorage.getItem("agentId");
      if (!agentId) {
        console.error("Agent ID not found in local storage.");
        return;
      }
      try {
        const response = await axios.get(
          `https://trustcoinfx.trade/api/assigned-clients/${agentId}`
        );
        const assignedClients = response.data.map((client) => client.userId);
        const walletsResponse = await axios.get(
          "https://trustcoinfx.trade/api/wallets"
        );
        const filteredWallets = walletsResponse.data.filter((wallet) =>
          assignedClients.includes(wallet.userId)
        );
        setWallets(filteredWallets);
      } catch (error) {
        console.error("Error fetching wallets:", error);
      }
    };
    fetchWallets();
  }, []);

  const renderBalances = (balances) => {
    const filteredBalances = Object.entries(balances).filter(
      ([key, value]) => value !== 0
    );

    return filteredBalances.map(([key, value]) => (
      <div key={key} className="balance-entry">
        <span className="font-bold">{key.toUpperCase()}:</span> {value}
      </div>
    ));
  };

  return (
    <div className="wallet-details p-4">
      <h2 className="text-2xl font-bold mb-4">Wallet Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead>
            <tr className="w-full bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">User ID</th>
              <th className="py-3 px-6 text-left">Balances</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {wallets.map((wallet) => (
              <tr
                key={wallet._id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {wallet.userId}
                </td>
                <td className="py-3 px-6 text-left">
                  {renderBalances(wallet.balances)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletDetails;
