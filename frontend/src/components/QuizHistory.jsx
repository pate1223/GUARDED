import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { exportQuizHistoryToCSV, exportQuizHistoryToPDF, exportAllProgressToCSV } from '../utils/exportUtils';

export default function QuizHistory({ lang, i18n }) {
  const { isAuthenticated, user, userInfo } = useAuth();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchProgress();
    else setLoading(false);
  }, [isAuthenticated]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const result = await apiService.getUserProgress();

      if (result.success) {
        setProgress(result?.data?.progress ?? []);
      } else {
        setError(result.error);
        setProgress([]);
      }
    } catch (e) {
      console.error(e);
      setError(i18n(lang, 'failedToFetchProgress'));
      setProgress([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizHistory = async (quizId) => {
    try {
      setHistoryLoading(true);
      const result = await apiService.getQuizHistory(quizId);
      if (result.success) setQuizHistory(result.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleViewHistory = (quiz) => {
    setSelectedQuiz(quiz);
    fetchQuizHistory(quiz.quiz_id);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400';
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400';
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400';
    if (percentage >= 60) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getCategoryIcon = (c) => c === "phishing" ? "📧" :
    c === "phone_scams" ? "📞" :
    c === "social_media" ? "👥" : "🎯";

  const getCategoryTitle = (c) =>
    c === 'phishing' ? i18n(lang, 'emailSecurity') :
    c === 'phone_scams' ? i18n(lang, 'phoneSecurity') :
    c === 'social_media' ? i18n(lang, 'socialMediaSecurity') :
    i18n(lang, 'general');

  // -----------------------------
  //  NOT AUTHENTICATED
  // -----------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold mb-4">
            {i18n(lang, 'signInRequired')}
          </h2>
          <p>{i18n(lang, 'pleaseSignInToView')}</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  //  LOADING
  // -----------------------------
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 text-center shadow-xl">
          <div className="animate-spin h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p>{i18n(lang, 'loadingQuizHistory')}</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  //  ERROR
  // -----------------------------
  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen">
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 text-center shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{i18n(lang, 'error')}</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // -----------------------------
  //  SELECTED QUIZ HISTORY VIEW
  // -----------------------------
  if (selectedQuiz) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen">

        <button
          onClick={() => setSelectedQuiz(null)}
          className="mb-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
        >
          ← {i18n(lang, 'backToAllQuizzes')}
        </button>

        <div className="flex items-center space-x-3 mb-8">
          <div className="text-4xl">{getCategoryIcon(selectedQuiz.category)}</div>
          <div>
            <h1 className="text-3xl font-bold">{selectedQuiz.title}</h1>
            <p>{getCategoryTitle(selectedQuiz.category)}</p>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-8 shadow-xl">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{i18n(lang, 'allAttempts')}</h2>

            <div className="flex gap-2">
              <button
                onClick={() => exportQuizHistoryToCSV(quizHistory, selectedQuiz.title, { displayName: user?.displayName, email: user?.email, ...userInfo })}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                {i18n(lang, 'certificate')}
              </button>

              <button
                onClick={() => exportQuizHistoryToPDF(quizHistory, selectedQuiz.title, { displayName: user?.displayName, email: user?.email, ...userInfo })}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                {i18n(lang, 'pdfExport')}
              </button>
            </div>
          </div>

          {historyLoading ? (
            <p className="text-center py-8">{i18n(lang, 'loadingHistory')}</p>
          ) : quizHistory.length === 0 ? (
            <p className="text-center py-8">{i18n(lang, 'noAttemptsFound')}</p>
          ) : (
            <div className="space-y-4">
              {quizHistory.map((attempt) => (
                <div key={attempt.id} className="p-6 rounded-xl border">

                  <div className="flex justify-between mb-4">
                    <div>
                      <div>{i18n(lang, 'attemptNumber')} {attempt.attempt_number}</div>
                      <div>{new Date(attempt.completed_at).toLocaleString()}</div>
                    </div>

                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getScoreColor(attempt.percentage)}`}>
                        {attempt.percentage}%
                      </div>
                      <div>{attempt.score}/{attempt.max_score} {i18n(lang, 'points')}</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>{i18n(lang, 'timeTakenLabel')} {formatTime(attempt.time_taken)}</span>
                    {attempt.achievements?.length > 0 && (
                      <span>🏆 {attempt.achievements.length} {i18n(lang, 'achievementsEarned')}</span>
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

  // -----------------------------
  //  MAIN QUIZ HISTORY LIST
  // -----------------------------
  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold"> {i18n(lang, 'quizHistory')}</h1>
        <p className="text-xl">{i18n(lang, 'trackProgressText')}</p>

        {progress.length > 0 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => exportAllProgressToCSV(progress)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl"
            >
              {i18n(lang, 'exportToCSV')}
            </button>
          </div>
        )}
      </div>

      {progress.length === 0 ? (
        <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl p-12 text-center shadow-xl">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold">{i18n(lang, 'noQuizHistoryYet')}</h3>
          <p>{i18n(lang, 'completeQuizzesMessage')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {progress.map((quiz) => (
            <div
              key={quiz.quiz_id}
              className="bg-white/90 dark:bg-gray-800/90 p-6 rounded-xl shadow-xl cursor-pointer"
              onClick={() => handleViewHistory(quiz)}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="text-3xl">{getCategoryIcon(quiz.category)}</div>
                <div>
                  <h3 className="font-bold">{quiz.title}</h3>
                  <p>{getCategoryTitle(quiz.category)}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>{i18n(lang, 'latestScore')}</span>
                  <span className={`font-bold ${getScoreColor(quiz.percentage)}`}>
                    {quiz.score}/{quiz.max_score} ({quiz.percentage}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{i18n(lang, 'timeTaken')}:</span>
                  <span>{formatTime(quiz.time_taken)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{i18n(lang, 'completed')}</span>
                  <span>{new Date(quiz.completed_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t text-center text-sm text-purple-600">
                {i18n(lang, 'viewAllAttempts')}
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}
