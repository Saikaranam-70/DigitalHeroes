import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../services/api";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/users?page=${page}&search=${search}`);
      setUsers(data.users);
      setTotal(data.total);
      setPages(data.pages);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search]);

  const toggleActive = async (userId, current) => {
    try {
      await api.put(`/admin/users/${userId}`, { isActive: !current });
      toast.success("User updated");
      fetchUsers();
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>USERS</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>{total} total users</p>

      <div className="gh-card mb-4">
        <div className="position-relative" style={{ maxWidth: "320px" }}>
          <i className="bi bi-search position-absolute" style={{ left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--gh-text-muted)" }} />
          <input className="form-control gh-input" style={{ paddingLeft: "36px" }} placeholder="Search by name or email..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        </div>
      </div>

      <div className="gh-card" style={{ overflowX: "auto" }}>
        {loading ? (
          <div className="text-center py-4"><div className="spinner-border" style={{ color: "var(--gh-green-light)" }} /></div>
        ) : (
          <table className="gh-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subscription</th>
                <th>Plan</th>
                <th>Charity %</th>
                <th>Scores</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 500 }}>{u.name}</td>
                  <td className="text-gh-muted">{u.email}</td>
                  <td>
                    <span className={u.subscription?.status === "active" ? "gh-badge-active" : "gh-badge-inactive"}>
                      {u.subscription?.status}
                    </span>
                  </td>
                  <td className="text-gh-muted" style={{ textTransform: "capitalize" }}>{u.subscription?.plan || "—"}</td>
                  <td>{u.charity?.percentage || 10}%</td>
                  <td>{u.scores?.length || 0}/5</td>
                  <td>
                    <span style={{ fontSize: "12px", color: u.isActive ? "var(--gh-green-muted)" : "#ff8080" }}>
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => toggleActive(u._id, u.isActive)}
                      style={{ fontSize: "12px", padding: "4px 10px", borderRadius: "6px", border: "1px solid var(--gh-border)", background: "transparent", color: u.isActive ? "#ff8080" : "var(--gh-green-muted)", cursor: "pointer" }}
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} style={{ width: "36px", height: "36px", borderRadius: "8px", border: "1px solid var(--gh-border)", background: page === p ? "var(--gh-green)" : "transparent", color: page === p ? "#fff" : "var(--gh-text-muted)", cursor: "pointer" }}>
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
