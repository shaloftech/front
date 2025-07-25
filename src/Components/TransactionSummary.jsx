// Final Updated TransactionSummary.js — table row only, no repeated header
import React, { useState } from "react";
import "./TransactionSummary.css";

const TransactionSummary = ({ transaction, logo }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDetails = () => {
    setIsOpen(!isOpen);
  };

  const isApproved =
    transaction.status === "completed" ||
    transaction.status === "complete" ||
    transaction.approved;

  const transactionAmount = transaction.amount;
  let transactionSymbol = "UNKNOWN";
  if (transaction.selectedSymbol) {
    transactionSymbol = transaction.selectedSymbol.toUpperCase();
  } else if (transaction.symbol) {
    transactionSymbol = transaction.symbol.toUpperCase();
  } else if (transaction.fromSymbol && transaction.toSymbol) {
    transactionSymbol = `${transaction.fromSymbol.toUpperCase()}-${transaction.toSymbol.toUpperCase()}`;
  }

  const statusClass = isApproved ? "completed" : "pending";
  const statusIcon = isApproved ? "✓" : "⏳";
  const statusMessage = isApproved ? "Completed" : "Pending";

  return (
    <>
      <tr className="transaction-summary" onClick={toggleDetails}>
        <td>{transactionSymbol}</td>
        <td>{transactionAmount}</td>
        <td>{new Date(transaction.createdAt).toLocaleString()}</td>
        <td className={statusClass}>
          {statusIcon} {statusMessage}
        </td>
      </tr>
      {isOpen && (
        <tr className="transaction-details-row">
          <td colSpan="4">
            <div className="details-table">
              <p style={{ color: "black", fontSize: "14px" }}>
                <strong style={{ color: "black", fontSize: "14px" }}>
                  Amount:
                </strong>{" "}
                {transactionAmount} {transactionSymbol}
              </p>
              {/* {transaction.type === "send" && (
                <p>
                  <strong>Sent to:</strong> {transaction.address}
                </p>
              )} */}
              <p style={{ color: "black", fontSize: "14px" }}>
                <strong>Status:</strong> {statusIcon} {statusMessage}
              </p>
              {/* <p>
                <strong>Transaction Type:</strong> {transaction.type}
              </p> */}
              <p style={{ color: "black", fontSize: "14px" }}>
                <strong>Date:</strong>{" "}
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default TransactionSummary;
