import { createContext, useContext, useEffect, useReducer } from "react";

const ExpenseContext = createContext();

const initialState = {
  expenses: [],
  loading: false,
  error: null,
};

const expenseReducer = (state, action) => {
  switch (action.type) {
    case "ADD_EXPENSE":
      return { ...state, expenses: [...state.expenses, action.payload] };
    case "DELETE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.filter(
          (expense) => expense._id !== action.payload.id
        ),
      };
    case "UPDATE_EXPENSE":
      return {
        ...state,
        expenses: state.expenses.map((expense) =>
          expense._id === action.payload._id ? action.payload : expense
        ),
      };
    case "SET_EXPENSES":
      return { ...state, expenses: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const ExpenseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(expenseReducer, initialState);

  // Fetch expenses from backend on mount
  useEffect(() => {
    const fetchExpenses = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/expenses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          dispatch({ type: "SET_EXPENSES", payload: data });
        } else {
          dispatch({ type: "SET_ERROR", payload: data.message || "Failed to fetch expenses" });
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: error.message });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };
    fetchExpenses();
  }, []);

  const addExpense = async (expense) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(expense),
      });
      const data = await res.json();
      if (res.ok) {
        dispatch({ type: "ADD_EXPENSE", payload: data });
      } else {
        dispatch({ type: "SET_ERROR", payload: data.message || "Failed to add expense" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const deleteExpense = async (id) => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        dispatch({ type: "DELETE_EXPENSE", payload: { id } });
      } else {
        const data = await res.json();
        dispatch({ type: "SET_ERROR", payload: data.message || "Failed to delete expense" });
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const value = {
    ...state,
    addExpense,
    deleteExpense,
    updateExpense: (expense) => {
      dispatch({ type: "UPDATE_EXPENSE", payload: expense });
    },
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};
