import React, { useState } from 'react';
import Logo from './assets/logo.png';
import WhyItMatters from './WhyItMatters';
import TypesOfScams from './TypesOfScams';
import Quiz from './Quiz';
import Home from './Home';
import SignIn from './SignIn';

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
  const [view, setView] = useState('home');
  const [showLang, setShowLang] = useState(false);

  // If SignIn is active, take over the full screen (no top bar, no footer)
  if (view === 'signin') {
    return <SignIn onBack={() => setView('home')} />;
  }

  return (
    <div className="relative w-full bg-white text-black min-h-screen flex flex-col items-center border-none p-0 m-0">
      <div className="absolute inset-0 bg-[#5c52ff] opacity-10 pointer-events-none z-0"></div>

      {/* Top bar */}
      <div className="sticky top-6 z-50 w-[900px] mx-auto flex items-center px-10 py-5 shadow-xl bg-white rounded-full mt-8">
        {/* Logo and title */}
        <div className="flex items-center mr-8">
          <div className="w-16 h-16 bg-white border border-purple-200 rounded-full flex items-center justify-center">
            <img src={Logo} alt="Logo" className="w-10 h-10" />
          </div>
          <span className="ml-3 text-[#5c52ff] font-extrabold text-xl">GuardEd</span>
        </div>

        {/* Navigation */}
        <nav className="flex gap-12 items-center text-xl font-medium text-gray-700 flex-1 justify-center">
          <button
            className={`hover:text-[#5c52ff] transition ${view === 'home' ? 'text-[#5c52ff] font-bold underline' : ''}`}
            onClick={() => setView('home')}
          >
            Home
          </button>
          <span className="text-gray-300">|</span>
          <button
            className={`hover:text-[#5c52ff] transition ${view === 'learn' ? 'text-[#5c52ff] font-bold underline' : ''}`}
            onClick={() => setView('learn')}
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
        </nav>

        {/* Sign in button */}
        <button
          className="ml-8 px-6 py-3 bg-[#5c52ff] text-white rounded-full font-semibold shadow hover:bg-[#4335d1] transition text-base"
          type="button"
          onClick={() => setView('signin')}
        >
          Sign in
        </button>

        {/* Language Globe Toggle */}
        <div className="relative ml-4">
          <button
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#5c52ff] bg-white hover:bg-purple-50 transition"
            onClick={() => setShowLang(!showLang)}
            aria-label="Toggle language"
            type="button"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="#5c52ff" strokeWidth="2" />
              <ellipse cx="14" cy="14" rx="7" ry="12" stroke="#5c52ff" strokeWidth="2" />
              <line x1="2" y1="14" x2="26" y2="14" stroke="#5c52ff" strokeWidth="2" />
              <line x1="14" y1="2" x2="14" y2="26" stroke="#5c52ff" strokeWidth="2" />
            </svg>
          </button>

          {showLang && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg py-2 px-4 flex flex-col gap-2 z-50">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  lang === 'EN' ? 'bg-purple-100 font-bold text-[#5c52ff]' : 'hover:bg-purple-50'
                }`}
                onClick={() => { setLang('EN'); setShowLang(false); }}
              >
                <span className="text-2xl">🇬🇧</span>
                <span className="text-lg font-semibold">EN</span>
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${
                  lang === 'FR' ? 'bg-purple-100 font-bold text-[#5c52ff]' : 'hover:bg-purple-50'
                }`}
                onClick={() => { setLang('FR'); setShowLang(false); }}
              >
                <span className="text-2xl">🇫🇷</span>
                <span className="text-lg font-semibold">FR</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      {view === 'quiz' ? (
        <Quiz />
      ) : (
        <Home i18n={i18n} lang={lang} />
      )}

      {/* Extra sections only for Home */}
      {view === 'home' && (
        <>
          <WhyItMatters />
          <TypesOfScams />
        </>
      )}

      {/* Faint purple bar at the bottom */}
      <div className="w-full h-24 bg-purple-100 absolute left-0 bottom-0 z-0"></div>
    </div>
  );
}

export default App;
