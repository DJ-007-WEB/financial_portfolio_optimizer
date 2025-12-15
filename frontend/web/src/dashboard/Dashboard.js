import { useEffect, useRef, useState } from "react";
import "./Dashboard.css";
import InfoCard from "../components/InfoCard";
import PortfolioSection from "../portfolio/PortfolioSection";
import RiskSection from "../risk/RiskSection";
import { getWallet, getMarketQuote } from "../api/backend";

const INVESTMENT_OPTIONS = [
  {
    title: "Growth Equity Basket",
    risk: "High",
    description: "Focused on high-quality growth stocks across sectors.",
  },
  {
    title: "Balanced Smart Portfolio",
    risk: "Medium",
    description: "Blend of equity and debt aligned to your risk profile.",
  },
  {
    title: "Capital Protection Plan",
    risk: "Low",
    description: "Preserve capital with limited equity exposure.",
  },
  {
    title: "Tax Efficient Portfolio",
    risk: "Medium",
    description: "Optimize for post-tax returns using compliant instruments.",
  },
  {
    title: "Bluechip Dividend Focus",
    risk: "Medium",
    description: "Stable large caps with strong dividend history.",
  },
  {
    title: "Satellite Opportunities",
    risk: "High",
    description: "Small tactical bets around your core holdings.",
  },
];

const MARKET_NEWS = [
  {
    title: "Nifty, Sensex close higher as financials lead rally",
    source: "Economic Times",
    url: "https://economictimes.indiatimes.com/markets",
  },
  {
    title: "Global markets digest Fed commentary on rates",
    source: "Bloomberg",
    url: "https://www.bloomberg.com/markets",
  },
  {
    title: "Earnings season: Key stocks to watch this week",
    source: "Reuters",
    url: "https://www.reuters.com/markets/",
  },
];

export default function Dashboard({ user, activeSection }) {
  const [riskProfile, setRiskProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [showBalance, setShowBalance] = useState(false);

  const dashboardRef = useRef(null);
  const riskRef = useRef(null);
  const portfolioRef = useRef(null);

  useEffect(() => {
    const sectionMap = {
      dashboard: dashboardRef,
      risk: riskRef,
      portfolio: portfolioRef,
    };

    const target = sectionMap[activeSection];
    if (target?.current) {
      target.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeSection]);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchWalletAndValue() {
      try {
        setWalletLoading(true);
        setWalletError("");
        const data = await getWallet(user.id);
        setWallet(data);

        const holdings = data?.holdings || [];
        if (!holdings.length) {
          setPortfolioValue(0);
          return;
        }

        const quotes = await Promise.all(
          holdings.map((h) =>
            getMarketQuote(h.symbol).catch(() => null)
          )
        );

        let total = 0;
        holdings.forEach((h, idx) => {
          const q = quotes[idx];
          if (q && typeof q.last_price === "number") {
            total += h.quantity * q.last_price;
          }
        });

        setPortfolioValue(total);
      } catch (err) {
        setWalletError("Unable to load wallet details right now.");
      } finally {
        setWalletLoading(false);
      }
    }

    fetchWalletAndValue();
  }, [user]);

  const maskedBalance = showBalance
    ? `₹ ${Number(wallet?.balance || 0).toFixed(2)}`
    : "₹ ••••••";

  return (
    <div className="dashboard">
      {/* 1) Welcome */}
      <div className="dashboard-header" ref={dashboardRef}>
        <h2>Welcome, {user?.name || "Investor"} 👋</h2>
        <p className="subtitle">
          Get a live view of your holdings, risk profile and AI-driven allocation.
        </p>
      </div>

      {/* 2) Cards already present */}
      <div className="dashboard-cards">
        <InfoCard
          title="Risk Category"
          value={riskProfile?.category || "Not Assessed"}
          subtitle="Based on your answers"
        />

        <InfoCard
          title="Portfolio Status"
          value={riskProfile ? "Ready" : "Incomplete"}
          subtitle="Complete risk assessment first"
        />

        <InfoCard
          title="AI Engine"
          value="Enabled"
          subtitle="Smart allocation"
        />
      </div>

      {/* 3) Balance & current portfolio value */}
      <div className="dashboard-section wallet-section">
        <h3>Your Capital Overview</h3>
        {walletLoading ? (
          <p className="subtitle">Loading wallet & holdings...</p>
        ) : walletError ? (
          <p className="text-danger">{walletError}</p>
        ) : (
          <div className="wallet-grid">
            <div className="wallet-box">
              <div className="wallet-label">
                Available Balance
                <button
                  type="button"
                  className="toggle-balance-btn"
                  onClick={() => setShowBalance((v) => !v)}
                >
                  {showBalance ? "Hide" : "Show"}
                </button>
              </div>
              <div className="wallet-value">{maskedBalance}</div>
            </div>

            <div className="wallet-box">
              <div className="wallet-label">Current Portfolio Value</div>
              <div className="wallet-value">
                ₹ {Number(portfolioValue || 0).toFixed(2)}
              </div>
            </div>

            <div className="wallet-holdings">
              <div className="wallet-label">Holdings</div>
              {wallet?.holdings?.length ? (
                wallet.holdings.map((h) => (
                  <div key={h.symbol} className="holding-row">
                    <span>{h.symbol}</span>
                    <span>{h.quantity} units</span>
                  </div>
                ))
              ) : (
                <p className="subtitle">You don&apos;t hold any assets yet.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4) Investment options cards */}
      <div className="dashboard-section">
        <h3>Investment Ideas Curated For You</h3>
        <p className="subtitle">
          Explore model portfolios aligned with different risk levels.
        </p>
        <div className="investment-grid">
          {INVESTMENT_OPTIONS.map((opt) => (
            <div key={opt.title} className="investment-card">
              <div className="investment-header">
                <h4>{opt.title}</h4>
                <span className={`risk-pill risk-${opt.risk.toLowerCase()}`}>
                  {opt.risk} risk
                </span>
              </div>
              <p>{opt.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 5) Latest Market news */}
      <div className="dashboard-section">
        <h3>Latest Market News</h3>
        <p className="subtitle">
          Headlines from reputed financial publishers. Click to read the full story.
        </p>
        <div className="market-news">
          {MARKET_NEWS.map((item) => (
            <a
              key={item.title}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="news-item"
            >
              <h4>{item.title}</h4>
              <span>{item.source}</span>
            </a>
          ))}
        </div>
      </div>

      {/* 6) Your portfolio (with existing functionality) */}
      <div className="dashboard-section" ref={portfolioRef}>
        <h3>Your Portfolio</h3>
        <p className="subtitle">
          Answer a few questions to build your risk profile and let the optimizer
          design an allocation.
        </p>
        <div className="portfolio-layout">
          <div className="portfolio-column" ref={riskRef}>
            <RiskSection
              user={user}
              onRiskChange={setRiskProfile}
            />
          </div>
          <div className="portfolio-column">
            <PortfolioSection
              user={user}
              riskProfile={riskProfile}
            />
          </div>
        </div>
      </div>

      {/* 7) Footer */}
      <footer className="dashboard-footer">
        <div className="footer-left">
          <span className="footer-brand">Aurora Capital Lab</span>
          <span> | Research-driven portfolio optimization for serious investors.</span>
        </div>
        <div className="footer-right">
          <span>© {new Date().getFullYear()} Aurora Capital Lab. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
