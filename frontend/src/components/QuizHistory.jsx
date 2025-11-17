import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function QuizHistory() {
  const { isAuthenticated } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setProgress(result.data.data);
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
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

  // Group quiz history by quiz
  const groupedHistory = () => {
    if (!progress?.quizHistory) return {};
    
    return progress.quizHistory.reduce((groups, attempt) => {
      const key = attempt.quiz_id;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(attempt);
      return groups;
    }, {});
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to view your quiz history.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const grouped = groupedHistory();

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">📚 Quiz History</h1>
        <p className="text-xl text-gray-600">
          Track your progress and improvement across all quizzes
        </p>
      </div>

      {/* Current Progress Summary */}
      {progress?.currentProgress && progress.currentProgress.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.currentProgress.map((quiz) => (
              <div key={quiz.quiz_id} className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border border-purple-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-3xl">{getCategoryIcon(quiz.category)}</div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-600">{getCategoryTitle(quiz.category)}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Latest Score:</span>
                    <span className={`font-bold ${getScoreColor(quiz.percentage)}`}>
                      {quiz.score}/{quiz.max_score} ({quiz.percentage}%)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Attempts:</span>
                    <span className="font-semibold">{quiz.attempt_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Time:</span>
                    <span className="font-semibold">{formatTime(quiz.time_taken)}</span>
                  </div>
                  {quiz.improvement_score > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Improvement:</span>
                      <span className="font-semibold text-green-600">+{quiz.improvement_score} points</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Quiz History */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed History</h2>
        
        {Object.keys(grouped).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Quiz History Yet</h3>
            <p className="text-gray-600">Start taking quizzes to see your progress here!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(([quizId, attempts]) => (
              <div key={quizId} className="border border-gray-200 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-2xl">{getCategoryIcon(attempts[0].category)}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{attempts[0].title}</h3>
                    <p className="text-gray-600">{getCategoryTitle(attempts[0].category)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {attempts.map((attempt, index) => (
                    <div key={attempt.id} className={`p-4 rounded-lg border-2 ${
                      attempt.is_current_attempt 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-sm">
                          {attempt.is_current_attempt ? 'Current' : `Attempt #${attempt.attempt_number}`}
                        </span>
                        <span className={`text-sm font-bold ${getScoreColor(attempt.percentage)}`}>
                          {attempt.percentage}%
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                          <span>Score:</span>
                          <span className="font-semibold">{attempt.score}/{attempt.max_score}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time:</span>
                          <span className="font-semibold">{formatTime(attempt.time_taken)}</span>
                        </div>
                        {attempt.previous_score !== null && (
                          <div className="flex justify-between">
                            <span>Previous:</span>
                            <span className="font-semibold">{attempt.previous_score}/{attempt.max_score}</span>
                          </div>
                        )}
                        {attempt.improvement_score !== 0 && (
                          <div className="flex justify-between">
                            <span>Change:</span>
                            <span className={`font-semibold ${
                              attempt.improvement_score > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {attempt.improvement_score > 0 ? '+' : ''}{attempt.improvement_score}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span>Date:</span>
                          <span className="font-semibold">
                            {new Date(attempt.completed_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      {/* Achievements for this attempt */}
                      {attempt.achievements && attempt.achievements.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-200">
                          <div className="text-xs text-gray-600 mb-1">Achievements:</div>
                          <div className="flex flex-wrap gap-1">
                            {attempt.achievements.map((achievement, idx) => (
                              <span key={idx} className="text-lg" title={achievement.title}>
                                {achievement.icon}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}