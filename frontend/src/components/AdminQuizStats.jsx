import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { exportQuizStatsToCSV, exportQuizStatsToPDF } from '../utils/exportUtils';

export default function AdminQuizStats() {
  const { showError } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const result = await apiService.getQuizzes();
      if (result.success) {
        setQuizzes(result.data.quizzes || result.data);
      } else {
        showError(result.error || 'Failed to fetch quizzes');
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      showError('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizStats = async (quizId) => {
    try {
      setStatsLoading(true);
      const result = await apiService.getQuizStats(quizId);
      if (result.success) {
        setStats(result.data);
      } else {
        showError(result.error || 'Failed to fetch quiz statistics');
      }
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      showError('Failed to fetch quiz statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuizStats(quiz.id);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'phishing': return '📧';
      case 'phone_scams': return '📞';
      case 'social_media': return '👥';
      default: return '🎯';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading quiz statistics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">📊 Quiz Analytics</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">
          Comprehensive statistics and insights for all quizzes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quiz Selector Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-colors duration-300 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Select Quiz</h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {quizzes.map((quiz) => (
                <button
                  key={quiz.id}
                  onClick={() => handleQuizSelect(quiz)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                    selectedQuiz?.id === quiz.id
                      ? 'bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-500 dark:border-purple-600'
                      : 'bg-gray-100 dark:bg-gray-700/50 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getCategoryIcon(quiz.category)}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">{quiz.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Display */}
        <div className="lg:col-span-2">
          {!selectedQuiz ? (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center transition-colors duration-300">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-purple-300 mb-2 transition-colors duration-300">Select a Quiz</h3>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Choose a quiz from the sidebar to view detailed analytics
              </p>
            </div>
          ) : statsLoading ? (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-12 text-center transition-colors duration-300">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading statistics...</p>
            </div>
          ) : stats ? (
            <div className="space-y-6">
              {/* Export Buttons */}
              <div className="flex justify-end gap-2 mb-4">
                <button
                  onClick={() => exportQuizStatsToCSV(stats, selectedQuiz.title)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  📊 Export CSV
                </button>
                <button
                  onClick={() => exportQuizStatsToPDF(stats, selectedQuiz.title)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg text-sm font-semibold transition-all duration-300 flex items-center gap-2"
                >
                  📄 Export PDF
                </button>
              </div>

              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700/50 transition-colors duration-300">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.statistics.total_attempts}</div>
                  <div className="text-sm text-blue-800 dark:text-blue-300 font-medium">Total Attempts</div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-4 border border-green-200 dark:border-green-700/50 transition-colors duration-300">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.statistics.unique_users}</div>
                  <div className="text-sm text-green-800 dark:text-green-300 font-medium">Unique Users</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700/50 transition-colors duration-300">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.statistics.average_percentage}%</div>
                  <div className="text-sm text-purple-800 dark:text-purple-300 font-medium">Avg Score</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-4 border border-yellow-200 dark:border-yellow-700/50 transition-colors duration-300">
                  <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.statistics.pass_rate}%</div>
                  <div className="text-sm text-yellow-800 dark:text-yellow-300 font-medium">Pass Rate</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Highest Score</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{stats.statistics.highest_score}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Lowest Score</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{stats.statistics.lowest_score}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average Score</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{stats.statistics.average_score}</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Fastest Time</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatTime(stats.statistics.shortest_time)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Slowest Time</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatTime(stats.statistics.longest_time)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Average Time</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{formatTime(stats.statistics.average_time)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Engagement Stats */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Engagement Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Retry Rate</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{stats.statistics.retry_rate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${stats.statistics.retry_rate}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.statistics.users_who_retried}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Users Who Retried</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.statistics.avg_attempts_per_user}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Avg Attempts/User</div>
                    </div>
                  </div>
                  {stats.statistics.avg_improvement > 0 && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-xl">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">📈</span>
                        <div>
                          <div className="font-bold text-green-900 dark:text-green-100">+{stats.statistics.avg_improvement}% Average Improvement</div>
                          <div className="text-sm text-green-700 dark:text-green-300">Users improve on average when retrying</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Score Distribution */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Score Distribution</h3>
                <div className="space-y-3">
                  {stats.scoreDistribution && stats.scoreDistribution.length > 0 ? (
                    stats.scoreDistribution.map((dist) => {
                      const total = stats.statistics.total_attempts;
                      const percentage = total > 0 ? Math.round((dist.count / total) * 100) : 0;
                      return (
                        <div key={dist.score_range}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{dist.score_range}</span>
                            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{dist.count} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-4">No distribution data available</p>
                  )}
                </div>
              </div>

              {/* Recent Attempts */}
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 transition-colors duration-300">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">Recent Attempts</h3>
                <div className="space-y-2">
                  {stats.recentAttempts && stats.recentAttempts.length > 0 ? (
                    stats.recentAttempts.map((attempt) => (
                      <div key={attempt.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-gray-100">{attempt.email || 'Unknown User'}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              Attempt #{attempt.attempt_number} • {new Date(attempt.completed_at).toLocaleString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${
                              attempt.percentage >= 90 ? 'text-green-600 dark:text-green-400' :
                              attempt.percentage >= 70 ? 'text-blue-600 dark:text-blue-400' :
                              attempt.percentage >= 60 ? 'text-yellow-600 dark:text-yellow-400' :
                              'text-red-600 dark:text-red-400'
                            }`}>
                              {attempt.percentage}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{formatTime(attempt.time_taken)}</div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-4">No recent attempts</p>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}