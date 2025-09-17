import React, { useState } from 'react';
import Logo from './assets/logo.png';
import WhyItMatters from './WhyItMatters';
import TypesOfScams from './TypesOfScams';
import Quiz from './Quiz';
import Home from './Home';
import SignIn from './SignIn';
import Learn from './Learn';
import OnlineScams from './OnlineScams';
import CallScams from './CallScams';
import EmailScams from './EmailScams';
import ThemeToggle from './ThemeToggle';

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

  if (view === 'signin') {
    return <SignIn onBack={() => setView('home')} />;
  }

  return (
    <div className="relative w-full bg-white text-black min-h-screen flex flex-col items-center border-none p-0 m-0">
      <div className="absolute inset-0 bg-[#5c52ff] opacity-10 pointer-events-none z-0"></div>

      {/* Top bar */}
      <div className="top-0 z-50 w-[900px] mx-auto flex items-center px-10 py-5 shadow-xl bg-white rounded-full mt-8">
        <div className="flex items-center mr-8">
          <div className="w-16 h-16 bg-white border border-purple-200 rounded-full flex items-center justify-center">
            <img src={Logo} alt="Logo" className="w-10 h-10" />
          </div>
          <span className="ml-3 text-[#5c52ff] font-extrabold text-xl">GuardEd</span>
        </div>

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

        <button
          className="ml-8 px-6 py-3 bg-[#5c52ff] text-white rounded-full font-semibold shadow hover:bg-[#4335d1] transition text-base"
          type="button"
          onClick={() => setView('signin')}
        >
          Sign in
        </button>
      </div>

      {/* Main content */}
      {view === 'quiz' && <Quiz />}
      {view === 'learn' && <Learn setView={setView} onBack={() => setView('home')} />}
      {view === 'home' && <Home i18n={i18n} lang={lang} />}

      {/* Scams Pages */}
      {view === 'online-scams' && <OnlineScams onBack={() => setView('learn')} />}
      {view === 'call-scams' && <CallScams onBack={() => setView('learn')} />}
      {view === 'email-scams' && <EmailScams onBack={() => setView('learn')} />}

      {/* Extra sections only for Home */}
      {view === 'home' && (
        <>
          <WhyItMatters />
          <TypesOfScams />
        </>
      )}

      <div className="w-full h-24 bg-purple-100 absolute left-0 bottom-0 z-0"></div>
    </div>
  );
}

export default App;
