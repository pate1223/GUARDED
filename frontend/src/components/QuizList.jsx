import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';

export default function QuizList({ onQuizSelect, lang, i18n }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchQuizzes();
  }, [lang]); // refetch quizzes when language changes

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      // Pass language to backend
      const result = await apiService.getQuizzes(lang);

      if (result.success) {
        setQuizzes(result.data.quizzes);
      } else {
        setError(result.error || i18n(lang, 'failedToLoadQuizzes'));
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError(i18n(lang, 'failedToLoadQuizzes'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5c52ff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchQuizzes}
          className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition"
        >
          {i18n(lang, 'retry')}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {quizzes.map((quiz) => (
        <div
          key={quiz.id}
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-12 h-12 bg-[#5c52ff] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="inline-block px-2 py-1 text-xs font-semibold text-[#5c52ff] bg-purple-100 rounded-full">
                  {quiz.category.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <span className="text-sm text-gray-500 capitalize">{quiz.difficulty}</span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2">{quiz.title}</h3>
          <p className="text-gray-600 mb-4">{quiz.description}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {quiz.time_limit} {i18n(lang, 'minutes')}
            </div>

            <button
              onClick={() => onQuizSelect(quiz)}
              className="px-6 py-2 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition font-semibold"
            >
              {i18n(lang, 'start')}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
