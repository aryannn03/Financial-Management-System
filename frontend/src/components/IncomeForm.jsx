import React, { useState } from "react";

const defaultCategories = ["Salary", "Business", "Investment", "Gift", "Other"];

const IncomeForm = ({ onAdd }) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(defaultCategories[0]);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/income", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, category, date, note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add income");
      setAmount("");
      setCategory(defaultCategories[0]);
      setDate("");
      setNote("");
      if (onAdd) onAdd(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 12px rgba(123,47,242,0.07)', padding: 24, marginBottom: 24, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ color: '#7b2ff2', fontSize: 24, marginRight: 8 }}>
          <svg width="28" height="28" fill="none" stroke="#7b2ff2" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v8m0 0v-8m0 8h4m-4 0H8"/><circle cx="12" cy="12" r="10"/></svg>
        </span>
        <h3 style={{ fontWeight: 700, fontSize: 20, color: '#7b2ff2', margin: 0 }}>Add Income</h3>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            type="number"
            id="income-amount"
            name="amount"
            placeholder="Amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            style={{ flex: 1, borderRadius: 8, border: '1.5px solid #e0e0e0', padding: '0.7em', fontSize: 16 }}
            autocomplete="off"
          />
          <select id="income-category" name="category" value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1, borderRadius: 8, border: '1.5px solid #e0e0e0', padding: '0.7em', fontSize: 16 }}>
            {defaultCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input
            type="date"
            id="income-date"
            name="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
            style={{ flex: 1, borderRadius: 8, border: '1.5px solid #e0e0e0', padding: '0.7em', fontSize: 16 }}
            autocomplete="off"
          />
          <input
            type="text"
            id="income-note"
            name="note"
            placeholder="Note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{ flex: 2, borderRadius: 8, border: '1.5px solid #e0e0e0', padding: '0.7em', fontSize: 16 }}
            autocomplete="off"
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: '0.8em', background: 'linear-gradient(90deg,#7b2ff2,#f357a8)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 17, marginTop: 4, boxShadow: '0 1px 4px rgba(123,47,242,0.08)' }}>
          {loading ? "Adding..." : "Add Income"}
        </button>
        {error && <div style={{ color: "#e53935", marginTop: 8, textAlign: 'center' }}>{error}</div>}
      </form>
    </div>
  );
};

export default IncomeForm; 