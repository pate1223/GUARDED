import React, { useState } from 'react';
import { ClipboardList, Trophy, History, Sparkles } from 'lucide-react'; // Make sure to install lucide-react
import Quiz from '../Quiz';
import Achievements from './Achievements';
import QuizHistory from './QuizHistory';

export default function QuizDashboard({ lang, i18n }) {
  const [activeTab, setActiveTab] = useState('quizzes');

  const tabs = [
    { 
      id: 'quizzes', 
      label: i18n(lang, 'quizzes'), 
      icon: <ClipboardList className="w-5 h-5" /> 
    },
    { 
      id: 'achievements', 
      label: i18n(lang, 'achievements'), 
      icon: <Trophy className="w-5 h-5" /> 
    },
    { 
      id: 'history', 
      label: i18n(lang, 'history') || 'History', // Fallback if translation missing
      icon: <History className="w-5 h-5" /> 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 flex flex-col">
      
      {/* 🔹 Background Decor (Subtle Gradients similar to Learn page) */}
      <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent opacity-60" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex-grow flex flex-col">
        
        {/* 🔹 Header Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
            <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 mb-4">
            {i18n(lang, 'Quiz Dashboard') || 'Knowledge Center'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {i18n(lang, 'Take a quiz to test your knowledge!') || 'Test your skills, track your progress, and earn achievements.'}
          </p>
        </div>

        {/* 🔹 Modern Tab Navigation (Floating Pill Style) */}
        <div className="flex justify-center mb-10">
          <div className="bg-white dark:bg-gray-800 p-1.5 rounded-full shadow-lg border border-gray-100 dark:border-gray-700 inline-flex flex-wrap justify-center gap-1 sm:gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2
                    ${isActive 
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md transform scale-105" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }
                  `}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 🔹 Main Content Area */}
        <div className="flex-grow w-full animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[500px] p-6 md:p-8">
            {activeTab === 'quizzes' && (
              <div className="animate-slideUp">
                <Quiz lang={lang} i18n={i18n} />
              </div>
            )}
            
            {activeTab === 'achievements' && (
              <div className="animate-slideUp">
                <Achievements lang={lang} i18n={i18n} />
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="animate-slideUp">
                <QuizHistory lang={lang} i18n={i18n} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}