import React from "react";

const IncomeSummary = ({ incomeList = [], expenseList = [] }) => {
  const totalIncome = incomeList.reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpenses = expenseList.reduce((sum, e) => sum + Number(e.amount), 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div style={{ background: "#f3eafe", borderRadius: 12, padding: 16, marginBottom: 24, display: 'flex', gap: 32, justifyContent: 'center' }}>
      <div>
        <div style={{ fontWeight: 600, fontSize: 18, color: '#7b2ff2' }}>Total Income</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>${totalIncome.toFixed(2)}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 18, color: '#e53935' }}>Total Expenses</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>${totalExpenses.toFixed(2)}</div>
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: 18, color: netBalance >= 0 ? '#43a047' : '#e53935' }}>Net Balance</div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>${netBalance.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default IncomeSummary; 