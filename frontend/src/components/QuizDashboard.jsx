import React, { useState } from 'react';
import Quiz from '../Quiz';
import Achievements from './Achievements';
import QuizHistory from './QuizHistory';



export default function QuizDashboard() {
  const [activeTab, setActiveTab] = useState('quizzes'); // 'quizzes', 'achievements', 'history'

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[#f3f2fd]">
      {/* Split Header */}
      <div className="w-[90%] h-24 bg-[#5c52ff] rounded-full flex items-center justify-center mb-[-40px] z-10 mt-10 shadow-lg">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-6 py-2 rounded-full text-xl font-bold transition-all duration-300 ${
              activeTab === 'quizzes'
                ? 'bg-white text-[#5c52ff] shadow-lg'
                : 'text-white hover:bg-white/20'
            }`}
          >
            📚 Quizzes
          </button>
          <div className="text-white text-2xl">|</div>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-2 rounded-full text-xl font-bold transition-all duration-300 ${
              activeTab === 'achievements'
                ? 'bg-white text-[#5c52ff] shadow-lg'
                : 'text-white hover:bg-white/20'
            }`}
          >
            🏆 Achievements
          </button>
          <div className="text-white text-2xl">|</div>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-2 rounded-full text-xl font-bold transition-all duration-300 ${
              activeTab === 'history'
                ? 'bg-white text-[#5c52ff] shadow-lg'
                : 'text-white hover:bg-white/20'
            }`}
          >
            📈 History
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="w-full mt-40">
        {activeTab === 'quizzes' && <Quiz />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'history' && <QuizHistory />}
      </div>
    </div>
  );
}