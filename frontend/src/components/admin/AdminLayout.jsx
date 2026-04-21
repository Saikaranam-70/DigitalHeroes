import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: "bi-grid", end: true },
  { to: "/admin/users", label: "Users", icon: "bi-people" },
  { to: "/admin/draws", label: "Draws", icon: "bi-shuffle" },
  { to: "/admin/charities", label: "Charities", icon: "bi-heart" },
  { to: "/admin/winners", label: "Winners", icon: "bi-trophy" },
  { to: "/admin/payments", label: "Payments", icon: "bi-credit-card" },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <div style={{ background: "var(--gh-dark)", minHeight: "100vh" }}>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 99 }} />}

      <div className={`gh-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="gh-sidebar-logo">
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: "3px", color: "var(--gh-gold-light)" }}>ADMIN</div>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "2px", color: "var(--gh-text-muted)" }}>DIGITAL HEROES</div>
        </div>

        <nav className="gh-sidebar-nav">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `gh-nav-item ${isActive ? "active" : ""}`} onClick={() => setSidebarOpen(false)}>
              <i className={`bi ${item.icon}`} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: "16px 12px", borderTop: "1px solid var(--gh-border)" }}>
          <div className="d-flex align-items-center gap-2 px-2 mb-3">
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--gh-gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "#0a0a0a", flexShrink: 0 }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 500 }}>{user?.name}</div>
              <div className="text-gh-muted" style={{ fontSize: "11px" }}>Administrator</div>
            </div>
          </div>
          <button onClick={handleLogout} className="gh-nav-item w-100" style={{ background: "none", border: "none", color: "#ff8080", justifyContent: "flex-start" }}>
            <i className="bi bi-box-arrow-right" />Logout
          </button>
        </div>
      </div>

      <div className="gh-main-content">
        <div className="d-flex align-items-center justify-content-between mb-4 d-md-none">
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", color: "var(--gh-text)", fontSize: "1.3rem" }}>
            <i className="bi bi-list" />
          </button>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "2px", color: "var(--gh-gold-light)" }}>ADMIN</span>
          <div />
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
