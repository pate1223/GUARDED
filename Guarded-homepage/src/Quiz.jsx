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
  },
  {
    id: 2,
    status: "new",
    title: "FRAUD FACTS",
    subtitle: "QUIZ MODE",
    desc: "GET SMARTER IN SECONDS",
    button: "START",
    color: "from-[#6a5cff] to-[#5c52ff]",
  },
  {
    id: 3,
    status: "completed",
    title: "STAY SHARP",
    subtitle: "CHECK YOURSELF",
    desc: "BEFORE YOU GET SCAMMED",
    button: "START",
    color: "from-gray-400 to-gray-400",
  },
  {
    id: 4,
    status: "completed",
    title: "SCAM SMART",
    subtitle: "STAY SAFE",
    desc: "ONLINE & OFFLINE",
    button: "START",
    color: "from-gray-400 to-gray-400",
  },
];

function QuizCard({ quiz }) {
  return (
    <div
      key={quiz.id}
      className="relative bg-white rounded-3xl shadow-xl w-72 min-h-[370px] flex flex-col items-center pt-8 pb-6 px-6 transition-all"
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
  );
}

export default function Quiz() {
  const newQuizzes = quizzes.filter((q) => q.status === "new");
  const completedQuizzes = quizzes.filter((q) => q.status === "completed");

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f3f2fd]">
      {/* Page header */}
      <div className="w-[90%] h-24 bg-[#5c52ff] rounded-full flex items-center justify-center mb-[-40px] z-10 mt-10 shadow-lg">
        <span className="text-white text-4xl font-bold">Quizzes</span>
      </div>

      {/* Browse Quizzes */}
      <section className="w-full mt-40 px-8">
        <h2 className="text-2xl font-bold text-[#5c52ff] mb-8 text-center">
          Browse Quizzes
        </h2>
        {newQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 justify-items-center">
            {newQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 italic">
            No new quizzes available right now.
          </p>
        )}
      </section>

      {/* Completed Quizzes */}
      <section className="w-full mt-20 px-8 mb-24">
        <h2 className="text-2xl font-bold text-gray-600 mb-8 text-center">
          Completed Quizzes
        </h2>
        {completedQuizzes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 justify-items-center">
            {completedQuizzes.map((quiz) => (
              <QuizCard key={quiz.id} quiz={quiz} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 italic">
            You haven’t completed any quizzes yet.
          </p>
        )}
      </section>
    </div>
  );
}