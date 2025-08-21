import React from "react";
import { formatCurrency } from "../utils/expenses";
import { Trash2 } from "lucide-react";
const IncomeList = ({ incomes = [], onDelete, loading = false }) => {
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income entry?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`https://finance-backend-g8ab.onrender.com/api/income/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete income");

      // ✅ Update parent instantly
      if (onDelete) onDelete(id);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading income...</div>;
  if (!incomes.length) return <div>No income entries yet.</div>;

  return (
    <div style={{ marginBottom: 24 }}>
      <h3>Your Income</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f3eafe" }}>
            <th style={{ padding: 8, textAlign: "left" }}>Amount</th>
            <th style={{ padding: 8, textAlign: "left" }}>Category</th>
            <th style={{ padding: 8, textAlign: "left" }}>Date</th>
            <th style={{ padding: 8, textAlign: "left" }}>Note</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>
                {formatCurrency(Number(income.amount))}
              </td>
              <td style={{ padding: 8 }}>{income.category}</td>
              <td style={{ padding: 8 }}>
                {income.date
                  ? new Date(income.date).toLocaleDateString()
                  : ""}
              </td>
              <td style={{ padding: 8 }}>{income.note}</td>
              <td style={{ padding: 8 }}>
                <button
                  onClick={() => handleDelete(income._id)}
                  style={{
                    color: "#e53935",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                  }}
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeList;
