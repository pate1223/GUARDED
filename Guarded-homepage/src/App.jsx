import React, { useState } from 'react';
import ShieldImage from './assets/shield.png';
import Logo from './assets/logo.png';
import './index.css';
import WhyItMatters from './WhyItMatters';

// Add translations for EN and FR
const translations = {
  EN: {
    learn: "Learn",
    quizzes: "Quizzes",
    info: "Info",
    staySafe: "Stay Safe",
    defend: "Defend Yourself",
    against: "Against Online Scams",
    getStarted: "Get Started"
  },
  FR: {
    learn: "Apprendre",
    quizzes: "Quiz",
    info: "Infos",
    staySafe: "Restez en sécurité :",
    defend: "Défendez-vous",
    against: "Contre les arnaques en ligne",
    getStarted: "Commencer"
  }
};

// i18n function for translation lookup
function i18n(lang, key) {
  return translations[lang][key] || key;
}

function App() {
  const [lang, setLang] = useState('EN');

  return (
    <div className="relative w-full bg-white text-black min-h-screen flex flex-col items-center border-none p-0 m-0">
      <div className="absolute inset-0 bg-[#5c52ff] opacity-10 pointer-events-none z-0"></div>
      {/* Top bar with logo, nav, language, and login */}
      <div className="w-full flex justify-center p-4 shadow-md bg-purple-100 rounded-b-3xl relative">
        <img src={Logo} alt="Logo" className="w-10 h-10 mr-4" />
        <nav className="flex gap-4 items-center text-sm">
          <button className="px-3 py-1 rounded hover:bg-purple-200 transition">{i18n(lang, "learn")}</button>
          <button className="px-3 py-1 rounded hover:bg-purple-200 transition">{i18n(lang, "quizzes")}</button>
          <button className="px-3 py-1 rounded hover:bg-purple-200 transition">{i18n(lang, "info")}</button>
          <div className="ml-4 flex items-center">
            <button
              className={`px-2 py-1 rounded transition ${lang === 'EN' ? 'bg-purple-300 font-bold' : 'hover:bg-purple-200'}`}
              onClick={() => setLang('EN')}
              aria-pressed={lang === 'EN'}
            >
              EN
            </button>
            <span className="mx-1">/</span>
            <button
              className={`px-2 py-1 rounded transition ${lang === 'FR' ? 'bg-purple-300 font-bold' : 'hover:bg-purple-200'}`}
              onClick={() => setLang('FR')}
              aria-pressed={lang === 'FR'}
            >
              FR
            </button>
          </div>
        </nav>
        {/* Login button top right */}
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#5c52ff] text-white rounded-full font-semibold shadow hover:bg-[#4335d1] transition text-sm"
          type="button"
        >
          Login
        </button>
      </div>
      <button
        className="flex flex-col md:flex-row justify-center items-center mt-24 px-4 w-full focus:outline-none"
        type="button"
        onClick={() => alert(`${i18n(lang, "getStarted")} clicked!`)}
      >
        <img src={ShieldImage} alt="Shield graphic" className="w-96 h-auto" />
        <div className="text-center md:text-left md:ml-16">
          <span className="block text-7xl font-extrabold text-[#5c52ff] mb-2">
            GuardED
          </span>
          <span className="block text-2xl font-semibold text-[#5c52ff] mb-2">
            {i18n(lang, "staySafe")}
          </span>
          <span className="block text-2xl font-semibold text-[#5c52ff] mb-2">
            {i18n(lang, "defend")}
          </span>
          <span className="block text-2xl font-semibold text-[#5c52ff] mb-6">
            {i18n(lang, "against")}
          </span>
          <span className="mt-10 inline-block">
            <span className="px-10 py-5 bg-[#5c52ff] text-white font-semibold rounded-full hover:bg-[#4335d1] text-xl">
              {i18n(lang, "getStarted")}
            </span>
          </span>
        </div>
      </button>
      {/* Why It Matters section */}
      <WhyItMatters />
      {/* Faint purple bar at the bottom */}
      <div className="w-full h-24 bg-purple-100 absolute left-0 bottom-0 z-0"></div>
    </div>
  );
}

export default App;
