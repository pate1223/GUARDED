import React from "react";
import { ChevronLeft } from "lucide-react";
import { useLanguage } from "./contexts/LanguageContext";

export default function CallLibrary({ onBack }) {
  const { t } = useLanguage();

  const topics = [
    {
      title: t("commonPhoneScripts"),
      desc: t("phoneScriptsDesc"),
      icon: "📞",
    },
    {
      title: t("threateningLanguage"),
      desc: t("threateningLanguageDesc"),
      icon: "⚠️",
    },
    {
      title: t("protectingSeniors"),
      desc: t("protectingSeniorsDesc"),
      icon: "👴",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 flex flex-col items-center py-12 px-6 transition-colors duration-300">
      <div className="w-full max-w-6xl flex items-center justify-between mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:underline transition-colors"
        >
          <ChevronLeft size={20} /> {t("backToLearn")}
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-purple-600 dark:text-purple-400 text-center flex-1 transition-colors">
          {t("callScamLibrary")}
        </h1>
        <div className="w-20" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-gray-800 border-2 border-purple-500 dark:border-purple-600 rounded-2xl p-6 shadow hover:shadow-lg dark:shadow-purple-500/20 transition-all flex flex-col items-center text-center"
          >
            <div className="text-6xl mb-4">{topic.icon}</div>
            <h4 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100 transition-colors">{topic.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">{topic.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}