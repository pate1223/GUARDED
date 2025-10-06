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
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import Dashboard from './Dashboard';
import AdminDashboard from './AdminDashboard';
import FeedbackFab from './FeedbackFab';

// Translations for EN and FR
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

// i18n function
function i18n(lang, key) {
  return translations[lang][key] || key;
}

function AppContent() {
  const [lang, setLang] = useState('EN');
  const [view, setView] = useState('home');
  const [showLang, setShowLang] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { loading, error, isAuthenticated, user } = useAuth();

  // Firebase initialization states
  if (loading) {
    return <LoadingSpinner message="Initializing GuardEd..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Initialization Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (view === 'signin') {
    return <SignIn onBack={() => setView('home')} />;
  }

  return (
    <div className="relative w-full bg-white text-black min-h-screen flex flex-col items-center border-none p-0 m-0">
      <div className="absolute inset-0 bg-[#5c52ff] opacity-10 pointer-events-none z-0"></div>

      {/* Top bar */}
      <div className="sticky top-6 z-50 w-[900px] mx-auto flex items-center px-10 py-5 shadow-xl bg-white rounded-full mt-8">
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

        {/* Sign in / User Menu */}
        <div className="ml-8 relative">
          {!isAuthenticated ? (
            <button
              className="px-6 py-3 bg-[#5c52ff] text-white rounded-full font-semibold shadow hover:bg-[#4335d1] transition text-base"
              type="button"
              onClick={() => setView('signin')}
            >
              Sign in
            </button>
          ) : (
            <div className="relative">
              <button
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#5c52ff] text-white font-bold shadow hover:bg-[#4335d1] transition"
                type="button"
                onClick={() => setShowMenu(!showMenu)}
              >
                {user?.email ? user.email[0].toUpperCase() : "U"}
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    Signed in as <br />
                    <span className="font-semibold">{user?.email}</span>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setView('dashboard');
                      setShowMenu(false);
                    }}
                  >
                    Profile
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => { setView('admin'); setShowMenu(false); }}
                  >
                    Access Admin Dashboard
                  </button>
                  <button
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100"
                    onClick={async () => {
                      const { signOutUser } = await import("./services/firebase");
                      await signOutUser();
                      setView("home");
                      setShowMenu(false);
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Theme + Language */}
        <div className="relative ml-4 flex items-center gap-4">
          <ThemeToggle />
          <div className="relative">
            <button
              className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-[#5c52ff] bg-white hover:bg-purple-50 transition"
              onClick={() => setShowLang(!showLang)}
              aria-label="Toggle language"
              type="button"
            >
              🌐
            </button>

            {showLang && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg py-2 px-4 flex flex-col gap-2 z-50">
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${lang === 'EN' ? 'bg-purple-100 font-bold text-[#5c52ff]' : 'hover:bg-purple-50'}`}
                  onClick={() => { setLang('EN'); setShowLang(false); }}
                >
                  <span className="text-2xl">🇬🇧</span>
                  <span className="text-lg font-semibold">EN</span>
                </button>
                <button
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition ${lang === 'FR' ? 'bg-purple-100 font-bold text-[#5c52ff]' : 'hover:bg-purple-50'}`}
                  onClick={() => { setLang('FR'); setShowLang(false); }}
                >
                  <span className="text-2xl">🇫🇷</span>
                  <span className="text-lg font-semibold">FR</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      {view === 'quiz' && <Quiz />}
      {view === 'learn' && <Learn setView={setView} onBack={() => setView('home')} />}
      {view === 'home' && <Home i18n={i18n} lang={lang} />}
      {view === 'dashboard' && <Dashboard setView={setView} />}
      {view === 'admin' && <AdminDashboard />}

      {/* Scam pages */}
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

      {/* Always-available Feedback button */}
      <FeedbackFab />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
