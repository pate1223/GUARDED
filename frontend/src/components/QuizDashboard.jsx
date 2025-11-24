import React, { useState } from 'react';
import Quiz from '../Quiz';
import Achievements from './Achievements';
import QuizHistory from './QuizHistory';

export default function QuizDashboard({ lang, i18n }) {
  const [activeTab, setActiveTab] = useState('quizzes');

  const tabs = [
    { id: 'quizzes', label: i18n(lang, 'quizzes'), icon: '📝' },
    { id: 'achievements', label: i18n(lang, 'achievements'), icon: '🏆' },
    { id: 'history', label: 'History', icon: '📚' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Tab Navigation */}
      <div className="sticky top-24 z-40 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-purple-500/10 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Quiz Dashboard Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative py-4 px-1 font-medium text-sm transition-colors duration-300 ${
                  activeTab === tab.id
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400 transition-colors duration-300"></div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="transition-opacity duration-300">
        {activeTab === 'quizzes' && <Quiz lang={lang} i18n={i18n} />}
        {activeTab === 'achievements' && <Achievements lang={lang} i18n={i18n} />}
        {activeTab === 'history' && <QuizHistory lang={lang} i18n={i18n} />}
      </div>
    </div>
  );
}