import React from "react";

// Define view constants
const VIEWS = {
  ONLINE: "online-scams",
  CALL: "call-scams",
  EMAIL: "email-scams",
};

export default function Learn({ onBack, setView }) {
  const modules = [
    {
      title: "Getting Started",
      desc: "Understand what scams are, why they work, and common red flags.",
    },
    {
      title: "Spotting Scams",
      desc: "Learn how to detect email, phone, and online scams in real life.",
    },
    {
      title: "Defending Yourself",
      desc: "Practical strategies to protect your money, data, and identity.",
    },
  ];

  const topics = [
    {
      icon: "💻",
      title: "Online Scams",
      desc: "Fake websites, phishing links, and fraudulent online offers.",
      view: VIEWS.ONLINE,
    },
    {
      icon: "📞",
      title: "Call Scams",
      desc: "Suspicious phone calls, fake tech support, and IRS/CRA scams.",
      view: VIEWS.CALL,
    },
    {
      icon: "📧",
      title: "Email Scams",
      desc: "Phishing emails, fake attachments, and identity theft.",
      view: VIEWS.EMAIL,
    },
  ];

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

      {/* Hero */}
      <div className="flex flex-col items-center text-center px-6 py-16 bg-gradient-to-r from-[#f5f3ff] to-white">
        <h2 className="text-4xl font-bold text-[#5c52ff] mb-4">
          Choose Your Learning Path
        </h2>
        <p className="text-lg text-gray-700 max-w-2xl mb-8">
          GuardEd gives you two ways to learn: follow a guided journey through structured modules, or freely browse scam topics at your own pace.
        </p>
      </div>

      {/* Directed Learning Path */}
      <div className="px-8 py-16 bg-white border-t border-gray-200">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Directed Learning
        </h3>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Work through step-by-step modules, complete quizzes, and track your progress to build scam awareness skills from the ground up.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {modules.map((module, idx) => (
            <div
              key={idx}
              className="bg-[#f5f3ff] rounded-2xl shadow p-8 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-white flex items-center justify-center rounded-full mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-[#5c52ff]">{module.title}</h4>
              <p className="text-gray-600 mb-6">{module.desc}</p>
              <button
                onClick={() => setView("module-" + idx)}
                className="px-5 py-2 bg-[#5c52ff] text-white rounded-full hover:bg-[#4335d1] transition"
              >
                Start Module
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Self-Learning Path */}
      <div className="px-8 py-16 bg-gray-50">
        <h3 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Self-Learning
        </h3>
        <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
          Prefer to explore on your own? Browse topics and read articles on specific scams whenever you like.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {topics.map((topic, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-xl transition"
            >
              <div className="w-16 h-16 bg-[#f5f3ff] flex items-center justify-center rounded-full mb-4">
                <span className="text-2xl">{topic.icon}</span>
              </div>
              <h4 className="text-xl font-semibold mb-3 text-[#5c52ff]">{topic.title}</h4>
              <p className="text-gray-600 mb-6">{topic.desc}</p>
              <button
                onClick={() => setView(topic.view)}
                className="px-5 py-2 border border-[#5c52ff] text-[#5c52ff] rounded-full hover:bg-[#e6e3ff] transition"
              >
                Read More
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Resources */}
      <div className="px-8 py-16 bg-white border-t border-gray-200">
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
