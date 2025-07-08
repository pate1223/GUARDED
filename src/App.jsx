import React, { useState } from 'react';
import Quiz from './Quiz';
import AudioLibrary from './AudioLibrary';
import './i18n';
import { useTranslation } from 'react-i18next';
import welcomeImg from './assets/unnamed.png';

function App() {
  const { i18n, t } = useTranslation();
  const [view, setView] = useState('home');

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'fr' : 'en');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white text-black">
      <div className="absolute top-4 right-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          onClick={toggleLanguage}
        >
          {i18n.language === 'en' ? 'Français' : 'English'}
        </button>
      </div>

      {view === 'home' && (
        <div className="flex flex-col items-center justify-center space-y-6 text-center p-6 max-w-md w-full">
          <img
            src={welcomeImg}
            alt="Welcome"
            className="w-full max-w-xs object-contain"
          />
          <h1 className="welcome-text text-red-600 text-xl font-bold">Welcome to GuardED</h1>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
            onClick={() => setView('quiz')}
          >
            {t('startQuiz')}
          </button>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition duration-200"
            onClick={() => setView('audio')}
          >
            {t('Audio Library')}
          </button>
        </div>
      )}

      {view === 'quiz' && <Quiz />}
      {view === 'audio' && <AudioLibrary />}
    </div>
  );
}

export default App;
