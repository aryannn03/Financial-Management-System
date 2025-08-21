import React, { useEffect, useState } from "react";
import ExpenseSummary from "./ExpenseSummary";
import ExpenseChart from "./ExpenseChart";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import IncomeForm from "./IncomeForm";
import IncomeList from "./IncomeList";
import IncomeSummary from "./IncomeSummary";
import { useExpenses } from "../context/ExpenseContext";

const Dashboard = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [incomeLoading, setIncomeLoading] = useState(true);
  const { expenses } = useExpenses();

  // Fetch income
  const fetchIncome = async () => {
    setIncomeLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://finance-backend-g8ab.onrender.com/api/income", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setIncomeList(data);
    } finally {
      setIncomeLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  // ✅ Add income instantly
  const handleAddIncome = (newIncome) => {
    setIncomeList((prev) => [...prev, newIncome]);
  };

  // ✅ Delete income instantly
  const handleDeleteIncome = (id) => {
    setIncomeList((prev) => prev.filter((income) => income._id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Income and Expense summary */}
      <IncomeSummary incomeList={incomeList} expenseList={expenses} />

      {/* Income management */}
      <IncomeForm onAdd={handleAddIncome} />
      <IncomeList
        incomes={incomeList}
        loading={incomeLoading}
        onDelete={handleDeleteIncome}
      />

      {/* Expense management */}
      <ExpenseSummary />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ExpenseChart />
        </div>
        <div>
          <ExpenseForm />
        </div>
      </div>
      <ExpenseList />
    </div>
  );
};

export default Dashboard;
