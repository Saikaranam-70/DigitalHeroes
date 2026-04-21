import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Overview", icon: "bi-grid", end: true },
  { to: "/dashboard/scores", label: "My Scores", icon: "bi-pencil-square" },
  { to: "/dashboard/charity", label: "My Charity", icon: "bi-heart" },
  { to: "/dashboard/winnings", label: "Winnings", icon: "bi-trophy" },
  { to: "/dashboard/subscription", label: "Subscription", icon: "bi-credit-card" },
  { to: "/dashboard/profile", label: "Profile", icon: "bi-person" },
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div style={{ background: "var(--gh-dark)", minHeight: "100vh" }}>
      {/* Mobile overlay */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99 }} />}

      <div className={`gh-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="gh-sidebar-logo">
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", letterSpacing: "3px", color: "var(--gh-green-muted)" }}>
            GOLF<span style={{ color: "var(--gh-gold-light)" }}>HERO</span>
          </div>
          <div className="d-flex align-items-center gap-2 mt-2">
            {user?.subscription?.status === "active"
              ? <span className="gh-badge-active">Active</span>
              : <span className="gh-badge-inactive">Inactive</span>}
          </div>
        </div>

        <nav className="gh-sidebar-nav">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `gh-nav-item ${isActive ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid var(--gh-border)" }}>
          <div className="d-flex align-items-center gap-2 px-2 mb-3">
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--gh-green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "13px", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user?.name}</div>
              <div className="text-gh-muted" style={{ fontSize: "11px" }}>{user?.subscription?.plan || "No plan"}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="gh-nav-item w-100" style={{ background: "none", border: "none", color: "#ff8080", justifyContent: "flex-start" }}>
            <i className="bi bi-box-arrow-right" />
            Logout
          </button>
        </div>
      </div>

      <div className="gh-main-content">
        <div className="d-flex align-items-center justify-content-between mb-4 d-md-none">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "var(--gh-text)", fontSize: "1.3rem" }}>
            <i className="bi bi-list" />
          </button>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", letterSpacing: "2px", color: "var(--gh-green-muted)" }}>GOLFHERO</span>
          <div />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
