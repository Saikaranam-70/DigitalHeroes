import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useEffect, useState } from "react";
import api from "../services/api";

const HomePage = () => {
  const [charities, setCharities] = useState([]);
  const [draws, setDraws] = useState([]);

  useEffect(() => {
    api.get("/charities?limit=3").then((r) => setCharities(r.data.charities?.slice(0, 3) || [])).catch(() => {});
    api.get("/draws").then((r) => setDraws(r.data.draws?.slice(0, 2) || [])).catch(() => {});
  }, []);

  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section style={{ minHeight: "92vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", background: "radial-gradient(ellipse at 20% 50%, rgba(26,107,60,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,168,76,0.08) 0%, transparent 50%), var(--gh-dark)" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(45,158,95,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />
        <div className="container page-enter">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="glow-dot" />
                <span className="text-gh-muted" style={{ fontSize: "13px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Monthly Draw · Charity · Golf</span>
              </div>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(3.5rem, 10vw, 7rem)", lineHeight: 0.9, marginBottom: "24px" }}>
                PLAY.<br />
                <span style={{ color: "var(--gh-gold-light)" }}>WIN.</span><br />
                GIVE.
              </h1>
              <p style={{ fontSize: "1.1rem", color: "var(--gh-text-muted)", maxWidth: "480px", lineHeight: 1.7, marginBottom: "36px" }}>
                Enter your Stableford scores. Compete in monthly prize draws. Support the charities you believe in. One subscription — real impact.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/register" className="btn-gh-gold" style={{ fontSize: "1rem", padding: "14px 36px" }}>
                  Start for ₹999/mo <i className="bi bi-arrow-right ms-1" />
                </Link>
                <Link to="/draws" className="btn-gh-outline" style={{ fontSize: "1rem", padding: "14px 36px" }}>
                  View Draws
                </Link>
              </div>
            </div>
            <div className="col-lg-5 mt-5 mt-lg-0">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                {[
                  { icon: "bi-trophy-fill", label: "Prize Pool", value: "Monthly Draws", color: "var(--gh-gold-light)" },
                  { icon: "bi-heart-fill", label: "Charity", value: "10%+ Donated", color: "#ff8080" },
                  { icon: "bi-controller", label: "Format", value: "Stableford", color: "var(--gh-green-muted)" },
                  { icon: "bi-people-fill", label: "Community", value: "Growing Fast", color: "#80aaff" },
                ].map((item) => (
                  <div key={item.label} className="gh-card" style={{ textAlign: "center", padding: "24px 16px" }}>
                    <i className={`bi ${item.icon}`} style={{ fontSize: "1.8rem", color: item.color, display: "block", marginBottom: "10px" }} />
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "1px" }}>{item.value}</div>
                    <div className="text-gh-muted" style={{ fontSize: "12px", marginTop: "4px" }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "96px 0", background: "var(--gh-dark-2)" }}>
        <div className="container">
          <div className="text-center mb-5">
            <p className="text-gh-green" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>The Process</p>
            <h2 className="section-title">HOW IT WORKS</h2>
          </div>
          <div className="row g-4">
            {[
              { step: "01", title: "Subscribe", desc: "Choose monthly or yearly. Your subscription funds the prize pool and your chosen charity.", icon: "bi-credit-card" },
              { step: "02", title: "Enter Scores", desc: "Add your latest 5 Stableford scores (1–45). One score per date, always your most recent 5.", icon: "bi-pencil-square" },
              { step: "03", title: "Monthly Draw", desc: "Every month 5 numbers are drawn. Match 3, 4, or 5 and you win a share of the pool.", icon: "bi-shuffle" },
              { step: "04", title: "Claim & Give", desc: "Winners verify with proof screenshots. 10%+ of every subscription goes to your charity.", icon: "bi-gift" },
            ].map((item) => (
              <div className="col-md-6 col-lg-3" key={item.step}>
                <div className="gh-card h-100" style={{ position: "relative" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "3.5rem", color: "rgba(45,158,95,0.12)", position: "absolute", top: "12px", right: "16px", lineHeight: 1 }}>{item.step}</div>
                  <i className={`bi ${item.icon}`} style={{ fontSize: "1.6rem", color: "var(--gh-green-light)", marginBottom: "14px", display: "block" }} />
                  <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", marginBottom: "8px", letterSpacing: "1px" }}>{item.title}</h5>
                  <p className="text-gh-muted" style={{ fontSize: "14px", lineHeight: 1.65, margin: 0 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prize pool breakdown */}
      <section style={{ padding: "96px 0" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-5">
              <p className="text-gh-green" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>The Rewards</p>
              <h2 className="section-title mb-3">PRIZE<br />POOL<br /><span style={{ color: "var(--gh-gold-light)" }}>BREAKDOWN</span></h2>
              <p className="text-gh-muted" style={{ fontSize: "15px", lineHeight: 1.7 }}>Every subscription contributes directly to the prize pool. The more subscribers, the bigger the wins. Unclaimed jackpots roll over to the next month.</p>
            </div>
            <div className="col-lg-7">
              <div className="d-flex flex-column gap-3">
                {[
                  { match: "5-Number Match", share: "40%", label: "Jackpot (rolls over)", color: "var(--gh-gold-light)", icon: "bi-star-fill" },
                  { match: "4-Number Match", share: "35%", label: "Major Prize", color: "var(--gh-green-muted)", icon: "bi-gem" },
                  { match: "3-Number Match", share: "25%", label: "Entry Prize", color: "#80aaff", icon: "bi-award" },
                ].map((row) => (
                  <div key={row.match} className="gh-card d-flex align-items-center gap-4" style={{ padding: "20px 24px" }}>
                    <i className={`bi ${row.icon}`} style={{ fontSize: "1.6rem", color: row.color, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "15px" }}>{row.match}</div>
                      <div className="text-gh-muted" style={{ fontSize: "13px" }}>{row.label}</div>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: row.color, letterSpacing: "1px" }}>{row.share}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured charities */}
      {charities.length > 0 && (
        <section style={{ padding: "96px 0", background: "var(--gh-dark-2)" }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-end mb-5">
              <div>
                <p className="text-gh-green" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase", marginBottom: "8px" }}>Making a Difference</p>
                <h2 className="section-title">FEATURED<br /><span style={{ color: "var(--gh-green-muted)" }}>CHARITIES</span></h2>
              </div>
              <Link to="/charities" className="btn-gh-outline" style={{ padding: "10px 20px", fontSize: "13px" }}>View All</Link>
            </div>
            <div className="row g-4">
              {charities.map((c) => (
                <div className="col-md-4" key={c._id}>
                  <div className="gh-card h-100">
                    {c.image && <img src={c.image} alt={c.name} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "16px" }} />}
                    <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: "1px" }}>{c.name}</h5>
                    <p className="text-gh-muted" style={{ fontSize: "13px", lineHeight: 1.6, marginTop: "8px" }}>{c.description?.slice(0, 100)}...</p>
                    <div className="d-flex align-items-center gap-2 mt-3">
                      <i className="bi bi-people text-gh-green" style={{ fontSize: "13px" }} />
                      <span className="text-gh-muted" style={{ fontSize: "12px" }}>{c.subscriberCount} subscribers supporting</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "96px 0", textAlign: "center", background: "radial-gradient(ellipse at center, rgba(26,107,60,0.2) 0%, transparent 70%)" }}>
        <div className="container">
          <h2 className="section-title mb-3">READY TO<br /><span style={{ color: "var(--gh-gold-light)" }}>JOIN?</span></h2>
          <p className="text-gh-muted mx-auto mb-5" style={{ fontSize: "1rem", maxWidth: "460px", lineHeight: 1.7 }}>
            Subscribe today. Enter your scores. Support a cause. Win monthly prizes. Everything in one place.
          </p>
          <Link to="/register" className="btn-gh-gold" style={{ fontSize: "1.1rem", padding: "16px 48px" }}>
            Get Started — ₹999/month
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
