import React, { useState } from "react";
import "./FAQSection.css";
import QA from "./QA.png";
const faqs = [
  {
    question: "What is TrustCoinFX?",
    answer:
      "TrustCoinFX is a next-gen cryptocurrency investment platform built for performance, flexibility, and security. Offering futures trading, fixed-ROI investment plans, and secure staking options, it empowers both retail and institutional investors. With integrated portfolio tools, risk analytics, and seamless non-custodial wallet support, TrustCoinFX provides everything needed to navigate the digital asset economy with confidence.",
  },
  {
    question: "How do I start trading on TrustCoinFX?",
    answer:
      "Getting started is simple:\n\n- Sign up using your email and enter your referral link.\n- Log in to your account.\n- Connect your Web3 wallet (MetaMask, Trust Wallet, SafePal, or Exodus).\n- Open TrustCoinFX in your wallet’s DApp browser and tap 'Connect Wallet.'\n- Fund your account with ETH, BTC, USDT, USDC, XRP, or SOL.\n- You're now ready to trade or invest.",
  },
  {
    question: "Is my investment safe with TrustCoinFX?",
    answer:
      "Yes. TrustCoinFX uses multi-layered security, including end-to-end encryption, smart contract protections, and secure wallet integration. All transactions are done through non-custodial Web3 wallets, ensuring full control. Compliance policies also guard against fraud.",
  },
  {
    question: "Can beginners use TrustCoinFX effectively?",
    answer:
      "Yes. TrustCoinFX is beginner-friendly with intuitive dashboards, guided steps, and educational tools. Everything is designed to make investing simple, secure, and accessible.",
  },
  {
    question: "What makes TrustCoinFX different from other crypto platforms?",
    answer:
      "TrustCoinFX is fully decentralized and non-custodial, offering users complete control of their funds. It features a streamlined interface, fixed-ROI plans, and community-driven insights.",
  },
  {
    question: "How do I top up or recharge my assets in TrustCoinFX?",
    answer:
      "Step 1: Prepare Your Assets\n- Use a Web3 wallet like MetaMask, Trust Wallet, SafePal, or Exodus.\n- Transfer funds from a centralized exchange if needed.\n\nStep 2: Get Your Wallet Address\n- Log in to TrustCoinFX and go to 'Wallet'.\n- Select your asset and copy the address.\n\nStep 3: Transfer Assets\n- Send crypto from your wallet to the copied address.\n- Save the transaction screenshot.\n\nStep 4: Submit Recharge Request\n- Click 'Recharge' in your Wallet section.\n- Enter amount and upload screenshot.\n- Submit the request.\n\nStep 5: Confirmation\n- Funds are credited after blockchain verification.",
  },
  {
    question: "What cryptocurrencies can I use on TrustCoinFX?",
    answer:
      "Supported assets include ETH, BTC, USDC, USDT, XRP, SOL, BNB, MATIC, and others listed on the platform.",
  },
  {
    question: "How does staking work on TrustCoinFX?",
    answer:
      "Users can lock eligible crypto into fixed-ROI plans. Rewards are calculated daily and paid at maturity.",
  },
  {
    question: "What are the minimum and maximum investment amounts?",
    answer:
      "Minimum investments start at $500. Maximums vary by plan, going up to $1,000,000.",
  },
  {
    question: "How do I withdraw my earnings?",
    answer:
      "After a plan matures, go to 'Wallet', select your asset, and withdraw to your connected wallet.",
  },
  {
    question: "Are there any fees for deposits or withdrawals?",
    answer:
      "Yes. Network and platform fees may apply and are clearly shown before confirmation.",
  },
  {
    question: "Can I cancel an investment plan before it matures?",
    answer:
      "No. All plans are fixed-term and cannot be cancelled before maturity.",
  },
  {
    question: "What is the ROI structure for each plan?",
    answer:
      "Each plan has a fixed ROI, displayed during plan selection. Returns and principal are paid together at the end.",
  },
  {
    question: "How are staking rewards calculated and distributed?",
    answer:
      "Staking rewards are based on locked capital and ROI rate, credited in one payout at plan end.",
  },
  {
    question: "Does TrustCoinFX support mobile wallets and browsers?",
    answer:
      "Yes. The platform works with mobile Web3 wallets and is optimized for mobile browsers.",
  },
  {
    question: "Is KYC required?",
    answer:
      "No KYC is needed for most users. High-volume and institutional users may require verification.",
  },
  {
    question: "What happens if I send the wrong coin to a wallet address?",
    answer:
      "Sending unsupported assets may result in permanent loss. Always confirm the asset and wallet address before sending.",
  },
  {
    question: "Can I reinvest my profits into another plan automatically?",
    answer:
      "Auto-reinvest is not available, but manual reinvestment is supported via the dashboard.",
  },
  {
    question: "How long does a recharge take to reflect?",
    answer:
      "Recharge times vary based on network congestion but typically range from a few minutes to one hour.",
  },
  {
    question: "What kind of support does TrustCoinFX offer?",
    answer:
      "24/7 support is available via live chat and email for all technical, wallet, and investment-related inquiries.",
  },
  {
    question: "Is TrustCoinFX available globally?",
    answer:
      "Yes. TrustCoinFX is accessible worldwide, except in regions with legal restrictions on crypto trading.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const renderFAQ = (faqList) =>
    faqList.map((faq, index) => (
      <div
        key={index}
        className={`faq-item ${openIndex === index ? "open" : ""}`}
        onClick={() => toggleFAQ(index)}
      >
        <div className="faq-question">
          <h3>{faq.question}</h3>
          <span className="faq-icon">{openIndex === index ? "▲" : "▼"}</span>
        </div>
        {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
      </div>
    ));

  return (
    <section className="faq-section">
      <div className="faq-content">
        <p style={{ fontSize: "25px", marginBottom: "10px" }}>
          Frequently Asked Questions
        </p>
        <p>
          Your Queries Answered: Unveiling the Essentials of Crypto Trading and
          Investment with TrustCoinFX
        </p>
        <button className="faq-button" onClick={() => setIsModalOpen(true)}>
          More Questions?
        </button>
      </div>

      <div className="faq-list">{renderFAQ(faqs.slice(0, 5))}</div>

      {/* Modal for More Questions */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal1"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="modal-header">
              <h2>More Questions</h2>
              <button
                className="close-button"
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-faqs">{renderFAQ(faqs.slice(5))}</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FAQSection;
