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
  const { expenses } = useExpenses();

  // Fetch income
  const fetchIncome = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:5000/api/income", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setIncomeList(data);
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  return (
    <div className="space-y-8">
      {/* Income and Expense summary */}
      <IncomeSummary incomeList={incomeList} expenseList={expenses} />

      {/* Income management */}
      <IncomeForm onAdd={fetchIncome} />
      <IncomeList onChange={fetchIncome} />

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
