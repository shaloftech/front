import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TransactionSummary from "./TransactionSummary";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./Transactions.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import { useTheme } from "../ThemeContext"; // Import ThemeContext for dark mode
import Header from "./Header";

const Transactions = () => {
  const [transactions, setTransactions] = useState({
    deposits: [],
    sends: [],
    conversions: [],
  });
  const [logos, setLogos] = useState({});
  const [selectedTab, setSelectedTab] = useState("deposits");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const uidd = localStorage.getItem("userId");
  const userId = localStorage.getItem("_id");
  const navigate = useNavigate();
  const sidebarRef = useRef();
  const [showLoginModal, setShowLoginModal] = useState(false); // State to manage login modal visibility
  const [showSignupModal, setShowSignupModal] = useState(false); // State to manage signup modal visibility
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to manage login status
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status
  const [showKycModal, setShowKycModal] = useState(false); // State to manage KYC modal visibility
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme(); // Access theme context
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default to USD
  const [exchangeRates, setExchangeRates] = useState({});
  const [email, setEmail] = useState(""); // State to hold the email
  const userrid = localStorage.getItem("userId");

  const id1 = localStorage.getItem("_id");
  const uid = localStorage.getItem("userId");

  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }
  }, []);
  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const response = await axios.get(
          `https://trustcoinfx.trade/api/users/${id1}`
        );
        setEmail(response.data.email);
      } catch (error) {
        console.error("Error fetching email:", error);
      }
    };

    if (uid) {
      fetchEmail();
    }
  }, [uid]);
  const handleNavigation = (route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      setShowLoginModal(true);
    }
  };
  useEffect(() => {
    // Check if the user is logged in by checking the localStorage for authToken
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setIsLoggedIn(true);
    }

    const fetchKycStatus = async () => {
      try {
        const response = await axios.get(
          `https://trustcoinfx.trade/api/kyc/${id1}`
        );
        setKycStatus(response.data.status);
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };

    if (uid) {
      fetchKycStatus();
    }
  }, [uid]);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!userId) {
        console.error("User ID is not available in localStorage");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://trustcoinfx.trade/api/transactions/${userId}`
        );
        if (response && response.data) {
          setTransactions(response.data);
        } else {
          console.error("No data returned from the API");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

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
            coin.symbol.toUpperCase()
          ] = `data:image/jpeg;base64,${imageResponse.data.image}`;
        }
        setLogos(logoMap);
      } catch (error) {
        console.error("Error fetching logos:", error);
      }
    };

    fetchLogos();
  }, []);
  const tableRef = useRef();

  const handleDownloadPDF = async () => {
    const input = tableRef.current;
    if (!input) return;

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("transactions_report.pdf");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
  };
  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("_id");
    localStorage.removeItem("userId");
    localStorage.removeItem("selectedCurrency");

    // Redirect to the login page
    navigate("/");
  };
  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmNewPassword } = e.target.elements;

    if (newPassword.value !== confirmNewPassword.value) {
      alert("New passwords do not match");
      return;
    }

    try {
      await axios.post("https://trustcoinfx.trade/api/change-password", {
        userId: uid, // Use the user ID from local storage
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      });
      setShowChangePasswordModal(false);
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password.");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderDeposits = () =>
    transactions.deposits.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <TransactionSummary
          transaction={transaction}
          logo={logos[transaction.selectedSymbol?.toUpperCase()]}
        />
      </li>
    ));

  // const renderKycStatus = () => {
  //   if (kycStatus === "approved") {
  //     return (
  //       <p className="kyc-status">
  //         Verified{" "}
  //         <i className="fas fa-check-circle" style={{ color: "white" }}></i>
  //       </p>
  //     );
  //   }
  //   return null;
  // };
  const renderKycStatus = () => {
    switch (kycStatus) {
      case "approved":
        return (
          <p className="header-text">
            Verified{" "}
            <i className="fas fa-check-circle" style={{ color: "green" }}></i>
          </p>
        );
      case "pending":
        return (
          <p className="header-text">
            KYC Pending{" "}
            <i
              className="fas fa-spinner fa-spin"
              style={{ color: "orange" }}
            ></i>
          </p>
        );
      case "rejected":
        return (
          <>
            <p className="header-text">
              KYC Rejected{" "}
              <i className="fas fa-times-circle" style={{ color: "red" }}></i>
            </p>
            <button
              onClick={() => setShowKycModal(true)}
              style={{
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                padding: "5px 10px",
                border: "none",
                cursor: "pointer",
                marginTop: "5px",
                borderRadius: "5px",
                fontSize: "12px",
              }}
            >
              Verify KYC
            </button>
          </>
        );
      default:
        return (
          <>
            <p className="header-text">
              Unverified{" "}
              <i className="fas fa-times-circle" style={{ color: "red" }}></i>
            </p>
            <button
              onClick={() => setShowKycModal(true)}
              style={{
                // backgroundColor: "var(--background-color)",
                color: "blue",
                borderBottom: "1px solid blue",
                // padding: "5px 10px",
                border: "none",
                cursor: "pointer",
                marginTop: "5px",

                fontSize: "12px",
              }}
            >
              Verify KYC
            </button>
          </>
        );
    }
  };

  const renderSends = () =>
    transactions.sends.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <TransactionSummary
          transaction={transaction}
          logo={logos[transaction.symbol?.toUpperCase()]}
        />
      </li>
    ));

  const renderConversions = () =>
    transactions.conversions.map((transaction) => (
      <li key={transaction._id} className="transaction-item">
        <TransactionSummary
          transaction={transaction}
          logo={logos[transaction.fromSymbol?.toUpperCase()]}
        />
      </li>
    ));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container1">
      <Header />
      <div className="main-content">
        {/* <div className="banner">
          <h2>Transaction History</h2>
          <p>
            Manage your deposits, withdraws<br></br> and conversions.
          </p>
        </div> */}
        <div className="button-group">
          <button
            className={`tab-button ${
              selectedTab === "deposits" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("deposits")}
          >
            Deposits
          </button>
          <button
            className={`tab-button ${selectedTab === "sends" ? "active" : ""}`}
            onClick={() => setSelectedTab("sends")}
          >
            Withdraws
          </button>
          <button
            className={`tab-button ${
              selectedTab === "conversions" ? "active" : ""
            }`}
            onClick={() => setSelectedTab("conversions")}
          >
            Conversions
          </button>
        </div>
      </div>{" "}
      <div className="transaction-container">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "16px",
          }}
        >
          <button
            onClick={handleDownloadPDF}
            style={{
              padding: "8px 16px",
              backgroundColor: "#1e1e1e",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Download PDF
          </button>
        </div>
        <div ref={tableRef}>
          <table className="transaction-table">
            <thead>
              <tr className="table-header">
                <th>Symbol</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions[selectedTab].length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    No {selectedTab} found for this user.
                  </td>
                </tr>
              ) : (
                transactions[selectedTab].map((tx) => (
                  <TransactionSummary
                    key={tx._id}
                    transaction={tx}
                    logo={
                      logos[
                        tx.selectedSymbol?.toUpperCase() ||
                          tx.symbol?.toUpperCase()
                      ]
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
