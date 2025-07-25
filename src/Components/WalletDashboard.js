import React, { useEffect, useState, useRef, useId } from "react";
import axios from "axios";
import "./WalletDashboard.css"; // Import the CSS file for styling
import QRCode from "react-qr-code";
// import image from "./qr.png";
import { Link, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
// import logo3 from "../Components/logo3.png";
// import Login from "../Components/Login";
// import SignupModal from "../Components/SignupModal";
// import walletInfos from "./wallet-info.json"; // Make sure the path is correct
import Header from "./Header";
// import Sidebar from "../Components/Sidebar";
// import Footer from "../Components/Footer";
// import { Sparklines, SparklinesLine } from "react-sparklines";
import usdt from "./USDT.png";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import InvestmentHistory1 from "./InvestmentHistory1";
import Result from "./Result.jsx";
import Footer from "./Footer.js";
// REGISTER elements
ChartJS.register(ArcElement, Tooltip, Legend);

const WalletDashboard = () => {
  const [walletData, setWalletData] = useState(null);
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSymbol, setSelectedSymbol] = useState("BTC");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedTab, setSelectedTab] = useState("Receive");
  const [amount, setAmount] = useState("");
  const [usdtValue, setUsdtValue] = useState("");
  const [address, setAddress] = useState("");
  const [address1, setAddress1] = useState("");
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferModalU, setShowTransferModalU] = useState(false);
  const [isReceiveFlow, setIsReceiveFlow] = useState(false);
  // inside WalletDashboard():
  const [childAddresses, setChildAddresses] = useState({});
  const [walletInfo, setWalletInfo] = useState({
    walletAddress: "",
    qrCodeUrl: "",
  });
  // const [isLoadingWalletInfo, setIsLoadingWalletInfo] = useState(true);
  const [summary, setSummary] = useState({});
  const [totalUsd, setTotalUsd] = useState(0);
  const [info, setInfo] = useState([]);
  const [mainBalance, setMainBalance] = useState(0);
  const [futuresBalance, setFuturesBalance] = useState(0);
  const [stakeBalance, setStakeBalance] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const [proof, setProof] = useState(null);
  const userId = localStorage.getItem("_id");
  const uid = localStorage.getItem("userId");
  const uid11 = localStorage.getItem("_id");
  const [frozenAmounts, setFrozenAmounts] = useState({});
  // const [currencySymbols, setCurrencySymbols] = useState({});
  const [activeWalletTab, setActiveWalletTab] = useState("overview"); // or 'futures', 'stake'
  const [showsend, setshowsend] = useState(false);

  const navigate = useNavigate();

  const [isSendFlow, setIsSendFlow] = useState(false);

  const sidebarRef = useRef();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usdDepositAmount, setUsdDepositAmount] = useState("");
  const [cryptoDepositAmount, setCryptoDepositAmount] = useState("");
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalIconColor, setModalIconColor] = useState("green");
  const [redirectAfterModal, setRedirectAfterModal] = useState(false);
  const [kycStatus, setKycStatus] = useState(""); // State to manage KYC status
  const id1 = localStorage.getItem("_id");
  // const [walletInfo, setWalletInfo] = useState(null);
  const [isLoadingWalletInfo, setIsLoadingWalletInfo] = useState(true);
  const [isLoadingRecharge, setIsLoadingRecharge] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [totalUsdBalance, setTotalUsdBalance] = useState(0);
  const [exchangeRates, setExchangeRates] = useState({});
  // const [investedAmount, setInvestedAmount] = useState(0);
  const [activeMainTab, setActiveMainTab] = useState("overview");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferTarget, setTransferTarget] = useState("futures");
  const [frozenStake, setFrozenStake] = useState(0);

  // useEffect(() => {
  //   const fetchInvestedAmount = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://trustcoinfx.trade/api/investment/${id1}`
  //       );
  //       console.log(response);

  //       setInvestedAmount(response.data.investedAmount || 0);
  //       console.log(investedAmount);
  //     } catch (error) {
  //       console.error("Error fetching invested amount:", error);
  //     }
  //   };

  //   if (userId) fetchInvestedAmount();
  // }, [userId]);

  // useEffect(() => {
  //   const fetchCryptoCharts = async () => {
  //     try {
  //       const chartData = {};

  //       for (const crypto of walletInfos) {
  //         let symbol = crypto.symbol.toLowerCase();

  //         // Auto format: Replace spaces with dashes
  //         symbol = symbol.replace(/\s+/g, "-");

  //         console.log("Fetching:", symbol);

  //         try {
  //           const res = await axios.get(
  //             `https://pro-api.coingecko.com/api/v3/coins/${symbol}/market_chart`,
  //             {
  //               params: {
  //                 vs_currency: "usd",
  //                 days: "7",
  //               },
  //               headers: {
  //                 "X-Cg-Pro-Api-Key": "CG-abdEKxm7HXgBnnG2D2eexnmq",
  //               },
  //             }
  //           );

  //           chartData[symbol] = res.data.prices.map((p) => p[1]);
  //         } catch (err) {
  //           console.warn(
  //             `⚠️ Failed fetching for symbol: ${symbol}`,
  //             err?.response?.data?.error || err.message
  //           );
  //         }
  //       }

  //       setCryptoCharts(chartData);
  //     } catch (error) {
  //       console.error("❌ General error fetching crypto chart data:", error);
  //     }
  //   };

  //   fetchCryptoCharts();
  // }, []);

  const symbolToFullNameMap = {
    btc: "bitcoin",
    eth: "ethereum",
    usdt: "tether",
    xrp: "ripple",
    ada: "cardano",
    toncoin: "the-open-network",
    trx: "tron",
    avax: "avalanche-2",
    bch: "bitcoin-cash",
    dot: "polkadot",
    ltc: "litecoin",
    shib: "shiba-inu",
    sol: "solana",
    steth: "lido-staked-ether",
    wbtc: "wrapped-bitcoin",
    link: "chainlink",
    leo: "leo-token",
    wsteth: "wrapped-steth",
  };

  const [wallet, setWallet] = useState(null);
  const [price, setPrices] = useState({});
  const [usdBalance, setUsdBalance] = useState(0);
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  // const toggleBalanceVisibility = () => {
  //   setIsBalanceVisible((prevState) => !prevState);
  // };
  // const [modalIconColor, setModalIconColor] = useState("green");
  // const [modalMessage, setModalMessage] = useState("");
  const [walletLogos, setWalletLogos] = useState({});
  const [rechargeSuccessMessage, setRechargeSuccessMessage] = useState(""); // New state
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default to USD
  const formattedBalance = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(totalUsdBalance * (exchangeRates[selectedCurrency] || 1));
  // src/WalletDashboard.js
  // useEffect(() => {
  //   const fetchAll = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `https://trustcoinfx.trade/api/user/${userId}/wallet`
  //       );
  //       // data.balances includes ETH, BNB, BTC, SOL, TRON, **future**, **stake**
  //       setWalletData({ balances: data.balances, prices: data.prices });
  //       setFuturesBalance(data.balances.future || 0);
  //       setStakeBalance(data.balances.stake || 0);
  //       setTotalUsdBalance(
  //         Object.entries(data.balances)
  //           .filter(([sym]) => sym !== "future" && sym !== "stake")
  //           .reduce(
  //             (sum, [sym, amt]) => sum + (data.prices[sym]?.usd || 0) * amt,
  //             0
  //           )
  //       );
  //     } catch (e) {
  //       console.error("couldn't fetch combined wallet data", e);
  //     }
  //   };
  //   if (userId) fetchAll();
  // }, [userId]);

  const overallTotalBalance = totalUsdBalance + futuresBalance + stakeBalance;

  // const [walletInfo, setWalletInfo] = useState({
  //   qrCodeUrl: "",
  //   walletAddress: "",
  // });

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCryptos, setFilteredCryptos] = useState([]);
  const [primaryWallets, setPrimaryWallets] = useState([]);
  const [secondaryWallets, setSecondaryWallets] = useState([]);
  const cryptoShortNames = {
    BITCOIN: "BTC",
    ETHEREUM: "ETH",
    TETHER: "USDT",
    BINANCECOIN: "BNB",
    SOLANA: "SOL",
    "USD-COIN": "USDC",
    XRP: "XRP",
    "LIDO STAKED ETHER": "STETH",
    DOGECOIN: "DOGE",
    CARDANO: "ADA",
    TRON: "TRX",
    TONCOIN: "TON",
    "WRAPPED STETH": "WSTETH",
    AVALANCHE: "AVAX",
    "WRAPPED BITCOIN": "WBTC",
    "SHIBA INU": "SHIB",
    WETH: "WETH",
    POLKADOT: "DOT",
    CHAINLINK: "LINK",
    "BITCOIN CASH": "BCH",
    "LEO TOKEN": "LEO",
    "NEAR PROTOCOL": "NEAR",
    LITECOIN: "LTC",
    DAI: "DAI",
    UNISWAP: "UNI",
    "WRAPPED EETH": "WEETH",
    KASPA: "KAS",
    POLYGON: "MATIC",
    "INTERNET COMPUTER": "ICP",
    APTOS: "APT",
    PEPE: "PEPE",
    MONERO: "XMR",
    "ETHENA USDE": "USDE",
    // Add other mappings as needed
  };
  // at the bottom of your useEffects
  useEffect(() => {
    if (!uid) return;
    setIsLoading(true);
    axios
      .get(`https://trustcoinfx.trade/api/user/${uid}/wallet-summary`)
      .then(({ data }) => {
        setSummary(data.summary);
        setTotalUsd(data.totalUsd);
        setPrimaryWallets(Object.keys(data.summary));
        setFuturesBalance(data.summary.future.balance);
        setStakeBalance(data.summary.stake.balance);
      })
      .catch((err) => {
        console.error("Failed to fetch wallet summary:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [uid]);

  // inside WalletDashboard component
  const handleTransfer = async () => {
    const amt = parseFloat(transferAmount);
    if (isNaN(amt) || amt <= 0) {
      alert("Enter a valid USDT amount.");
      return;
    }

    // 1) Check local main balance
    const mainBal = walletData.balances.USDT || 0;
    if (mainBal < amt) {
      alert("Insufficient USDT in main wallet.");
      return;
    }

    try {
      // 2) POST to backend
      const resp = await axios.post(
        "https://trustcoinfx.trade/api/wallet/transfer-usdt",
        {
          userId,
          amount: amt,
          targetWallet: transferTarget,
        }
      );

      // 3) Update local state with new balances
      const newBalances = resp.data.balances;
      setWalletData((prev) => ({
        ...prev,
        balances: newBalances,
      }));
      setFuturesBalance(newBalances.future || 0);
      setStakeBalance(newBalances.stake || 0);

      alert(resp.data.message);
      setTransferAmount("");
      setShowTransferModal(false);
    } catch (err) {
      console.error("Transfer failed:", err);
      alert(
        err.response?.data?.message ||
          "Transfer failed. Check console for details."
      );
    }
  };

  const transferFromFutures = async (amount) => {
    try {
      await axios.post("https://trustcoinfx.trade/api/wallet/futures-to-main", {
        userId: id1,
        amount,
      });
      alert(`Transferred ${amount} USDT from Futures to Main`);
    } catch (err) {
      console.error("Futures transfer failed:", err);
      alert("Transfer failed");
    }
  };

  const transferFromStake = async (amount) => {
    console.log("🏃‍♂️ transferFromStake called with:", amount, "userId:", id1);
    try {
      const resp = await axios.post(
        "https://trustcoinfx.trade/api/wallet/stake-to-main",
        { userId: id1, amount }
      );
      console.log("✅ stake-to-main response:", resp.data);
      alert(`Transferred ${amount} USDT from Stake to Main`);
    } catch (err) {
      console.error(
        "Stake transfer failed:",
        err.response?.data || err.message
      );
      alert("Transfer failed: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    async function loadAddresses() {
      const res = await axios.get(
        `https://trustcoinfx.trade/api/wallet/${userId}/child-addresses`
      );
      const lower = Object.fromEntries(
        Object.entries(res.data.addresses || {}).map(([sym, arr]) => [
          sym.toLowerCase(),
          arr,
        ])
      );
      console.log(lower);

      setChildAddresses(lower);
      // console.log(childAddresses);

      setIsLoadingWalletInfo(false);
    }
    setIsLoadingWalletInfo(true);
    if (userId) loadAddresses();
  }, [userId]);
  // useEffect(() => {
  //   console.log("🚀 childAddresses is now:", childAddresses);
  // }, [childAddresses]);

  // useEffect(() => {
  //   const fetchWalletInfo = async () => {
  //     try {
  //       const response = await axios.get("https://trustcoinfx.trade/api/wallet-info");
  //       const walletInfos = response.data;

  //       // Separate primary and secondary wallets
  //       const primarySymbols = walletInfos.map((info) =>
  //         info.symbol.toLowerCase()
  //       );
  //       const primary = Object.keys(walletData.balances).filter((symbol) =>
  //         primarySymbols.includes(symbol)
  //       );
  //       const secondary = Object.keys(walletData.balances).filter(
  //         (symbol) => !primarySymbols.includes(symbol)
  //       );

  //       setPrimaryWallets(primary);
  //       setSecondaryWallets(secondary);
  //     } catch (error) {
  //       console.error("Error fetching wallet info:", error);
  //     }
  //   };

  //   fetchWalletInfo();
  // }, [walletData]);
  const toggleBalanceVisibility = () => {
    setIsBalanceVisible((prevState) => !prevState);
  };
  // useEffect(() => {
  //   const fetchExchangeRates = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://api.exchangerate-api.com/v4/latest/USD"
  //       );
  //       setExchangeRates(response.data.rates);
  //     } catch (error) {
  //       console.error("Error fetching exchange rates:", error);
  //     }
  //   };

  //   fetchExchangeRates();
  // }, []);
  const handleNavigation = (route) => {
    if (isLoggedIn) {
      navigate(route);
    } else {
      setShowLoginModal(true);
    }
  };
  // useEffect(() => {
  //   const fetchWalletAndPrices = async () => {
  //     try {
  //       const resp = await axios.get(
  //         `https://trustcoinfx.trade/api/user/${userId}/wallet`
  //       );
  //       const { balances, prices, addresses } = resp.data;

  //       // 1) normalize address keys to lowercase:
  //       const lowerAddrs = Object.fromEntries(
  //         Object.entries(addresses).map(([chain, arr]) => [
  //           chain.toLowerCase(),
  //           arr,
  //         ])
  //       );

  //       setWalletData({ balances, prices });
  //       setTotalUsdBalance(
  //         Object.entries(balances).reduce(
  //           (sum, [sym, amt]) =>
  //             sum + (prices[sym.toLowerCase()]?.usd || 0) * amt,
  //           0
  //         )
  //       );
  //       // setChildAddresses(lowerAddrs); // ← store normalized child wallet addresses
  //       setIsLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching combined wallet info:", error);
  //       setIsLoading(false);
  //     }
  //   };

  //   if (userId) fetchWalletAndPrices();
  // }, [userId]);

  // useEffect(() => {
  //   const fetchCurrencySymbols = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://api.exchangerate.host/symbols"
  //       );
  //       console.log("Response from symbols API:", response.data);

  //       if (response.data && response.data.symbols) {
  //         const symbols = response.data.symbols;
  //         const formattedSymbols = Object.keys(symbols).reduce((acc, key) => {
  //           acc[key] = symbols[key].description; // Example: "USD": "Dollar"
  //           return acc;
  //         }, {});
  //         setCurrencySymbols(formattedSymbols);
  //       } else {
  //         console.error(
  //           "Symbols data is missing in API response. Using fallback."
  //         );
  //         setCurrencySymbols({
  //           USD: "$",
  //           EUR: "€",
  //           GBP: "£",
  //           JPY: "¥",
  //           AUD: "A$",
  //           CAD: "C$",
  //         }); // Add more as needed
  //       }
  //     } catch (error) {
  //       console.error("Error fetching currency symbols:", error);
  //       setCurrencySymbols({
  //         USD: "$",
  //         EUR: "€",
  //         GBP: "£",
  //         JPY: "¥",
  //         AUD: "A$",
  //         CAD: "C$",
  //       }); // Use fallback
  //     }
  //   };

  //   fetchCurrencySymbols();
  // }, []);
  useEffect(() => {
    if (activeWalletTab !== "overview" || !uid) return;

    setIsLoading(true);
    axios
      .get(`https://trustcoinfx.trade/api/user/${uid}/wallet-summary`)
      .then(({ data }) => {
        setSummary(data.summary);
        setTotalUsd(data.totalUsd);
      })
      .catch((err) => {
        console.error("Failed to fetch wallet summary:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [activeWalletTab, userId]);
  useEffect(() => {
    const fetchTotalBalance = async () => {
      const uid = localStorage.getItem("userId");
      if (uid) {
        try {
          const response = await axios.get(
            `https://trustcoinfx.trade/api/wallet/${uid}/total-balance`
          );
          const totalBalance = response.data.totalUsdBalance;
          setUsdBalance(totalBalance || 0); // Fallback to 0 if response is invalid
        } catch (error) {
          console.error("Error fetching total balance:", error);
          setUsdBalance(0); // Set fallback on error
        }
      }
    };
    fetchTotalBalance();
  }, []);
  // useEffect(() => {
  //   const savedCurrency = localStorage.getItem("selectedCurrency");
  //   if (savedCurrency) {
  //     setSelectedCurrency(savedCurrency);
  //   }
  // }, []);
  const handleCurrencyChange = (e) => {
    const newCurrency = e.target.value;
    setSelectedCurrency(newCurrency);
    localStorage.setItem("selectedCurrency", newCurrency);
  };
  // useEffect(() => {
  //   if (!walletData) return;

  //   // Grab every symbol the user actually holds
  //   const symbols = Object.keys(walletData.balances);
  //   setPrimaryWallets(symbols);
  // }, [walletData]);

  // const fetchFrozenAmounts = async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://trustcoinfx.trade/api/frozen/${userId}`
  //     );
  //     const frozenData = response.data.reduce((acc, item) => {
  //       acc[item.symbol.toLowerCase()] = item.amount; // Ensure symbols are lowercase
  //       return acc;
  //     }, {});
  //     console.log(frozenData); // Debug to check the data structure
  //     setFrozenAmounts(frozenData);
  //   } catch (error) {
  //     console.error("Error fetching frozen amounts:", error);
  //   }
  // };

  // useEffect(() => {
  //   const fetchWalletInfo = async () => {
  //     try {
  //       const symbol =
  //         selectedSymbol === "usd" ? "TETHER" : selectedSymbol.toUpperCase();
  //       const response = await axios.get(
  //         `https://trustcoinfx.trade/api/wallet-info/${symbol}`
  //       );
  //       setWalletInfo(response.data);
  //       setIsLoadingWalletInfo(false);
  //     } catch (error) {
  //       console.error("Error fetching wallet info:", error);
  //       setIsLoadingWalletInfo(false);
  //     }
  //   };

  //   fetchWalletInfo();
  // }, [selectedSymbol]);
  // useEffect(() => {
  //   const fetchWalletInfo = async () => {
  //     try {
  //       let symbol = selectedSymbol.toUpperCase();

  //       // Handle USDT (Tether) wallet info
  //       if (symbol === "USDT") {
  //         symbol = "TETHER"; // Use the actual identifier for Tether
  //       }

  //       const response = await axios.get(
  //         `https://trustcoinfx.trade/api/wallet-info/${symbol}`
  //       );

  //       setWalletInfo(response.data);
  //       setIsLoadingWalletInfo(false);
  //     } catch (error) {
  //       console.error("Error fetching wallet info:", error);
  //       setIsLoadingWalletInfo(false);
  //     }
  //   };

  //   fetchWalletInfo();
  // }, [selectedSymbol]);
  useEffect(() => {
    if (!selectedSymbol || !childAddresses) return;

    // Normalize USDT → tether if your backend uses that key
    let key = selectedSymbol.toLowerCase();
    if (key === "usdt") key = "tether";

    // Grab the first address (or an empty string)
    const addrArray = childAddresses[key] || [];
    const walletAddress = addrArray[0] || "";

    // If you want a QR code, generate it on the fly
    const qrCodeUrl = walletAddress
      ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
          walletAddress
        )}`
      : "";

    setWalletInfo({ walletAddress, qrCodeUrl });
    setIsLoadingWalletInfo(false);
  }, [selectedSymbol, childAddresses]);

  const cryptoFullNames = {
    BTC: "Bitcoin",
    ETH: "Ethereum",
    USDT: "Tether",
    BNB: "Binance Coin",
    SOL: "Solana",
    USDC: "USD Coin",
    ADA: "Cardano",
    TRX: "Tron",
    DOT: "Polkadot",
    LINK: "Chainlink",
    LTC: "Litecoin",
    DAI: "Dai",
    // Add other mappings as needed
  };
  // then your handleCryptoClick:
  const handleCryptoClick = (symbol) => {
    setSelectedSymbol(symbol);
    setAddress1(childAddresses[symbol.toLowerCase()] || []);

    // Pick the right tab based on how we opened the modal:
    if (isSendFlow) {
      setSelectedTab("Send");
    } else if (isReceiveFlow) {
      setSelectedTab("Receive");
    } else {
      setSelectedTab("Receive"); // your default “normal click” state
    }

    setShowCryptoModal(true);
  };

  // And when you close the crypto modal:
  const closeCryptoModal = () => {
    setShowCryptoModal(false);
    // reset the “flows” so next normal click shows all tabs
    setIsSendFlow(false);
    setIsReceiveFlow(false);
  };

  // useEffect(() => {
  //   console.log("🏷️ address1 updated to:", address1);
  // }, [address1]);
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
  useEffect(() => {
    const fetchWalletLogos = () => {
      const logos = {};
      primaryWallets.forEach((symbol) => {
        const shortName = cryptoShortNames[symbol.toUpperCase()] || symbol;
        logos[symbol] = `/coin_logos/${shortName}.png`;
      });
      setWalletLogos(logos);
    };

    if (primaryWallets.length > 0) {
      fetchWalletLogos();
    }
  }, [primaryWallets]);

  // useEffect(() => {
  //   // Check if the user is logged in by checking the localStorage for authToken
  //   const authToken = localStorage.getItem("authToken");
  //   if (authToken) {
  //     setIsLoggedIn(true);
  //   }

  //   const fetchKycStatus = async () => {
  //     try {
  //       const response = await axios.get(
  //         `https://trustcoinfx.trade/api/kyc/${id1}`
  //       );
  //       setKycStatus(response.data.status);
  //     } catch (error) {
  //       console.error("Error fetching KYC status:", error);
  //     }
  //   };

  //   if (uid) {
  //     fetchKycStatus();
  //   }
  // }, [uid]);

  // useEffect(() => {
  //   // Check if the user is logged in by checking the localStorage for authToken
  //   const authToken = localStorage.getItem("authToken");
  //   if (authToken) {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  const formatBalance = (balance) => {
    const threshold = 1e-8; // Set a reasonable threshold
    return balance < threshold ? 0 : balance.toFixed(8);
  };
  // useEffect(() => {
  //   if (userId) {
  //     fetchFrozenAmounts(); // Call to fetch frozen amounts once the userId is available
  //   }
  // }, [userId]);
  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        // 1) grab all on-chain + USDT-peg balances & USD values
        const { data: details } = await axios.get(
          `https://trustcoinfx.trade/api/wallet/${uid}/details`
        );
        // details.wallets === { ETH: { balance, address, usdValue }, …, future: { balance, usdValue }, stake: { … } }

        // 2) reshape into the shape your UI expects:
        //    balances: { ETH: 0.5, BNB: 1.2, …, future: 100, stake: 50 }
        //    prices:   { ethereum: { usd: <price> }, … }  (only needed if you still use prices)
        const balances = Object.fromEntries(
          Object.entries(details.wallets).map(([sym, info]) => [
            sym,
            info.balance,
          ])
        );
        const prices = Object.fromEntries(
          Object.entries(details.wallets)
            .filter(([_, info]) => info.balance > 0)
            .map(([sym, info]) => {
              // coin-name lowercased (e.g. ethereum) should match your price key
              const key =
                sym === "future" || sym === "stake"
                  ? "tether"
                  : sym.toLowerCase();
              const price = info.balance > 0 ? info.usdValue / info.balance : 0;
              return [key, { usd: price }];
            })
        );

        setWalletData({ balances, prices });
        setTotalUsdBalance(details.totalUsdBalance);

        // 3) (optional) pull child addresses if you need them separately
        const { data: addrData } = await axios.get(
          `https://trustcoinfx.trade/api/wallet/${userId}/child-addresses`
        );
        // setChildAddresses(addrData.addresses || {});
        // console.log(childAddresses);
      } catch (error) {
        console.error("Error fetching wallet details:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const fetchCryptos = async () => {
      try {
        const response = await axios.get(
          "https://trustcoinfx.trade/api/cryptos"
        );
        setCryptos(response.data);
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error);
      }
    };

    fetchWalletData();
    fetchCryptos();
  }, [userId]);

  const handleConvertAmountChange = (e) => {
    const value = e.target.value;
    setUsdtValue(value);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const cryptoValue = value / walletData.prices[selectedSymbol].usd;
      setAmount(cryptoValue < 1e-8 ? "0.00" : cryptoValue.toFixed(8));
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  // const handleCryptoClick = (symbol) => {
  //   setSelectedSymbol(symbol);
  //   setSelectedTab("Receive"); // Default to the "Receive" tab
  //   setShowCryptoModal(true); // Show the crypto modal
  // };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setAddress(text);
  };

  const handleMax = () => {
    const maxCryptoAmount = walletData?.balances[selectedSymbol] || 0;
    setAmount(maxCryptoAmount);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      setUsdAmount(
        (maxCryptoAmount * walletData.prices[selectedSymbol].usd).toFixed(2)
      );
    }
  };
  // 1) Handler to take “max” crypto balance → fill both amount & USDT fields:
  const handleMaxConversion = () => {
    const maxCrypto = walletData?.balances?.[selectedSymbol] || 0;
    setAmount(maxCrypto.toString()); // fill the crypto field
    const price = walletData?.prices?.[selectedSymbol]?.usd || 0;
    setUsdtValue((maxCrypto * price).toFixed(2)); // fill the USDT field
  };

  const handleMaxConvertAssetValue = () => {
    const maxCryptoAmount = walletData?.balances[selectedSymbol] || 0;
    setAmount(maxCryptoAmount); // Set the asset value

    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol]?.usd
    ) {
      const usdValue = maxCryptoAmount * walletData.prices[selectedSymbol].usd;
      setUsdtValue(usdValue.toFixed(2)); // Automatically fill the USD amount
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    if (term === "") {
      setFilteredCryptos([]);
    } else {
      setFilteredCryptos(
        cryptos.filter(
          (crypto) =>
            crypto.name.toLowerCase().includes(term) ||
            crypto.symbol.toLowerCase().includes(term)
        )
      );
    }
  };

  const handleMaxConvert = () => {
    const maxCryptoAmount = walletData?.balances[selectedSymbol] || 0;
    setAmount(maxCryptoAmount);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      setUsdtValue(
        (maxCryptoAmount * walletData.prices[selectedSymbol].usd).toFixed(2)
      );
    }
  };

  const handleMaxConvertUSD = () => {
    if (
      walletData &&
      walletData.balances &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const maxUsdAmount =
        (walletData.balances[selectedSymbol] || 0) *
        (walletData.prices[selectedSymbol]?.usd || 0);
      setUsdtValue(maxUsdAmount.toFixed(2));
      setAmount(
        (maxUsdAmount / (walletData.prices[selectedSymbol]?.usd || 1)).toFixed(
          8
        )
      );
    }
  };

  const [usdAmount, setUsdAmount] = useState("");
  // const handleSendSubmit = async (e) => {
  //   e.preventDefault();

  //   const cryptoPrice = walletData.prices[selectedSymbol]?.usd;
  //   const cryptoAmount = parseFloat(usdAmount) / cryptoPrice;

  //   if (cryptoAmount > walletData.balances[selectedSymbol]) {
  //     setModalMessage("Insufficient balance.");
  //     setModalIconColor("red");
  //     setShowSuccessPopup(true);
  //     return;
  //   }

  //   if (cryptoAmount <= 0 || usdAmount === "") {
  //     setModalMessage("Amount should be greater than 0.");
  //     setModalIconColor("red");
  //     setShowSuccessPopup(true);
  //     return;
  //   }

  //   try {
  //     await axios.post("https://trustcoinfx.trade/api/send", {
  //       userId,
  //       symbol: selectedSymbol,
  //       amount: parseFloat(cryptoAmount.toFixed(8)),
  //       address,
  //     });

  //     setModalMessage("Send request submitted successfully");
  //     setModalIconColor("green");
  //     setShowSuccessPopup(true);
  //     setUsdAmount("");
  //     setAmount("");
  //     setAddress("");
  //   } catch (error) {
  //     console.error("Error submitting send request:", error);
  //     setModalMessage("Failed to submit send request");
  //     setModalIconColor("red");
  //     setShowSuccessPopup(true);
  //   }
  // };
  // then later:
  const handleSendSubmit = async (e) => {
    e.preventDefault();

    // 1️⃣ Use your crypto‐amount state directly
    const cryptoAmount = parseFloat(amount);
    const mainBalance = walletData?.balances?.[selectedSymbol] || 0;

    // 2️⃣ Basic validation
    if (isNaN(cryptoAmount) || cryptoAmount <= 0) {
      setModalMessage("Amount should be greater than 0.");
      setModalIconColor("red");
      return setShowSuccessPopup(true);
    }
    if (cryptoAmount > mainBalance) {
      setModalMessage("Insufficient balance.");
      setModalIconColor("red");
      return setShowSuccessPopup(true);
    }

    try {
      // 3️⃣ Send the real Mongo _id, and the actual crypto amount
      await axios.post("https://trustcoinfx.trade/api/send", {
        userId, // 24-char ObjectId
        symbol: selectedSymbol,
        amount: cryptoAmount, // already a real number
        address,
      });

      // 4️⃣ Success UI
      setModalMessage("Send request submitted successfully.");
      setModalIconColor("green");
      setShowSuccessPopup(true);

      // 5️⃣ Refresh your balances
      // const { data } = await axios.get(
      //   `https://trustcoinfx.trade/api/wallet/${userId}/balances`
      // );
      // setWalletData(data);

      // 6️⃣ Clear the form
      setUsdAmount("");
      setAmount("");
      setAddress("");
    } catch (err) {
      console.error("Error submitting send request:", err);
      setModalMessage("Failed to submit send request.");
      setModalIconColor("red");
      setShowSuccessPopup(true);
    }
  };

  const handleConvertSubmit = async (e) => {
    e.preventDefault();

    if (
      walletData &&
      parseFloat(amount) > walletData.balances[selectedSymbol]
    ) {
      setModalMessage("Insufficient balance.");
      setModalIconColor("red");
      setShowSuccessPopup(true);
      return;
    }

    if (parseFloat(amount) <= 0 || amount === "") {
      setModalMessage("Amount should be greater than 0.");
      setModalIconColor("red");
      setShowSuccessPopup(true);
      return;
    }

    try {
      await axios.post("https://trustcoinfx.trade/api/convert", {
        userId,
        fromSymbol: selectedSymbol,
        toSymbol: "usdt", // Converting to USDT
        amount: parseFloat(amount),
      });

      setModalMessage("Conversion Successfull!.");
      setModalIconColor("green");
      setShowSuccessPopup(true);
      setAmount("");
      setUsdtValue("");
    } catch (error) {
      console.error("Error submitting conversion request:", error);
      setModalMessage("Failed to submit conversion request.");
      setModalIconColor("red");
      setShowSuccessPopup(true);
    }
  };
  const coinGeckoIds = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    BNB: "binancecoin",
    SOL: "solana",
    TRX: "tron",
    ADA: "cardano",
    XRP: "ripple",
    // …add the rest you need…
  };

  // 1.b) State to hold the live price
  const [cgPrice, setCgPrice] = useState(0);
  useEffect(() => {
    if (!selectedSymbol) return;

    const id = coinGeckoIds[selectedSymbol] || selectedSymbol.toLowerCase();

    axios
      .get("https://pro-api.coingecko.com/api/v3/simple/price", {
        params: {
          ids: id,
          vs_currencies: "usd",
        },
        headers: {
          "X-Cg-Pro-Api-Key": "CG-3KJu1RL8kFsQGjJouk9cWkDZ",
        },
      })
      .then((res) => {
        setCgPrice(res.data[id]?.usd || 0);
      })
      .catch((err) => {
        console.error(
          "🔥 Pro price fetch error:",
          err.response?.data || err.message
        );
        setCgPrice(0);
      });
  }, [selectedSymbol]);

  const handleConvert = async (e) => {
    e.preventDefault();
    if (selectedCrypto) {
      try {
        const usdAmount = parseFloat(usdtValue);
        if (!isNaN(usdAmount) && usdAmount > 0) {
          const response = await axios.post(
            "https://trustcoinfx.trade/api/convert",
            {
              userId,
              fromSymbol: "tether",
              toSymbol: selectedCrypto?.symbol || selectedCrypto?.id,
              amount: usdAmount,
            }
          );
          setModalMessage("Conversion successful");
          setModalIconColor("green");
          setShowMessageModal(true);
          setAmount("");
          setUsdtValue("");
          setSelectedCrypto(null);

          // Update walletData safely
          if (response.data && response.data.balances && response.data.prices) {
            setWalletData(response.data);
          }
          setRedirectAfterModal(true); // Set redirectAfterModal to true
        } else {
          alert("Invalid USD amount");
        }
      } catch (error) {
        console.error("Error during conversion:", error);
        setModalMessage("Insufficient Balance");
        setModalIconColor("red");
        setShowMessageModal(true);
      }
    }
  };

  const handleUsdAmountChange = (value, setCryptoAmount, setUsdAmount) => {
    setUsdAmount(value);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const cryptoValue = value / walletData.prices[selectedSymbol].usd;
      setCryptoAmount(cryptoValue < 1e-8 ? "0.00" : cryptoValue.toFixed(8));
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleRechargeSubmit = async (e) => {
    e.preventDefault();

    setIsLoadingRecharge(true); // Start loading

    if (parseFloat(usdDepositAmount) <= 0 || usdDepositAmount === "") {
      alert("Amount should be greater than 0.");
      setIsLoadingRecharge(false); // Stop loading in case of error
      return;
    }

    const formData = new FormData();
    formData.append("amount", cryptoDepositAmount);
    formData.append("proof", proof);
    formData.append("userId", userId);
    formData.append("selectedSymbol", selectedSymbol);
    formData.append("uid", uid); // Add this line to include the UID in the form data

    try {
      await axios.post("https://trustcoinfx.trade/api/deposit", formData);

      // Set success message and show the success popup
      setRechargeSuccessMessage("Recharge request submitted successfully");
      setModalMessage("Recharge request submitted successfully");
      setModalIconColor("green");
      setShowSuccessPopup(true);

      // Clear form data and close the recharge modal
      setUsdDepositAmount("");
      setCryptoDepositAmount("");
      setProof(null);
      // setShowRechargeModal(false); // Close the recharge modal
    } catch (error) {
      console.error("Error submitting deposit request:", {
        message: error.message,
        stack: error.stack,
        response: error.response ? error.response.data : null,
      });
      setModalMessage("Failed to submit deposit request");
      setModalIconColor("red");
      setShowSuccessPopup(true); // Show error popup
    } finally {
      setIsLoadingRecharge(false); // Stop loading
    }
  };

  const handleUsdDepositAmountChange = (e) => {
    const value = e.target.value;
    setUsdDepositAmount(value);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const cryptoValue = value / walletData.prices[selectedSymbol].usd;
      setCryptoDepositAmount(
        cryptoValue < 1e-8 ? "0.00" : cryptoValue.toFixed(8)
      );
    }
  };

  const handleCryptoDepositAmountChange = (e) => {
    const value = e.target.value;
    setCryptoDepositAmount(value);
    if (
      walletData &&
      walletData.prices &&
      walletData.prices[selectedSymbol] &&
      walletData.prices[selectedSymbol].usd !== undefined
    ) {
      const usdValue = value * walletData.prices[selectedSymbol].usd;
      setUsdDepositAmount(usdValue < 1e-8 ? "0.00" : usdValue.toFixed(2));
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!walletData) {
    return <div>Error fetching wallet data.</div>;
  }

  const { balances, prices } = walletData || { balances: {}, prices: {} };
  const totalBalance = Object.keys(balances).reduce((acc, symbol) => {
    const price = prices[symbol]?.usd;
    if (price !== undefined) {
      return acc + balances[symbol] * price;
    }
    return acc;
  }, 0);

  const renderKycStatus = () => {
    if (kycStatus === "approved") {
      return (
        <p className="kyc-status">
          Verified{" "}
          <i className="fas fa-check-circle" style={{ color: "white" }}></i>
        </p>
      );
    }
    return null;
  };
  const totalPortfolio = totalUsdBalance + futuresBalance + stakeBalance;

  const data = {
    // labels: ["Total Holdings", "Futures", "Investment/Stake"],
    datasets: [
      {
        data: [totalUsdBalance, futuresBalance, stakeBalance],
        backgroundColor: [
          "#4caf50", // Green for Main
          "#2196f3", // Blue for Futures
          "#ff9800", // Orange for Stake
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        // labels: {
        //   color: "white", // make text white for dark background
        // },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const value = context.raw;
            const percentage = totalPortfolio
              ? ((value / totalPortfolio) * 100).toFixed(2)
              : 0;
            return `${context.label}: ${value.toFixed(
              2
            )} USDT (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="container1">
      <Header />

      <div
        className="main-content1"
        style={{
          flexDirection: "column",
        }}
      >
        <div className="wallet-main-tabs">
          <button
            style={{
              fontSize: "18px",
              marginBottom: "10px",
              color: activeMainTab === "main" ? "#7d9aea" : "inherit",
              fontWeight: activeMainTab === "main" ? "bold" : "normal",
              borderBottom:
                activeMainTab === "main" ? "2px solid #7d9aea" : "none",
            }}
            onClick={() => {
              setActiveMainTab("main");
              setActiveWalletTab("main");
            }}
          >
            Overview
          </button>
          <button
            style={{
              fontSize: "18px",
              marginBottom: "10px",
              color: activeMainTab === "overview" ? "#7d9aea" : "inherit",
              fontWeight: activeMainTab === "overview" ? "bold" : "normal",
              borderBottom:
                activeMainTab === "overview" ? "2px solid #7d9aea" : "none",
            }}
            onClick={() => {
              setActiveMainTab("overview");
              setActiveWalletTab("overview");
            }}
          >
            Main
          </button>
          <button
            style={{
              fontSize: "18px",
              marginBottom: "10px",
              color: activeMainTab === "futures" ? "#7d9aea" : "inherit",
              fontWeight: activeMainTab === "futures" ? "bold" : "normal",
              borderBottom:
                activeMainTab === "futures" ? "2px solid #7d9aea" : "none",
            }}
            onClick={async () => {
              setActiveMainTab("futures");
              setActiveWalletTab("futures");
              try {
                const res = await axios.get(
                  `https://trustcoinfx.trade/api/wallet/futures/${uid}`
                );
                setWalletData({
                  balances: { tether: res.data.usdtBalance },
                  prices: { tether: { usd: 1 } },
                });
              } catch (error) {
                console.error("Failed to fetch futures balance", error);
              }
            }}
          >
            Futures
          </button>

          <button
            style={{
              fontSize: "18px",
              marginBottom: "10px",
              color: activeMainTab === "investment" ? "#7d9aea" : "inherit",
              fontWeight: activeMainTab === "investment" ? "bold" : "normal",
              borderBottom:
                activeMainTab === "investment" ? "2px solid #7d9aea" : "none",
            }}
            onClick={async () => {
              setActiveMainTab("investment");
              setActiveWalletTab("stake");
              try {
                const res = await axios.get(
                  `https://trustcoinfx.trade/api/wallet/stake/${uid}`
                );
                setWalletData({
                  balances: { tether: res.data.usdtBalance },
                  prices: { tether: { usd: 1 } },
                });
              } catch (error) {
                console.error("Failed to fetch stake balance", error);
              }
            }}
          >
            Investment & Stake
          </button>
        </div>
        <div style={{ marginTop: "10px" }}>
          {" "}
          {/* <h2>/home/Wallet</h2> */}
          <h1
            style={{ color: "white", fontSize: "20px" }}
            className="main-balance-text"
          >
            Est. Total Value
          </h1>
          <div>
            <div style={{ display: "flex" }}>
              {" "}
              <div style={{ display: "flex" }}>
                <h1 style={{ fontSize: "30px", color: "white" }}>
                  <b className="main-balance-text">
                    {isBalanceVisible
                      ? `${new Intl.NumberFormat("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }).format(
                          activeWalletTab === "main"
                            ? overallTotalBalance *
                                (exchangeRates[selectedCurrency] || 1)
                            : activeWalletTab === "futures"
                            ? futuresBalance *
                              (exchangeRates[selectedCurrency] || 1)
                            : activeWalletTab === "stake"
                            ? (stakeBalance + frozenStake) *
                              (exchangeRates[selectedCurrency] || 1)
                            : totalUsdBalance *
                              (exchangeRates[selectedCurrency] || 1)
                        )} USDT`
                      : "****"}
                  </b>
                </h1>

                <i
                  className={`fa-regular ${
                    isBalanceVisible ? "fa-eye" : "fa-eye-slash"
                  }`}
                  style={{
                    color: "#9ca3af",
                    marginLeft: "5px",
                    fontSize: "15px",
                    marginTop: "10px",
                    cursor: "pointer",
                  }}
                  onClick={toggleBalanceVisibility}
                ></i>
              </div>
              {isBalanceVisible && (
                <p
                  style={{
                    fontSize: "14px",
                    color: "#9ca3af",
                    marginTop: "5px",
                  }}
                >
                  ≈$
                  {new Intl.NumberFormat("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(
                    activeWalletTab === "main"
                      ? overallTotalBalance *
                          (exchangeRates[selectedCurrency] || 1)
                      : activeWalletTab === "futures"
                      ? futuresBalance * (exchangeRates[selectedCurrency] || 1)
                      : activeWalletTab === "stake"
                      ? (stakeBalance + frozenStake) *
                        (exchangeRates[selectedCurrency] || 1)
                      : totalUsdBalance * (exchangeRates[selectedCurrency] || 1)
                  )}
                </p>
              )}
              {activeMainTab === "main" && (
                <div style={{ width: "150px", height: "150px" }}>
                  <Doughnut data={data} options={options} />
                </div>
              )}
            </div>{" "}
            {activeWalletTab === "stake" && (
              <p style={{ color: "#9ca3af", marginTop: "5px" }}>
                Available balance for transaction:
                <span style={{ color: "white", fontWeight: "bold" }}>
                  {stakeBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  USDT
                </span>
              </p>
            )}
            {activeMainTab === "overview" && (
              <div className="overview-actions">
                <div
                  className="overview-action"
                  onClick={() => {
                    setIsSendFlow(false);
                    setIsReceiveFlow(true);
                    setSelectedTab("Receive");
                    setSearchTerm("");
                    setshowsend(true);
                    // setShowCryptoModal(true);
                  }}
                >
                  <div className="action-icon">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                  <div className="action-label">Receive</div>
                </div>
                <div
                  className="overview-action"
                  onClick={() => {
                    setIsSendFlow(true);
                    setIsReceiveFlow(false);
                    setSelectedTab("Send");
                    setSearchTerm("");
                    setshowsend(true);
                    // setShowCryptoModal(true);
                  }}
                >
                  <div className="action-icon">
                    <i className="fas fa-arrow-up"></i>
                  </div>
                  <div className="action-label">Send</div>
                </div>
                {showsend && (
                  <div
                    style={{
                      position: "fixed",
                      top: 0,
                      left: 0,
                      width: "100vw",
                      height: "100vh",
                      backgroundColor: "rgba(0,0,0,0.7)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 1000,
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "8px",
                        width: "400px",
                        maxHeight: "80vh",
                        overflowY: "auto",
                        padding: "20px",
                      }}
                    >
                      <h3>{selectedTab} Cryptocurrency</h3>
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          padding: "10px",
                          width: "100%",
                          marginBottom: "15px",
                          border: "1px solid #ccc",
                          borderRadius: "5px",
                        }}
                      />

                      {(selectedTab === "Send"
                        ? Object.entries(walletData.balances || {}).filter(
                            ([symbol, bal]) =>
                              bal > 0 &&
                              symbol.includes(searchTerm.toLowerCase())
                          )
                        : primaryWallets.filter((symbol) =>
                            symbol.includes(searchTerm.toLowerCase())
                          )
                      ).map((item) => {
                        const symbol = selectedTab === "Send" ? item[0] : item;
                        const balance =
                          selectedTab === "Send"
                            ? item[1]
                            : walletData.balances[item];
                        const logoSymbol =
                          cryptoShortNames[symbol.toUpperCase()] ||
                          symbol.toUpperCase();

                        return (
                          <div
                            key={symbol}
                            className="market-item"
                            onClick={() => {
                              handleCryptoClick(symbol);
                              setshowsend(false);
                            }}
                            style={{
                              display: "flex",
                              height: "80px",
                              width: "100%",
                              justifyContent: "space-evenly",
                              alignItems: "center",
                              padding: "10px",
                              color: "black",
                              borderBottom: "0.5px solid #ccc",
                            }}
                          >
                            <div
                              className="market-info"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                width: "100%",
                              }}
                            >
                              <img
                                src={`/coin_logos/${logoSymbol}.png`}
                                alt={symbol.toUpperCase()}
                                className="crypto-logo"
                                style={{ height: "40px", width: "40px" }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/coin_logos/default.png";
                                }}
                              />
                              <div>
                                <h3 style={{ fontSize: "17px" }}>
                                  {cryptoFullNames[symbol.toUpperCase()] ||
                                    symbol.toUpperCase()}
                                </h3>
                                <p style={{ fontSize: "15px" }}>
                                  {symbol.toUpperCase()}
                                </p>
                              </div>
                            </div>

                            <div
                              className="market-stats"
                              style={{ textAlign: "right", minWidth: "150px" }}
                            >
                              <p>
                                {balance?.toFixed(8)}{" "}
                                {cryptoFullNames[symbol.toUpperCase()] ||
                                  symbol.toUpperCase()}
                              </p>
                              <p>
                                USD$
                                {walletData.prices[symbol]?.usd !== undefined
                                  ? (
                                      balance * walletData.prices[symbol].usd
                                    ).toFixed(2)
                                  : "0.00"}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      <button
                        onClick={() => setshowsend(false)}
                        style={{
                          marginTop: "10px",
                          width: "100%",
                          padding: "10px",
                          backgroundColor: "#7d9aea",
                          color: "white",
                          border: "none",
                          borderRadius: "5px",
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}

                <div
                  className="overview-action"
                  onClick={() => setShowTransferModal(true)}
                >
                  <div className="action-icon">
                    <i className="fas fa-exchange-alt"></i>
                  </div>
                  <div className="action-label">Transfer</div>
                </div>
              </div>
            )}
            {(activeMainTab === "futures" ||
              activeMainTab === "investment") && (
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    textAlign: "left",
                    cursor: "pointer",
                    marginTop: "30px",
                  }}
                  onClick={() => setShowTransferModalU(true)}
                >
                  <div
                    style={{
                      backgroundColor: "#f5f5f5",
                      borderRadius: "10px",
                      padding: "10px",
                      display: "inline-flex",
                      // alignItems: "center",
                      // justifyContent: "center",
                    }}
                  >
                    <div
                      style={{ justifyContent: "center", textAlign: "center" }}
                    >
                      {" "}
                      <i
                        className="fas fa-exchange-alt"
                        style={{ fontSize: "15px", color: "black" }}
                      ></i>
                    </div>

                    <div
                      style={{ justifyContent: "center", textAlign: "center" }}
                    >
                      <p
                        style={{
                          fontSize: "18px",
                          color: "black",
                          marginLeft: "20px",
                        }}
                      >
                        Transfer
                      </p>
                    </div>
                  </div>
                </div>
                <a href="/plan" style={{ marginLeft: "20px" }}>
                  <div
                    style={{
                      textAlign: "left",
                      cursor: "pointer",
                      marginTop: "30px",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#f5f5f5",
                        borderRadius: "10px",
                        padding: "10px",
                        display: "inline-flex",
                        // alignItems: "center",
                        // justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        {" "}
                        <i
                          class="fa-solid fa-hand-holding-dollar"
                          style={{ color: "black" }}
                        ></i>
                      </div>

                      <div
                        style={{
                          justifyContent: "center",
                          textAlign: "center",
                        }}
                      >
                        <p
                          style={{
                            fontSize: "18px",
                            color: "black",
                            marginLeft: "20px",
                          }}
                        >
                          Invest Now
                        </p>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <div className="market-list">
          {searchTerm ? (
            filteredCryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="market-item"
                onClick={() => handleCryptoClick(crypto.symbol)}
              >
                <img
                  src={`/coin_logos/${selectedSymbol}.png`}
                  alt={selectedSymbol}
                />

                <div className="market-info" style={{ color: "white" }}>
                  <h3 style={{ color: "white" }}>{crypto.name}</h3>
                  <p style={{ color: "white" }}>
                    {crypto.symbol.toUpperCase()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <>
              {activeMainTab === "main" ? (
                <>
                  {/* Total Holdings Header */}
                  <div
                    style={{
                      width: "100%",
                      marginBottom: "10px",
                      marginLeft: "10px",
                      borderBottom: "1px solid white",
                    }}
                  >
                    <h1 style={{ color: "green", fontSize: "18px" }}>
                      Total Holdings
                    </h1>
                  </div>

                  {/* ——— Overview (everything except future & stake) ——— */}
                  {primaryWallets
                    .filter(
                      (sym) => !["future", "stake"].includes(sym.toLowerCase())
                    )
                    .map((sym) => {
                      const { balance = 0, priceUsd = 0 } = summary[sym] || {};
                      const usdVal = balance * priceUsd;
                      const upper = sym.toUpperCase();

                      return (
                        <div
                          key={sym}
                          className="market-item"
                          onClick={() => handleCryptoClick(sym)}
                          style={{
                            display: "flex",
                            height: "80px",
                            width: "100%",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            padding: "10px",
                            color: "white",
                            borderBottom: "0.5px solid #3e3e3e",
                          }}
                        >
                          <div
                            className="market-info"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <img
                              src={`/coin_logos/${upper}.png`}
                              alt={upper}
                              className="crypto-logo"
                              style={{ height: "40px", width: "40px" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/coin_logos/default.png";
                              }}
                            />
                            <div>
                              <h3 style={{ fontSize: "17px", color: "white" }}>
                                {upper}
                              </h3>
                              <p style={{ fontSize: "15px", color: "white" }}>
                                {upper}
                              </p>
                            </div>
                          </div>

                          <div
                            className="market-stats"
                            style={{
                              textAlign: "right",
                              minWidth: "150px",
                              color: "white",
                            }}
                          >
                            <p>
                              {balance.toFixed(8)} {upper}
                            </p>
                            <p>USD ${usdVal.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}

                  {/* ——— Futures Wallet ——— */}
                  <div
                    style={{
                      borderBottom: "1px solid white",
                      marginBottom: "10px",
                      marginTop: "30px",
                      marginLeft: "10px",
                    }}
                  >
                    <h1 style={{ color: "blue", fontSize: "18px" }}>Futures</h1>
                  </div>
                  <div
                    className="market-item"
                    // onClick={() => handleCryptoClick("future")}
                    style={{
                      display: "flex",
                      height: "80px",
                      width: "100%",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      padding: "10px",
                      color: "white",
                      borderBottom: "0.5px solid #3e3e3e",
                    }}
                  >
                    <div
                      className="market-info"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <h3 style={{ fontSize: "17px", color: "white" }}>USDT</h3>
                      <img src={usdt} alt="USDT" style={{ height: "30px" }} />
                    </div>

                    <div
                      className="market-stats"
                      style={{
                        textAlign: "right",
                        minWidth: "150px",
                        color: "white",
                      }}
                    >
                      <p>USDT {summary.future.balance.toFixed(2)}</p>
                      <p>USD$ {summary.future.balance.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* ——— Investment / Stake Wallet ——— */}
                  <div
                    style={{
                      borderBottom: "1px solid white",
                      marginBottom: "10px",
                      marginTop: "30px",
                      marginLeft: "10px",
                    }}
                  >
                    <h1 style={{ color: "orange", fontSize: "18px" }}>
                      Investment / Stake
                    </h1>
                  </div>
                  <div
                    className="market-item"
                    // onClick={() => handleCryptoClick("stake")}
                    style={{
                      display: "flex",
                      height: "80px",
                      width: "100%",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      padding: "10px",
                      color: "white",
                      borderBottom: "0.5px solid #3e3e3e",
                    }}
                  >
                    <div
                      className="market-info"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <h3 style={{ fontSize: "17px", color: "white" }}>USDT</h3>
                      <img src={usdt} alt="USDT" style={{ height: "30px" }} />
                    </div>

                    <div
                      className="market-stats"
                      style={{
                        textAlign: "right",
                        minWidth: "150px",
                        color: "white",
                      }}
                    >
                      <p>USDT {summary.stake.balance.toFixed(2)}</p>
                      <p>USD$ {summary.stake.balance.toFixed(2)}</p>
                    </div>
                  </div>
                </>
              ) : (
                // ELSE your original market-list and filtering
                <>
                  {primaryWallets
                    // 1️⃣ Select the right wallets per tab
                    .filter((sym) => {
                      const key = sym.toLowerCase();
                      if (activeMainTab === "overview") {
                        // overview: everything except future & stake
                        return !["future", "stake"].includes(key);
                      }
                      if (activeMainTab === "futures") {
                        // futures tab: only the 'future' wallet
                        return key === "future";
                      }
                      if (activeMainTab === "investment") {
                        // investment tab: only the 'stake' wallet
                        return key === "stake";
                      }
                      return false;
                    })
                    // 2️⃣ Render each row
                    .map((sym) => {
                      const key = sym.toLowerCase();
                      const { balance = 0, priceUsd = 0 } = summary[sym] || {};
                      const upper = sym.toUpperCase();

                      // detect future/stake so we can disable clicks and tweak USD calc
                      const isSpecial = key === "future" || key === "stake";

                      // USD = balance for special, otherwise balance * priceUsd
                      const displayUsdValue = isSpecial
                        ? balance
                        : balance * priceUsd;

                      // force USDT logo for special
                      const logoKey =
                        {
                          eth: "ETH",
                          btc: "BTC",
                          bnb: "BNB",
                          usdt: "USDT",
                          tether: "USDT",
                          future: "USDT",
                          stake: "USDT",
                        }[key] || upper;

                      // friendly names
                      const coinNames = {
                        btc: "Bitcoin",
                        eth: "Ethereum",
                        usdt: "Tether",
                        future: "Futures Wallet",
                        stake: "Staking Wallet",
                      };
                      const displayName = coinNames[key] || upper;

                      return (
                        <div
                          key={sym}
                          className="market-item"
                          onClick={
                            !isSpecial
                              ? () => handleCryptoClick(sym)
                              : undefined
                          }
                          style={{
                            display: "flex",
                            height: "80px",
                            width: "100%",
                            justifyContent: "space-evenly",
                            alignItems: "center",
                            padding: "10px",
                            color: "white",
                            borderBottom: "0.5px solid #3e3e3e",
                            cursor: !isSpecial ? "pointer" : "default",
                          }}
                        >
                          <div
                            className="market-info"
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                              width: "100%",
                            }}
                          >
                            <img
                              src={`/coin_logos/${logoKey}.png`}
                              alt={displayName}
                              className="crypto-logo"
                              style={{ height: "40px", width: "40px" }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/coin_logos/default.png";
                              }}
                            />
                            <div>
                              <h3 style={{ fontSize: "17px" }}>
                                {displayName}
                              </h3>
                              <p style={{ fontSize: "15px" }}>{upper}</p>
                            </div>
                          </div>

                          <div
                            className="market-stats"
                            style={{
                              textAlign: "right",
                              minWidth: "150px",
                            }}
                          >
                            <p>
                              {balance.toFixed(8)} {upper}
                            </p>
                            <p>USD ${displayUsdValue.toFixed(2)}</p>
                          </div>
                        </div>
                      );
                    })}

                  {/* Show Result component on the Futures tab */}
                  {activeMainTab === "futures" && (
                    <div style={{ marginTop: "30px" }}>
                      <Result />
                    </div>
                  )}

                  {/* Show InvestmentHistory on the Investment tab */}
                  {activeMainTab === "investment" && (
                    <div style={{ marginTop: "30px" }}>
                      <InvestmentHistory1 />
                    </div>
                  )}
                </>
              )}
              <hr />
              {secondaryWallets.map((symbol) => (
                <div
                  key={symbol}
                  className="market-item"
                  style={{ display: searchTerm ? "block" : "none" }} // Show only if searched
                  onClick={() => handleCryptoClick(symbol)}
                >
                  <div className="market-info">
                    <h3>{cryptoFullNames[symbol.toUpperCase()] || symbol}</h3>{" "}
                    {/* Display full name */}
                    <p>{symbol.toUpperCase()}</p>
                  </div>
                  <div className="market-stats">
                    <p>
                      {formatBalance(walletData.balances[symbol] || 0)}{" "}
                      {symbol.toUpperCase()}
                    </p>
                    <p>
                      USD${" "}
                      {walletData.prices[symbol]?.usd !== undefined
                        ? (
                            walletData.balances[symbol] *
                            walletData.prices[symbol].usd
                          ).toFixed(2)
                        : "0.00"}
                    </p>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
      {showCryptoModal && (
        <div
          className="modal show"
          id="crypto-modal"
          // style={{ backgroundColor: "black" }}
        >
          <div
            id="wallet-modalss"
            className={`modal-content
                      ${isSendFlow ? "send-only" : ""}
                      ${isReceiveFlow ? "receive-only" : ""}
                    `}
            style={{ border: "none" }}
          >
            <span
              className="close"
              onClick={closeCryptoModal}
              style={{ color: "black", fontSize: "30px" }}
            >
              &times;
            </span>

            <div className="wallet" style={{ border: "0.5px solid #6c6969" }}>
              <div
                className="wallet-header"
                style={{
                  backgroundColor: "white",
                  borderBottom: "0.5px solid #6c6969",
                  justifyContent: "center",
                  textAlign: "center",
                  alignContent: "center",
                }}
              >
                <h1
                  className="labels23"
                  style={{ fontSize: "20px", color: "white" }}
                >
                  {selectedSymbol === "tether"
                    ? "USDT"
                    : selectedSymbol.toUpperCase()}{" "}
                  Wallet
                </h1>
              </div>

              <div className="wallet-balance">
                {(() => {
                  // 1️⃣ Find the actual summary key (case-insensitive)
                  const sel = selectedSymbol;
                  const symKey = Object.keys(summary).find(
                    (k) => k.toLowerCase() === sel.toLowerCase()
                  );

                  // 2️⃣ Pull balance & priceUsd from that entry
                  const { balance = 0, priceUsd = 0 } = summary[symKey] || {};

                  // 3️⃣ If it’s future/stake, we use balance as USD; otherwise use balance*priceUsd
                  const usdVal =
                    symKey === "future" || symKey === "stake"
                      ? balance
                      : balance * priceUsd;

                  // 4️⃣ Always label tether/future/stake as USDT in the UI
                  const displaySym = ["tether", "future", "stake"].includes(
                    symKey.toLowerCase()
                  )
                    ? "USDT"
                    : symKey.toUpperCase();

                  return (
                    <>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          margin: 0,
                        }}
                      >
                        Total Coins: {balance.toFixed(8)} {displaySym}
                      </p>
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                          margin: "4px 0 0",
                        }}
                      >
                        Total USD Value: ${usdVal.toFixed(2)}
                      </p>
                    </>
                  );
                })()}
                <h2
                  style={{
                    fontSize: "18px",
                    color: "#9ca3af",
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  {/* Invested: {currencySymbols[selectedCurrency]} */}
                  {/* {Number( */}
                  {/* ( */}
                  {/* investedAmount * (exchangeRates[selectedCurrency] || 1) */}
                  {/* ).toFixed(2) */}
                  {/* )} */}
                </h2>
                <p>
                  {" "}
                  {/* <p>
                    {frozenAmounts[selectedSymbol] && (
                      <span>
                        (Frozen: {frozenAmounts[selectedSymbol].toFixed(8)}{" "}
                        {selectedSymbol.toUpperCase()})
                      </span>
                    )}
                  </p> */}
                </p>
              </div>
              <div
                className="wallet-tabs"
                style={{
                  width: "100%",
                  gap: "20px",
                  justifyContent:
                    selectedTab === "Send" || selectedTab === "Receive"
                      ? "center"
                      : "space-evenly",
                }}
              >
                <button
                  style={{ borderRadius: "0" }}
                  data-tab="Receive"
                  className={selectedTab === "Receive" ? "active" : ""}
                  onClick={() => handleTabClick("Receive")}
                >
                  Receive
                </button>
                <button
                  style={{ borderRadius: "0" }}
                  data-tab="Send"
                  className={selectedTab === "Send" ? "active" : ""}
                  onClick={() => handleTabClick("Send")}
                >
                  Send
                </button>
                <button
                  style={{ borderRadius: "0" }}
                  data-tab="Convert"
                  className={selectedTab === "Convert" ? "active" : ""}
                  onClick={() => handleTabClick("Convert")}
                >
                  Convert
                </button>
              </div>

              {selectedTab === "Receive" && (
                <div id="Receive" className="tab-content active">
                  {/* <p style={{ marginTop: "20px", marginBottom: "10px" }}>
                    Deposit
                  </p> */}
                  {/* <div className="wallet-buttons">
                    <span
                      className="recharge-link"
                      onClick={() => setShowRechargeModal(true)}
                      style={{
                        marginTop: "10px",
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          color: "#7d9aea",
                          marginTop: "20px",
                          borderBottom: "0.5px solid #7d9aea ",
                          width: "80px",
                        }}
                      >
                        Recharge
                      </p>
                    </span>
                  </div> */}
                  <div
                    className="wallet-qr"
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      color: "white",
                    }}
                  >
                    {isLoadingWalletInfo ? (
                      <p>Loading address…</p>
                    ) : address1 ? (
                      <>
                        <div className="qr-wrapper">
                          <QRCode
                            value={address1}
                            size={150}
                            fgColor="#fff"
                            bgColor="transparent"
                          />
                        </div>
                        <div
                          className="address-copy-container"
                          style={{
                            position: "relative",
                            display: "inline-block",
                            marginBottom: 10,
                            marginTop: "20px",
                          }}
                        >
                          <span
                            className="break-all"
                            style={{ fontSize: "12px" }}
                          >
                            {address1}
                          </span>
                          <button
                            className="copy-link"
                            onClick={() => {
                              navigator.clipboard.writeText(address1);
                              setShowCopiedMessage(true);
                              setTimeout(
                                () => setShowCopiedMessage(false),
                                2000
                              );
                            }}
                          >
                            {showCopiedMessage ? (
                              <>
                                <i className="fas fa-check"></i>
                                Copied
                              </>
                            ) : (
                              <>
                                <i className="fas fa-clipboard"></i>
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p>No address found for {selectedSymbol.toUpperCase()}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedTab === "Send" && (
                <div id="Send" className="tab-content active">
                  {/* <p>Send Cryptocurrency</p> */}
                  <form onSubmit={handleSendSubmit}>
                    <div className="form-group">
                      {showSuccessPopup && (
                        <div
                          className="modal show"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            position: "fixed",
                            top: "0",
                            left: "0",
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            zIndex: "1000",
                          }}
                        >
                          <div
                            className="modal-content"
                            style={{
                              backgroundColor: "#fefefe",
                              margin: "5% auto",
                              padding: "20px",
                              border: "1px solid #888",
                              width: "80%",
                              maxWidth: "400px",
                              borderRadius: "10px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              textAlign: "center",
                            }}
                          >
                            <span
                              className="close"
                              onClick={() => setShowSuccessPopup(false)}
                              style={{
                                color: "#aaa",
                                float: "right",
                                fontSize: "28px",
                                fontWeight: "bold",
                                cursor: "pointer",
                              }}
                            >
                              &times;
                            </span>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                              }}
                            >
                              <div
                                className="success-animation"
                                style={{ marginBottom: "20px" }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={modalIconColor}
                                  width="80px"
                                  height="80px"
                                >
                                  <path d="M0 0h24v24H0z" fill="none" />
                                  <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                                  {modalIconColor === "red" && (
                                    <path
                                      d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                                      fill="red"
                                    />
                                  )}
                                </svg>
                              </div>
                            </div>
                            <h2 style={{ color: "black" }}>{modalMessage}</h2>
                            <button
                              onClick={() => setShowSuccessPopup(false)}
                              style={{
                                display: "block",
                                width: "100%",
                                padding: "10px",
                                background:
                                  "linear-gradient(to right, #4caf50, #81c784)",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                fontSize: "16px",
                                marginTop: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              }}
                            >
                              OK
                            </button>
                          </div>
                        </div>
                      )}
                      <label style={{ fontSize: "12px", marginTop: "5px" }}>
                        USD Amount:
                      </label>{" "}
                      <div
                        style={{
                          display: "flex",
                          padding: "2px 2px 2px 2px",
                        }}
                      >
                        <input
                          type="number"
                          value={usdAmount}
                          onChange={(e) => {
                            const usd = parseFloat(e.target.value) || 0;
                            setUsdAmount(usd.toString());
                            // crypto = usd / cgPrice
                            const crypto = cgPrice > 0 ? usd / cgPrice : 0;
                            setAmount(crypto.toFixed(8));
                          }}
                          style={{ flex: 1, height: 25, padding: "0 8px" }}
                          placeholder="0.00"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const maxCrypto =
                              walletData?.balances?.[selectedSymbol] || 0;
                            setAmount(maxCrypto.toString());
                            setUsdAmount((maxCrypto * cgPrice).toFixed(2));
                          }}
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: "12px" }}>
                        {selectedSymbol.toUpperCase()} Value:
                      </label>
                      <div
                        style={{
                          display: "flex",
                          padding: "1px 1px 1px 1px",
                        }}
                      >
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => {
                            const crypto = parseFloat(e.target.value) || 0;
                            setAmount(crypto.toString());
                            // USD = crypto * cgPrice
                            setUsdAmount((crypto * cgPrice).toFixed(2));
                          }}
                          style={{ flex: 1, height: 25, padding: "0 8px" }}
                          placeholder="0.00000000"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const maxCrypto =
                              walletData?.balances?.[selectedSymbol] || 0;
                            setAmount(maxCrypto.toString());
                            setUsdAmount((maxCrypto * cgPrice).toFixed(2));
                          }}
                        >
                          Max
                        </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label style={{ fontSize: "12px" }}>
                        Wallet Address:
                      </label>
                      <input
                        type="text"
                        value={address}
                        style={{ width: "230px", height: "25px" }}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={handlePaste}
                        style={{ marginLeft: "10px" }}
                      >
                        Paste
                      </button>
                    </div>
                    <button
                      type="submit"
                      className="send-button"
                      style={{
                        backgroundColor: "#7d9aea",
                        color: "white",
                        position: "relative",
                        height: "35px",
                        textAlign: "center",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: "20px",
                      }}
                    >
                      Proceed to Send
                    </button>
                  </form>
                </div>
              )}

              {selectedTab === "Convert" && (
                <div id="Convert" className="tab-content active">
                  <div className="wallet">
                    {console.log(selectedSymbol)}
                    {selectedSymbol === "tether" ? (
                      <form onSubmit={handleConvert}>
                        {/* <p>Convert USD to Another Cryptocurrency</p> */}
                        {showMessageModal && (
                          <div
                            className="modal show"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "fixed",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.4)",
                              zIndex: "1000",
                            }}
                          >
                            <div
                              className="modal-content"
                              style={{
                                backgroundColor: "#fefefe",
                                margin: "5% auto",
                                padding: "20px",
                                border: "1px solid #888",
                                width: "80%",
                                maxWidth: "400px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                              }}
                            >
                              <span
                                className="close"
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                  color: "#aaa",
                                  float: "right",
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                              >
                                &times;
                              </span>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  className="success-animation"
                                  style={{ marginBottom: "20px" }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={modalIconColor} // Use the modalIconColor
                                    width="80px"
                                    height="80px"
                                  >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                                    {modalIconColor === "red" && (
                                      <path
                                        d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                                        fill="red"
                                      />
                                    )}
                                  </svg>
                                </div>
                              </div>
                              <h2 style={{ color: "black" }}>{modalMessage}</h2>
                              <p>
                                {
                                  modalIconColor === "green"
                                  // ? "Your order has been successfully submitted."
                                }
                              </p>
                              <button
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  padding: "10px",
                                  background:
                                    "linear-gradient(to right, #4caf50, #81c784)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  marginTop: "10px",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        )}

                        <div className="form-group">
                          <label>USDT Amount:</label>
                          <div
                            style={{
                              padding: "10px 10px 10px 10px",
                              display: "flex",
                            }}
                          >
                            <input
                              type="number"
                              value={usdtValue}
                              style={{ marginRight: "10px" }}
                              onChange={(e) => handleConvertAmountChange(e)}
                              required
                            />
                            <button type="button" onClick={handleMaxConvertUSD}>
                              Max
                            </button>
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Select Cryptocurrency:</label>
                          <select
                            className="select11"
                            style={{
                              width: "90%",
                              height: "40px",
                              fontSize: "12px",
                            }}
                            value={selectedSymbol}
                            onChange={(e) => {
                              setSelectedSymbol(e.target.value);
                            }}
                            required
                          >
                            <option value="">Select...</option>
                            {primaryWallets.map((sym) => (
                              <option key={sym} value={sym}>
                                {sym}{" "}
                                {/* or use a mapping from sym→fullname if you have one */}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="submit"
                          className="convert-button"
                          style={{ backgroundColor: "#7d9aea", color: "white" }}
                        >
                          Convert
                        </button>
                      </form>
                    ) : (
                      <form onSubmit={handleConvertSubmit}>
                        {showSuccessPopup && (
                          <div
                            className="modal show"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "fixed",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.4)",
                              zIndex: "1000",
                            }}
                          >
                            <div
                              className="modal-content"
                              style={{
                                backgroundColor: "#fefefe",
                                margin: "5% auto",
                                padding: "20px",
                                border: "1px solid #888",
                                width: "80%",
                                maxWidth: "400px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                              }}
                            >
                              <span
                                className="close"
                                onClick={() => setShowSuccessPopup(false)}
                                style={{
                                  color: "#aaa",
                                  float: "right",
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                              >
                                &times;
                              </span>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  className="success-animation"
                                  style={{ marginBottom: "20px" }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={modalIconColor} // Use the modalIconColor
                                    width="80px"
                                    height="80px"
                                  >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                                    {modalIconColor === "red" && (
                                      <path
                                        d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                                        fill="red"
                                      />
                                    )}
                                  </svg>
                                </div>
                              </div>
                              <h2 style={{ color: "black" }}>{modalMessage}</h2>
                              <button
                                onClick={() => setShowSuccessPopup(false)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  padding: "10px",
                                  background:
                                    "linear-gradient(to right, #4caf50, #81c784)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  marginTop: "10px",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        )}
                        <p>{selectedSymbol.toUpperCase()} / USDT</p>
                        {showMessageModal && (
                          <div
                            className="modal show"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              position: "fixed",
                              top: "0",
                              left: "0",
                              width: "100%",
                              height: "100%",
                              backgroundColor: "rgba(0, 0, 0, 0.4)",
                              zIndex: "1000",
                            }}
                          >
                            <div
                              className="modal-content"
                              style={{
                                backgroundColor: "#fefefe",
                                margin: "5% auto",
                                padding: "20px",
                                border: "1px solid #888",
                                width: "80%",
                                maxWidth: "400px",
                                borderRadius: "10px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                textAlign: "center",
                              }}
                            >
                              <span
                                className="close"
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                  color: "#aaa",
                                  float: "right",
                                  fontSize: "28px",
                                  fontWeight: "bold",
                                  cursor: "pointer",
                                }}
                              >
                                &times;
                              </span>
                              <div
                                style={{
                                  width: "100%",
                                  display: "flex",
                                  justifyContent: "center",
                                }}
                              >
                                <div
                                  className="success-animation"
                                  style={{ marginBottom: "20px" }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill={modalIconColor} // Use the modalIconColor
                                    width="80px"
                                    height="80px"
                                  >
                                    <path d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                                    {modalIconColor === "red" && (
                                      <path
                                        d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                                        fill="red"
                                      />
                                    )}
                                  </svg>
                                </div>
                              </div>
                              <h2 style={{ color: "black" }}>{modalMessage}</h2>
                              <p>
                                {modalIconColor === "green"
                                  ? "Your order has been successfully submitted."
                                  : "There was an error with your submission."}
                              </p>
                              <button
                                onClick={() => setShowMessageModal(false)}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  padding: "10px",
                                  background:
                                    "linear-gradient(to right, #4caf50, #81c784)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  marginTop: "10px",
                                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                }}
                              >
                                OK
                              </button>
                            </div>
                          </div>
                        )}

                        <div
                          className="form-group"
                          style={{
                            marginTop: "20px",
                            display: "flex",
                            justifyContent: "center",
                            textAlign: "center",
                            alignItems: "center",
                          }}
                        >
                          <label style={{ fontSize: "12px" }}>
                            USDT Amount
                          </label>
                          <div className="form-group">
                            {/* <label>USDT Amount</label> */}
                            <div style={{ display: "flex", gap: 8 }}>
                              <input
                                type="number"
                                value={usdAmount}
                                onChange={(e) => {
                                  const usd = parseFloat(e.target.value) || 0;
                                  setUsdAmount(usd.toString());
                                  // crypto = usd / cgPrice
                                  const crypto =
                                    cgPrice > 0 ? usd / cgPrice : 0;
                                  setAmount(crypto.toFixed(8));
                                }}
                                style={{
                                  flex: 1,
                                  height: 32,
                                  padding: "0 8px",
                                }}
                                placeholder="0.00"
                                required
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const maxCrypto =
                                    walletData?.balances?.[selectedSymbol] || 0;
                                  setAmount(maxCrypto.toString());
                                  setUsdAmount(
                                    (maxCrypto * cgPrice).toFixed(2)
                                  );
                                }}
                              >
                                Max
                              </button>
                            </div>
                          </div>
                        </div>
                        <div
                          className="form-group"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            textAlign: "center",
                            alignItems: "center",
                          }}
                        >
                          <label
                            style={{
                              fontSize: "12px",
                              marginTop: "3px",
                              width: "50px",
                            }}
                          >
                            Asset Value
                          </label>
                          <input
                            type="number"
                            value={amount}
                            onChange={(e) => {
                              const crypto = parseFloat(e.target.value) || 0;
                              setAmount(crypto.toString());
                              // USD = crypto * cgPrice
                              setUsdAmount((crypto * cgPrice).toFixed(2));
                            }}
                            style={{ flex: 1, height: 32, padding: "0 8px" }}
                            placeholder="0.00000000"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const maxCrypto =
                                walletData?.balances?.[selectedSymbol] || 0;
                              setAmount(maxCrypto.toString());
                              setUsdAmount((maxCrypto * cgPrice).toFixed(2));
                            }}
                          >
                            Max
                          </button>
                        </div>
                        <div className="wallet-buttons">
                          <span className="currency-tag">To</span>
                          <span
                            className="currency"
                            style={{ marginRight: "2px" }}
                          >
                            USDT
                          </span>
                          <input
                            style={{
                              height: "30px",
                              marginLeft: "10px",
                              width: "100px",
                              marginRight: "30px",
                            }}
                            type="text"
                            value={usdtValue}
                            placeholder="0"
                            className="input-field small-input"
                            readOnly
                          />
                        </div>
                        <button
                          type="submit"
                          className="convert-button"
                          style={{ backgroundColor: "#7d9aea", color: "white" }}
                        >
                          Proceed to Convert
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showTransferModalU && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>
              Transfer USDT from{" "}
              {activeMainTab === "futures" ? "Futures" : "Stake"} to Main Wallet
            </h2>
            <p>
              Available:{" "}
              {activeMainTab === "futures"
                ? futuresBalance.toFixed(2)
                : stakeBalance.toFixed(2)}{" "}
              USDT
            </p>
            <input
              type="number"
              placeholder="Enter amount"
              value={transferAmount}
              max={activeMainTab === "futures" ? futuresBalance : stakeBalance}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                const maxAmount =
                  activeMainTab === "futures" ? futuresBalance : stakeBalance;
                if (val <= maxAmount) {
                  setTransferAmount(e.target.value);
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                marginTop: "10px",
                marginBottom: "10px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
            <button
              onClick={async () => {
                const amount = parseFloat(transferAmount);
                if (!amount || amount <= 0) {
                  alert("Please enter valid amount");
                  return;
                }

                // Trigger transfer
                if (activeMainTab === "futures") {
                  await transferFromFutures(transferAmount);
                } else if (activeMainTab === "investment") {
                  await transferFromStake(transferAmount);
                }

                // Close modal after transfer
                setShowTransferModal(false);
                setTransferAmount("");
              }}
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#4caf50",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Transfer
            </button>

            <button
              onClick={() => setShowTransferModalU(false)}
              style={{
                marginTop: "10px",
                width: "100%",
                padding: "10px",
                backgroundColor: "#f44336",
                color: "white",
                border: "none",
                borderRadius: "5px",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showTransferModal && (
        <div
          className="modal show"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#1e1e1e",
              padding: "20px",
              borderRadius: "10px",
              width: "90%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <span
              style={{
                color: "#aaa",
                float: "right",
                fontSize: "28px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => setShowTransferModal(false)}
            >
              &times;
            </span>

            <h2 style={{ color: "white", marginBottom: "20px" }}>
              Transfer USDT to Futures or Stake Wallet
            </h2>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <input
                type="number"
                placeholder="Enter USDT amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  color: "black",
                }}
              />
              <select
                value={transferTarget}
                onChange={(e) => setTransferTarget(e.target.value)}
                style={{
                  padding: "10px",
                  borderRadius: "5px",
                  color: "black",
                }}
              >
                <option value="futures">Futures</option>
                <option value="stake">Stake</option>
              </select>
              <button
                onClick={handleTransfer}
                style={{
                  backgroundColor: "black",
                  color: "white",
                  borderRadius: "30px",
                  width: "100px",
                  height: "30px",
                  /* your styles */
                }}
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}

      {showRechargeModal && (
        <div
          className="modal show"
          id="recharge-modal"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            zIndex: 1000,
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            overflow: "auto",
            // backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        >
          <div
            id="recharggge"
            className="modal-content"
            style={{
              // backgroundColor: "#222e35",
              paddingTop: "10px",
              padding: "20px",
              border: "1px solid #888",
              width: "90%",
              maxWidth: "400px",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              maxHeight: "87%", // Add maxHeight for scrolling
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <span
              className="close"
              onClick={() => setShowRechargeModal(false)}
              style={{
                color: "#aaa",
                fontSize: "28px",
                fontWeight: "bold",
                position: "absolute",
                top: "10px",
                right: "20px",
                cursor: "pointer",
              }}
            >
              &times;
            </span>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                textAlign: "center",
                alignItems: "center",
              }}
            >
              <h2>{selectedSymbol.toUpperCase()} Recharge </h2>
            </div>

            {showSuccessPopup && (
              <div
                className="modal show"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "fixed",
                  top: "0",
                  left: "0",
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  zIndex: "1000",
                }}
              >
                <div
                  className="modal-content"
                  style={{
                    backgroundColor: "#fefefe",
                    margin: "5% auto",
                    padding: "20px",
                    border: "1px solid #888",
                    width: "80%",
                    maxWidth: "400px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    textAlign: "center",
                  }}
                >
                  <span
                    className="close"
                    onClick={() => setShowSuccessPopup(false)}
                    style={{
                      color: "#aaa",
                      float: "right",
                      fontSize: "28px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </span>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="success-animation"
                      style={{ marginBottom: "20px" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={modalIconColor}
                        width="80px"
                        height="80px"
                      >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 6.63 5.37 12 12 12s12-5.37 12-12C24 5.37 18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10zM10 17.2l-5.3-5.3 1.4-1.4 3.9 3.9 7.9-7.9 1.4 1.4L10 17.2z" />
                        {modalIconColor === "red" && (
                          <path
                            d="M15.41 8.59L12 12l-3.41-3.41L7 10l5 5 5-5z"
                            fill="red"
                          />
                        )}
                      </svg>
                    </div>
                  </div>
                  <h2 style={{ color: "black" }}>{modalMessage}</h2>
                  <button
                    onClick={() => {
                      setShowSuccessPopup(false);
                      setRechargeSuccessMessage(""); // Reset the message
                      setShowRechargeModal(false); // Close the modal
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      padding: "10px",
                      background: "linear-gradient(to right, #4caf50, #81c784)",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      cursor: "pointer",
                      fontSize: "16px",
                      marginTop: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}

            {/* The existing form content remains as it is */}
            {!showSuccessPopup && (
              <form onSubmit={handleRechargeSubmit} style={{ height: "500px" }}>
                {/* <div className="form-group">
                  <label>Currency</label>
                  <input
                    type="text"
                    value={selectedSymbol.toUpperCase()}
                    readOnly
                  />
                </div> */}
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>Network</label>
                  <input
                    type="text"
                    value={selectedSymbol.toUpperCase()}
                    readOnly
                    style={{ height: "30px" }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>Address</label>
                  <input
                    type="text"
                    value={walletInfo.walletAddress}
                    readOnly
                    style={{ height: "30px" }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>USDT Value:</label>
                  <input
                    type="number"
                    value={usdDepositAmount}
                    onChange={handleUsdDepositAmountChange}
                    required
                    style={{ height: "30px" }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>
                    {selectedSymbol.toUpperCase()} Amount:
                  </label>
                  <input
                    type="number"
                    value={cryptoDepositAmount}
                    onChange={handleCryptoDepositAmountChange}
                    required
                    style={{ height: "30px" }}
                  />
                </div>
                <div className="form-group">
                  <label style={{ fontSize: "12px" }}>Upload Screenshot</label>
                  <div
                    className="upload-screenshot"
                    onClick={() =>
                      document.getElementById("file-upload").click()
                    }
                  >
                    <span className="upload-icon">&#128247;</span>
                    <p
                      id="upload-text"
                      style={{ marginBottom: "20px", fontSize: "18px" }}
                    >
                      Upload Screenshot Here!
                    </p>
                    <img
                      id="uploaded-image"
                      style={{
                        display: "none",
                        maxWidth: "100%",
                        height: "auto",
                      }}
                      alt="uploaded"
                    />
                  </div>
                  <input
                    type="file"
                    id="file-upload"
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        document.getElementById("uploaded-image").src =
                          event.target.result;
                        document.getElementById(
                          "uploaded-image"
                        ).style.display = "block";
                        document.getElementById("upload-text").style.display =
                          "none";
                      };
                      reader.readAsDataURL(file);
                      setProof(file);
                    }}
                  />
                </div>
                <div style={{ padding: "0 0 10px 0" }}>
                  <button
                    type="submit"
                    className="submit-button"
                    style={{
                      backgroundColor: "#7d9aea",
                      color: "white",
                      position: "relative",
                      height: "40px",
                      textAlign: "center",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      // Centers content vertically
                    }}
                    disabled={isLoadingRecharge} // Disable the button when loading
                  >
                    {isLoadingRecharge && (
                      <div
                        className="loading-overlay"
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          zIndex: 1000,
                        }}
                      >
                        <div
                          className="loading-spinner"
                          style={{
                            border: "4px solid #f3f3f3",
                            borderTop: "4px solid #3498db",
                            borderRadius: "50%",
                            width: "30px",
                            height: "30px",
                            animation: "spin 1s linear infinite",
                          }}
                        ></div>
                      </div>
                    )}
                    Submit
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      {/* {showLoginModal && <Login closeModal={() => setShowLoginModal(false)} />}
      {showSignupModal && (
        <SignupModal closeModal={() => setShowSignupModal(false)} />
      )}
      {!showRechargeModal && !showCryptoModal && !showSuccessPopup && (
        <Footer />
      )} */}
      {/* <Footer /> */}
    </div>
  );
};

export default WalletDashboard;
