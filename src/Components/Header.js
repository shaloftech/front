import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Header.css";
import logo from "./logo10.png";
import CryptoTicker from "./CryptoTicker";
import { FaUserCircle } from "react-icons/fa"; // ✅ Import User Profile Icon
import { useRef } from "react"; // ✅ Import useRef at the top
import { useLocation } from "react-router-dom";
// import CryptoTable from "./CryptoTable";
import {
  FaHome,
  FaChartLine,
  FaDollarSign,
  FaStar,
  FaWallet,
  FaListAlt,
  FaExchangeAlt,
  FaEnvelope,
  FaTachometerAlt,
} from "react-icons/fa";
const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otp, setOtp] = useState("");
  const [userID, setUserID] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const profileRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const location = useLocation(); // Get the current route

  useEffect(() => {
    const storedUserID = localStorage.getItem("_id");
    const pathname = location.pathname;
    const isSignupReferral = pathname.startsWith("/signup/");
    const referralCode = pathname.split("/")[2];

    if (storedUserID) {
      setIsLoggedIn(true);
      setUserID(storedUserID);
    }

    if (!storedUserID) {
      if (isSignupReferral) {
        if (referralCode && referralCode.length >= 8) {
          setShowSignupModal(true); // ✅ Show signup modal only on valid referral
        } else {
          setError("Referral link invalid or expired.");
        }
      } else if (pathname !== "/") {
        setShowLoginModal(true);
        setError("Please login first.");
      }
    }
  }, [location.pathname]);

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        if (isConnecting) return; // Prevent multiple clicks
        setIsConnecting(true);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const userWalletAddress = accounts[0];

        setWalletAddress(userWalletAddress);
        setIsWalletConnected(true);
        localStorage.setItem("walletAddress", userWalletAddress);

        console.log("Wallet connected: ", userWalletAddress);
      } catch (error) {
        if (error.code === -32002) {
          console.warn("Wallet connection request is already pending.");
        } else {
          console.error("Error connecting wallet: ", error);
        }
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert(
        "No Ethereum wallet detected. Please install MetaMask or Trust Wallet."
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        !event.target.closest(".mobile-nav") &&
        !event.target.closest(".menu-icon")
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const openLoginModal = () => {
    setShowLoginModal(true);
    setShowSignupModal(false);
    setError("");
  };

  const openSignupModal = () => {
    setShowSignupModal(true);
    setShowLoginModal(false);
    setError("");
  };

  const closeModals = () => {
    setShowLoginModal(false);
    setShowSignupModal(false);
    setError("");
    setSuccessMessage("");
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      await axios.post("https://trustcoinfx.trade/api/verify/otp", {
        email,
        otp,
        password,
      });
      setSuccessMessage("Account verified successfully! You can now log in.");
      setShowOtpModal(false);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "https://trustcoinfx.trade/api/register/Signup",
        {
          email,
          password,
        }
      );
      const data = response.data;

      localStorage.setItem("authToken", data.authToken);
      localStorage.setItem("userId", data.userdata.userId);
      localStorage.setItem("_id", data.userdata._id);
      localStorage.setItem("walletAddress", data.userdata.walletAddress);
      // setMessage("Successfully logged in!");
      // setShowMessageModal(true);

      setIsLoggedIn(true);
      setUserID(response.data.userID);

      setSuccessMessage("Login successful!");
      setTimeout(() => {
        closeModals();
        window.location.reload();
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    const referralCode = location.pathname.startsWith("/signup/")
      ? location.pathname.split("/")[2]
      : null;

    if (!referralCode) {
      setError("Signup is allowed only via referral link.");
      return;
    }

    try {
      await axios.post("https://trustcoinfx.trade/api/register/createuser", {
        email,
        password,
        referralCode,
      });

      setSuccessMessage("OTP sent to your email.");
      setShowSignupModal(false);
      setShowOtpModal(true);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    setIsLoggedIn(false);
    setUserID("");
    window.location.reload();
  };

  return (
    <div>
      <CryptoTicker />
      <header className="header" style={{ marginTop: "25px" }}>
        <div className="logo1">
          <img style={{ height: "50px" }} src={logo} alt="TrustCoinFX Logo" />
        </div>

        {/* Mobile Navigation - Visible when `isOpen` is true */}
        {isMobile && (
          <div className="menu-icon" onClick={toggleMenu}>
            {isOpen ? "✖" : "☰"}
          </div>
        )}

        <div className={`mobile-nav ${isOpen ? "open" : ""}`}>
          <ul>
            {/* <div className="logo">
              <img src={logo} alt="TrustCoinFX Logo" />
            </div> */}

            <li style={{ marginTop: "100px" }}>
              <a
                href="/"
                style={{
                  display: "flex",

                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <FaHome style={{ marginRight: 8 }} /> Home
              </a>
            </li>
            <li>
              <a
                href="/trade"
                style={{
                  display: "flex",

                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                <FaChartLine style={{ marginRight: 8 }} /> Futures
              </a>
            </li>
            <li>
              <a
                href="/plan"
                style={{
                  display: "flex",

                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                <FaDollarSign style={{ marginRight: 8 }} /> Pricing
              </a>
            </li>
            <li>
              <a
                href="/feature"
                style={{
                  display: "flex",

                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                <FaStar style={{ marginRight: 8 }} /> Features
              </a>
            </li>
            <li>
              <a
                href="/wallet"
                style={{
                  display: "flex",

                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                <FaWallet style={{ marginRight: 8 }} /> Wallet
              </a>
            </li>
            <li>
              <a
                href="/result"
                style={{
                  display: "flex",

                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                <FaListAlt style={{ marginRight: 8 }} /> Result
              </a>
            </li>
            <li>
              <a
                href="/transaction"
                style={{
                  display: "flex",

                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                <FaExchangeAlt style={{ marginRight: 8 }} /> Transactions
              </a>
            </li>
            <li>
              <a
                href="/userDashboard"
                style={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                }}
              >
                <FaTachometerAlt style={{ marginRight: 8 }} /> Dashboard
              </a>
            </li>

            <li>
              <a
                href="/contactwithus"
                style={{
                  display: "flex",

                  textAlign: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                <FaEnvelope style={{ marginRight: 8 }} /> Contact
              </a>
            </li>

            {/* <li>
              <a
                href="/contactwithus"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                Contact
              </a>
            </li> */}
            {/* ✅ If Logged In, Show "Connect Wallet" & "Logout" inside mobile menu */}
            {isLoggedIn ? (
              <>
                <li>
                  <button
                    className="connect-wallet mobile-wallet"
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </button>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              /* ✅ If Not Logged In, Show "Login" Button */
              <li>
                <button
                  style={{
                    marginTop: "60px",
                    width: "100px",
                    height: "40px",
                    color: "white",
                    border: "1px solid white",
                    borderRadius: "10px",
                  }}
                  onClick={() => setShowLoginModal(true)}
                >
                  Login
                </button>
              </li>
            )}
          </ul>
        </div>

        <nav className="navigation desktop-nav">
          <ul>
            <li>
              <a href="/">Home</a>
            </li>
            <li>
              <a
                href="/trade"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                Futures
              </a>
            </li>
            <li>
              <a
                href="/plan"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                Investment & Staking
              </a>
            </li>
            <li>
              <a
                href="/feature"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="/wallet"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                Wallet
              </a>
            </li>
            <li>
              <a
                href="/contactwithus"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                Contact
              </a>
            </li>
            <li>
              <a
                href="/historyInvestment"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                Investment History
              </a>
            </li>
            <li>
              <a
                href="/transaction"
                onClick={(e) => {
                  if (!isLoggedIn) {
                    e.preventDefault();
                    setShowLoginModal(true);
                    setError("Please login first");
                  }
                }}
              >
                Transactions
              </a>
            </li>
          </ul>
        </nav>

        {/* ✅ Show Profile Icon if Logged In, Else Show Connect Wallet Button */}
        {/* ✅ If Logged In, Show Profile Icon, Else Show "Login" Button */}
        {/* ✅ Show Profile Icon on PC View Only */}
        {!isLoggedIn && !isMobile ? (
          <button
            style={{
              width: "120px",
              height: "40px",
              color: "white",
              border: "1px solid white",
              borderRadius: "10px",
            }}
            onClick={() => setShowLoginModal(true)}
          >
            Login
          </button>
        ) : (
          !isMobile && (
            <div className="profile-container">
              <FaUserCircle
                className="profile-icon"
                onClick={() => setShowProfileModal(!showProfileModal)}
              />
              {showProfileModal && (
                <div className="profile-modal" ref={profileRef}>
                  {isWalletConnected ? (
                    <div className="wallet-info">
                      <span className="wallet-address">
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                      </span>
                    </div>
                  ) : (
                    <button
                      className="connect-wallet desktop-wallet"
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                    >
                      {isConnecting ? "Connecting..." : "Connect to Wallet"}
                    </button>
                  )}
                  <button className="logout-btn" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )
        )}
      </header>

      {showLoginModal && (
        <div className="modal-login">
          <div className="modal-content1">
            <span className="close" onClick={closeModals}>
              &times;
            </span>
            <h2>Login</h2>
            {error && <p className="error-text">{error}</p>}
            {successMessage && <p className="success-text">{successMessage}</p>}
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="modal-btn" type="submit">
                Login
              </button>
            </form>
            <p className="switch-text">
              Don't have an account?{" "}
              <span onClick={openSignupModal}>Sign Up</span>
            </p>
          </div>
        </div>
      )}

      {showSignupModal && (
        <div className="modal-login">
          <div className="modal-content1">
            <span className="close" onClick={closeModals}>
              &times;
            </span>
            <h2>Sign Up</h2>
            {error && <p className="error-text">{error}</p>}
            {successMessage && <p className="success-text">{successMessage}</p>}
            <form onSubmit={handleSignup}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button className="modal-btn" type="submit">
                Sign Up
              </button>
            </form>
            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={openLoginModal}>Login</span>
            </p>
          </div>
        </div>
      )}

      {showOtpModal && (
        <div className="modal-login">
          <div className="modal-content1">
            <h2>Enter OTP</h2>
            <form onSubmit={handleVerifyOTP}>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button className="modal-btn" type="submit">
                Verify
              </button>
            </form>
            {error && <p className="error-text">{error}</p>}
            {successMessage && <p className="success-text">{successMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
