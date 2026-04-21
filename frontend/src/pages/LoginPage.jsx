import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // 👉 Demo autofill function
  const fillDemoAdmin = () => {
    setForm({
      email: "saikaranam995@gmail.com",
      password: "Admin@123",
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "radial-gradient(ellipse at center, rgba(26,107,60,0.12) 0%, var(--gh-dark) 70%)",
        padding: "24px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }} className="page-enter">
        
        {/* LOGO */}
        <div className="text-center mb-5">
          <Link
            to="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "2rem",
              letterSpacing: "3px",
              color: "var(--gh-green-muted)",
              textDecoration: "none",
            }}
          >
            DIGITAL
            <span style={{ color: "var(--gh-gold-light)" }}>HEROES</span>
          </Link>
          <p className="text-gh-muted mt-2" style={{ fontSize: "14px" }}>
            Sign in to your account
          </p>
        </div>

        {/* CARD */}
        <div className="gh-card">

          {/* 🔥 DEMO LOGIN BOX */}
          <div
            onClick={fillDemoAdmin}
            style={{
              cursor: "pointer",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--gh-border)",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "20px",
              fontSize: "13px",
            }}
          >
            <strong style={{ color: "var(--gh-gold-light)" }}>
              Click to use Demo Admin
            </strong>
            <div className="text-gh-muted mt-1">
              Email: <span style={{ color: "#fff" }}>saikaranam995@gmail.com</span> <br />
              Password: <span style={{ color: "#fff" }}>Admin@123</span>
            </div>
            <p>Wait 40secs from initial Request to restart render free tier server</p>
          </div>

          {/* FORM */}
          <form onSubmit={submit}>
            <div className="mb-4">
              <label className="gh-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control gh-input"
                placeholder="you@email.com"
                value={form.email}
                onChange={handle}
                required
              />
            </div>

            <div className="mb-5">
              <label className="gh-label">Password</label>
              <input
                name="password"
                type="password"
                className="form-control gh-input"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-gh-gold w-100"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2" />
              ) : null}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* FOOTER */}
          <p
            className="text-center text-gh-muted mt-4 mb-0"
            style={{ fontSize: "14px" }}
          >
            No account?{" "}
            <Link to="/register" className="text-gh-green">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;