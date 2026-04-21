import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const AdminDraws = () => {
  const [draws, setDraws] = useState([]);
  const [form, setForm] = useState({ month: new Date().getMonth() + 1, year: new Date().getFullYear(), drawType: "random" });
  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [activeDrawId, setActiveDrawId] = useState(null);

  const fetchDraws = async () => {
    try {
      const { data } = await api.get("/draws");
      setDraws(data.draws);
    } catch {}
  };

  useEffect(() => { fetchDraws(); }, []);

  const configure = async () => {
    setLoading(true);
    try {
      const { data } = await api.post("/draws/configure", form);
      setActiveDrawId(data.draw._id);
      toast.success("Draw configured!");
      fetchDraws();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const simulate = async (drawId) => {
    setLoading(true);
    try {
      const { data } = await api.post(`/draws/${drawId}/simulate`);
      setSimResult(data.simulation);
      toast.success("Simulation complete");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const publish = async (drawId) => {
    if (!confirm("Publish this draw? This will notify all winners via email.")) return;
    setLoading(true);
    try {
      await api.post(`/draws/${drawId}/publish`);
      toast.success("Draw published and winners notified!");
      fetchDraws();
      setSimResult(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>DRAW MANAGEMENT</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>Configure, simulate, and publish monthly draws.</p>

      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <div className="gh-card">
            <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "16px" }}>CONFIGURE DRAW</h6>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="gh-label">Month</label>
                <select className="form-select gh-input" value={form.month} onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}>
                  {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="gh-label">Year</label>
                <input type="number" className="form-control gh-input" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
              </div>
            </div>
            <div className="mb-4">
              <label className="gh-label">Draw Type</label>
              <div className="d-flex gap-3">
                {["random", "algorithmic"].map((t) => (
                  <label key={t} className="d-flex align-items-center gap-2 cursor-pointer" style={{ cursor: "pointer", fontSize: "14px" }}>
                    <input type="radio" name="drawType" value={t} checked={form.drawType === t} onChange={() => setForm({ ...form, drawType: t })} style={{ accentColor: "var(--gh-green)" }} />
                    <span style={{ textTransform: "capitalize" }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
            <button className="btn-gh-primary w-100" onClick={configure} disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Configure Draw
            </button>
          </div>
        </div>

        {activeDrawId && (
          <div className="col-lg-7">
            <div className="gh-card">
              <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "16px" }}>DRAW ACTIONS</h6>
              <div className="d-flex gap-3 mb-4">
                <button className="btn-gh-outline flex-fill" onClick={() => simulate(activeDrawId)} disabled={loading}>
                  <i className="bi bi-play-circle me-2" />Run Simulation
                </button>
                <button className="btn-gh-gold flex-fill" onClick={() => publish(activeDrawId)} disabled={loading}>
                  <i className="bi bi-broadcast me-2" />Publish Draw
                </button>
              </div>

              {simResult && (
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "var(--gh-text-muted)", marginBottom: "10px" }}>Simulation Preview</p>
                  <div className="d-flex gap-2 mb-3 flex-wrap">
                    {simResult.numbers?.map((n, i) => <div key={i} className="draw-number">{n}</div>)}
                  </div>
                  <div className="d-flex flex-column gap-1">
                    {Object.entries(simResult.winners || {}).map(([type, winners]) => (
                      <div key={type} className="d-flex gap-3" style={{ fontSize: "13px" }}>
                        <span style={{ color: type === "5-match" ? "var(--gh-gold-light)" : type === "4-match" ? "var(--gh-green-muted)" : "#80aaff", minWidth: "80px", fontWeight: 600 }}>{type}</span>
                        <span className="text-gh-muted">{winners.length} winner{winners.length !== 1 ? "s" : ""}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="gh-card">
        <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "16px" }}>PUBLISHED DRAWS</h6>
        {draws.length === 0 ? (
          <p className="text-gh-muted" style={{ fontSize: "14px" }}>No published draws yet.</p>
        ) : (
          <table className="gh-table">
            <thead>
              <tr>
                <th>Period</th>
                <th>Drawn Numbers</th>
                <th>Type</th>
                <th>Prize Pool</th>
                <th>Winners</th>
                <th>Jackpot Rollover</th>
              </tr>
            </thead>
            <tbody>
              {draws.map((d) => (
                <tr key={d._id}>
                  <td style={{ fontWeight: 500 }}>{MONTHS[d.month - 1]} {d.year}</td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {d.drawnNumbers?.map((n, i) => (
                        <span key={i} style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--gh-green)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 600 }}>{n}</span>
                      ))}
                    </div>
                  </td>
                  <td className="text-gh-muted" style={{ textTransform: "capitalize" }}>{d.drawType}</td>
                  <td style={{ color: "var(--gh-gold-light)" }}>₹{d.prizePool?.total?.toLocaleString()}</td>
                  <td>{d.winners?.length || 0}</td>
                  <td>{d.prizePool?.jackpotCarryover > 0 ? <span style={{ color: "var(--gh-gold-light)" }}>₹{d.prizePool.jackpotCarryover.toLocaleString()}</span> : <span className="text-gh-muted">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDraws;
