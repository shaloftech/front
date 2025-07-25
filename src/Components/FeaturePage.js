import React from "react";
import MainContentFeatures from "./MainContentFeatures";
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
import TradeViewChart from "./TradeViewChart";

const FeaturePage = () => {
  return (
    <div>
      <MainContentFeatures />
      {/* <TradeViewChart/> */}
      <CryptoInfoSection />
      {/* <TradeInvestStake />
      <CryptoPlan /> */}
      {/* <StakingInvestments /> */}
      {/* <CurrencyExchange /> */}
      {/* <CryptoConversions />
      <CryptoTable /> */}
      <CryptoExcellence />
      {/* <TradingJourney /> */}
      {/* <FAQSection /> */}
      <ClientTestimonials />
    </div>
  );
};

export default FeaturePage;
