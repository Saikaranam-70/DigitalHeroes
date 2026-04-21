import { useAuth } from "../../context/AuthContext";
import useRazorpay from "../../hooks/useRazorpay";

const SubscriptionPage = () => {
  const { user, refreshUser } = useAuth();
  const { initiatePayment, loading } = useRazorpay();

  const sub = user?.subscription;
  const isActive = sub?.status === "active";

  const handleSubscribe = (plan) => {
    initiatePayment(plan, async () => { await refreshUser(); });
  };

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>SUBSCRIPTION</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>Manage your GolfHero subscription plan.</p>

      {isActive && (
        <div className="gh-card mb-4" style={{ border: "1px solid rgba(45,158,95,0.3)", background: "rgba(26,107,60,0.07)" }}>
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="glow-dot" />
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gh-green-muted)" }}>Active Subscription</span>
          </div>
          <div className="row g-3">
            <div className="col-sm-3">
              <div style={{ fontSize: "12px", color: "var(--gh-text-muted)" }}>Plan</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", textTransform: "capitalize" }}>{sub.plan}</div>
            </div>
            <div className="col-sm-3">
              <div style={{ fontSize: "12px", color: "var(--gh-text-muted)" }}>Started</div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>{new Date(sub.startDate).toLocaleDateString()}</div>
            </div>
            <div className="col-sm-3">
              <div style={{ fontSize: "12px", color: "var(--gh-text-muted)" }}>Expires</div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>{new Date(sub.endDate).toLocaleDateString()}</div>
            </div>
            <div className="col-sm-3">
              <div style={{ fontSize: "12px", color: "var(--gh-text-muted)" }}>Renewal</div>
              <div style={{ fontSize: "14px", fontWeight: 500 }}>{new Date(sub.renewalDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {[
          { key: "monthly", name: "Monthly", price: "₹999", period: "/month", desc: "Flexible. Cancel anytime.", features: ["Monthly draw entry", "5 score slots", "Charity donation", "Winner eligibility"], featured: false },
          { key: "yearly", name: "Yearly", price: "₹9,999", period: "/year", badge: "Save 17%", desc: "Best value. 2 months free.", features: ["Everything in Monthly", "2 months free", "Priority entry", "Yearly badge"], featured: true },
        ].map((plan) => (
          <div className="col-md-6" key={plan.key}>
            <div className="gh-card h-100" style={{ border: plan.featured ? "1px solid rgba(201,168,76,0.3)" : "1px solid var(--gh-border)", padding: "28px", position: "relative" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "-11px", left: "24px", background: "linear-gradient(135deg, var(--gh-gold), var(--gh-gold-light))", color: "#0a0a0a", fontSize: "10px", fontWeight: 700, padding: "3px 12px", borderRadius: "20px", letterSpacing: "1px" }}>
                  {plan.badge}
                </div>
              )}
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", letterSpacing: "2px" }}>{plan.name}</h4>
              <p className="text-gh-muted" style={{ fontSize: "13px" }}>{plan.desc}</p>
              <div className="d-flex align-items-end gap-1 mb-4">
                <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: plan.featured ? "var(--gh-gold-light)" : "var(--gh-green-muted)", lineHeight: 1 }}>{plan.price}</span>
                <span className="text-gh-muted" style={{ fontSize: "13px", paddingBottom: "4px" }}>{plan.period}</span>
              </div>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="d-flex align-items-center gap-2" style={{ fontSize: "13px" }}>
                    <i className="bi bi-check-circle-fill" style={{ color: plan.featured ? "var(--gh-gold-light)" : "var(--gh-green-light)" }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={plan.featured ? "btn-gh-gold w-100" : "btn-gh-outline w-100"}
                onClick={() => handleSubscribe(plan.key)}
                disabled={loading || (isActive && sub.plan === plan.key)}
                style={{ padding: "12px" }}
              >
                {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                {isActive && sub.plan === plan.key ? "Current Plan" : isActive ? "Switch Plan" : `Subscribe ${plan.name}`}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="gh-card mt-4" style={{ background: "rgba(45,158,95,0.03)" }}>
        <h6 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", letterSpacing: "1px", marginBottom: "10px", color: "var(--gh-text-muted)" }}>PAYMENT INFO</h6>
        <p className="text-gh-muted" style={{ fontSize: "13px", margin: 0 }}>
          <i className="bi bi-shield-check me-2 text-gh-green" />
          Payments are processed securely via Razorpay. We do not store card details. For billing issues, contact support.
        </p>
      </div>
    </div>
  );
};

export default SubscriptionPage;
