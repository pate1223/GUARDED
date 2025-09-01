import React from "react";

export default function Learn({ onBack }) {
  return (
    <div className="w-screen min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center px-8 py-4 bg-[#f5f3ff] shadow">
        <h1 className="text-2xl font-bold text-[#5c52ff]">Learning Hub</h1>
        <button
          onClick={onBack}
          className="px-6 py-2 border border-[#5c52ff] rounded-full text-[#5c52ff] hover:bg-[#e6e3ff] font-semibold"
        >
          Back
        </button>
      </div>

      {/* Hero / Intro */}
      <div className="flex flex-col items-center text-center px-6 py-16 bg-gradient-to-r from-[#f5f3ff] to-white">
        <h2 className="text-4xl font-bold text-[#5c52ff] mb-4">
          Learn & Defend Against Scams
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          Explore interactive lessons, reading modules, and quizzes to strengthen your defenses
          against online, phone, and email scams.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-[#5c52ff] text-white rounded-full font-semibold hover:bg-[#4335d1] transition">
            Start Learning
          </button>
          <button className="px-6 py-3 border border-[#5c52ff] text-[#5c52ff] rounded-full font-semibold hover:bg-[#e6e3ff] transition">
            Take a Quiz
          </button>
        </div>
      </div>

      {/* Learning Modules */}
      <div className="px-8 py-16 max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Learning Modules
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "Scam Basics",
              desc: "Understand the fundamentals of scams and how to recognize red flags.",
            },
            {
              title: "Communication Scams",
              desc: "Learn how scammers use phone calls, emails, and texts to trick people.",
            },
            {
              title: "Advanced Scams",
              desc: "Dive deeper into investment, romance, and AI-powered scams.",
            },
          ].map((module, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition cursor-pointer"
            >
              <div className="w-16 h-16 bg-[#f5f3ff] flex items-center justify-center rounded-full mb-4">
                <span className="text-2xl">📘</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-[#5c52ff]">
                {module.title}
              </h4>
              <p className="text-gray-600 mb-6">{module.desc}</p>
              <button className="px-5 py-2 bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1] transition">
                Start Module
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quizzes */}
      <div className="px-8 py-16 bg-white border-t border-gray-200">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Test Your Knowledge
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {[
            { title: "Email Safety Quiz", desc: "Can you spot the phishing attempt?" },
            { title: "Phone Scam Quiz", desc: "Learn to handle suspicious calls safely." },
            { title: "Phishing Challenge", desc: "Test your ability to detect fake websites." },
          ].map((quiz, idx) => (
            <div
              key={idx}
              className="bg-[#f5f3ff] rounded-2xl shadow p-6 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <h4 className="text-xl font-semibold mb-3 text-[#5c52ff]">
                {quiz.title}
              </h4>
              <p className="text-gray-600 mb-6">{quiz.desc}</p>
              <button className="px-5 py-2 bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1] transition">
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="px-8 py-16 max-w-5xl mx-auto">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Additional Resources
        </h3>
        <ul className="space-y-4 text-lg text-[#5c52ff] text-center">
          <li>
            <a href="https://www.antifraudcentre-centreantifraude.ca/" target="_blank" rel="noreferrer">
              Canadian Anti-Fraud Centre
            </a>
          </li>
          <li>
            <a href="https://www.consumer.ftc.gov/features/scam-alerts" target="_blank" rel="noreferrer">
              FTC Scam Alerts
            </a>
          </li>
          <li>
            <a href="https://www.getcybersafe.gc.ca/en" target="_blank" rel="noreferrer">
              Government of Canada: Get Cyber Safe
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
