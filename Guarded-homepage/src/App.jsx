import React, { useState } from 'react';
import ShieldImage from './assets/shield.png';
import Logo from './assets/logo.png';
import './index.css';
import WhyItMatters from './WhyItMatters';
import Quiz from './Quiz'; // Import the Quiz component

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
  const [view, setView] = useState('home'); // Add view state
  const [showLang, setShowLang] = useState(false);

  return (
    <div className="relative w-full bg-white text-black min-h-screen flex flex-col items-center border-none p-0 m-0">
      <div className="absolute inset-0 bg-[#5c52ff] opacity-10 pointer-events-none z-0"></div>
      {/* Top bar with logo, nav, language, and login */}
      <div className="sticky top-6 z-50 w-[900px] mx-auto flex items-center px-10 py-5 shadow-xl bg-white rounded-full mt-8">
        {/* Left icon/logo in circle */}
        <div className="flex items-center mr-8">
          <div className="w-16 h-16 bg-white border border-purple-200 rounded-full flex items-center justify-center">
            <img src={Logo} alt="Logo" className="w-10 h-10" />
          </div>
        </div>
        {/* Navigation */}
        <nav className="flex gap-12 items-center text-xl font-medium text-gray-700 flex-1 justify-center">
          <button
            className={`hover:text-[#5c52ff] transition ${view === 'home' ? 'text-[#5c52ff] font-bold underline' : ''}`}
            onClick={() => setView('home')}
          >
            {i18n(lang, "learn")}
          </button>
          <span className="text-gray-300">|</span>
          <button
            className={`hover:text-[#5c52ff] transition ${view === 'quiz' ? 'text-[#5c52ff] font-bold underline' : ''}`}
            onClick={() => setView('quiz')}
          >
            {i18n(lang, "quizzes")}
          </button>
          <span className="text-gray-300">|</span>
          <button className="hover:text-[#5c52ff] transition flex items-center">
            <span className="sr-only">{i18n(lang, "info")}</span>
            <span className="w-10 h-10 bg-[#5c52ff] rounded-full flex items-center justify-center text-white font-bold text-2xl">
              i
            </span>
          </button>
        </nav>
        {/* Language Globe Toggle */}
        <div className="relative ml-8">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#5c52ff] bg-white hover:bg-purple-50 transition"
            onClick={() => setShowLang(!showLang)}
            aria-label="Toggle language"
            type="button"
          >
            {/* Globe SVG */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="#5c52ff" strokeWidth="2" />
              <ellipse cx="14" cy="14" rx="7" ry="12" stroke="#5c52ff" strokeWidth="2" />
              <line x1="2" y1="14" x2="26" y2="14" stroke="#5c52ff" strokeWidth="2" />
              <line x1="14" y1="2" x2="14" y2="26" stroke="#5c52ff" strokeWidth="2" />
            </svg>
          </button>
          {/* Language options dropdown */}
          {showLang && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg py-2 px-4 flex flex-col gap-2 z-50">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  lang === 'EN' ? 'bg-purple-100 font-bold text-[#5c52ff]' : 'hover:bg-purple-50'
                }`}
                onClick={() => { setLang('EN'); setShowLang(false); }}
                aria-pressed={lang === 'EN'}
              >
                <span className="text-2xl">🇬🇧</span>
                <span className="text-lg font-semibold">EN</span>
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  lang === 'FR' ? 'bg-purple-100 font-bold text-[#5c52ff]' : 'hover:bg-purple-50'
                }`}
                onClick={() => { setLang('FR'); setShowLang(false); }}
                aria-pressed={lang === 'FR'}
              >
                <span className="text-2xl">🇫🇷</span>
                <span className="text-lg font-semibold">FR</span>
              </button>
            </div>
          )}
        </div>
        {/* Login button */}
        <button
          className="ml-8 px-6 py-3 bg-[#5c52ff] text-white rounded-full font-semibold shadow hover:bg-[#4335d1] transition text-base"
          type="button"
        >
          Login
        </button>
      </div>
      {/* Main content: show Quiz or homepage */}
      {view === 'quiz' ? (
        <Quiz />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}

export default App;
