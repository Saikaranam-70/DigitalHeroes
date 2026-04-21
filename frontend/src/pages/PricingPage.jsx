import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import { useAuth } from "../context/AuthContext";

const PricingPage = () => {
  const { user } = useAuth();

  const plans = [
    {
      name: "Monthly",
      price: "₹999",
      period: "/month",
      description: "Perfect for getting started. Cancel anytime.",
      features: ["Enter monthly draws", "Track 5 Stableford scores", "Choose your charity (10%+)", "Access all draw results", "Winner prize pool eligibility"],
      cta: "Start Monthly",
      key: "monthly",
      featured: false,
    },
    {
      name: "Yearly",
      price: "₹9,999",
      period: "/year",
      badge: "Save 17%",
      description: "Commit for the year. Bigger savings, same impact.",
      features: ["Everything in Monthly", "2 months free vs monthly", "Priority draw entry", "Yearly supporter badge", "Dedicated charity tracking"],
      cta: "Start Yearly",
      key: "yearly",
      featured: true,
    },
  ];

  return (
    <div>
      <Navbar />
      <section style={{ padding: "72px 0 96px", background: "radial-gradient(ellipse at top, rgba(26,107,60,0.12) 0%, transparent 60%)" }}>
        <div className="container page-enter">
          <div className="text-center mb-5">
            <p className="text-gh-green" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase" }}>Simple Pricing</p>
            <h1 className="section-title mt-1">CHOOSE YOUR<br /><span style={{ color: "var(--gh-gold-light)" }}>PLAN</span></h1>
            <p className="text-gh-muted mt-3" style={{ fontSize: "15px", maxWidth: "460px", margin: "12px auto 0" }}>
              One subscription covers your draw entry, score tracking, and charity contribution. No hidden fees.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {plans.map((plan) => (
              <div className="col-md-5" key={plan.key}>
                <div className="gh-card h-100" style={{ border: plan.featured ? "1px solid rgba(201,168,76,0.35)" : "1px solid var(--gh-border)", position: "relative", padding: "32px" }}>
                  {plan.badge && (
                    <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, var(--gh-gold), var(--gh-gold-light))", color: "#0a0a0a", fontSize: "11px", fontWeight: 700, padding: "4px 14px", borderRadius: "20px", letterSpacing: "1px", whiteSpace: "nowrap" }}>
                      {plan.badge}
                    </div>
                  )}
                  <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", letterSpacing: "2px", marginBottom: "6px" }}>{plan.name}</h4>
                  <p className="text-gh-muted" style={{ fontSize: "13px", marginBottom: "20px" }}>{plan.description}</p>
                  <div className="d-flex align-items-end gap-1 mb-4">
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "3rem", color: plan.featured ? "var(--gh-gold-light)" : "var(--gh-green-muted)", lineHeight: 1 }}>{plan.price}</span>
                    <span className="text-gh-muted" style={{ fontSize: "14px", paddingBottom: "6px" }}>{plan.period}</span>
                  </div>

                  <div className="divider" />

                  <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="d-flex align-items-center gap-2" style={{ fontSize: "14px" }}>
                        <i className="bi bi-check-circle-fill" style={{ color: plan.featured ? "var(--gh-gold-light)" : "var(--gh-green-light)", flexShrink: 0 }} />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to={user ? "/dashboard/subscription" : "/register"}
                    className={plan.featured ? "btn-gh-gold w-100 text-center" : "btn-gh-outline w-100 text-center"}
                    style={{ display: "block", padding: "13px", fontSize: "15px" }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5">
            <p className="text-gh-muted" style={{ fontSize: "13px" }}>
              <i className="bi bi-shield-check me-2 text-gh-green" />
              Payments secured by Razorpay · Cancel anytime · 10% minimum goes to charity
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PricingPage;
