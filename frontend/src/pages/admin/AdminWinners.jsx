import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const AdminWinners = () => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDraws = async () => {
    try {
      const { data } = await api.get("/draws");
      setDraws(data.draws.filter((d) => d.winners?.length > 0));
    } catch {
      toast.error("Failed to load");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDraws(); }, []);

  const verifyWinner = async (drawId, winnerId, action) => {
    try {
      await api.post("/draws/verify-winner", { drawId, winnerId, action });
      toast.success(`Winner ${action}d`);
      fetchDraws();
    } catch {
      toast.error("Failed");
    }
  };

  const markPaid = async (drawId, winnerId) => {
    try {
      await api.post("/draws/mark-paid", { drawId, winnerId });
      toast.success("Marked as paid");
      fetchDraws();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>WINNER VERIFICATION</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>Review proof submissions and manage prize payouts.</p>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--gh-green-light)" }} /></div>
      ) : draws.length === 0 ? (
        <div className="gh-card text-center py-5">
          <i className="bi bi-trophy" style={{ fontSize: "2.5rem", color: "var(--gh-text-muted)", display: "block", marginBottom: "12px" }} />
          <p className="text-gh-muted">No winners to review yet.</p>
        </div>
      ) : (
        draws.map((draw) => (
          <div key={draw._id} className="gh-card mb-4">
            <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: "1px", marginBottom: "16px" }}>
              {MONTHS[draw.month - 1]} {draw.year} Winners
            </h5>
            <div className="d-flex flex-column gap-3">
              {draw.winners.map((w) => (
                <div key={w._id} style={{ padding: "16px", background: "var(--gh-dark-3)", borderRadius: "10px", border: "1px solid var(--gh-border)" }}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "14px" }}>{w.userId?.name || "Unknown User"}</div>
                      <div className="text-gh-muted" style={{ fontSize: "12px" }}>{w.userId?.email}</div>
                      <div className="d-flex gap-2 mt-1 flex-wrap">
                        <span style={{ fontSize: "11px", color: w.matchType === "5-match" ? "var(--gh-gold-light)" : w.matchType === "4-match" ? "var(--gh-green-muted)" : "#80aaff", fontWeight: 600 }}>{w.matchType}</span>
                        <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "4px",
                          background: w.verificationStatus === "approved" ? "rgba(45,158,95,0.15)" : w.verificationStatus === "rejected" ? "rgba(255,80,80,0.1)" : "rgba(201,168,76,0.1)",
                          color: w.verificationStatus === "approved" ? "var(--gh-green-muted)" : w.verificationStatus === "rejected" ? "#ff8080" : "var(--gh-gold-light)" }}>
                          {w.verificationStatus}
                        </span>
                        <span style={{ fontSize: "11px", padding: "1px 8px", borderRadius: "4px",
                          background: w.paymentStatus === "paid" ? "rgba(45,158,95,0.15)" : "rgba(255,180,0,0.1)",
                          color: w.paymentStatus === "paid" ? "var(--gh-green-muted)" : "var(--gh-gold-light)" }}>
                          {w.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--gh-gold-light)" }}>₹{w.prizeAmount?.toLocaleString()}</div>
                    </div>
                  </div>

                  {w.proofUrl && (
                    <div className="mt-2" style={{ fontSize: "13px" }}>
                      <span className="text-gh-muted me-2">Proof:</span>
                      <a href={w.proofUrl} target="_blank" rel="noreferrer" className="text-gh-green">{w.proofUrl.slice(0, 50)}...</a>
                    </div>
                  )}

                  <div className="d-flex gap-2 mt-3 flex-wrap">
                    {w.verificationStatus === "pending" && w.proofUrl && (
                      <>
                        <button onClick={() => verifyWinner(draw._id, w._id, "approve")} style={{ fontSize: "12px", padding: "6px 14px", background: "rgba(45,158,95,0.15)", border: "1px solid rgba(45,158,95,0.3)", color: "var(--gh-green-muted)", borderRadius: "6px", cursor: "pointer" }}>
                          ✓ Approve
                        </button>
                        <button onClick={() => verifyWinner(draw._id, w._id, "reject")} style={{ fontSize: "12px", padding: "6px 14px", background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", color: "#ff8080", borderRadius: "6px", cursor: "pointer" }}>
                          ✗ Reject
                        </button>
                      </>
                    )}
                    {w.verificationStatus === "approved" && w.paymentStatus === "pending" && (
                      <button onClick={() => markPaid(draw._id, w._id)} style={{ fontSize: "12px", padding: "6px 14px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "var(--gh-gold-light)", borderRadius: "6px", cursor: "pointer" }}>
                        Mark as Paid
                      </button>
                    )}
                    {w.paymentStatus === "paid" && (
                      <span style={{ fontSize: "12px", color: "var(--gh-green-muted)" }}>
                        <i className="bi bi-check-circle-fill me-1" />Paid {w.paidAt ? new Date(w.paidAt).toLocaleDateString() : ""}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminWinners;
