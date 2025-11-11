import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function QuizResults({ quiz, results, onBack }) {
  const { isAuthenticated } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log('QuizResults component received data:', { quiz, results });
  }, [quiz, results]);

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

  const handleExit = () => {
    if (onBack) {
      onBack();
    }
  };

  if (!quiz || !results || !quiz.questions) {
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz results...</p>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  
  // Parse the answers from the results
  let parsedAnswers = [];
  let rawAnswers = {};
  
  // Try to get results array first (processed answers)
  if (results.results && Array.isArray(results.results)) {
    parsedAnswers = results.results;
  }
  
  // If no results array, try to parse the raw answers
  if (parsedAnswers.length === 0 && results.answers) {
    try {
      rawAnswers = typeof results.answers === 'string' ? JSON.parse(results.answers) : results.answers;
      console.log('Raw answers from backend:', rawAnswers);
    } catch (error) {
      console.error('Error parsing answers:', error);
    }
  }
  
  // Get the result for current question
  const result = parsedAnswers[currentQuestion] || null;
  
  // Debug the result data
  console.log('Current question result:', {
    result,
    currentQuestion,
    parsedAnswers,
    rawAnswers,
    resultsAnswers: results.answers,
    resultsResults: results.results
  });
  
  let isCorrect = result ? result.isCorrect : false;
  let actualUserAnswer = result ? result.userAnswer : null;
  let actualCorrectAnswer = result ? result.correctAnswer : null;
  
  // If we have raw answers but no processed results, try to match with current question
  if (!actualUserAnswer && rawAnswers && currentQ && currentQ.id) {
    actualUserAnswer = rawAnswers[currentQ.id];
    console.log('Got user answer from raw answers:', actualUserAnswer);
    console.log('Raw answers object:', rawAnswers);
    console.log('Current question ID:', currentQ.id);
  }
  
  // Get correct answer from question data
  if (!actualCorrectAnswer && currentQ && currentQ.correct_answer) {
    actualCorrectAnswer = currentQ.correct_answer;
    console.log('Got correct answer from question data:', actualCorrectAnswer);
  } else {
    console.log('No correct answer found. Question data:', currentQ);
  }
  
  // Calculate isCorrect if we don't have it from results
  if (!result && actualUserAnswer && actualCorrectAnswer) {
    isCorrect = actualUserAnswer === actualCorrectAnswer;
    console.log('Calculated isCorrect:', isCorrect);
  }
  
  console.log('Final answer values:', {
    actualUserAnswer,
    actualCorrectAnswer,
    isCorrect,
    currentQCorrectAnswer: currentQ?.correct_answer,
    currentQId: currentQ?.id
  });

  // Debug logging
  console.log('QuizResults Debug:', {
    currentQ,
    currentQuestion,
    quizQuestions: quiz.questions,
    result,
    results,
    parsedAnswers,
    currentQOptions: currentQ?.options,
    currentQOptionsType: typeof currentQ?.options,
    currentQKeys: currentQ ? Object.keys(currentQ) : null
  });

  // Safety checks
  if (!currentQ) {
    console.error('Current question is undefined:', { currentQuestion, questions: quiz.questions });
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">Question data not found.</p>
        </div>
      </div>
    );
  }

  // Handle different options formats (array or object)
  let optionsArray = [];
  if (currentQ.options) {
    if (Array.isArray(currentQ.options)) {
      optionsArray = currentQ.options;
    } else if (typeof currentQ.options === 'object') {
      // Convert object to array if it's an object with keys like A, B, C, D
      optionsArray = Object.values(currentQ.options);
    }
  }

  if (optionsArray.length === 0) {
    console.error('Question options are not available or empty:', currentQ);
    return (
      <div className="max-w-4xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">Question options not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#f3f2fd]">
      <div className="max-w-4xl w-full mx-auto p-6">
        {/* Quiz Card - Same style as the quiz interface */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* Header - Quiz title and progress */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-[#5c52ff]">{quiz.title}</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {quiz.questions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#5c52ff]">{formatTime(results.time_taken || 0)}</div>
              <p className="text-gray-600">Time taken</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div 
              className="bg-gradient-to-r from-[#6a5cff] to-[#5c52ff] h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            ></div>
          </div>


          {/* Question Result Summary */}
          <div className={`p-4 rounded-xl mb-6 ${
            isCorrect 
              ? 'bg-green-100 border-2 border-green-300' 
              : 'bg-red-100 border-2 border-red-300'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold ${
                isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {isCorrect ? '✓' : '✗'}
              </div>
              <div>
                <h3 className={`font-bold text-lg ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
                </h3>
                <p className={`text-sm ${
                  isCorrect ? 'text-green-700' : 'text-red-700'
                }`}>
                  {isCorrect 
                    ? `Well done! You selected "${actualUserAnswer || 'No answer'}" which is the correct answer.` 
                    : `You selected "${actualUserAnswer || 'No answer'}" but the correct answer was "${actualCorrectAnswer || 'Unknown'}"`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {currentQ.question_text || currentQ.question}
            </h2>

            {/* Answer Options - Show user selection */}
            <div className="space-y-4">
              {optionsArray.map((option, index) => {
                const isUserAnswer = actualUserAnswer === option;
                const isCorrectOption = actualCorrectAnswer === option;
                
                // Determine styling based on user selection
                let optionStyle = 'bg-gray-50 border-2 border-gray-300';
                let textStyle = 'text-gray-600';
                let radioStyle = 'border-gray-400 bg-gray-400';
                
                if (isUserAnswer) {
                  // User's selected answer - highlighted
                  optionStyle = 'bg-blue-100 border-2 border-blue-500';
                  textStyle = 'text-blue-900 font-semibold';
                  radioStyle = 'border-blue-600 bg-blue-600';
                }

                return (
                  <div
                    key={index}
                    className={`block p-4 rounded-xl ${optionStyle}`}
                  >
                    <div className="flex items-center space-x-4">
                      {/* Radio button */}
                      <div className={`w-6 h-6 rounded-full border-2 ${radioStyle} flex items-center justify-center`}>
                        {isUserAnswer && <span className="text-white text-sm font-bold">✓</span>}
                      </div>
                      
                      {/* Option text */}
                      <span className={`font-medium ${textStyle} flex-1`}>
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons - Same style as quiz interface */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600 shadow-lg hover:shadow-xl'
              }`}
            >
              ← Previous
            </button>

            <button
              onClick={handleExit}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all shadow-lg hover:shadow-xl"
            >
              Exit Quiz
            </button>

            <button
              onClick={handleNext}
              disabled={currentQuestion === quiz.questions.length - 1}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                currentQuestion === quiz.questions.length - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-[#5c52ff] text-white hover:bg-[#4a42cc] shadow-lg hover:shadow-xl'
              }`}
            >
              {currentQuestion === quiz.questions.length - 1 ? 'Last Question' : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}