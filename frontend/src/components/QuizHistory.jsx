import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { exportQuizHistoryToCSV, exportQuizHistoryToPDF, exportAllProgressToCSV } from '../utils/exportUtils';

export default function QuizHistory() {
  const { isAuthenticated, user, userInfo } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const result = await apiService.getUserProgress();
      if (result.success) {
        setProgress(result.data.progress);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      setError('Failed to fetch quiz progress');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizHistory = async (quizId) => {
    try {
      setHistoryLoading(true);
      const result = await apiService.getQuizHistory(quizId);
      if (result.success) {
        setQuizHistory(result.data.data);
      } else {
        console.error('Error fetching quiz history:', result.error);
      }
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewHistory = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuizHistory(quiz.quiz_id);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'phishing': return '📧';
      case 'phone_scams': return '📞';
      case 'social_media': return '👥';
      default: return '🎯';
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'phishing': return 'Email Security';
      case 'phone_scams': return 'Phone Security';
      case 'social_media': return 'Social Media Security';
      default: return 'General';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 text-center transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">Sign In Required</h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Please sign in to view your quiz history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 text-center transition-colors duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 text-center transition-colors duration-300">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 transition-colors duration-300">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{error}</p>
        </div>
      </div>
    );
  }

  if (selectedQuiz) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
          >
            ← Back to All Quizzes
          </button>
          <div className="flex items-center space-x-3">
            <div className="text-4xl">{getCategoryIcon(selectedQuiz.category)}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-purple-300 transition-colors duration-300">{selectedQuiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{getCategoryTitle(selectedQuiz.category)}</p>
            </div>
          </div>
        </div>

        {/* Quiz History Details */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 transition-colors duration-300">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-purple-300 transition-colors duration-300">All Attempts</h2>
            <div className="flex gap-2">
              <button
                onClick={() => exportQuizHistoryToCSV(quizHistory, selectedQuiz.title, { displayName: user?.displayName, email: user?.email, ...userInfo })}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-300"
                title="Generate Completion Certificate"
              >
                🏆 Certificate
              </button>
              <button
                onClick={() => exportQuizHistoryToPDF(quizHistory, selectedQuiz.title, { displayName: user?.displayName, email: user?.email, ...userInfo })}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg text-sm font-semibold transition-all duration-300"
                title="Generate PDF Certificate"
              >
                📄 PDF
              </button>
            </div>
          </div>

          {historyLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading history...</p>
            </div>
          ) : quizHistory.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">No attempts found for this quiz.</p>
          ) : (
            <div className="space-y-4">
              {quizHistory.map((attempt) => (
                <div
                  key={attempt.id}
                  className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-700/50 transition-colors duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        Attempt #{attempt.attempt_number}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-500 transition-colors duration-300">
                        {new Date(attempt.completed_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                        {attempt.percentage}%
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                        {attempt.score}/{attempt.max_score} points
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                    <span>Time Taken: {formatTime(attempt.time_taken)}</span>
                    {attempt.achievements && attempt.achievements.length > 0 && (
                      <span>🏆 {attempt.achievements.length} achievement(s) earned</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">📚 Quiz History</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Track your progress and improvement across all quizzes
        </p>
        {progress.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => exportAllProgressToCSV(progress)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              📊 Export to CSV
            </button>
          </div>
        )}
      </div>

      {/* Quiz Progress Cards */}
      {progress.length === 0 ? (
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-12 text-center transition-colors duration-300">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-purple-300 mb-2 transition-colors duration-300">No Quiz History Yet</h3>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            Complete some quizzes to see your progress history here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progress.map((quiz) => (
            <div
              key={quiz.quiz_id}
              className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-6 hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => handleViewHistory(quiz)}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-3xl">{getCategoryIcon(quiz.category)}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">{quiz.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{getCategoryTitle(quiz.category)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Latest Score:</span>
                  <span className={`font-bold ${getScoreColor(quiz.percentage)}`}>
                    {quiz.score}/{quiz.max_score} ({quiz.percentage}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Time Taken:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{formatTime(quiz.time_taken)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">Completed:</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {new Date(quiz.completed_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
                <div className="text-center text-sm text-purple-600 dark:text-purple-400 font-medium hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-300">
                  View All Attempts →
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}