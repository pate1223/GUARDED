import React, { useState } from 'react';

export default function FeedbackList() {
  const [query, setQuery] = useState('');
  const feedback = [
    { id: 1, name: 'Mirana Marci', quiz: 1, rating: 5, comment: "I've used other kits, but this one is the best. The attention to detail and usability are truly amazing for all designers. I highly recommend it for any type of project.", createdAt: '2025-09-25' },
    { id: 2, name: 'Dazzle Healer', quiz: 5, rating: 5, comment: "This UI Kit saved me hours of work. It’s intuitive, high-quality, and totally worth the price for all design needs.", createdAt: '2025-09-25' },
    { id: 3, name: 'Mirana Marci', quiz: 1, rating: 3, comment: "Loading speed is good, but certain pages feel a bit heavy. Optimizing.", createdAt: '2025-09-24' },
  ];

  const rows = feedback.filter(f =>
    `${f.name} ${f.comment}`.toLowerCase().includes(query.toLowerCase())
  );

  const StarRow = ({ n }) => (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill={i < n ? '#f6b73c' : 'none'} stroke={i < n ? '#f6b73c' : '#e6e3f6'} strokeWidth="1.5">
          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.172L12 18.896 4.664 23.17l1.402-8.172L.132 9.21l8.2-1.192z"/>
        </svg>
      ))}
    </div>
  );

  return (
    <div className="bg-white rounded-xl p-6 shadow min-h-[540px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 w-full max-w-[640px]">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full px-4 py-2 rounded-lg border border-[#e9e6ff] focus:outline-none focus:ring-1 focus:ring-[#5c52ff]"
          />
          <button className="p-2 border border-[#e9e6ff] rounded-lg text-[#5c52ff]">
            🔎
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg border border-[#e9e6ff] text-[#5c52ff]">Filter</button>
          <button className="px-4 py-2 bg-[#5c52ff] text-white rounded-lg">Export</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="py-3 w-12">#</th>
              <th className="py-3">NAME</th>
              <th className="py-3 w-24">QUIZ</th>
              <th className="py-3 w-40">RATING</th>
              <th className="py-3">COMMENT</th>
              <th className="py-3 w-32">CREATED ON</th>
              <th className="py-3 w-36">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id} className="align-top border-b last:border-b-0">
                <td className="py-6 text-sm text-gray-600">{idx + 1}</td>
                <td className="py-6 text-sm text-[#2b2360]">{r.name}</td>
                <td className="py-6 text-sm text-gray-600">{r.quiz}</td>
                <td className="py-6">
                  <StarRow n={r.rating} />
                </td>
                <td className="py-6 text-sm text-gray-700">{r.comment}</td>
                <td className="py-6 text-sm text-gray-600">{r.createdAt}</td>
                <td className="py-6">
                  <button className="px-4 py-2 rounded-lg border-2 border-[#5c52ff] text-[#5c52ff] hover:bg-[#f0ecff]">Reply</button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-400">No feedback found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}