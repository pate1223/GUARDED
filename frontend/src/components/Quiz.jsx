import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import QuizSubmission from './QuizSubmission';

export default function Quiz({ quiz, onComplete, onBack }) {
  const { isAuthenticated } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz?.time_limit ? quiz.time_limit * 60 : 600); // default 10 min
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('🧩 Quiz loaded:', quiz);
    if (quiz?.questions) console.log('📋 Questions:', quiz.questions);
  }, [quiz]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
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
      alert('Please sign in to submit your quiz answers.');
      return;
    }

    setIsSubmitting(true);
    try {
      const timeTaken = (quiz.time_limit * 60) - timeLeft;
      const result = await apiService.submitQuiz(quiz.id, answers, timeTaken);

      if (result.success) {
        console.log('✅ Quiz submitted:', result);
        setResults(result.data);
        setShowResults(true);
      } else {
        alert(result.error || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('❌ Quiz submission failed:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Show results
  if (showResults && results) {
    return (
      <QuizSubmission
        quiz={quiz}
        results={results}
        onRetake={() => {
          setShowResults(false);
          setResults(null);
          setCurrentQuestion(0);
          setAnswers({});
          setTimeLeft(quiz?.time_limit ? quiz.time_limit * 60 : 600);
        }}
        onContinue={() => onComplete && onComplete(results)}
        onBack={onBack}
      />
    );
  }

  // Handle loading or invalid quiz data
  if (!quiz || !quiz.questions || !quiz.questions[currentQuestion]) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Loading Quiz...</h2>
          <p className="text-gray-600">Please wait while we load the quiz questions.</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{quiz.title}</h2>
            <p className="text-gray-600">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${timeLeft < 60 ? 'text-red-600' : 'text-gray-900'}`}>
              {formatTime(timeLeft)}
            </div>
            <div className="text-sm text-gray-500">Time remaining</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
          <div
            className="bg-[#5c52ff] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Question */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            {question.question_text || 'Question not available'}
          </h3>

          <div className="space-y-3">
            {question.options ? (
              Object.entries(question.options).map(([key, value]) => (
                <label
                  key={key}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    answers[question.id] === key
                      ? 'border-[#5c52ff] bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question_${question.id}`}
                    value={key}
                    checked={answers[question.id] === key}
                    onChange={() => handleAnswerSelect(question.id, key)}
                    className="sr-only"
                  />
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      answers[question.id] === key
                        ? 'border-[#5c52ff] bg-[#5c52ff]'
                        : 'border-gray-300'
                    }`}
                  >
                    {answers[question.id] === key && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium">{key}. {value}</span>
                </label>
              ))
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  Question options are not available. Please try refreshing the page.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
          >
            ← Previous
          </button>

          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
            >
              Exit Quiz
            </button>

            <button
              onClick={currentQuestion === quiz.questions.length - 1 ? handleSubmit : handleNext}
              disabled={!answers[question.id] || isSubmitting}
              className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {isSubmitting
                ? 'Submitting...'
                : currentQuestion === quiz.questions.length - 1
                ? 'Submit Quiz'
                : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
