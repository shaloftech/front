import React from "react";
import MainContent from "./MainContent";
import CryptoInfoSection from "./CryptoInfoSection";
import TradeInvestStake from "./TradeInvestStake";
import CryptoPlan from "./CryptoPlans";
import StakingInvestments from "./StakingInvestments";
import CurrencyExchange from "./CurrencyExchange";
import CryptoTable from "./CryptoTable";
import CryptoConversions from "./CryptoConversions";
import CryptoExcellence from "./CryptoExcellence";
import TradingJourney from "./TradingJourney";
import FAQSection from "./FAQSection";
import ClientTestimonials from "./ClientTestimonials";
import Footer from "./Footer";
import CryptoNews from "./CryptoNews";
const Main1 = () => {
  return (
    <div>
      <MainContent />
      <CryptoInfoSection />
      <CryptoNews />
      <CryptoPlan />
      <TradeInvestStake />
      <StakingInvestments />
      <CurrencyExchange />
      <CryptoTable />
      <CryptoConversions />
      <CryptoExcellence />
      <TradingJourney />
      <FAQSection />
      <ClientTestimonials />
    </div>
  );
};

export default Main1;
