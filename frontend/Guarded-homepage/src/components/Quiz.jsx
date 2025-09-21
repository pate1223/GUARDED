import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Quiz({ quiz, onComplete, onBack }) {
  const { isAuthenticated } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(quiz?.time_limit ? quiz.time_limit * 60 : 600); // Convert to seconds, default 10 min
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);

  // Debug logging
  useEffect(() => {
    console.log('Quiz component received data:', quiz);
    if (quiz?.questions) {
      console.log('Questions data:', quiz.questions);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, showResults]);

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
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
        setResults(result.data);
        setShowResults(true);
      } else {
        alert(result.error || 'Failed to submit quiz');
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
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

  if (showResults && results) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Completed!</h2>
            <p className="text-gray-600">Here are your results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{results.score}/{results.maxScore}</div>
              <div className="text-blue-800 font-semibold">Score</div>
            </div>
            <div className="bg-green-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">{results.percentage}%</div>
              <div className="text-green-800 font-semibold">Percentage</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">{formatTime(results.timeTaken)}</div>
              <div className="text-purple-800 font-semibold">Time Taken</div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-xl font-bold text-gray-900">Question Review</h3>
            {results.results.map((result, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                result.isCorrect ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Question {index + 1}</span>
                  <span className={`px-2 py-1 rounded text-sm font-semibold ${
                    result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {result.isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  <p><strong>Your answer:</strong> {result.userAnswer || 'Not answered'}</p>
                  <p><strong>Correct answer:</strong> {result.correctAnswer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Back to Quizzes
            </button>
            <button
              onClick={() => onComplete && onComplete(results)}
              className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition"
            >
              Continue Learning
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
            <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
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
          <h3 className="text-xl font-semibold text-gray-900 mb-6">{question.question_text || 'Question not available'}</h3>
          
          <div className="space-y-3">
            {question.options && Object.entries(question.options).map(([key, value]) => (
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
                <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  answers[question.id] === key
                    ? 'border-[#5c52ff] bg-[#5c52ff]'
                    : 'border-gray-300'
                }`}>
                  {answers[question.id] === key && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">{key}. {value}</span>
              </label>
            ))}
            {!question.options && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">Question options are not available. Please try refreshing the page.</p>
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
              {isSubmitting ? 'Submitting...' : currentQuestion === quiz.questions.length - 1 ? 'Submit Quiz' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
