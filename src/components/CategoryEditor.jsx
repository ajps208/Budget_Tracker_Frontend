import React, { useState } from "react";

export default function CategoryEditor({ category, onClose, onSave }) {
  // form states
  const [name, setName] = useState(category?.name || "");
  const [color, setColor] = useState(category?.color || "#1976d2");

  // preset colors
  const preset = ["#e57373", "#64b5f6", "#81c784", "#fff176", "#f06292", "#90a4ae"];

  return (
    // overlay
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40">
      <div className="bg-white p-4 rounded w-full max-w-sm space-y-3">
        
        {/* title */}
        <h3 className="font-semibold text-lg">
          {category?._id ? "Edit Category" : "Add Category"}
        </h3>

        {/* name input */}
        <div>
          <label className="text-sm">Name</label>
          <input
            className="w-full border px-2 py-1 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* color selector */}
        <div>
          <label className="text-sm">Color</label>
          <div className="flex gap-2 mt-2">
            {preset.map((p) => (
              <button
                key={p}
                onClick={() => setColor(p)}
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: p }}
              />
            ))}
          </div>
        </div>

        {/* action buttons */}
        <div className="flex justify-end gap-2 pt-3">
          <button className="px-3 py-1 bg-gray-200 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-indigo-600 text-white rounded"
            onClick={() => onSave({ name, color })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
