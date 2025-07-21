import React, { useEffect, useState } from "react";

const IncomeList = ({ onChange }) => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIncomes = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch income");
      setIncomes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
    // eslint-disable-next-line
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this income entry?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/income/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete income");
      setIncomes(incomes.filter(i => i._id !== id));
      if (onChange) onChange();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Loading income...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
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
          {incomes.map(income => (
            <tr key={income._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>${Number(income.amount).toFixed(2)}</td>
              <td style={{ padding: 8 }}>{income.category}</td>
              <td style={{ padding: 8 }}>{income.date ? new Date(income.date).toLocaleDateString() : ""}</td>
              <td style={{ padding: 8 }}>{income.note}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleDelete(income._id)} style={{ color: "#e53935", border: "none", background: "none", cursor: "pointer" }}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomeList; 