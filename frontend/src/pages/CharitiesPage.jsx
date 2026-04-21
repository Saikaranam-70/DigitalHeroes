import { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

const CharitiesPage = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchCharities = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/charities?search=${search}`);
      setCharities(data.charities);
    } catch {
      setCharities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCharities(); }, [search]);

  return (
    <div>
      <Navbar />
      <section style={{ padding: "72px 0 40px", background: "radial-gradient(ellipse at top, rgba(26,107,60,0.15) 0%, transparent 60%)" }}>
        <div className="container page-enter">
          <div className="text-center mb-5">
            <p className="text-gh-green" style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "3px", textTransform: "uppercase" }}>Making a Difference</p>
            <h1 className="section-title mt-1">SUPPORTED<br /><span style={{ color: "var(--gh-green-muted)" }}>CHARITIES</span></h1>
            <p className="text-gh-muted mt-3" style={{ fontSize: "15px" }}>Every GolfHero subscriber donates at least 10% of their subscription to their chosen charity.</p>
          </div>

          <div className="row justify-content-center mb-5">
            <div className="col-md-5">
              <div className="position-relative">
                <i className="bi bi-search position-absolute" style={{ left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--gh-text-muted)" }} />
                <input
                  className="form-control gh-input"
                  style={{ paddingLeft: "40px" }}
                  placeholder="Search charities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--gh-green-light)" }} /></div>
          ) : charities.length === 0 ? (
            <div className="text-center py-5 text-gh-muted">No charities found</div>
          ) : (
            <div className="row g-4">
              {charities.map((c) => (
                <div className="col-md-6 col-lg-4" key={c._id}>
                  <div className="gh-card h-100" style={{ position: "relative" }}>
                    {c.isFeatured && (
                      <div style={{ position: "absolute", top: "14px", right: "14px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", color: "var(--gh-gold-light)", fontSize: "11px", fontWeight: 600, padding: "3px 10px", borderRadius: "20px" }}>
                        FEATURED
                      </div>
                    )}
                    {c.image && (
                      <img src={c.image} alt={c.name} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "16px" }} />
                    )}
                    <h5 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", letterSpacing: "1px" }}>{c.name}</h5>
                    {c.category && (
                      <span style={{ fontSize: "11px", color: "var(--gh-green-muted)", background: "rgba(45,158,95,0.1)", padding: "2px 8px", borderRadius: "4px", display: "inline-block", margin: "6px 0 10px" }}>{c.category}</span>
                    )}
                    <p className="text-gh-muted" style={{ fontSize: "13px", lineHeight: 1.65 }}>{c.description?.slice(0, 120)}...</p>

                    {c.events?.length > 0 && (
                      <div style={{ marginTop: "14px", padding: "12px", background: "var(--gh-dark-3)", borderRadius: "8px" }}>
                        <p style={{ fontSize: "11px", color: "var(--gh-text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px" }}>Upcoming Event</p>
                        <p style={{ fontSize: "13px", margin: 0 }}>{c.events[0].title}</p>
                        <p className="text-gh-muted" style={{ fontSize: "12px", margin: 0 }}>{c.events[0].location} · {new Date(c.events[0].date).toLocaleDateString()}</p>
                      </div>
                    )}

                    <div className="d-flex align-items-center gap-2 mt-3">
                      <i className="bi bi-people" style={{ color: "var(--gh-green-light)", fontSize: "13px" }} />
                      <span className="text-gh-muted" style={{ fontSize: "12px" }}>{c.subscriberCount} supporters</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CharitiesPage;
