import React from "react";
import CategoryEditor from "./CategoryEditor";

export default function Settings({
  categories,
  budgets,
  activeMonth,
  monthLabel,
  changeMonth,
  setRoute,
  setBudgetForMonth,
  deleteBudgetForMonth,
  deleteCategory,
  selectedCategoryForEdit,
  setSelectedCategoryForEdit,
  updateCategory,
  addCategory,
}) {
  // current month budgets
  const monthBudgets = budgets[activeMonth] || {};

  return (
    <div className="space-y-6">

      {/* header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button
          onClick={() => setRoute("dashboard")}
          className="px-3 py-1 bg-gray-100 rounded"
        >
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* category manager */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Categories</h3>
            <button
              onClick={() => setSelectedCategoryForEdit({})}
              className="px-2 py-1 bg-indigo-50 rounded"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {categories.map((c) => (
              <div
                key={c._id}
                className="flex items-center justify-between p-2 border rounded"
              >
                {/* category info */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-6 rounded"
                    style={{ backgroundColor: c.color }}
                  />
                  <div>{c.name}</div>
                </div>

                {/* actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCategoryForEdit(c)}
                    className="px-2 py-1 bg-yellow-50 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteCategory(c._id)}
                    className="px-2 py-1 bg-red-50 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* budget manager */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Budgets — {monthLabel}</h3>

            {/* month switch */}
            <div>
              <button
                onClick={() => changeMonth(-1)}
                className="px-2 py-1 bg-gray-100 rounded"
              >
                ◀
              </button>
              <button
                onClick={() => changeMonth(1)}
                className="ml-2 px-2 py-1 bg-gray-100 rounded"
              >
                ▶
              </button>
            </div>
          </div>

          {/* budget fields */}
          <div className="space-y-3">
            {categories.map((c) => (
              <div key={c._id} className="flex items-center gap-3">
                <div
                  className="w-3 h-6 rounded"
                  style={{ backgroundColor: c.color }}
                />
                <div className="flex-1 text-sm">{c.name}</div>

                {/* input */}
                <input
                  type="number"
                  className="w-40 border px-2 py-1 rounded"
                  value={monthBudgets[c._id] || ""}
                  placeholder="0"
                  onChange={(e) =>
                    setBudgetForMonth(activeMonth, c._id, e.target.value)
                  }
                />

                {/* delete */}
                <button
                  onClick={() => deleteBudgetForMonth(activeMonth, c._id)}
                  className="px-2 py-1 bg-red-50 rounded"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* category editor modal */}
      {selectedCategoryForEdit && (
        <CategoryEditor
          category={selectedCategoryForEdit}
          onClose={() => setSelectedCategoryForEdit(null)}
          onSave={(data) => {
            if (selectedCategoryForEdit._id)
              updateCategory(selectedCategoryForEdit._id, data);
            else addCategory(data);
            setSelectedCategoryForEdit(null);
          }}
        />
      )}
    </div>
  );
}
