import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/stats").then((r) => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: "Total Users", value: stats.totalUsers, icon: "bi-people", color: "#80aaff" },
    { label: "Active Subscribers", value: stats.activeSubscribers, icon: "bi-person-check", color: "var(--gh-green-muted)" },
    { label: "Total Revenue", value: `₹${stats.totalRevenue?.toLocaleString()}`, icon: "bi-currency-rupee", color: "var(--gh-gold-light)" },
    { label: "Charity Contributions", value: `₹${stats.totalCharityContributions?.toLocaleString()}`, icon: "bi-heart-fill", color: "#ff8080" },
    { label: "Prize Pool Total", value: `₹${stats.totalPrizePool?.toLocaleString()}`, icon: "bi-trophy-fill", color: "var(--gh-gold-light)" },
    { label: "Active Charities", value: stats.activeCharities, icon: "bi-building-heart", color: "var(--gh-green-muted)" },
  ] : [];

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>
        ADMIN <span style={{ color: "var(--gh-gold-light)" }}>DASHBOARD</span>
      </h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>Platform overview and key metrics.</p>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--gh-green-light)" }} /></div>
      ) : (
        <div className="row g-3">
          {cards.map((card) => (
            <div className="col-sm-6 col-lg-4" key={card.label}>
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="stat-label">{card.label}</div>
                    <div className="stat-value mt-1" style={{ color: card.color }}>{card.value}</div>
                  </div>
                  <i className={`bi ${card.icon}`} style={{ fontSize: "1.6rem", color: card.color, opacity: 0.4 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
