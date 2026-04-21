import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const MyCharityPage = () => {
  const { user, refreshUser } = useAuth();
  const [charities, setCharities] = useState([]);
  const [selected, setSelected] = useState(user?.charity?.charityId?._id || user?.charity?.charityId || "");
  const [percentage, setPercentage] = useState(user?.charity?.percentage || 10);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get(`/charities?search=${search}`).then((r) => setCharities(r.data.charities)).catch(() => {});
  }, [search]);

  const save = async () => {
    if (!selected) return toast.error("Please select a charity");
    setSaving(true);
    try {
      await api.post("/charities/select", { charityId: selected, percentage });
      await refreshUser();
      toast.success("Charity preference saved!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>MY CHARITY</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>Choose where your contribution goes. Minimum 10% of your subscription.</p>

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="gh-card">
            <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "16px" }}>CONTRIBUTION</h6>
            <label className="gh-label">Donation Percentage</label>
            <input type="range" className="form-range" min="10" max="50" step="5" value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              style={{ accentColor: "var(--gh-green)" }}
            />
            <div className="text-center mt-2">
              <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--gh-gold-light)" }}>{percentage}%</span>
              <p className="text-gh-muted" style={{ fontSize: "12px", marginTop: "4px" }}>of your subscription goes to charity</p>
            </div>

            {user?.subscription?.plan && (
              <div style={{ background: "var(--gh-dark-3)", borderRadius: "8px", padding: "14px", marginTop: "16px" }}>
                <div className="d-flex justify-content-between" style={{ fontSize: "13px" }}>
                  <span className="text-gh-muted">Plan</span>
                  <span style={{ textTransform: "capitalize" }}>{user.subscription.plan}</span>
                </div>
                <div className="d-flex justify-content-between mt-2" style={{ fontSize: "13px" }}>
                  <span className="text-gh-muted">Monthly donation</span>
                  <span style={{ color: "var(--gh-green-muted)" }}>
                    ₹{Math.floor(((user.subscription.plan === "yearly" ? 9999 / 12 : 999) * percentage) / 100)}
                  </span>
                </div>
              </div>
            )}

            <button className="btn-gh-gold w-100 mt-4" onClick={save} disabled={saving}>
              {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Save Preference
            </button>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="gh-card">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", margin: 0 }}>SELECT CHARITY</h6>
              <div className="position-relative" style={{ width: "200px" }}>
                <i className="bi bi-search position-absolute" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--gh-text-muted)", fontSize: "12px" }} />
                <input className="form-control gh-input" style={{ paddingLeft: "30px", fontSize: "13px", padding: "8px 8px 8px 30px" }} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>

            <div style={{ maxHeight: "420px", overflowY: "auto" }} className="d-flex flex-column gap-2">
              {charities.map((c) => (
                <div key={c._id}
                  onClick={() => setSelected(c._id)}
                  style={{ padding: "14px 16px", borderRadius: "10px", border: `1px solid ${selected === c._id ? "var(--gh-green)" : "var(--gh-border)"}`, background: selected === c._id ? "rgba(26,107,60,0.1)" : "var(--gh-dark-3)", cursor: "pointer", transition: "all 0.18s" }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: selected === c._id ? "var(--gh-green)" : "var(--gh-dark-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <i className="bi bi-heart-fill" style={{ color: selected === c._id ? "#fff" : "var(--gh-text-muted)", fontSize: "14px" }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "14px", fontWeight: 500 }}>{c.name}</div>
                      <div className="text-gh-muted" style={{ fontSize: "12px" }}>{c.category} · {c.subscriberCount} supporters</div>
                    </div>
                    {selected === c._id && <i className="bi bi-check-circle-fill" style={{ color: "var(--gh-green-light)" }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCharityPage;
