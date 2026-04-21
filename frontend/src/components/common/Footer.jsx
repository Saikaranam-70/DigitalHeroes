import { Link } from "react-router-dom";

const Footer = () => (
  <footer style={{ background: "var(--gh-dark-2)", borderTop: "1px solid var(--gh-border)", padding: "48px 0 24px" }}>
    <div className="container">
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", letterSpacing: "3px", color: "var(--gh-green-muted)" }}>
            GOLF<span style={{ color: "var(--gh-gold-light)" }}>HERO</span>
          </span>
          <p className="text-gh-muted mt-2" style={{ fontSize: "13px", lineHeight: 1.7 }}>
            Track your game. Enter draws. Support the charities you love. A different kind of golf platform.
          </p>
        </div>
        <div className="col-md-2 offset-md-2">
          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--gh-text-muted)", marginBottom: "12px" }}>Platform</p>
          <div className="d-flex flex-column gap-2">
            <Link to="/charities" className="text-gh-muted" style={{ fontSize: "13px" }}>Charities</Link>
            <Link to="/draws" className="text-gh-muted" style={{ fontSize: "13px" }}>Draws</Link>
            <Link to="/pricing" className="text-gh-muted" style={{ fontSize: "13px" }}>Pricing</Link>
          </div>
        </div>
        <div className="col-md-2">
          <p style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--gh-text-muted)", marginBottom: "12px" }}>Account</p>
          <div className="d-flex flex-column gap-2">
            <Link to="/register" className="text-gh-muted" style={{ fontSize: "13px" }}>Sign Up</Link>
            <Link to="/login" className="text-gh-muted" style={{ fontSize: "13px" }}>Login</Link>
            <Link to="/dashboard" className="text-gh-muted" style={{ fontSize: "13px" }}>Dashboard</Link>
          </div>
        </div>
      </div>
      <div className="divider" />
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <p className="text-gh-muted" style={{ fontSize: "12px", margin: 0 }}>
          © {new Date().getFullYear()} GolfHero. All rights reserved.
        </p>
        <p className="text-gh-muted" style={{ fontSize: "12px", margin: 0 }}>
          Payments secured by Razorpay · Built with ❤️
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
