import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import QuizResults from './QuizResults';

export default function Quiz({ quiz, onComplete, onBack, lang, i18n }) {
  const { isAuthenticated } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz?.time_limit ? quiz.time_limit * 60 : 600); // Convert to seconds, default 10 min
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [showDetailedReview, setShowDetailedReview] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log('Quiz component received data:', quiz);
    if (quiz?.questions) {
      console.log('Questions data:', quiz.questions);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      alert(i18n(lang, 'pleaseSignInSubmitQuiz'));
      return;
    }

    setIsSubmitting(true);
    try {
      const timeTaken = (quiz.time_limit * 60) - timeLeft;
      const result = await apiService.submitQuiz(quiz.id, answers, timeTaken);

      if (result.success) {
        setResults(result.data);
        setShowResults(true);
      } else {
        alert(result.error || i18n(lang, 'failedToSubmitQuiz'));
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert(i18n(lang, 'failedToSubmitQuiz'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(quiz?.time_limit ? quiz.time_limit * 60 : 600);
    setShowResults(false);
    setResults(null);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Show detailed review if requested
  if (showDetailedReview && results && quiz) {
    return (
      <QuizResults
        quiz={quiz}
        results={results}
        onBack={() => setShowDetailedReview(false)}
        onRetry={() => {
          setShowDetailedReview(false);
          handleRetry();
        }}
        lang={lang}
        i18n={i18n}
      />
    );
  }

  if (showResults && results) {
    const isExcellent = results.percentage >= 90;
    const isGood = results.percentage >= 70;
    const isPassing = results.percentage >= 50;

    return (
      <div className="max-w-5xl mx-auto p-6 pb-20 max-h-screen overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Celebration Animation */}
        {isExcellent && (
          <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🎉</div>
          </div>
        )}

        <div className="bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 mb-8 border border-purple-100 dark:border-gray-700 transition-colors duration-300">
          {/* Header Section */}
          <div className="text-center mb-10">
            <div
              className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center transform transition-all duration-500 ${
                isExcellent
                  ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 scale-110 shadow-2xl'
                  : isGood
                  ? 'bg-gradient-to-br from-green-400 to-green-600 shadow-xl'
                  : isPassing
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg'
                  : 'bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg'
              }`}
            >
              {isExcellent ? (
                <span className="text-6xl animate-pulse">🏆</span>
              ) : isGood ? (
                <span className="text-6xl">⭐</span>
              ) : isPassing ? (
                <span className="text-6xl">👍</span>
              ) : (
                <span className="text-6xl">📚</span>
              )}
            </div>

            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-3">
              {isExcellent
                ? i18n(lang, 'outstandingPerformance')
                : isGood
                ? i18n(lang, 'greatJob')
                : isPassing
                ? i18n(lang, 'wellDone')
                : i18n(lang, 'keepPracticing')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 font-medium transition-colors duration-300">
              {isExcellent
                ? i18n(lang, 'youCrushedIt')
                : isGood
                ? i18n(lang, 'youDidWell')
                : isPassing
                ? i18n(lang, 'youPassed')
                : i18n(lang, 'everyAttempt')}
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12" />
              <div className="relative">
                <div className="text-5xl font-extrabold text-white mb-2">
                  {results.score}
                  <span className="text-3xl">/{results.maxScore}</span>
                </div>
                <div className="text-blue-100 font-semibold text-lg uppercase tracking-wide">
                  {i18n(lang, 'totalScore')}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12" />
              <div className="relative">
                <div className="text-5xl font-extrabold text-white mb-2">
                  {results.percentage}
                  <span className="text-3xl">%</span>
                </div>
                <div className="text-green-100 font-semibold text-lg uppercase tracking-wide">
                  {i18n(lang, 'accuracy')}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-8 text-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12" />
              <div className="relative">
                <div className="text-5xl font-extrabold text-white mb-2">
                  {formatTime(results.timeTaken)}
                </div>
                <div className="text-purple-100 font-semibold text-lg uppercase tracking-wide">
                  {i18n(lang, 'timeTaken')}
                </div>
              </div>
            </div>
          </div>

          {/* Performance Badge */}
          <div
            className={`p-6 rounded-xl mb-10 text-center ${
              isExcellent
                ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 border-2 border-yellow-400'
                : isGood
                ? 'bg-gradient-to-r from-green-100 to-green-200 border-2 border-green-400'
                : isPassing
                ? 'bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-400'
                : 'bg-gradient-to-r from-orange-100 to-orange-200 border-2 border-orange-400'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl">
                {isExcellent ? '🏅' : isGood ? '🎯' : isPassing ? '✨' : '🔥'}
              </span>
              <span
                className={`text-2xl font-bold ${
                  isExcellent
                    ? 'text-yellow-800'
                    : isGood
                    ? 'text-green-800'
                    : isPassing
                    ? 'text-blue-800'
                    : 'text-orange-800'
                }`}
              >
                {isExcellent
                  ? i18n(lang, 'excellentMaster')
                  : isGood
                  ? i18n(lang, 'goodKnowStuff')
                  : isPassing
                  ? i18n(lang, 'passKeepGoing')
                  : i18n(lang, 'tryAgainPractice')}
              </span>
            </div>
          </div>

          {/* Newly Earned Badges Section */}
          {results.newBadges && results.newBadges.length > 0 && (
            <div className="mb-10 animate-fadeIn">
              <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-yellow-300 shadow-xl">
                <div className="text-center mb-6">
                  <div className="inline-block animate-bounce">
                    <span className="text-6xl">🎉</span>
                  </div>
                  <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-orange-600 mt-4 mb-2">
                    {i18n(lang, 'newBadgesEarned')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">
                    {i18n(lang, 'congratsAchievement')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {results.newBadges.map((badge) => (
                    <div
                      key={badge.id}
                      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-yellow-200 dark:border-yellow-600"
                    >
                      <div className="text-center">
                        <div className="text-5xl mb-3 animate-pulse">{badge.icon}</div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 transition-colors duration-300">
                          {badge.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Review Answers Section */}
          <div className="space-y-6 mb-10">
            <div className="flex items-center gap-3 border-t-2 border-purple-200 pt-8 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 transition-colors duration-300">
                  {i18n(lang, 'answerReview')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                  {i18n(lang, 'seeHowYouDid')}
                </p>
              </div>
            </div>

            {results.results.map((result, index) => (
              <div
                key={index}
                className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  result.isCorrect
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300'
                    : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-300'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                          result.isCorrect
                            ? 'bg-gradient-to-br from-green-500 to-green-600'
                            : 'bg-gradient-to-br from-red-500 to-red-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <span className="font-bold text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">
                        {i18n(lang, 'question')} {index + 1}
                      </span>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
                        result.isCorrect
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white'
                          : 'bg-gradient-to-r from-red-500 to-red-600 text-white'
                      }`}
                    >
                      {result.isCorrect ? i18n(lang, 'correct') : i18n(lang, 'incorrect')}
                    </span>
                  </div>
                  <div className="space-y-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">
                    <div className="flex items-start gap-2">
                      <span className="font-semibold min-w-[140px]">
                        {i18n(lang, 'yourAnswer')}:
                      </span>
                      <span
                        className={`font-medium ${
                          result.isCorrect ? 'text-green-700' : 'text-red-700'
                        }`}
                      >
                        {result.userAnswer || i18n(lang, 'notAnswered')}
                      </span>
                    </div>
                    {!result.isCorrect && (
                      <div className="flex items-start gap-2">
                        <span className="font-semibold min-w-[140px]">
                          {i18n(lang, 'correctAnswer')}:
                        </span>
                        <span className="font-medium text-green-700">
                          {result.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-6 border-t-2 border-purple-200">
            <button
              onClick={() => setShowDetailedReview(true)}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              {i18n(lang, 'reviewAnswers')}
            </button>
            <button
              onClick={handleRetry}
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {i18n(lang, 'retryQuiz')}
            </button>
            <button
              onClick={onBack}
              className="px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {i18n(lang, 'backToQuizzes')}
            </button>
            <button
              onClick={() => onComplete && onComplete(results)}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
            >
              {i18n(lang, 'continueLearningQuiz')}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Add safety check for question data
  if (!quiz || !quiz.questions || !quiz.questions[currentQuestion]) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
            {i18n(lang, 'loadingQuiz')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
            {i18n(lang, 'pleaseWait')}
          </p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isUrgent = timeLeft < 60;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="max-w-5xl mx-auto p-6 min-h-screen pb-24 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Floating Timer Badge */}
      <div
        className={`fixed top-24 right-8 z-50 transform transition-all duration-300 ${
          isUrgent ? 'animate-pulse scale-110' : ''
        }`}
      >
        <div
          className={`rounded-2xl shadow-2xl p-4 ${
            isUrgent
              ? 'bg-gradient-to-br from-red-500 to-red-600'
              : 'bg-gradient-to-br from-purple-500 to-blue-500'
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-extrabold text-white mb-1">
              {formatTime(timeLeft)}
            </div>
            <div className="text-xs text-white opacity-90 font-semibold uppercase tracking-wider">
              {isUrgent ? i18n(lang, 'hurry') : i18n(lang, 'timeLeft')}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-white via-purple-50/30 to-blue-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl border border-purple-100 dark:border-gray-700 transition-colors duration-300">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-8 text-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-extrabold mb-2">{quiz.title}</h2>
              <div className="flex items-center gap-4">
                <span className="px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
                  {i18n(lang, 'question')} {currentQuestion + 1} / {quiz.questions.length}
                </span>
                <span className="px-4 py-1 bg-white/20 backdrop-blur rounded-full text-sm font-semibold">
                  {answeredCount} / {quiz.questions.length} {i18n(lang, 'answered')}
                </span>
              </div>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                <span className="text-4xl">
                  {currentQuestion < quiz.questions.length / 3
                    ? '🎯'
                    : currentQuestion < (quiz.questions.length * 2) / 3
                    ? '🚀'
                    : '🏁'}
                </span>
              </div>
            </div>
          </div>

          {/* Enhanced Progress bar */}
          <div className="relative">
            <div className="w-full bg-white/20 backdrop-blur rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 via-green-400 to-green-500 h-4 rounded-full transition-all duration-500 ease-out shadow-lg"
                style={{ width: `${progress}%` }}
              >
                <div className="h-full w-full bg-white/30 animate-pulse" />
              </div>
            </div>
            <div className="absolute -top-1 left-0 right-0 flex justify-between text-xs font-bold text-white/80">
              <span>Start</span>
              <span>{Math.round(progress)}% Complete</span>
              <span>Finish</span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="p-8">
          {/* Question Number Badge */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg transform rotate-3">
              <span className="text-2xl font-extrabold text-white">
                {currentQuestion + 1}
              </span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-purple-600 uppercase tracking-wide mb-1">
                {i18n(lang, 'question')} {currentQuestion + 1}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight transition-colors duration-300">
                {question.question_text || i18n(lang, 'questionNotAvailable')}
              </h3>
            </div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4 mb-8">
            {question.options &&
              Object.entries(question.options).map(([key, value], index) => (
                <label
                  key={key}
                  className={`group relative flex items-start p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    answers[question.id] === key
                      ? 'border-purple-500 dark:border-purple-400 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 shadow-lg scale-[1.02] transform'
                      : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md bg-white dark:bg-gray-800'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={key}
                    checked={answers[question.id] === key}
                    onChange={() => handleAnswerSelect(question.id, key)}
                    className="sr-only"
                  />

                  {/* Custom Radio Button */}
                  <div
                    className={`relative w-8 h-8 rounded-full border-2 mr-5 flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      answers[question.id] === key
                        ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg'
                        : 'border-gray-300 group-hover:border-purple-400 bg-white'
                    }`}
                  >
                    {answers[question.id] === key ? (
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-gray-200 group-hover:bg-purple-200 transition-colors" />
                    )}
                  </div>

                  {/* Answer Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-lg font-bold transition-colors duration-300 ${
                          answers[question.id] === key
                            ? 'text-purple-700 dark:text-purple-400'
                            : 'text-gray-600 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400'
                        }`}
                      >
                        {key}.
                      </span>
                      <span
                        className={`text-lg font-medium transition-colors duration-300 ${
                          answers[question.id] === key
                            ? 'text-gray-900 dark:text-gray-100 font-semibold'
                            : 'text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100'
                        }`}
                      >
                        {value}
                      </span>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {answers[question.id] === key && (
                    <div className="absolute top-3 right-3">
                      <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center shadow-lg animate-bounce">
                        <span className="text-white text-lg">✓</span>
                      </div>
                    </div>
                  )}
                </label>
              ))}

            {!question.options && (
              <div className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
                <p className="text-yellow-900 dark:text-yellow-200 font-semibold transition-colors duration-300">
                  {i18n(lang, 'optionsNotAvailable')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t-2 border-gray-200 dark:border-gray-700 rounded-b-2xl transition-colors duration-300">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="group px-8 py-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center gap-2"
            >
              <svg
                className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {i18n(lang, 'previous')}
            </button>

            <div className="flex space-x-4">
              <button
                onClick={onBack}
                className="px-8 py-4 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300 font-bold"
              >
                {i18n(lang, 'exitQuiz')}
              </button>

              <button
                onClick={
                  currentQuestion === quiz.questions.length - 1
                    ? handleSubmit
                    : handleNext
                }
                disabled={!answers[question.id] || isSubmitting}
                className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {i18n(lang, 'submitting')}
                  </>
                ) : currentQuestion === quiz.questions.length - 1 ? (
                  <>
                    {i18n(lang, 'submitQuiz')}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </>
                ) : (
                  <>
                    {i18n(lang, 'next')}
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {quiz.questions.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentQuestion
                    ? 'w-8 bg-gradient-to-r from-purple-500 to-blue-500'
                    : answers[quiz.questions[index].id]
                    ? 'w-2 bg-green-500'
                    : 'w-2 bg-gray-300'
                }`}
                title={`Question ${index + 1}${
                  answers[quiz.questions[index].id] ? ' (Answered)' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
