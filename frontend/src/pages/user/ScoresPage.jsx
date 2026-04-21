import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const ScoresPage = () => {
  const { user, refreshUser } = useAuth();
  const [scores, setScores] = useState([]);
  const [form, setForm] = useState({ score: "", date: "" });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/scores").then((r) => setScores(r.data.scores)).catch(() => {});
  }, []);

  const isSubscribed = user?.subscription?.status === "active";

  const submit = async (e) => {
    e.preventDefault();
    if (!form.score || !form.date) return toast.error("Fill in both fields");
    setLoading(true);
    try {
      if (editing) {
        const { data } = await api.put(`/scores/${editing}`, form);
        setScores(data.scores);
        toast.success("Score updated");
        setEditing(null);
      } else {
        const { data } = await api.post("/scores", form);
        setScores(data.scores);
        toast.success("Score added");
      }
      setForm({ score: "", date: "" });
      refreshUser().catch(() => {});
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving score");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (s) => {
    setEditing(s._id);
    setForm({ score: s.score, date: new Date(s.date).toISOString().split("T")[0] });
  };

  const deleteScore = async (id) => {
    if (!confirm("Delete this score?")) return;
    try {
      const { data } = await api.delete(`/scores/${id}`);
      setScores(data.scores);
      toast.success("Score removed");
      refreshUser().catch(() => {});
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>MY SCORES</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>Track your last 5 Stableford scores. Oldest is replaced when a new one is added.</p>

      {!isSubscribed && (
        <div className="gh-card mb-4" style={{ borderColor: "rgba(255,128,128,0.2)", background: "rgba(255,80,80,0.05)" }}>
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-lock-fill" style={{ color: "#ff8080", fontSize: "1.3rem" }} />
            <p style={{ margin: 0, fontSize: "14px", color: "#ff8080" }}>An active subscription is required to enter scores.</p>
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="gh-card">
            <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "20px" }}>
              {editing ? "EDIT SCORE" : "ADD SCORE"}
            </h6>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="gh-label">Stableford Score (1–45)</label>
                <input
                  type="number" min="1" max="45"
                  className="form-control gh-input"
                  placeholder="e.g. 32"
                  value={form.score}
                  onChange={(e) => setForm({ ...form, score: e.target.value })}
                  disabled={!isSubscribed}
                />
              </div>
              <div className="mb-4">
                <label className="gh-label">Date Played</label>
                <input
                  type="date"
                  className="form-control gh-input"
                  value={form.date}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  disabled={!isSubscribed}
                />
              </div>
              <div className="d-flex gap-2">
                <button type="submit" className="btn-gh-primary flex-fill" disabled={!isSubscribed || loading}>
                  {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                  {editing ? "Update Score" : "Add Score"}
                </button>
                {editing && (
                  <button type="button" className="btn-gh-outline" onClick={() => { setEditing(null); setForm({ score: "", date: "" }); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="gh-card mt-3" style={{ background: "rgba(45,158,95,0.04)" }}>
            <h6 style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", letterSpacing: "1px", marginBottom: "10px", color: "var(--gh-text-muted)" }}>RULES</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0">
              {["Scores must be in Stableford format (1–45)", "Only 1 score per date", "Latest 5 scores are kept", "New score replaces oldest", "Scores are used in monthly draws"].map((r) => (
                <li key={r} className="d-flex gap-2" style={{ fontSize: "12px", color: "var(--gh-text-muted)" }}>
                  <i className="bi bi-dot" style={{ flexShrink: 0, color: "var(--gh-green-light)" }} />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="gh-card">
            <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "16px" }}>
              YOUR SCORES <span className="text-gh-muted" style={{ fontSize: "0.8rem" }}>({scores.length}/5)</span>
            </h6>
            {scores.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-clipboard" style={{ fontSize: "2.5rem", color: "var(--gh-text-muted)", display: "block", marginBottom: "12px" }} />
                <p className="text-gh-muted" style={{ fontSize: "14px" }}>No scores yet. Add your first score to enter monthly draws.</p>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {scores.map((s, i) => (
                  <div key={s._id} className="d-flex align-items-center justify-content-between" style={{ padding: "14px 16px", background: "var(--gh-dark-3)", borderRadius: "10px", border: "1px solid var(--gh-border)" }}>
                    <div className="d-flex align-items-center gap-3">
                      <div className="score-ball" style={{ borderColor: i === 0 ? "var(--gh-green)" : "var(--gh-border)" }}>{s.score}</div>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 500 }}>{new Date(s.date).toLocaleDateString("en-IN", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</div>
                        <div className="text-gh-muted" style={{ fontSize: "11px" }}>Added {new Date(s.addedAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="d-flex gap-1">
                      <button onClick={() => startEdit(s)} style={{ background: "rgba(45,158,95,0.1)", border: "none", color: "var(--gh-green-muted)", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" }}>
                        <i className="bi bi-pencil" style={{ fontSize: "13px" }} />
                      </button>
                      <button onClick={() => deleteScore(s._id)} style={{ background: "rgba(255,80,80,0.1)", border: "none", color: "#ff8080", borderRadius: "6px", padding: "6px 10px", cursor: "pointer" }}>
                        <i className="bi bi-trash" style={{ fontSize: "13px" }} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoresPage;
