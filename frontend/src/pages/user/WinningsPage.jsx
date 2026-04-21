import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const WinningsPage = () => {
  const { user } = useAuth();
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proofForm, setProofForm] = useState({ drawId: "", proofUrl: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/draws/my-history")
      .then((r) => setDraws(r.data.draws))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const submitProof = async (e) => {
    e.preventDefault();
    if (!proofForm.proofUrl) return toast.error("Enter proof URL");
    setSubmitting(true);
    try {
      await api.post("/draws/proof", proofForm);
      toast.success("Proof submitted for review!");
      setProofForm({ drawId: "", proofUrl: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const totalWon = draws.reduce((sum, draw) => {
    const myWin = draw.winners?.find((w) => w.userId === user._id || w.userId?._id === user._id);
    return sum + (myWin?.prizeAmount || 0);
  }, 0);

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>WINNINGS</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>Your draw history and prize status.</p>

      <div className="row g-3 mb-4">
        <div className="col-sm-4">
          <div className="stat-card">
            <div className="stat-label">Total Draws Won</div>
            <div className="stat-value">{draws.length}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="stat-card">
            <div className="stat-label">Total Winnings</div>
            <div className="stat-value" style={{ color: "var(--gh-gold-light)" }}>₹{totalWon.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--gh-green-light)" }} /></div>
      ) : draws.length === 0 ? (
        <div className="gh-card text-center py-5">
          <i className="bi bi-trophy" style={{ fontSize: "3rem", color: "var(--gh-text-muted)", display: "block", marginBottom: "12px" }} />
          <p className="text-gh-muted">No wins yet — keep entering draws!</p>
        </div>
      ) : (
        <div className="d-flex flex-column gap-4">
          {draws.map((draw) => {
            const myWin = draw.winners?.find((w) => w.userId === user._id || w.userId?._id === user._id);
            if (!myWin) return null;
            const needsProof = myWin.verificationStatus === "pending" && !myWin.proofUrl;
            return (
              <div key={draw._id} className="gh-card">
                <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                  <div>
                    <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: "1px", marginBottom: "4px" }}>
                      {MONTHS[draw.month - 1]} {draw.year}
                    </h5>
                    <span style={{ fontSize: "13px", color: myWin.matchType === "5-match" ? "var(--gh-gold-light)" : myWin.matchType === "4-match" ? "var(--gh-green-muted)" : "#80aaff", fontWeight: 600 }}>
                      {myWin.matchType} Win
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--gh-gold-light)" }}>₹{myWin.prizeAmount?.toLocaleString()}</div>
                    <div className="d-flex gap-2 justify-content-end mt-1">
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px",
                        background: myWin.verificationStatus === "approved" ? "rgba(45,158,95,0.15)" : myWin.verificationStatus === "rejected" ? "rgba(255,80,80,0.1)" : "rgba(201,168,76,0.1)",
                        color: myWin.verificationStatus === "approved" ? "var(--gh-green-muted)" : myWin.verificationStatus === "rejected" ? "#ff8080" : "var(--gh-gold-light)" }}>
                        {myWin.verificationStatus}
                      </span>
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "4px",
                        background: myWin.paymentStatus === "paid" ? "rgba(45,158,95,0.15)" : "rgba(201,168,76,0.1)",
                        color: myWin.paymentStatus === "paid" ? "var(--gh-green-muted)" : "var(--gh-gold-light)" }}>
                        {myWin.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="d-flex gap-2 flex-wrap mb-3">
                  {draw.drawnNumbers?.map((n, i) => (
                    <div key={i} className="draw-number" style={{ width: "40px", height: "40px", fontSize: "1rem",
                      background: myWin.matchedNumbers?.includes(n) ? "linear-gradient(135deg, var(--gh-gold), var(--gh-gold-light))" : "var(--gh-dark-3)",
                      color: myWin.matchedNumbers?.includes(n) ? "#0a0a0a" : "var(--gh-text-muted)",
                      boxShadow: myWin.matchedNumbers?.includes(n) ? "0 4px 12px rgba(201,168,76,0.3)" : "none" }}>
                      {n}
                    </div>
                  ))}
                </div>

                {needsProof && (
                  <div style={{ background: "rgba(201,168,76,0.05)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", padding: "16px" }}>
                    <p style={{ fontSize: "13px", color: "var(--gh-gold-light)", marginBottom: "10px" }}>
                      <i className="bi bi-exclamation-circle me-2" />Submit your score screenshot to claim your prize
                    </p>
                    <form onSubmit={submitProof} className="d-flex gap-2">
                      <input className="form-control gh-input flex-fill" placeholder="Screenshot URL or hosted link" value={proofForm.drawId === draw._id ? proofForm.proofUrl : ""}
                        onClick={() => setProofForm({ drawId: draw._id, proofUrl: "" })}
                        onChange={(e) => setProofForm({ drawId: draw._id, proofUrl: e.target.value })}
                        style={{ fontSize: "13px" }} />
                      <button type="submit" className="btn-gh-primary" style={{ whiteSpace: "nowrap", fontSize: "13px" }} disabled={submitting || proofForm.drawId !== draw._id}>
                        Submit Proof
                      </button>
                    </form>
                  </div>
                )}

                {myWin.proofUrl && myWin.verificationStatus === "pending" && (
                  <div style={{ fontSize: "13px", color: "var(--gh-text-muted)", marginTop: "8px" }}>
                    <i className="bi bi-clock me-2" />Proof submitted — awaiting admin review
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WinningsPage;
