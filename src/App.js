import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

import Main1 from "./Components/Main1";
// import Details from "./Components/CoinDetails/Graph";
// import Buy from "./Components/Market";
import "./App.css";
// import LoginModal from "./Components/LoginModal";
// import Nav from "./Components/Nav";
// import Signup from "./Components/Signup";
// import PredictionForm from "./Components/PredictionForm";
// import Trade from "./Components/Trade";
// import Result from "./Components/Result";
import AdminDashboard from "./Admin/AdminDashboard";
import AdminTradeControl from "./Admin/AdminTradeControl";
// import WalletDashboard from "./wallet/WalletDashboard";
import AdminDepositApproval from "./Admin/AdminDepositApproval";
import AdminSendApproval from "./Admin/AdminSendApproval";
// import TradePage from "./Components/TradePage";
// import PredictionDetails from "./Components/PredictionDetails";
// import Settings from "./Components/Settings";
// import Terms from "./Components/Terms";
// import Transactions from "./Components/Transactions";
// import TransactionDetails from "./Components/TransactionDetails";
// import AdminKyc from "./Components/AdminKyc";
import { ThemeProvider } from "./ThemeContext"; // Import ThemeProvider
import LoginAgent from "./Agent/LoginAgent";
import SignupAgent from "./Agent/SignupAgent";
import AdminAgentApproval from "./Admin/AdminAgentApproval";
// import ProfitStatistics from "./Components/ProfitStatistics";
import AgentDashboard from "./Agent/AgentDashboard";
// import HelpLoan from "./Components/HelpLoan";
// import ContactUs from "./Components/ContactUs";
import MasterAdminDashboard from "./MasterAdmin/MasterAdminDashboard";
import AdminLogin from "./Admin/AdminLogin";
import AdminSignup from "./Admin/AdminSignup";
import PrivateRouteAdmin from "./Admin/PrivateRouteAdmin"; // Import the PrivateRoute component
import PrivateRouteAgent from "./Agent/PrivateRouteAgent";
import PrivateRouteMasterAdmin from "./MasterAdmin/PrivateRouteMasterAdmin";
import MasterAdminLogin from "./MasterAdmin/MasterAdminLogin";
import MasterAdminSignup from "./MasterAdmin/MasterAdminSignup";
import UserDashboard from "./Components/UserDashboard";
// import ClientContact from "./Components/ClientContact";
// import { FooterProvider } from "./Components/FooterContext";
// import WalletReceive from "./wallet/WalletReceive";
// import WalletSend from "./wallet/WalletSend";
import AdminInfoWallet from "./Admin/AdminInfoWallet";
// import ChatUs from "./Components/ChatUs";
import TradePage from "./Components/TradePage"; // Trade Page
import PlanPage from "./Components/PlanPage"; // Trade Page
import FeaturePage from "./Components/FeaturePage"; // Trade Page
import WalletDashboard from "./Components/WalletDashboard";
import TradingDashboard from "./Components/TradingDashboard";
import CryptoNews from "./Components/CryptoNews";
import PredictionDetails from "./Components/PredictionDetails";
import PredictionSummary from "./Components/PredictionSummary";
import Result from "./Components/Result";
import Transactions from "./Components/Transactions";
import TransactionDetails from "./Components/TransactionDetails";
import TermsAndConditions from "./Components/TermsAndConditions";
// import ChatUs from "./Components/ContactUs";
import ContactUs from "./Components/ContactUs";
import InvestmentHistory from "./Components/InvestmentHistory";
import WalletDashboard1 from "./Components/WalletDashboard1";
const AppContent = () => {
  const [open, setOpen] = useState(false);
  const [opensign, setOpensign] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isWalletReady, setIsWalletReady] = useState(false);

  const location = useLocation();
  const pathsWithNav = [
    "/dashboard",
    "/transactionSell",
    "/coin",
    "/market",
    "/tradeCoin",
    "/dashboard",
    "/profileUpdate",
  ];

  const adminPaths = [
    "/tnega12-dashboard",
    "/masternimda21",
    "/nimda21",
    "/masteradminlogin",
    "/masteradminsignup",
    "/agentLogin",
    "/agentSignup",
    "/admin/signup",
    "/admin/login",
    "/",
  ]; // Add paths that should bypass wallet connection

  const walletProviders = {
    isTrust: "Trust Wallet",
    isMetaMask: "MetaMask",
    isCoinbaseWallet: "Coinbase Wallet",
    isPhantom: "Phantom",
    isArgent: "Argent",
    isZerion: "Zerion Wallet",
    isLedger: "Ledger",
    isRainbow: "Rainbow Wallet",
    isKeplr: "Keplr",
    isExodus: "Exodus Wallet",
  };
  // <Route path="/signup/:referralCode" element={<Main1 />} />;

  const handleConnectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        console.log("Wallet connected successfully!");
        setIsWalletConnected(true);
      } catch (error) {
        console.error("Error connecting to wallet:", error);
        setIsWalletConnected(false);
      }
    } else {
      console.error("No wallet detected.");
      setIsWalletConnected(false);
    }
  };

  useEffect(() => {
    // Skip wallet checks for admin paths
    if (adminPaths.some((path) => location.pathname.startsWith(path))) {
      setIsWalletReady(true);
      return;
    }

    const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);

    const checkWalletEnvironment = async () => {
      if (typeof window.ethereum !== "undefined") {
        const detectedWallet = Object.keys(walletProviders).find(
          (key) => window.ethereum[key]
        );

        if (detectedWallet) {
          console.log(
            `${walletProviders[detectedWallet]} detected. Proceeding...`
          );
          await handleConnectWallet();
          setIsWalletReady(true);
        } else {
          console.log("No specific Web3 wallet detected. Proceeding...");
          setIsWalletReady(true);
        }
      } else if (mobileCheck) {
        console.log("Redirecting to Trust Wallet mobile app...");
        setTimeout(() => {
          window.location.href = "https://trustwallet.com/download";
        }, 10000);
      } else {
        console.log("No Web3 wallet detected. Redirecting to Trust Wallet...");
        setTimeout(() => {
          window.location.href = "https://trustwallet.com/browser-extension";
        }, 10000);
      }
    };

    checkWalletEnvironment();
  }, [location.pathname]);

  if (
    !isWalletReady &&
    !adminPaths.some((path) => location.pathname.startsWith(path))
  ) {
    return <div>Loading...</div>;
  }

  if (
    !isWalletConnected &&
    !adminPaths.some((path) => location.pathname.startsWith(path))
  ) {
    return <div>Checking wallet connection...</div>;
  }
  return (
    <>
      {/* {open && <LoginModal closemod={[setOpen, setOpensign]} />} */}
      {/* {opensign && <Signup closemod={[setOpen, setOpensign]} />} */}

      <div>
        <Routes>
          <Route path="/userDashboard" element={<UserDashboard />} />
          <Route path="/" element={<Main1 />} />
          <Route path="/signup/:referralCode" element={<Main1 />} />
          <Route path="/trade" element={<TradingDashboard />} />{" "}
          {/* Trade Page */}
          <Route path="/plan" element={<PlanPage />} /> {/* Plan Page */}
          <Route path="/feature" element={<FeaturePage />} /> {/* Plan Page */}
          <Route path="/wallet" element={<WalletDashboard />} />{" "}
          {/* <Route exact path="/wallet" element={<WalletDashboard />} /> */}
          {/* <Route
            exact
            path="/coin"
            element={<Details open={[setOpen, setOpensign]} />}
          /> */}
          {/* <Route
            exact
            path="/tradeCoin"
            element={<Details open={[setOpen, setOpensign]} />}
          /> */}
          {/* <Route exact path="/market" element={<Buy />} /> */}
          {/* <Route exact path="/trades" element={<PredictionForm />} /> */}
          {/* <Route exact path="/trade" element={<Trade />} /> */}
          {/* <Route exact path="/result" element={<Result />} /> */}
          <Route
            path="/nimda21/*"
            element={
              <PrivateRouteAdmin>
                <AdminDashboard />
              </PrivateRouteAdmin>
            }
          />{" "}
          {/* <Route path="/tradepage" element={<TradePage />} /> */}
          <Route path="/tradeControl" element={<AdminTradeControl />} />
          <Route path="/viewRequests" element={<AdminDepositApproval />} />
          <Route path="/viewSend" element={<AdminSendApproval />} />
          {/* <Route path="/tradingPage" element={<TradingDashboard />} /> */}
          <Route
            exact
            path="/prediction/:predictionId"
            element={<PredictionDetails />}
          />
          <Route exact path="/transaction" element={<Transactions />} />
          <Route
            path="/transaction/:transactionId"
            element={<TransactionDetails />}
          />{" "}
          <Route
            exact
            path="/historyInvestment"
            element={<InvestmentHistory />}
          />
          {/* <Route path="/settings" element={<Settings />} /> */}
          {/* <Route path="/terms" element={<Terms />} /> */}
          {/* <Route path="/transaction" element={<Transactions />} /> */}
          {/* <Route path="/profit-stats" element={<ProfitStatistics />} /> */}
          {/* <Route path="/helpLoan" element={<HelpLoan />} /> */}
          {/* <Route path="/contactUs" element={<ContactUs />} /> */}
          {/* <Route path="/chatUs" element={<ChatUs />} /> */}
          {/* <Route path="/adminKyc" element={<AdminKyc />} /> */}
          <Route path="/agentLogin" element={<LoginAgent />} />
          <Route path="/walletss" element={<WalletDashboard1 />} />
          <Route path="/agentSignup" element={<SignupAgent />} />
          {/* <Route path="/walletSend" element={<WalletSend />} /> */}
          {/* <Route path="/walletReceive" element={<WalletReceive />} /> */}
          <Route path="/adminInfoWallet" element={<AdminInfoWallet />} />
          <Route path="/tnega12-dashboard/*" element={<PrivateRouteAgent />}>
            <Route path="*" element={<AgentDashboard />} />
          </Route>{" "}
          <Route
            path="/masternimda21/*"
            element={
              <PrivateRouteMasterAdmin>
                <MasterAdminDashboard />
              </PrivateRouteMasterAdmin>
            }
          />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="/result" element={<Result />} />
          <Route path="/masteradminlogin" element={<MasterAdminLogin />} />
          <Route path="/masteradminsignup" element={<MasterAdminSignup />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/cryptonews" element={<CryptoNews />} />
          <Route path="/contactwithus" element={<ContactUs />} />
          <Route
            path="/admin/agent/approval"
            element={<AdminAgentApproval />}
          />
          {/* <Route
            exact
            path="/prediction/:predictionId"
            element={<PredictionDetails />}
          /> */}
          {/* <Route
            path="/transaction/:transactionId"
            element={<TransactionDetails />}
          />{" "} */}
          {/* <Route path="/contactus1/" element={<ClientContact />} /> */}
        </Routes>
      </div>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* <FooterProvider> */}
        <AppContent />
        {/* </FooterProvider> */}
      </Router>
    </ThemeProvider>
  );
}

export default App;
