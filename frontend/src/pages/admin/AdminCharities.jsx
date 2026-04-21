import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const BLANK = { name: "", description: "", image: "", website: "", category: "General", isFeatured: false };

const AdminCharities = () => {
  const [charities, setCharities] = useState([]);
  const [form, setForm] = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchCharities = async () => {
    try {
      const { data } = await api.get("/charities");
      setCharities(data.charities);
    } catch {}
  };

  useEffect(() => { fetchCharities(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await api.put(`/charities/${editing}`, form);
        toast.success("Charity updated");
        setEditing(null);
      } else {
        await api.post("/charities", form);
        toast.success("Charity created");
      }
      setForm(BLANK);
      setShowForm(false);
      fetchCharities();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (c) => {
    setEditing(c._id);
    setForm({ name: c.name, description: c.description, image: c.image || "", website: c.website || "", category: c.category || "General", isFeatured: c.isFeatured || false });
    setShowForm(true);
  };

  const deleteCharity = async (id) => {
    if (!confirm("Delete this charity?")) return;
    try {
      await api.delete(`/charities/${id}`);
      toast.success("Charity deleted");
      fetchCharities();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="page-enter">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "2px" }}>CHARITIES</h2>
          <p className="text-gh-muted" style={{ fontSize: "14px", margin: 0 }}>{charities.length} registered charities</p>
        </div>
        <button className="btn-gh-gold" onClick={() => { setShowForm(!showForm); setEditing(null); setForm(BLANK); }}>
          <i className={`bi ${showForm ? "bi-x" : "bi-plus-lg"} me-2`} />
          {showForm ? "Cancel" : "Add Charity"}
        </button>
      </div>

      {showForm && (
        <div className="gh-card mb-4">
          <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1rem", letterSpacing: "1px", marginBottom: "16px" }}>
            {editing ? "EDIT CHARITY" : "NEW CHARITY"}
          </h6>
          <form onSubmit={submit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="gh-label">Name</label>
                <input className="form-control gh-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="gh-label">Category</label>
                <input className="form-control gh-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="gh-label">Description</label>
                <textarea className="form-control gh-input" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="col-md-6">
                <label className="gh-label">Image URL</label>
                <input className="form-control gh-input" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="col-md-6">
                <label className="gh-label">Website</label>
                <input className="form-control gh-input" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
              </div>
              <div className="col-12">
                <label className="d-flex align-items-center gap-2 cursor-pointer" style={{ cursor: "pointer", fontSize: "14px" }}>
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} style={{ accentColor: "var(--gh-green)", width: "16px", height: "16px" }} />
                  Featured on homepage
                </label>
              </div>
            </div>
            <button type="submit" className="btn-gh-primary mt-4" disabled={loading}>
              {loading ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              {editing ? "Update" : "Create Charity"}
            </button>
          </form>
        </div>
      )}

      <div className="row g-3">
        {charities.map((c) => (
          <div className="col-md-6 col-lg-4" key={c._id}>
            <div className="gh-card h-100" style={{ position: "relative" }}>
              {c.isFeatured && (
                <div style={{ position: "absolute", top: "12px", right: "12px", fontSize: "11px", color: "var(--gh-gold-light)", background: "rgba(201,168,76,0.1)", padding: "2px 8px", borderRadius: "4px" }}>FEATURED</div>
              )}
              <h6 style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", letterSpacing: "1px" }}>{c.name}</h6>
              <p className="text-gh-muted" style={{ fontSize: "12px", margin: "6px 0 10px" }}>{c.category}</p>
              <p style={{ fontSize: "13px", color: "var(--gh-text)", lineHeight: 1.6 }}>{c.description?.slice(0, 80)}...</p>
              <div className="d-flex align-items-center gap-2 mt-2 mb-3">
                <i className="bi bi-people" style={{ color: "var(--gh-green-light)", fontSize: "12px" }} />
                <span className="text-gh-muted" style={{ fontSize: "12px" }}>{c.subscriberCount} supporters</span>
              </div>
              <div className="d-flex gap-2">
                <button onClick={() => startEdit(c)} className="btn-gh-outline" style={{ fontSize: "12px", padding: "6px 14px", flex: 1 }}>Edit</button>
                <button onClick={() => deleteCharity(c._id)} style={{ fontSize: "12px", padding: "6px 14px", flex: 1, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", color: "#ff8080", borderRadius: "8px", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCharities;
