import { useState, useEffect } from "react";
import api from "../../services/api";

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/admin/payments?page=${page}`)
      .then((r) => {
        setPayments(r.data.payments);
        setTotal(r.data.total);
        setPages(r.data.pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="page-enter">
      <h2 style={{ fontFamily: "var(--font-display)", fontSize: "2rem", letterSpacing: "1px", marginBottom: "4px" }}>PAYMENTS</h2>
      <p className="text-gh-muted mb-4" style={{ fontSize: "14px" }}>{total} total successful payments</p>

      <div className="gh-card" style={{ overflowX: "auto" }}>
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border" style={{ color: "var(--gh-green-light)" }} /></div>
        ) : payments.length === 0 ? (
          <p className="text-gh-muted text-center py-4">No payments yet.</p>
        ) : (
          <table className="gh-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Plan</th>
                <th>Amount</th>
                <th>Charity Share</th>
                <th>Pool Share</th>
                <th>Razorpay ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ fontWeight: 500, fontSize: "14px" }}>{p.userId?.name}</div>
                    <div className="text-gh-muted" style={{ fontSize: "12px" }}>{p.userId?.email}</div>
                  </td>
                  <td>
                    <span style={{ textTransform: "capitalize", fontSize: "13px", padding: "3px 10px", borderRadius: "4px", background: p.plan === "yearly" ? "rgba(201,168,76,0.1)" : "rgba(45,158,95,0.1)", color: p.plan === "yearly" ? "var(--gh-gold-light)" : "var(--gh-green-muted)" }}>
                      {p.plan}
                    </span>
                  </td>
                  <td style={{ color: "var(--gh-gold-light)", fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>₹{p.amount?.toLocaleString()}</td>
                  <td style={{ color: "#ff8080" }}>₹{p.charityAmount?.toLocaleString()}</td>
                  <td style={{ color: "var(--gh-green-muted)" }}>₹{p.prizePoolAmount?.toLocaleString()}</td>
                  <td className="text-gh-muted" style={{ fontSize: "11px", maxWidth: "140px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.razorpayPaymentId}</td>
                  <td className="text-gh-muted" style={{ fontSize: "13px" }}>{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : "—"}</td>
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

export default AdminPayments;
