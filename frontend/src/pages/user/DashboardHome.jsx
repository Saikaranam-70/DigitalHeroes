import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DashboardHome = () => {
  const { user } = useAuth();
  const [currentDraw, setCurrentDraw] = useState(null);
  const [winHistory, setWinHistory] = useState([]);

  useEffect(() => {
    api.get("/draws/current").then((r) => setCurrentDraw(r.data.draw)).catch(() => {});
    if (user?.subscription?.status === "active") {
      api.get("/draws/my-history").then((r) => setWinHistory(r.data.draws)).catch(() => {});
    }
  }, [user]);

  const sub = user?.subscription;
  const charity = user?.charity;
  const isActive = sub?.status === "active";

  return (
    <div className="page-enter">
      <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "2px" }}>
            WELCOME BACK, <span style={{ color: "var(--gh-green-muted)" }}>{user?.name?.split(" ")[0].toUpperCase()}</span>
          </h2>
          <p className="text-gh-muted" style={{ fontSize: "14px", margin: 0 }}>Here's your GolfHero overview</p>
        </div>
        {!isActive && (
          <Link to="/dashboard/subscription" className="btn-gh-gold" style={{ fontSize: "14px", padding: "10px 20px" }}>
            Activate Subscription
          </Link>
        )}
      </div>

      {/* Stats row */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-label">Subscription</div>
            <div className="stat-value" style={{ fontSize: "1.4rem", marginTop: "6px" }}>
              {isActive ? <span style={{ color: "var(--gh-green-muted)" }}>Active</span> : <span style={{ color: "#ff8080" }}>Inactive</span>}
            </div>
            {isActive && sub?.renewalDate && (
              <div className="text-gh-muted" style={{ fontSize: "11px", marginTop: "4px" }}>Renews {new Date(sub.renewalDate).toLocaleDateString()}</div>
            )}
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-label">My Scores</div>
            <div className="stat-value">{user?.scores?.length || 0}<span style={{ fontSize: "1rem", color: "var(--gh-text-muted)" }}>/5</span></div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-label">Charity %</div>
            <div className="stat-value" style={{ color: "var(--gh-gold-light)" }}>{charity?.percentage || 10}%</div>
          </div>
        </div>
        <div className="col-6 col-lg-3">
          <div className="stat-card">
            <div className="stat-label">Draws Won</div>
            <div className="stat-value">{winHistory.length}</div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Scores */}
        <div className="col-lg-5">
          <div className="gh-card h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", margin: 0 }}>LATEST SCORES</h6>
              <Link to="/dashboard/scores" style={{ fontSize: "12px", color: "var(--gh-green-light)" }}>Manage →</Link>
            </div>
            {user?.scores?.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                {user.scores.slice(0, 5).map((s, i) => (
                  <div key={i} className="d-flex align-items-center justify-content-between" style={{ padding: "10px 12px", background: "var(--gh-dark-3)", borderRadius: "8px" }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="score-ball">{s.score}</div>
                      <span className="text-gh-muted" style={{ fontSize: "13px" }}>{new Date(s.date).toLocaleDateString()}</span>
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--gh-green-muted)" }}>#{i + 1}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <i className="bi bi-pencil-square" style={{ fontSize: "2rem", color: "var(--gh-text-muted)", display: "block", marginBottom: "8px" }} />
                <p className="text-gh-muted" style={{ fontSize: "13px", margin: 0 }}>No scores yet</p>
                {isActive && <Link to="/dashboard/scores" className="text-gh-green" style={{ fontSize: "13px" }}>Add your first score</Link>}
              </div>
            )}
          </div>
        </div>

        {/* Current draw + Charity */}
        <div className="col-lg-7 d-flex flex-column gap-4">
          {currentDraw && (
            <div className="gh-card" style={{ border: "1px solid rgba(201,168,76,0.15)" }}>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="glow-dot" />
                <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gh-gold-light)" }}>This Month's Draw</span>
              </div>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div>
                  <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", margin: 0 }}>
                    {MONTHS[currentDraw.month - 1]} {currentDraw.year}
                  </h5>
                  <span className="text-gh-muted" style={{ fontSize: "13px" }}>{currentDraw.activeSubscriberCount} active participants</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "11px", color: "var(--gh-text-muted)" }}>Prize Pool</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--gh-gold-light)" }}>
                    ₹{(currentDraw.prizePool?.total || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              {!isActive && (
                <div className="mt-3 d-flex align-items-center gap-2" style={{ background: "rgba(255,128,128,0.08)", padding: "10px 14px", borderRadius: "8px" }}>
                  <i className="bi bi-exclamation-triangle" style={{ color: "#ff8080" }} />
                  <span style={{ fontSize: "13px", color: "#ff8080" }}>Subscribe to enter draws</span>
                </div>
              )}
            </div>
          )}

          <div className="gh-card">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", margin: 0 }}>CHARITY SUPPORT</h6>
              <Link to="/dashboard/charity" style={{ fontSize: "12px", color: "var(--gh-green-light)" }}>Change →</Link>
            </div>
            {charity?.charityId ? (
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "var(--gh-green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <i className="bi bi-heart-fill" style={{ color: "#fff" }} />
                </div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: "14px" }}>{charity.charityId?.name || "Selected Charity"}</div>
                  <div className="text-gh-muted" style={{ fontSize: "12px" }}>{charity.percentage}% of subscription donated</div>
                </div>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-heart" style={{ fontSize: "1.5rem", color: "var(--gh-text-muted)" }} />
                <div>
                  <div style={{ fontSize: "13px" }}>No charity selected</div>
                  <Link to="/dashboard/charity" className="text-gh-green" style={{ fontSize: "12px" }}>Choose a charity</Link>
                </div>
              </div>
            )}
          </div>

          {winHistory.length > 0 && (
            <div className="gh-card">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", margin: 0 }}>RECENT WINS</h6>
                <Link to="/dashboard/winnings" style={{ fontSize: "12px", color: "var(--gh-green-light)" }}>All →</Link>
              </div>
              {winHistory.slice(0, 2).map((draw) => {
                const myWin = draw.winners?.find((w) => w.userId === user._id || w.userId?._id === user._id);
                return (
                  <div key={draw._id} className="d-flex justify-content-between align-items-center py-2" style={{ borderBottom: "1px solid var(--gh-border)" }}>
                    <span style={{ fontSize: "13px" }}>{MONTHS[draw.month - 1]} {draw.year} · {myWin?.matchType}</span>
                    <span style={{ color: "var(--gh-gold-light)", fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>₹{myWin?.prizeAmount?.toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
