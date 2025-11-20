import React, { useEffect, useState, useMemo } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import Reports from "./components/Reports";
import ExpenseForm from "./components/ExpenseForm";
import Toast from "./components/Toast";

import API from "./services/api";
import { monthKeyFromDate } from "./utils/helpers";

export default function App() {
  const navigate = useNavigate();

  // states
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [activeMonth, setActiveMonth] = useState(monthKeyFromDate(new Date()));
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] = useState(null);
  const [route, setRoute] = useState("dashboard");
  const [toast, setToast] = useState({ message: "", tone: "info" });


  // load data when month changes
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetchCategories();
    fetchExpenses(activeMonth);
    fetchBudgets(activeMonth);
  }, [activeMonth, token]);
  // fetch categories
  async function fetchCategories() {
    const res = await API.get("/categories");
    setCategories(res.data);
  }

  // fetch expenses
  async function fetchExpenses(month) {
    const res = await API.get(`/expenses?month=${month}`);
    setExpenses(res.data);
  }

  // fetch budgets
  async function fetchBudgets(month) {
    const res = await API.get(`/budgets?month=${month}`);
    const map = {};
    res.data.forEach((b) => (map[b.category._id] = b.limit));
    setBudgets({ [month]: map });
  }

  // save expense
  async function handleAddExpense(exp) {
    await API.post("/expenses", exp);
    fetchExpenses(activeMonth);
    fetchBudgets(activeMonth);
    showToast("Expense saved", "success");
  }

  // toast helper
  function showToast(message, tone) {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: "", tone: "info" }), 2000);
  }

  // compute totals per category
  const totalsByCategory = useMemo(() => {
    const m = {};
    expenses.forEach((e) => {
      const id = e.category._id;
      m[id] = (m[id] || 0) + Number(e.amount);
    });
    return m;
  }, [expenses]);

  // logout
  function logout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // month label
  const monthLabel = useMemo(() => {
    const [y, m] = activeMonth.split("-");
    return new Date(y, m - 1, 1).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [activeMonth]);

  return (
    <>
      <Routes>
        {/* auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* main protected route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100 p-3 sm:p-6 pt-16 sm:pt-6">
                <div className="max-w-6xl mx-auto">
                  {/* desktop navbar */}
                  <div className="hidden md:flex bg-white p-4 rounded shadow mb-6 justify-between items-center">
                    <h1 className="text-2xl font-bold">Expense Tracker</h1>

                    <div className="flex gap-3">
                      {/* top nav buttons */}
                      <button
                        className={`px-4 py-2 rounded ${
                          route === "dashboard"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => setRoute("dashboard")}
                      >
                        Dashboard
                      </button>

                      <button
                        className={`px-4 py-2 rounded ${
                          route === "reports"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => setRoute("reports")}
                      >
                        Reports
                      </button>

                      <button
                        className={`px-4 py-2 rounded ${
                          route === "settings"
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200"
                        }`}
                        onClick={() => setRoute("settings")}
                      >
                        Settings
                      </button>

                      <button
                        className="px-4 py-2 bg-red-500 text-white rounded"
                        onClick={logout}
                      >
                        Logout
                      </button>
                    </div>
                  </div>

                  {/* mobile top bar */}
                  <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow p-3 flex justify-between items-center z-50">
                    <h1 className="text-lg font-semibold">Expense Tracker</h1>
                  </div>

                  {/* route content */}
                  {route === "dashboard" && (
                    <Dashboard
                      categories={categories}
                      totalsByCategory={totalsByCategory}
                      budgets={budgets}
                      activeMonth={activeMonth}
                      monthLabel={monthLabel}
                      changeMonth={(d) => {
                        const [y, m] = activeMonth.split("-").map(Number);
                        const dt = new Date(y, m - 1 + d, 1);
                        setActiveMonth(monthKeyFromDate(dt));
                      }}
                      setShowExpenseForm={setShowExpenseForm}
                      setRoute={setRoute}
                    />
                  )}

                  {route === "reports" && (
                    <Reports
                      categories={categories}
                      activeMonth={activeMonth}
                      monthLabel={monthLabel}
                      setRoute={setRoute}
                      changeMonth={(newDate) => {
                        setActiveMonth(monthKeyFromDate(newDate));
                      }}
                    />
                  )}

                  {route === "settings" && (
                    <Settings
                      categories={categories}
                      budgets={budgets}
                      activeMonth={activeMonth}
                      monthLabel={monthLabel}
                      changeMonth={(d) => {
                        const [y, m] = activeMonth.split("-").map(Number);
                        const dt = new Date(y, m - 1 + d, 1);
                        setActiveMonth(monthKeyFromDate(dt));
                      }}
                      setRoute={setRoute}
                      setBudgetForMonth={async (mKey, cat, amt) => {
                        await API.post("/budgets", {
                          category: cat,
                          month: mKey,
                          limit: amt,
                        });
                        fetchBudgets(mKey);
                      }}
                      deleteBudgetForMonth={async (mKey, catId) => {
                        const res = await API.get(`/budgets?month=${mKey}`);
                        const item = res.data.find(
                          (b) => b.category._id === catId
                        );
                        if (item) {
                          await API.delete(`/budgets/${item._id}`);
                          fetchBudgets(mKey);
                        }
                      }}
                      deleteCategory={async (id) => {
                        await API.delete(`/categories/${id}`);
                        fetchCategories();
                      }}
                      selectedCategoryForEdit={selectedCategoryForEdit}
                      setSelectedCategoryForEdit={setSelectedCategoryForEdit}
                      updateCategory={async (id, data) => {
                        await API.put(`/categories/${id}`, data);
                        fetchCategories();
                      }}
                      addCategory={async (data) => {
                        await API.post("/categories", data);
                        fetchCategories();
                      }}
                    />
                  )}

                  {/* expense form modal */}
                  {showExpenseForm && (
                    <ExpenseForm
                      categories={categories}
                      onClose={() => setShowExpenseForm(false)}
                      onSave={(payload) => {
                        handleAddExpense(payload);
                        setShowExpenseForm(false);
                      }}
                    />
                  )}

                  {/* toast */}
                  <Toast
                    message={toast.message}
                    tone={toast.tone}
                    onClose={() => setToast({ message: "", tone: "info" })}
                  />
                </div>

                {/* mobile bottom nav */}
                <div className="md:hidden fixed bottom-0 left-0 w-full bg-white shadow-lg border-t flex justify-around py-2 z-50">
                  <button
                    className={`flex flex-col items-center text-xs ${
                      route === "dashboard"
                        ? "text-indigo-600"
                        : "text-gray-500"
                    }`}
                    onClick={() => setRoute("dashboard")}
                  >
                    📊
                    <span>Dashboard</span>
                  </button>

                  <button
                    className={`flex flex-col items-center text-xs ${
                      route === "reports" ? "text-indigo-600" : "text-gray-500"
                    }`}
                    onClick={() => setRoute("reports")}
                  >
                    📈
                    <span>Reports</span>
                  </button>

                  <button
                    className={`flex flex-col items-center text-xs ${
                      route === "settings" ? "text-indigo-600" : "text-gray-500"
                    }`}
                    onClick={() => setRoute("settings")}
                  >
                    ⚙️
                    <span>Settings</span>
                  </button>

                  <button
                    className="flex flex-col items-center text-xs text-red-600"
                    onClick={logout}
                  >
                    🚪
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
