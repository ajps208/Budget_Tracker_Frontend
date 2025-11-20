import React from "react";
import { formatMoney } from "../utils/helpers";

export default function Dashboard({
  categories,
  totalsByCategory,
  budgets,
  activeMonth,
  monthLabel,
  changeMonth,
  setShowExpenseForm,
  setRoute,
}) {
  const monthBudgets = budgets[activeMonth] || {};

  // summary numbers
  const totalBudget = Object.values(monthBudgets).reduce((acc, v) => acc + Number(v), 0);
  const totalSpent = Object.values(totalsByCategory).reduce((acc, v) => acc + Number(v), 0);
  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="space-y-6">

      {/* month controls */}
      <header className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-gray-100 rounded">
            ◀
          </button>

          <div className="text-lg font-semibold">{monthLabel}</div>

          <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-gray-100 rounded">
            ▶
          </button>
        </div>

        {/* add expense */}
        <button
          onClick={() => {
            setShowExpenseForm(true);
            setRoute("dashboard");
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded shadow"
        >
          + Add Expense
        </button>
      </header>

      {/* summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* budget */}
        <div className="p-4 bg-white rounded shadow border-l-4 border-indigo-500">
          <div className="text-sm text-gray-600">Total Budget</div>
          <div className="text-2xl font-bold mt-1">{formatMoney(totalBudget)}</div>
        </div>

        {/* spent */}
        <div className="p-4 bg-white rounded shadow border-l-4 border-red-500">
          <div className="text-sm text-gray-600">Total Spent</div>
          <div className="text-2xl font-bold mt-1">{formatMoney(totalSpent)}</div>
        </div>

        {/* remaining */}
        <div className="p-4 bg-white rounded shadow border-l-4 border-green-500">
          <div className="text-sm text-gray-600">Remaining Balance</div>
          <div
            className={`text-2xl font-bold mt-1 ${
              totalRemaining < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {formatMoney(totalRemaining)}
          </div>
        </div>
      </div>

      {/* category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((c) => {
          const catId = c._id;

          // per-category values
          const spent = totalsByCategory[catId] || 0;
          const limit = monthBudgets[catId] || 0;

          const pct =
            limit > 0
              ? Math.min(100, Math.round((spent / limit) * 100))
              : spent > 0
              ? 100
              : 0;

          const over = spent > limit && limit > 0;

          return (
            <div key={catId} className="p-4 bg-white rounded shadow">
              <div className="flex items-start justify-between">

                {/* category info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-6 rounded"
                    style={{ backgroundColor: c.color }}
                  />
                  <div>
                    <div className="font-semibold">{c.name}</div>
                    <div className="text-sm text-gray-500">
                      {formatMoney(spent)} spent
                    </div>
                  </div>
                </div>

                {/* limit info */}
                <div className="text-right">
                  <div className="text-sm text-gray-600">Limit</div>
                  <div className="font-medium">
                    {limit ? formatMoney(limit) : "—"}
                  </div>
                </div>
              </div>

              {/* progress bar */}
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded overflow-hidden">
                  <div
                    className={`h-full ${over ? "bg-red-500" : "bg-indigo-500"}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span>{pct}%</span>
                  <span className={over ? "text-red-600 font-semibold" : ""}>
                    {limit ? formatMoney(limit - spent) : formatMoney(-spent)}
                  </span>
                </div>

                {/* over-budget badge */}
                {over && (
                  <div className="mt-2 inline-block text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                    OVER BUDGET
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
