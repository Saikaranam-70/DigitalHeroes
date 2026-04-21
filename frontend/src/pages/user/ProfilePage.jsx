import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const ProfilePage = () => {
  const { user, refreshUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [savingName, setSavingName] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const saveName = async (e) => {
    e.preventDefault();
    setSavingName(true);
    try {
      await api.put("/auth/profile", { name });
      await refreshUser();
      toast.success("Name updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSavingName(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) return toast.error("Passwords don't match");
    if (pwForm.newPassword.length < 6) return toast.error("Min 6 characters");
    setSavingPw(true);
    try {
      await api.put("/auth/password", { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success("Password changed");
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setSavingPw(false);
    }
  };

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>PROFILE</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>Manage your account information.</p>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="gh-card mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "linear-gradient(135deg, var(--gh-green), var(--gh-green-light))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 700, flexShrink: 0 }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "16px" }}>{user?.name}</div>
                <div className="text-gh-muted" style={{ fontSize: "13px" }}>{user?.email}</div>
              </div>
            </div>

            <div style={{ background: "var(--gh-dark-3)", borderRadius: "8px", padding: "14px" }}>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: "13px" }}>
                <span className="text-gh-muted">Member since</span>
                <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-2" style={{ fontSize: "13px" }}>
                <span className="text-gh-muted">Subscription</span>
                <span style={{ textTransform: "capitalize", color: user?.subscription?.status === "active" ? "var(--gh-green-muted)" : "#ff8080" }}>{user?.subscription?.status}</span>
              </div>
              <div className="d-flex justify-content-between" style={{ fontSize: "13px" }}>
                <span className="text-gh-muted">Plan</span>
                <span style={{ textTransform: "capitalize" }}>{user?.subscription?.plan || "None"}</span>
              </div>
            </div>
          </div>

          <div className="gh-card">
            <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "16px" }}>UPDATE NAME</h6>
            <form onSubmit={saveName}>
              <div className="mb-3">
                <label className="gh-label">Full Name</label>
                <input className="form-control gh-input" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <button type="submit" className="btn-gh-primary" disabled={savingName}>
                {savingName ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Save Name
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="gh-card">
            <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "16px" }}>CHANGE PASSWORD</h6>
            <form onSubmit={savePassword}>
              <div className="mb-3">
                <label className="gh-label">Current Password</label>
                <input type="password" className="form-control gh-input" value={pwForm.currentPassword} onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="gh-label">New Password</label>
                <input type="password" className="form-control gh-input" value={pwForm.newPassword} onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} required />
              </div>
              <div className="mb-4">
                <label className="gh-label">Confirm New Password</label>
                <input type="password" className="form-control gh-input" value={pwForm.confirm} onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })} required />
              </div>
              <button type="submit" className="btn-gh-primary" disabled={savingPw}>
                {savingPw ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
