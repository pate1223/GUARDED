import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import { exportQuizStatsToCSV, exportQuizStatsToPDF } from '../utils/exportUtils';

export default function AdminQuizStats({ lang, i18n }) {
  const { showError } = useToast();
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(false);

  /* ----------------------------------------
     LOAD QUIZZES
  ---------------------------------------- */
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
        showError(result.error || i18n(lang, 'failedToFetchQuizzes'));
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      showError(i18n(lang, 'failedToFetchQuizzes'));
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------------
     LOAD QUIZ STATS
  ---------------------------------------- */
  const fetchQuizStats = async (quizId) => {
    try {
      setStatsLoading(true);
      const result = await apiService.getQuizStats(quizId);

      if (result.success) {
        setStats(result.data);
      } else {
        showError(result.error || i18n(lang, 'failedToFetchQuizStatistics'));
      }
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
      showError(i18n(lang, 'failedToFetchQuizStatistics'));
    } finally {
      setStatsLoading(false);
    }
  };

  const handleQuizSelect = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuizStats(quiz.id);
  };

  /* ----------------------------------------
     HELPER FUNCTIONS
  ---------------------------------------- */
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (cat) =>
    ({
      phishing: '📧',
      phone_scams: '📞',
      social_media: '👥',
    }[cat] || '🎯');

  /* ----------------------------------------
     LOADING UI
  ---------------------------------------- */
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {i18n(lang, 'loadingStatistics')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ----------------------------------------
     MAIN UI
  ---------------------------------------- */
  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">
          📊 {i18n(lang, 'quizAnalytics')}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">
          {i18n(lang, 'comprehensiveStatsDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* QUIZ LIST SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl 
                          border border-gray-200/50 dark:border-gray-700/50 p-6 sticky top-6">

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {i18n(lang, 'selectQuizPrompt')}
            </h2>

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
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{quiz.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{quiz.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ----------------------------------------
            STATS PANEL
        ---------------------------------------- */}
        <div className="lg:col-span-2">
          
          {/* IF NO QUIZ SELECTED */}
          {!selectedQuiz && (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl 
                            border p-12 text-center">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-purple-300 mb-2">
                {i18n(lang, 'selectQuizPrompt')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {i18n(lang, 'chooseQuizForAnalytics')}
              </p>
            </div>
          )}

          {/* IF LOADING STATS */}
          {statsLoading && selectedQuiz && (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl 
                            border p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 
                              dark:border-purple-400 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                {i18n(lang, 'loadingStatistics')}
              </p>
            </div>
          )}

          {/* IF STATS LOADED */}
          {stats && !statsLoading && (
            <div className="space-y-6">

              {/* EXPORT BUTTONS */}
              <div className="flex justify-end gap-2 mb-4">
                <button
                  onClick={() => exportQuizStatsToCSV(stats, selectedQuiz.title)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm 
                            font-semibold transition-all flex items-center gap-2"
                >
                  📊 {i18n(lang, 'exportCSV')}
                </button>

                <button
                  onClick={() => exportQuizStatsToPDF(stats, selectedQuiz.title)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm 
                            font-semibold transition-all flex items-center gap-2"
                >
                  📄 {i18n(lang, 'exportPDF')}
                </button>
              </div>

              {/* ----------------------------------------
                  OVERVIEW CARDS
              ---------------------------------------- */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: stats.statistics.total_attempts, label: 'totalAttempts', color: 'blue' },
                  { value: stats.statistics.unique_users, label: 'uniqueUsers', color: 'green' },
                  { value: `${stats.statistics.average_percentage}%`, label: 'avgScore', color: 'purple' },
                  { value: `${stats.statistics.pass_rate}%`, label: 'passRate', color: 'yellow' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100 
                              dark:from-${item.color}-900/20 dark:to-${item.color}-800/20 
                              rounded-xl p-4 border border-${item.color}-200`}
                  >
                    <div className={`text-3xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>
                      {item.value}
                    </div>
                    <div className={`text-sm text-${item.color}-800 dark:text-${item.color}-300`}>
                      {i18n(lang, item.label)}
                    </div>
                  </div>
                ))}
              </div>

              {/* ----------------------------------------
                  PERFORMANCE METRICS
              ---------------------------------------- */}
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border p-6">
                <h3 className="text-xl font-bold mb-4">
                  {i18n(lang, 'performanceMetrics')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div>
                    <Metric label={i18n(lang, 'highestScore')} value={stats.statistics.highest_score} />
                    <Metric label={i18n(lang, 'lowestScore')} value={stats.statistics.lowest_score} />
                    <Metric label={i18n(lang, 'averageScore')} value={stats.statistics.average_score} />
                  </div>

                  <div>
                    <Metric label={i18n(lang, 'fastestTime')} value={formatTime(stats.statistics.shortest_time)} />
                    <Metric label={i18n(lang, 'slowestTime')} value={formatTime(stats.statistics.longest_time)} />
                    <Metric label={i18n(lang, 'averageTime')} value={formatTime(stats.statistics.average_time)} />
                  </div>

                </div>
              </div>

              {/* ----------------------------------------
                  ENGAGEMENT
              ---------------------------------------- */}
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border p-6">
                <h3 className="text-xl font-bold mb-4">
                  {i18n(lang, 'engagementStatistics')}
                </h3>

                <MetricBar
                  label={i18n(lang, 'retryRate')}
                  value={`${stats.statistics.retry_rate}%`}
                  percentage={stats.statistics.retry_rate}
                />

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <CountCard label={i18n(lang, 'usersWhoRetried')} value={stats.statistics.users_who_retried} />
                  <CountCard label={i18n(lang, 'avgAttemptsPerUser')} value={stats.statistics.avg_attempts_per_user} />
                </div>

                {stats.statistics.avg_improvement > 0 && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border rounded-xl mt-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">📈</span>
                      <div>
                        <div className="font-bold text-green-900 dark:text-green-100">
                          +{stats.statistics.avg_improvement}% {i18n(lang, 'avgImprovement')}
                        </div>
                        <div className="text-sm text-green-700 dark:text-green-300">
                          {i18n(lang, 'usersImproveOnAverage')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ----------------------------------------
                  SCORE DISTRIBUTION
              ---------------------------------------- */}
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border p-6">
                <h3 className="text-xl font-bold mb-4">{i18n(lang, 'scoreDistribution')}</h3>

                {stats.scoreDistribution?.length > 0 ? (
                  stats.scoreDistribution.map((dist) => {
                    const total = stats.statistics.total_attempts;
                    const percent = total ? Math.round((dist.count / total) * 100) : 0;

                    return (
                      <MetricBar
                        key={dist.score_range}
                        label={dist.score_range}
                        value={`${dist.count} (${percent}%)`}
                        percentage={percent}
                      />
                    );
                  })
                ) : (
                  <p className="text-gray-600 dark:text-gray-400 text-center">{i18n(lang, 'noDistributionData')}</p>
                )}
              </div>

              {/* ----------------------------------------
                  RECENT ATTEMPTS
              ---------------------------------------- */}
              <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl border p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">{i18n(lang, 'recentAttempts')}</h3>

                {stats.recentAttempts?.length > 0 ? (
                  stats.recentAttempts.map((attempt) => (
                    <div key={attempt.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex justify-between items-center">

                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {attempt.email || i18n(lang, 'unknownUser')}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {i18n(lang, 'attemptNumber')} #{attempt.attempt_number} •{' '}
                            {new Date(attempt.completed_at).toLocaleString()}
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              attempt.percentage >= 90
                                ? 'text-green-600 dark:text-green-400'
                                : attempt.percentage >= 70
                                ? 'text-blue-600 dark:text-blue-400'
                                : attempt.percentage >= 60
                                ? 'text-yellow-600 dark:text-yellow-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {attempt.percentage}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {formatTime(attempt.time_taken)}
                          </div>
                        </div>

                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-600 dark:text-gray-400">
                    {i18n(lang, 'noRecentAttempts')}
                  </p>
                )}
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------
   SMALL REUSABLE COMPONENTS
---------------------------------------- */

const Metric = ({ label, value }) => (
  <div className="flex justify-between mb-2">
    <span className="text-sm text-gray-600 dark:text-gray-400">{label}</span>
    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{value}</span>
  </div>
);

const CountCard = ({ label, value }) => (
  <div>
    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

const MetricBar = ({ label, value, percentage }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{value}</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
      <div
        className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-blue-400 dark:to-purple-500 h-3 rounded-full"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);
