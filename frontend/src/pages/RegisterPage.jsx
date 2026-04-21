import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success("Account created! Subscribe to get started.");
      navigate("/dashboard/subscription");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "radial-gradient(ellipse at center, rgba(26,107,60,0.12) 0%, var(--gh-dark) 70%)", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }} className="page-enter">
        <div className="text-center mb-5">
          <Link to="/" style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "3px", color: "var(--gh-green-muted)", textDecoration: "none" }}>
            GOLF<span style={{ color: "var(--gh-gold-light)" }}>HERO</span>
          </Link>
          <p className="text-gh-muted mt-2" style={{ fontSize: "14px" }}>Create your account</p>
        </div>

        <div className="gh-card">
          <form onSubmit={submit}>
            <div className="mb-3">
              <label className="gh-label">Full Name</label>
              <input name="name" className="form-control gh-input" placeholder="Your name" value={form.name} onChange={handle} required />
            </div>
            <div className="mb-3">
              <label className="gh-label">Email</label>
              <input name="email" type="email" className="form-control gh-input" placeholder="you@email.com" value={form.email} onChange={handle} required />
            </div>
            <div className="mb-3">
              <label className="gh-label">Password</label>
              <input name="password" type="password" className="form-control gh-input" placeholder="Min 6 characters" value={form.password} onChange={handle} required />
            </div>
            <div className="mb-5">
              <label className="gh-label">Confirm Password</label>
              <input name="confirm" type="password" className="form-control gh-input" placeholder="Repeat password" value={form.confirm} onChange={handle} required />
            </div>
            <button type="submit" className="btn-gh-gold w-100" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-gh-muted mt-4 mb-0" style={{ fontSize: "14px" }}>
            Have an account? <Link to="/login" className="text-gh-green">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
