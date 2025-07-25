import React, { useEffect, useState } from "react";
import axios from "axios";

const deliveryTimes = [
  { time: 60, interest: 0.1, minAmount: 50 },
  { time: 120, interest: 0.35, minAmount: 1000 },
  { time: 129600, interest: 2.15, minAmount: 50000 },
  { time: 604800, interest: 3.15, minAmount: 100000 },
  { time: 2592000, interest: 5.2, minAmount: 200000 },
];
const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d`;
  return `${Math.floor(seconds / 604800)}w`;
};

const TradeBox = ({ selectedCoin, mode, onTradeSuccess }) => {
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [direction, setDirection] = useState("up");
  const [deliveryTime, setDeliveryTime] = useState(deliveryTimes[0].time);
  const [interest, setInterest] = useState(deliveryTimes[0].interest);
  const [minAmount, setMinAmount] = useState(deliveryTimes[0].minAmount);
  const [walletBalance, setWalletBalance] = useState(0);
  const userId = localStorage.getItem("_id");
  const uid = localStorage.getItem("userId");

  useEffect(() => {
    setPrice(0);
    setAmount(0);
    fetchWallet();
  }, [selectedCoin]);

  useEffect(() => {
    const selected = deliveryTimes.find((d) => d.time === Number(deliveryTime));
    if (selected) {
      setInterest(selected.interest);
      setMinAmount(selected.minAmount);
    }
  }, [deliveryTime]);

  const fetchWallet = async () => {
    try {
      const res = await axios.get(
        `https://trustcoinfx.trade/api/wallet/${userId}`
      );
      console.log("Fetched balance from server:", res.data.balances.tether);
      setWalletBalance(res.data.balances.tether || 0);

      console.log(walletBalance);
    } catch (error) {
      console.error("Failed to fetch wallet", error);
    }
  };

  const handleTrade = async () => {
    const direction = mode === "buy" ? "up" : "down";

    if (amount < minAmount) {
      return alert(`Minimum amount is ${minAmount} USDT`);
    }
    if (amount > walletBalance) {
      console.log(walletBalance);
      return alert("Insufficient balance");
    }

    try {
      await axios.post("https://trustcoinfx.trade/api/predict", {
        symbol: selectedCoin,
        direction,
        amount: Number(amount),
        deliveryTime,
        uid,
        userId,
      });
      alert("Trade placed successfully");
      console.log(walletBalance);
      setAmount(0);
      if (onTradeSuccess) onTradeSuccess();
    } catch (err) {
      console.error("Error placing trade", err);
      alert("Failed to place trade");
    }
  };

  return (
    <div className="bg-gray-900 p-4 rounded shadow-md text-white">
      {/* <h4
        className={`text-lg font-semibold mb-2 ${
          mode === "buy" ? "text-green-400" : "text-red-400"
        }`}
      >
        {mode === "buy" ? "Buy" : "Sell"} {selectedCoin}
      </h4> */}
      <p className="text-sm text-gray-400 mb-2">
        Avbl: {walletBalance.toFixed(8)} USDT
      </p>

      <div className="mb-2">
        <label className="block mb-1 text-sm">Amount</label>
        <input
          type="number"
          className="w-full p-2 bg-gray-800 rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 text-sm">Delivery Time</label>
        <select
          className="w-full p-2 bg-gray-800 rounded"
          value={deliveryTime}
          onChange={(e) => setDeliveryTime(Number(e.target.value))}
        >
          {deliveryTimes.map((dt) => (
            <option key={dt.time} value={dt.time}>
              {formatDuration(dt.time)} - {dt.interest * 100}% (min{" "}
              {dt.minAmount} USDT)
            </option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <p className="text-sm">Interest: {(interest * 100).toFixed(2)}%</p>
        <p className="text-sm">Min: {minAmount} USDT</p>
      </div>

      <button
        className={`w-full py-2 mt-2 rounded ${
          mode === "buy"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-red-600 hover:bg-red-700"
        }`}
        onClick={handleTrade}
      >
        {mode === "buy" ? "Buy" : "Sell"} {selectedCoin}
      </button>
    </div>
  );
};

export default TradeBox;
