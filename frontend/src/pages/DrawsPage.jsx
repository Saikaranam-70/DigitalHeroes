import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const DrawsPage = () => {
  const [draws, setDraws] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/draws"), api.get("/draws/current")])
      .then(([d, c]) => { setDraws(d.data.draws); setCurrent(c.data.draw); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Navbar />
      <section style={{ padding: "72px 0 40px" }}>
        <div className="container page-enter">
          <div className="text-center mb-5">
            <p className="text-gh-green" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase" }}>Monthly Prize Draws</p>
            <h1 className="section-title mt-1">DRAW<br /><span style={{ color: "var(--gh-gold-light)" }}>RESULTS</span></h1>
          </div>

          {current && (
            <div className="gh-card mb-5" style={{ border: "1px solid rgba(201,168,76,0.2)", background: "linear-gradient(135deg, rgba(201,168,76,0.05), var(--gh-dark-card))" }}>
              <div className="d-flex align-items-center gap-2 mb-3">
                <span className="glow-dot" />
                <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "2px", textTransform: "uppercase", color: "var(--gh-gold-light)" }}>Current Month Draw</span>
              </div>
              <h4 style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", letterSpacing: "1px" }}>
                {MONTHS[current.month - 1]} {current.year}
              </h4>
              <div className="row g-3 mt-2">
                <div className="col-sm-4">
                  <div style={{ fontSize: "12px", color: "var(--gh-text-muted)" }}>Prize Pool</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--gh-gold-light)" }}>₹{(current.prizePool?.total || 0).toLocaleString()}</div>
                </div>
                <div className="col-sm-4">
                  <div style={{ fontSize: "12px", color: "var(--gh-text-muted)" }}>Jackpot (5-match)</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--gh-green-muted)" }}>₹{(current.prizePool?.fiveMatch || 0).toLocaleString()}</div>
                </div>
                <div className="col-sm-4">
                  <div style={{ fontSize: "12px", color: "var(--gh-text-muted)" }}>Active Subscribers</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem" }}>{current.activeSubscriberCount}</div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--gh-green-light)" }} /></div>
          ) : draws.length === 0 ? (
            <div className="text-center py-5 text-gh-muted">No published draws yet. Check back soon!</div>
          ) : (
            <div className="d-flex flex-column gap-4">
              {draws.map((draw) => (
                <div key={draw._id} className="gh-card">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div>
                      <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", letterSpacing: "1px", marginBottom: "4px" }}>
                        {MONTHS[draw.month - 1]} {draw.year} Draw
                      </h5>
                      <span style={{ fontSize: "11px", background: "rgba(45,158,95,0.1)", color: "var(--gh-green-muted)", padding: "2px 10px", borderRadius: "4px" }}>
                        {draw.drawType === "algorithmic" ? "Algorithmic" : "Random"} Draw
                      </span>
                    </div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", color: "var(--gh-gold-light)" }}>
                      ₹{(draw.prizePool?.total || 0).toLocaleString()} pool
                    </div>
                  </div>

                  <div className="d-flex gap-2 flex-wrap mt-4">
                    {draw.drawnNumbers?.map((n, i) => (
                      <div key={i} className="draw-number">{n}</div>
                    ))}
                  </div>

                  {draw.winners?.length > 0 && (
                    <div className="mt-4">
                      <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--gh-text-muted)", marginBottom: "10px" }}>Winners</p>
                      <div className="d-flex flex-column gap-2">
                        {["5-match","4-match","3-match"].map((type) => {
                          const w = draw.winners.filter((x) => x.matchType === type);
                          if (!w.length) return null;
                          return (
                            <div key={type} className="d-flex align-items-center gap-3" style={{ fontSize: "13px" }}>
                              <span style={{ color: type === "5-match" ? "var(--gh-gold-light)" : type === "4-match" ? "var(--gh-green-muted)" : "#80aaff", fontWeight: 600, minWidth: "80px" }}>{type}</span>
                              <span className="text-gh-muted">{w.length} winner{w.length > 1 ? "s" : ""} · ₹{w[0]?.prizeAmount?.toLocaleString()} each</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {draw.prizePool?.jackpotCarryover > 0 && (
                    <div className="mt-3 d-flex align-items-center gap-2" style={{ fontSize: "13px", color: "var(--gh-gold-light)" }}>
                      <i className="bi bi-arrow-right-circle-fill" />
                      Jackpot rolled over: ₹{draw.prizePool.jackpotCarryover.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default DrawsPage;
