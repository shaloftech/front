import React from "react";
import Header from "./Header";
import "./TermsAndConditions.css";
import Footer from "./Footer";
const TermsAndConditions = () => {
  const Section = ({ title, children }) => (
    <section style={{ marginBottom: "2rem" }}>
      <h2 className="terms-section-title">{title}</h2>
      {children}
    </section>
  );
  return (
    <>
      <Header />
      <div
        className="terms-container"
        style={{
          padding: "2rem",
          maxWidth: "800px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <h1>Terms and Conditions – TrustCoinFX</h1>

        <Section title="1. Confidentiality">
          <p>
            TrustCoinFX complies with applicable data protection laws and treats
            all client data as strictly confidential. We do not disclose your
            information to third parties unless legally required or requested by
            authorized regulators.
          </p>
          <p>
            Clients may request access to their stored personal data at any
            time.
          </p>
        </Section>

        <Section title="2. Privacy Policy">
          <p>
            We prioritize your privacy. Any personal data collected is used only
            for service delivery, compliance, and support. Access to this data
            is restricted to authorized personnel. We do not sell or share
            client data with third parties.
          </p>
          <p>
            Our systems utilize EV SSL encryption (SHA-256 RSA) for secure
            communication. We also implement:
          </p>
          <ul>
            <li>Password-protected access</li>
            <li>Encrypted databases</li>
            <li>Strict internal handling procedures</li>
          </ul>
        </Section>

        <Section title="3. Know Your Customer (KYC) & Anti-Money Laundering (AML)">
          <p>
            We may request identity documents and transaction details to comply
            with KYC and AML laws. Users agree to provide this information
            promptly. Failure to comply may result in account suspension or
            termination.
          </p>
        </Section>

        <Section title="4. Account & Service Usage">
          <ul>
            <li>
              We reserve the right to suspend or terminate your account if terms
              are violated or usage is illegal under your jurisdiction.
            </li>
            <li>
              Only users aged 16+ (or legal age in your region) may register.
            </li>
            <li>
              You are responsible for keeping your login details secure and for
              all activities conducted under your account.
            </li>
          </ul>
        </Section>

        <Section title="5. Tax Compliance">
          <p>
            Users are solely responsible for determining, reporting, and paying
            any applicable taxes resulting from their use of TrustCoinFX
            services, in accordance with local tax laws.
          </p>
        </Section>

        <Section title="6. Risk Disclosure">
          <p>
            Digital asset trading is highly volatile and speculative. Key risks
            include:
          </p>
          <ul>
            <li>Loss of entire investment</li>
            <li>Market manipulation</li>
            <li>Regulatory impacts</li>
            <li>Technical or connectivity issues</li>
          </ul>
          <p>
            Only trade what you can afford to lose. We advise seeking
            professional advice if unsure.
          </p>
        </Section>

        <Section title="7. Website Usage">
          <ul>
            <li>
              All information on the site is for general guidance and does not
              constitute financial advice.
            </li>
            <li>
              We strive for 99% uptime, but do not guarantee uninterrupted
              service due to external factors (e.g., DDoS attacks, maintenance,
              natural disasters).
            </li>
            <li>
              We may restrict access temporarily for updates or emergencies
              without prior notice.
            </li>
          </ul>
        </Section>

        <Section title="8. Withdrawal Policy">
          <p>
            TrustCoinFX reserves the right to delay, hold, or limit withdrawals
            in cases of suspected fraud, security threats, or compliance audits.
            Users will be notified when possible, and we aim to minimize
            disruption.
          </p>
        </Section>

        <Section title="9. Account Suspension & Investigation">
          <p>
            We may suspend your account without notice if suspicious activity is
            detected. We reserve the right to retain funds during investigations
            and report to relevant authorities where necessary.
          </p>
        </Section>

        <Section title="10. Voluntary Account Termination">
          <p>
            Users may request account closure at any time. Remaining balances
            will be returned after necessary identity verification and
            compliance checks.
          </p>
        </Section>

        <Section title="11. Cookies & Logs">
          <ul>
            <li>
              We use cookies to improve user experience. You may disable them,
              but this may affect functionality.
            </li>
            <li>
              Server logs (IP, browser type, URL access) are collected for
              analytics and not linked to personal identity.
            </li>
          </ul>
        </Section>

        <Section title="12. Affiliate Program & External Links">
          <ul>
            <li>
              You may link to TrustCoinFX freely. Participation in the affiliate
              program requires using your unique referral link.
            </li>
            <li>
              Affiliates must not engage in spam or unsolicited promotions.
              Violations result in account termination.
            </li>
            <li>
              We are not responsible for third-party site content or privacy
              practices.
            </li>
          </ul>
        </Section>

        <Section title="13. Intellectual Property">
          <ul>
            <li>
              All site content, logos, code, and media are owned by TrustCoinFX.
            </li>
            <li>
              Reproduction is prohibited unless:
              <ul>
                <li>For personal, non-commercial use</li>
                <li>Shared with credit to TrustCoinFX</li>
              </ul>
            </li>
          </ul>
          <p>Unauthorized use may result in legal action.</p>
        </Section>

        <Section title="14. Communication & Support">
          <p>Clients may contact us via:</p>
          <ul>
            <li>Website support form</li>
            <li>Email</li>
            <li>WhatsApp</li>
            <li>Telegram</li>
          </ul>
          <p>
            All communications are monitored for quality and compliance. Abuse
            of staff or services may result in restriction or suspension.
          </p>
        </Section>

        <Section title="15. Legal Disclaimers">
          <ul>
            <li>Financial losses (direct or indirect)</li>
            <li>Profit loss, data corruption, or business disruption</li>
            <li>Use or misuse of our website content</li>
          </ul>
          <p>
            We do not exclude liability for death or injury caused by our
            negligence, within the limits of applicable law.
          </p>
        </Section>

        <Section title="16. Governing Law & Jurisdiction">
          <p>
            These Terms are governed by applicable law. Any disputes shall be
            subject to the exclusive jurisdiction of the competent courts.
          </p>
        </Section>

        <Section title="17. Restricted Territories">
          <p>
            Access to TrustCoinFX is prohibited in jurisdictions where digital
            asset trading is banned or restricted. Users are responsible for
            ensuring compliance with their local laws.
          </p>
        </Section>

        <Section title="18. Final Terms">
          <ul>
            <li>
              These terms become effective upon registration and are legally
              binding.
            </li>
            <li>
              We may update the terms without prior notice. Continued use
              indicates acceptance.
            </li>
            <li>
              If any part is found unenforceable, the rest remains in effect.
            </li>
            <li>
              This agreement does not establish a legal agency relationship.
            </li>
            <li>
              Unauthorized deposits or usage of accounts for third parties is
              prohibited and penalized.
            </li>
          </ul>
        </Section>

        <Section title="19. Language & Interpretation">
          <p>
            This agreement is published in English. If translated into other
            languages, the English version will take precedence in the event of
            any discrepancies.
          </p>
        </Section>

        <p style={{ marginTop: "3rem", fontWeight: "bold" }}>
          © 2025 TrustCoinFX – All rights reserved. A global crypto investment
          and trading platform.
        </p>
      </div>
      <Footer />
    </>
  );
};

const Section = ({ title, children }) => (
  <section style={{ marginBottom: "2rem" }}>
    <h2>{title}</h2>
    {children}
  </section>
);

export default TermsAndConditions;
