import React, { useState, useEffect } from "react";
import API from "../services/api";

export default function Reports() {
  // current month (YYYY-MM)
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  // report rows
  const [report, setReport] = useState([]);

  // load on month change
  useEffect(() => {
    load();
  }, [month]);

  // fetch report
  const load = async () => {
    const res = await API.get("/reports/monthly", { params: { month } });
    setReport(res.data.report);
  };

  return (
    <div className="p-4">
      {/* title */}
      <h2 className="text-2xl font-semibold text-gray-800">Monthly Report</h2>

      {/* month selector */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-600 mb-1">Month</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* table */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-gray-700 font-medium">Category</th>
              <th className="px-4 py-3 text-left text-gray-700 font-medium">Spent</th>
              <th className="px-4 py-3 text-left text-gray-700 font-medium">Budget</th>
              <th className="px-4 py-3 text-left text-gray-700 font-medium">Remaining</th>
            </tr>
          </thead>

          <tbody>
            {report.map((r) => (
              <tr
                key={r.category._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{r.category.name}</td>
                <td className="px-4 py-3">{r.spent}</td>
                <td className="px-4 py-3">{r.limit}</td>
                <td
                  className={`px-4 py-3 font-semibold ${
                    r.remaining < 0 ? "text-red-600" : "text-gray-800"
                  }`}
                >
                  {r.remaining}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
