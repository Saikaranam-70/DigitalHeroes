import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-gh">
      <div className="container">
        
        {/* LOGO */}
        <Link to="/" className="navbar-brand text-decoration-none">
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.6rem",
              letterSpacing: "3px",
              color: "var(--gh-green-muted)",
            }}
          >
            DIGITAL
            <span style={{ color: "var(--gh-gold-light)" }}>HEROES</span>
          </span>
        </Link>

        {/* HAMBURGER BUTTON */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* COLLAPSIBLE CONTENT */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="ms-auto d-flex flex-column flex-lg-row align-items-lg-center gap-3 gap-lg-4 mt-3 mt-lg-0">
            
            {/* LINKS */}
            <Link to="/charities" className="text-gh-muted" style={{ fontSize: "14px", fontWeight: 500 }}>
              Charities
            </Link>
            <Link to="/draws" className="text-gh-muted" style={{ fontSize: "14px", fontWeight: 500 }}>
              Draws
            </Link>
            <Link to="/pricing" className="text-gh-muted" style={{ fontSize: "14px", fontWeight: 500 }}>
              Pricing
            </Link>

            {/* AUTH */}
            {user ? (
              <div className="dropdown">
                <button
                  className="btn-gh-outline d-flex align-items-center gap-2"
                  style={{ padding: "8px 16px" }}
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle" />
                  <span style={{ fontSize: "14px" }}>
                    {user.name.split(" ")[0]}
                  </span>
                  <i className="bi bi-chevron-down" style={{ fontSize: "10px" }} />
                </button>

                <ul
                  className="dropdown-menu dropdown-menu-end"
                  style={{
                    background: "var(--gh-dark-card)",
                    border: "1px solid var(--gh-border)",
                    minWidth: "160px",
                  }}
                >
                  <li>
                    <Link
                      to={user.role === "admin" ? "/admin" : "/dashboard"}
                      className="dropdown-item"
                      style={{ color: "var(--gh-text)", fontSize: "14px" }}
                    >
                      <i className="bi bi-speedometer2 me-2" />
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <hr
                      className="dropdown-divider"
                      style={{ borderColor: "var(--gh-border)" }}
                    />
                  </li>

                  <li>
                    <button
                      className="dropdown-item"
                      style={{ color: "#ff8080", fontSize: "14px" }}
                      onClick={handleLogout}
                    >
                      <i className="bi bi-box-arrow-right me-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex flex-column flex-lg-row gap-2">
                <Link
                  to="/login"
                  className="btn-gh-outline"
                  style={{ padding: "8px 18px", fontSize: "14px" }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-gh-gold"
                  style={{ padding: "8px 18px", fontSize: "14px" }}
                >
                  Subscribe
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;