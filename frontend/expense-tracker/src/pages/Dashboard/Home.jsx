import React, { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { useNavigate } from 'react-router-dom';
import { LuHandCoins, LuWalletMinimal } from 'react-icons/lu';
import InfoCard from "../../components/Cards/InfoCard";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeprator } from '../../utils/helper';
import  RecentTransactions  from '../../components/Dashboard/RecentTransactions';
import FinanceOverview from '../../components/Dashboard/FinanceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/Last30DaysExpenses';
import RecentIncomeWithChart from '../../components/Dashboard/RecentIncomeWithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

const fetchDashboardData = async () => {
  if (loading) return;

  setLoading(true);

  try {
    const [dashboardRes, incomeRes, expenseRes] = await Promise.all([
      axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA),
      axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME),
      axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSE),
    ]);
    console.log("Dashboard Data =>", dashboardRes.data);


    setDashboardData({
      ...dashboardRes.data,
      allIncome: incomeRes.data.income || [],
      allExpense: expenseRes.data.expense || [],
    });

  } catch (error) {
    console.log("Something went wrong. Please try again.", error);
  } finally {
    setLoading(false);
  }
};
    console.log("Dashboard =>", dashboardData);
console.log("Last 30 Days Expenses:", dashboardData?.last30DaysExpenses);
console.log("Last 30 Days Transactions:", dashboardData?.last30DaysExpenses?.transactions);


  useEffect(() => {
    fetchDashboardData();
    return () => {};
  }, []);

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="my-5 mx-auto">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeprator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />

          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeprator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />

          <InfoCard
            icon={<LuHandCoins />}
            label="Total Expense"
            value={addThousandsSeprator(dashboardData?.totalExpense || 0)}
            color="bg-red-500"
          />
        </div> 

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <RecentTransactions
            transactions={dashboardData?.recentTransactions}
            onSeeMore={() => navigate("/expense")}
          />


          <FinanceOverview
            totalBalance={dashboardData?.totalBalance || 0}
            totalIncome={dashboardData?.totalIncome || 0}
            totalExpense={dashboardData?.totalExpenses || 0}
          /> 

          <ExpenseTransactions
            transactions={dashboardData?.last30DaysExpenses?.transactions || []}
            onSeeMore={() => navigate("/expense")}
          /> 

          <Last30DaysExpenses 
            data={dashboardData?.last30DaysExpenses?.transactions || []}
          />

          <RecentIncomeWithChart 
            data={dashboardData?.last60DaysIncome?.transactions?.slice(0,4) || []}
            totalIncome={dashboardData?.totalIncome || 0}
          />
          
          <RecentIncome
            transactions={dashboardData?.last60DaysIncome?.transactions || []}
            onSeeMore={() => navigate("/income")}
          />

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;