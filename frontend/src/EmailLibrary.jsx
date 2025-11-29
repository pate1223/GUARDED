import React from "react";
import { ChevronLeft } from "lucide-react";

export default function EmailLibrary({ onBack }) {
  const topics = [
    {
      title: "Recognizing Phishing Emails",
      desc: "Learn to identify common phishing tactics such as fake links, urgent tone, and spoofed senders.",
      icon: "📨",
    },
    {
      title: "Avoiding Malicious Attachments",
      desc: "Understand the risks of attachments and how scammers use them to install malware.",
      icon: "📎",
    },
    {
      title: "Spotting Fake Invoices",
      desc: "Explore how fake billing scams target businesses and individuals via email.",
      icon: "🧾",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-6">
      <div className="w-full max-w-6xl flex items-center justify-between mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[#5c52ff] font-semibold hover:underline"
        >
          <ChevronLeft size={20} /> Back to Learn
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-[#5c52ff] text-center flex-1">
          Email Scam Learning Library
        </h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="bg-white border-2 border-[#5c52ff] rounded-2xl p-6 shadow hover:shadow-lg transition flex flex-col items-center text-center"
          >
            <div className="text-6xl mb-4">{topic.icon}</div>
            <h4 className="text-lg font-bold mb-2">{topic.title}</h4>
            <p className="text-sm text-gray-600">{topic.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
