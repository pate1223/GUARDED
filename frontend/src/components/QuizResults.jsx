import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function QuizResults({ quiz, results, onBack, onRetry }) {
  const { isAuthenticated } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  if (!quiz || !results || !quiz.questions) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading quiz results...</p>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  // Parse answers from results
  let parsedAnswers = [];
  let rawAnswers = {};

  if (results.results && Array.isArray(results.results)) {
    parsedAnswers = results.results;
  }

  if (parsedAnswers.length === 0 && results.answers) {
    try {
      rawAnswers = typeof results.answers === 'string' ? JSON.parse(results.answers) : results.answers;
    } catch (error) {
      console.error('Error parsing answers:', error);
    }
  }

  const result = parsedAnswers[currentQuestion] || null;

  let isCorrect = result ? result.isCorrect : false;
  let actualUserAnswer = result ? result.userAnswer : null;
  let actualCorrectAnswer = result ? result.correctAnswer : null;

  if (!actualUserAnswer && rawAnswers && currentQ && currentQ.id) {
    actualUserAnswer = rawAnswers[currentQ.id];
  }

  if (!actualCorrectAnswer && currentQ && currentQ.correct_answer) {
    actualCorrectAnswer = currentQ.correct_answer;
  }

  if (!result && actualUserAnswer && actualCorrectAnswer) {
    isCorrect = actualUserAnswer === actualCorrectAnswer;
  }

  if (!currentQ) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 transition-colors duration-300">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Question data not found.</p>
        </div>
      </div>
    );
  }

  // Handle different options formats
  let optionsObj = {};
  if (currentQ.options) {
    if (typeof currentQ.options === 'object' && !Array.isArray(currentQ.options)) {
      optionsObj = currentQ.options;
    } else if (Array.isArray(currentQ.options)) {
      optionsObj = currentQ.options.reduce((acc, opt, idx) => {
        acc[String.fromCharCode(65 + idx)] = opt;
        return acc;
      }, {});
    }
  }

  const optionKeys = Object.keys(optionsObj);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 py-8">
      <div className="max-w-4xl w-full mx-auto p-6">
        {/* Quiz Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 transition-colors duration-300">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">{quiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
                Question {currentQuestion + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">
                {results.percentage}%
              </div>
              <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Your Score</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-8 transition-colors duration-300">
            <div
              className="bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Result Summary */}
          <div className={`p-4 rounded-xl mb-6 transition-colors duration-300 ${
            isCorrect
              ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-600'
              : 'bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-600'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-colors duration-300 ${
                isCorrect
                  ? 'bg-green-500 dark:bg-green-600 text-white'
                  : 'bg-red-500 dark:bg-red-600 text-white'
              }`}>
                {isCorrect ? '✓' : '✗'}
              </div>
              <span className={`font-semibold transition-colors duration-300 ${
                isCorrect
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}>
                {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors duration-300">
              {currentQ.question_text}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {optionKeys.map((key) => {
              const isUserAnswer = actualUserAnswer === key;
              const isCorrectAnswer = actualCorrectAnswer === key;

              let optionStyle = 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600';
              if (isCorrectAnswer) {
                optionStyle = 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600';
              } else if (isUserAnswer && !isCorrect) {
                optionStyle = 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600';
              }

              return (
                <div
                  key={key}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${optionStyle}`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-300 ${
                      isCorrectAnswer
                        ? 'bg-green-500 dark:bg-green-600 text-white'
                        : isUserAnswer && !isCorrect
                        ? 'bg-red-500 dark:bg-red-600 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}>
                      {key}
                    </span>
                    <span className={`flex-1 transition-colors duration-300 ${
                      isCorrectAnswer
                        ? 'font-semibold text-green-900 dark:text-green-100'
                        : isUserAnswer && !isCorrect
                        ? 'font-semibold text-red-900 dark:text-red-100'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}>
                      {optionsObj[key]}
                    </span>
                    {isCorrectAnswer && (
                      <span className="text-green-600 dark:text-green-400 font-bold transition-colors duration-300">✓ Correct</span>
                    )}
                    {isUserAnswer && !isCorrect && (
                      <span className="text-red-600 dark:text-red-400 font-bold transition-colors duration-300">Your Answer</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation (if available) */}
          {currentQ.explanation && (
            <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl transition-colors duration-300">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 dark:bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                  <span className="text-white text-lg">💡</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-1 transition-colors duration-300">Explanation</h3>
                  <p className="text-blue-800 dark:text-blue-200 transition-colors duration-300">{currentQ.explanation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                currentQuestion === 0
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
              }`}
            >
              ← Previous
            </button>

            <div className="flex space-x-3">
              {currentQuestion === quiz.questions.length - 1 ? (
                <>
                  {onRetry && (
                    <button
                      onClick={onRetry}
                      className="px-6 py-3 rounded-xl font-semibold bg-yellow-500 dark:bg-yellow-600 text-white hover:bg-yellow-600 dark:hover:bg-yellow-700 transition-all duration-300 shadow-lg dark:shadow-yellow-500/20"
                    >
                      🔄 Retry Quiz
                    </button>
                  )}
                  <button
                    onClick={onBack}
                    className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg dark:shadow-purple-500/30"
                  >
                    Exit Review
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 text-white hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg dark:shadow-purple-500/30"
                >
                  Next →
                </button>
              )}
            </div>
          </div>

          {/* Question Navigation Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {quiz.questions.map((_, idx) => {
              const questionResult = parsedAnswers[idx];
              const questionIsCorrect = questionResult ? questionResult.isCorrect : false;

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    idx === currentQuestion
                      ? 'w-8 bg-purple-600 dark:bg-purple-500'
                      : questionIsCorrect
                      ? 'bg-green-500 dark:bg-green-600'
                      : 'bg-red-500 dark:bg-red-600'
                  }`}
                  aria-label={`Go to question ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}