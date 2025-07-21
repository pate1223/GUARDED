import React from "react";

const quizzes = [
  {
    id: 1,
    status: "new",
    title: "SCAM AWARE",
    subtitle: "QUIZ TIME",
    desc: "LEARN TO SPOT FRAUD",
    button: "START",
    color: "from-[#6a5cff] to-[#5c52ff]",
    icon: "🟦", // Replace with your SVG or image
  },
  {
    id: 2,
    status: "new",
    title: "FRAUD FACTS",
    subtitle: "QUIZ MODE",
    desc: "GET SMARTER IN SECONDS",
    button: "START",
    color: "from-[#6a5cff] to-[#5c52ff]",
    icon: "🟦",
  },
  {
    id: 3,
    status: "completed",
    title: "STAY SHARP",
    subtitle: "CHECK YOURSELF",
    desc: "BEFORE YOU GET SCAMMED",
    button: "START",
    color: "from-gray-400 to-gray-400",
    icon: "⬜",
  },
  {
    id: 4,
    status: "completed",
    title: "SCAM SMART",
    subtitle: "STAY SAFE",
    desc: "ONLINE & OFFLINE",
    button: "START",
    color: "from-gray-400 to-gray-400",
    icon: "⬜",
  },
];

export default function Quiz() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f3f2fd] pb-24">
      {/* Big rounded purple bar */}
      <div className="w-[90%] h-24 bg-[#5c52ff] rounded-full flex items-center justify-center mb-[-40px] z-10 mt-10">
        <span className="text-white text-4xl font-bold">Quizzes</span>
      </div>
      {/* Quiz cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 w-full mt-40 px-8 justify-items-center">
        {quizzes.map((quiz) => (
          <div
            key={quiz.id}
            className={`relative bg-white rounded-3xl shadow-xl w-72 min-h-[370px] flex flex-col items-center pt-8 pb-6 px-6 transition-all`}
          >
            {/* Status badge */}
            <div
              className={`absolute left-6 top-6 px-4 py-1 rounded-tl-2xl rounded-br-2xl text-xs font-bold ${
                quiz.status === "new"
                  ? "bg-[#5c52ff] text-white"
                  : "bg-gray-400 text-white"
              }`}
            >
              {quiz.status === "new" ? "✨ New" : "✔ Completed"}
            </div>
            {/* Icon */}
            <div
              className={`w-32 h-32 rounded-2xl flex items-center justify-center mb-6 mt-6 shadow-lg ${
                quiz.status === "new"
                  ? "bg-gradient-to-br from-[#6a5cff] to-[#5c52ff]"
                  : "bg-gradient-to-br from-gray-400 to-gray-400"
              }`}
            >
              {/* Replace with SVG */}
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill={quiz.status === "new" ? "#fff" : "#e5e5e5"}
                  stroke={quiz.status === "new" ? "#5c52ff" : "#aaa"}
                  strokeWidth="4"
                />
                <text
                  x="32"
                  y="40"
                  textAnchor="middle"
                  fontSize="32"
                  fill={quiz.status === "new" ? "#5c52ff" : "#aaa"}
                >
                  ★
                </text>
              </svg>
            </div>
            {/* Titles */}
            <div className="text-center mb-2">
              <div
                className={`text-base font-bold ${
                  quiz.status === "new" ? "text-[#5c52ff]" : "text-gray-400"
                }`}
              >
                {quiz.title}
              </div>
              <div
                className={`text-2xl font-extrabold ${
                  quiz.status === "new" ? "text-[#5c52ff]" : "text-gray-400"
                }`}
              >
                {quiz.subtitle}
              </div>
              <div className="text-xs text-gray-400 mt-1">{quiz.desc}</div>
            </div>
            {/* Start button */}
            <button
              className={`mt-6 w-full py-3 rounded-xl font-bold text-lg shadow ${
                quiz.status === "new"
                  ? "bg-gradient-to-br from-[#6a5cff] to-[#5c52ff] text-white hover:opacity-90"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={quiz.status !== "new"}
            >
              {quiz.button}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}