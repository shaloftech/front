import React from "react";
import "./TermsModal.css";

const termsData = {
  flash: [
    "The Flash Yield plan has a deposit limit and offers a 10% return on every new capital, inclusive of both returns and principal.",
    "The withdrawal limit is capped at 10 successful withdrawals per trade.",
    "A network fee and commission is required for the protection of beneficiaries and in alignment with agreements between The Platform and blockchain protocols.",
    "Return on investment is calculated, accrued, and transferred to the investor’s account daily, based on the selected Flash Yield package.",
    "The principal amount may either be repaid at the end of the term or distributed through daily payouts.",
    "Investors can add capital through supported non-custodial wallets such as MetaMask, SafePal, Exodus, and Trust Wallet.",
    "Accepted cryptocurrencies include ETH, BTC, USDC, USDT, XRP, SOL, and other listed coins.",
    "The Platform reserves the right to update the minimum and maximum deposit and withdrawl thresholds for any investment package without prior notification.",
  ],
  momentum: [
    "The Momentum Boost plan has a deposit threshold and offers a 5% return on every new capital, inclusive of both returns and principal.",
    "The withdrawal limit is capped at 10 successful withdrawals per trade, with withdrawals processed every 6 days.",
    "Only the return on investment (ROI) can be withdrawn during the active cycle.",
    "The principal will be available upon plan maturity, or can be reinvested into other eligible trade plans.",
    "A network fee and commission is required for the protection of beneficiaries and in accordance with agreements between The Platform and blockchain protocols.",
    "Return on investment is calculated, accrued, and credited to the investor’s account throughout the 2-month investment cycle, based on the selected Momentum Boost package.",
    "Investors can add capital through supported non-custodial wallets such as MetaMask, SafePal, Exodus, and Trust Wallet.",
    "Accepted cryptocurrencies include ETH, BTC, USDC, USDT, XRP, SOL, and other listed coins.",
    "The Platform reserves the right to adjust the minimum and maximum investment limits for any plan without prior notice.",
  ],
  alpha: [
    "The Alpha Vault plan has a deposit threshold and offers a 20% return on every new capital, inclusive of both returns and principal.",
    "The withdrawal limit is capped at 10 successful withdrawals per trade, with withdrawals processed every 3 days.",
    "Only the return on investment (ROI) can be withdrawn during the active term.",
    "The principal will be available upon plan maturity, or may be reinvested into other available trade plans.",
    "A network fee and commission is applied for the safety of beneficiaries and in compliance with blockchain protocols and platform security measures.",
    "Return on investment is calculated, accrued, and credited to the investor’s account throughout the 1-month investment cycle under the selected Alpha Vault plan.",
    "Investors can add capital through supported non-custodial wallets such as MetaMask, SafePal, Exodus, and Trust Wallet.",
    "Accepted cryptocurrencies include ETH, BTC, USDC, USDT, XRP, SOL, and other listed coins.",
    "The Platform reserves the right to modify the minimum and maximum deposit and withdrawl thresholds for any plan without prior notice.",
  ],
  flex: [
    "The FlexGrow plan offers a 1-day investment cycle with a 5% return on every new capital, inclusive of both returns and principal.",
    "The withdrawal limit is capped at 10 successful withdrawals per trade, with withdrawals processed daily.",
    "Only the return on investment (ROI) can be withdrawn during the cycle.",
    "The principal becomes available upon plan maturity, or can be reinvested into another plan of choice.",
    "A network fee and commission applies to ensure the safety of beneficiaries and alignment with blockchain protocol standards.",
    "Return on investment is calculated, accrued, and credited to the investor’s account at the end of each daily cycle under the FlexGrow plan.",
    "Investors can add capital through supported non-custodial wallets such as MetaMask, SafePal, Exodus, and Trust Wallet.",
    "Accepted cryptocurrencies include ETH, BTC, USDC, USDT, XRP, SOL, and other listed coins.",
    "The Platform reserves the right to revise the minimum and maximum investment limits for any plan without prior notice.",
  ],
  titan: [
    "The Titan Plan offers a 3-month investment cycle with a 40% return on every new capital, inclusive of both returns and principal.",
    "The withdrawal limit is capped at 10 successful withdrawals per trade, with withdrawals processed every 10 days.",
    "Only the return on investment (ROI) can be withdrawn during the active term.",
    "The principal will be available upon plan maturity, or may be reinvested into other eligible trade plans.",
    "A network fee and commission applies for the protection of beneficiaries and in accordance with the platform’s blockchain-based protocols.",
    "Return on investment is calculated, accrued, and credited to the investor’s account over the 3-month investment cycle, as per the Titan Plan structure.",
    "Investors can add capital through supported non-custodial wallets such as MetaMask, SafePal, Exodus, and Trust Wallet.",
    "Accepted cryptocurrencies include ETH, BTC, USDC, USDT, XRP, SOL, and other listed coins.",
    "The Platform reserves the right to update the minimum and maximum deposit and withdrawl thresholds for any investment plan without prior notice.",
  ],
};

const TermsModal = ({ planType, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>
          &times;
        </span>
        <h3>
          {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Terms &
          Conditions
        </h3>
        <ul className="terms-list">
          {termsData[planType].map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TermsModal;
