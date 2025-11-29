import React, { useState, useEffect } from "react";
import { apiService } from "./services/api";

export default function FeedbackList() {
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const res = await apiService.getAllFeedback();
        if (res.success) {
          setFeedback(res.data);
        } else {
          setError(res.error || "Failed to load feedback");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const rows = feedback.filter((f) =>
    `${f.user_name || f.name || ""} ${f.question2 || ""} ${f.question3 || ""} ${f.question5 || ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  const StarRow = ({ n }) => (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < n ? "#f6b73c" : "none"}
          stroke={i < n ? "#f6b73c" : "#e6e3f6"}
          strokeWidth="1.5"
        >
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.172L12 18.896 4.664 23.17l1.402-8.172L.132 9.21l8.2-1.192z" />
        </svg>
      ))}
    </div>
  );

  if (loading)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow text-center">
        <div className="text-gray-500 dark:text-gray-400">Loading feedback...</div>
      </div>
    );

  if (error)
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow text-center">
        <div className="text-red-500 dark:text-red-400">⚠️ {error}</div>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow min-h-[540px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full max-w-[640px]">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search feedback..."
            className="w-full px-4 py-2 rounded-lg border border-[#e9e6ff] dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#5c52ff] dark:placeholder-gray-400"
          />
          <button className="p-2 border border-[#e9e6ff] dark:border-gray-600 rounded-lg text-[#5c52ff] dark:text-[#7c72ff]">🔎</button>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-[#e9e6ff] dark:border-gray-600 text-[#5c52ff] dark:text-[#7c72ff]">
            Filter
          </button>
          <button className="px-4 py-2 bg-[#5c52ff] dark:bg-[#7c72ff] text-white rounded-lg">
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
              <th className="py-3 px-3 w-10">#</th>
              <th className="py-3 px-3 w-36">USER</th>
              <th className="py-3 px-3 w-32 text-center">RATING</th>
              <th className="py-3 px-3 min-w-[300px] max-w-[400px]">LIKES</th>
              <th className="py-3 px-3 min-w-[300px] max-w-[400px]">IMPROVEMENTS</th>
              <th className="py-3 px-3 min-w-[300px] max-w-[400px]">OTHER COMMENTS</th>
              <th className="py-3 px-3 w-32">CREATED ON</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr
                key={r.id}
                className="border-b dark:border-gray-700 last:border-b-0 hover:bg-[#faf8ff] dark:hover:bg-gray-700 transition"
              >
                <td className="py-4 px-3 text-sm text-gray-600 dark:text-gray-300">{idx + 1}</td>
                <td className="py-4 px-3 text-sm text-[#2b2360] dark:text-[#a5b4fc] break-words">
                  {r.user_name || r.name || "Anonymous"}
                </td>
                <td className="py-4 px-3 text-center">
                  <StarRow n={r.rating || r.rating_value || 0} />
                </td>
                <td className="py-4 px-3 text-sm text-gray-700 dark:text-gray-200 break-words whitespace-pre-line">
                  {r.question2 || "—"}
                </td>
                <td className="py-4 px-3 text-sm text-gray-700 dark:text-gray-200 break-words whitespace-pre-line">
                  {r.question3 || "—"}
                </td>
                <td className="py-4 px-3 text-sm text-gray-700 dark:text-gray-200 break-words whitespace-pre-line">
                  {r.question5 || "—"}
                </td>
                <td className="py-4 px-3 text-sm text-gray-600 dark:text-gray-300">
                  {new Date(r.created_at || r.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400 dark:text-gray-500">
                  No feedback found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}