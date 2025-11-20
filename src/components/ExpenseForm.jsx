import React, { useState } from "react";

export default function ExpenseForm({ categories, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10);

  // form states
  const [category, setCategory] = useState(categories[0]?._id || "");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(today);

  return (
    // overlay
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white p-4 rounded w-full max-w-md space-y-3">

        {/* title */}
        <h3 className="font-semibold text-lg mb-2">Add Expense</h3>

        {/* category */}
        <div>
          <label className="text-sm">Category</label>
          <select
            className="w-full border px-2 py-1 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* amount */}
        <div>
          <label className="text-sm">Amount</label>
          <input
            type="number"
            className="w-full border px-2 py-1 rounded"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {/* date */}
        <div>
          <label className="text-sm">Date</label>
          <input
            type="date"
            className="w-full border px-2 py-1 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        {/* actions */}
        <div className="flex justify-end gap-2 pt-3">
          <button className="px-3 py-1 rounded bg-gray-200" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1 rounded bg-indigo-600 text-white"
            onClick={() => onSave({ category, amount, date })}
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}
