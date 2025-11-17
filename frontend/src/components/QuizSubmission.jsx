import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function QuizSubmission({ quiz, results, onRetake, onContinue, onBack }) {
  const { user } = useAuth();
  const [showAnimation, setShowAnimation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Debug logging for results structure
  console.log('QuizSubmission received results:', results);
  console.log('Results keys:', Object.keys(results || {}));
  console.log('Results.score:', results?.score);
  console.log('Results.maxScore:', results?.maxScore);
  console.log('Results.percentage:', results?.percentage);
  console.log('Results.timeTaken:', results?.timeTaken);
  console.log('Results.results:', results?.results);
  console.log('Results.data:', results?.data);
  console.log('Results.data keys:', Object.keys(results?.data || {}));

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setShowAnimation(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getPerformanceLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' };
    if (percentage >= 80) return { level: 'Very Good', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' };
    if (percentage >= 70) return { level: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' };
    if (percentage >= 60) return { level: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: 'border-orange-200' };
    return { level: 'Needs Improvement', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' };
  };

  const getMotivationalMessage = (percentage) => {
    if (percentage >= 90) return "Outstanding work! You've mastered this topic!";
    if (percentage >= 80) return "Great job! You have a solid understanding of this topic.";
    if (percentage >= 70) return "Good work! You're on the right track.";
    if (percentage >= 60) return "Not bad! Consider reviewing some concepts.";
    return "Don't worry! Learning takes time. Review the material and try again.";
  };

  const getAchievements = () => {
    const achievements = [];
    // Handle nested data structure
    const actualResults = results.data || results;
    const percentage = actualResults.percentage || 0;
    const score = actualResults.score || 0;
    
    // Debug logging
    console.log('getAchievements - results:', results);
    console.log('getAchievements - actualResults:', actualResults);
    console.log('getAchievements - score:', score);
    console.log('getAchievements - percentage:', percentage);
    console.log('getAchievements - achievements from backend:', actualResults.achievements);
    
    // Only show achievements if score is 3 or more
    if (score < 3) {
      console.log('Score below 3, returning empty achievements');
      return achievements; // Return empty array for scores below 3
    }

    // Use achievements from backend if available, otherwise generate them
    if (actualResults.achievements && actualResults.achievements.length > 0) {
      console.log('Using backend achievements:', actualResults.achievements);
      return actualResults.achievements;
    }

    // Fallback to frontend achievement generation
    // Score-based achievements
    if (percentage === 100) {
      achievements.push({
        id: 'perfect',
        title: 'Perfect Score!',
        description: 'You got every question right!',
        icon: '🏆',
        color: 'from-yellow-400 to-orange-500',
        rarity: 'legendary'
      });
    } else if (percentage >= 90) {
      achievements.push({
        id: 'excellent',
        title: 'Excellent Performance!',
        description: 'Outstanding understanding of the topic!',
        icon: '🥇',
        color: 'from-yellow-300 to-yellow-500',
        rarity: 'epic'
      });
    } else if (percentage >= 80) {
      achievements.push({
        id: 'great',
        title: 'Great Job!',
        description: 'You have a solid grasp of the material!',
        icon: '🥈',
        color: 'from-gray-300 to-gray-500',
        rarity: 'rare'
      });
    }

    // Speed achievements
    const timePerQuestion = actualResults.results ? actualResults.timeTaken / actualResults.results.length : 0;
    if (timePerQuestion < 30) {
      achievements.push({
        id: 'speed_demon',
        title: 'Speed Demon!',
        description: 'You answered questions quickly and accurately!',
        icon: '⚡',
        color: 'from-blue-400 to-purple-500',
        rarity: 'rare'
      });
    }

    // Category-specific achievements
    if (quiz.category === 'Email Scams') {
      achievements.push({
        id: 'email_expert',
        title: 'Email Security Expert!',
        description: 'You know how to spot email scams!',
        icon: '📧',
        color: 'from-green-400 to-blue-500',
        rarity: 'common'
      });
    } else if (quiz.category === 'Phone Scams') {
      achievements.push({
        id: 'phone_expert',
        title: 'Phone Security Expert!',
        description: 'You can identify phone scams!',
        icon: '📞',
        color: 'from-purple-400 to-pink-500',
        rarity: 'common'
      });
    }

    // Learning streak achievement
    if (percentage >= 70) {
      achievements.push({
        id: 'learner',
        title: 'Dedicated Learner!',
        description: 'Keep up the great learning!',
        icon: '📚',
        color: 'from-indigo-400 to-purple-500',
        rarity: 'common'
      });
    }

    console.log('Generated frontend achievements:', achievements);
    return achievements;
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 shadow-yellow-200';
      case 'epic': return 'border-purple-400 shadow-purple-200';
      case 'rare': return 'border-blue-400 shadow-blue-200';
      default: return 'border-green-400 shadow-green-200';
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Handle nested data structure - check if data is in results.data
  const actualResults = results.data || results;
  
  const performance = getPerformanceLevel(actualResults.percentage || 0);
  const correctAnswers = actualResults.results ? actualResults.results.filter(r => r.isCorrect).length : 0;
  const totalQuestions = actualResults.results ? actualResults.results.length : 0;
  const score = actualResults.score || 0;
  const maxScore = actualResults.maxScore || actualResults.max_score || totalQuestions;
  const percentage = actualResults.percentage || 0;
  const timeTaken = actualResults.timeTaken || actualResults.time_taken || 0;

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Celebration Header */}
      <div className={`text-center mb-8 transition-all duration-1000 ${showAnimation ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'}`}>
        <div className="relative inline-block">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {showAnimation && (
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-ping"></div>
          )}
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
        <p className="text-xl text-gray-600 mb-4">{getMotivationalMessage(percentage)}</p>
        
        {/* Attempt Information */}
        {actualResults.attemptNumber > 1 && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Attempt #{actualResults.attemptNumber}</h3>
              {actualResults.previousScore !== null && (
                <div className="text-blue-700">
                  <span className="font-medium">Previous Score: {actualResults.previousScore}/{actualResults.maxScore}</span>
                  {actualResults.improvementScore > 0 && (
                    <span className="ml-2 text-green-600 font-bold">
                      ↗️ Improved by {actualResults.improvementScore} points!
                    </span>
                  )}
                  {actualResults.improvementScore < 0 && (
                    <span className="ml-2 text-red-600">
                      ↘️ Decreased by {Math.abs(actualResults.improvementScore)} points
                    </span>
                  )}
                  {actualResults.improvementScore === 0 && (
                    <span className="ml-2 text-gray-600">
                      → Same score as last attempt
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className={`inline-block px-6 py-2 rounded-full text-lg font-semibold ${performance.bgColor} ${performance.color} ${performance.borderColor} border-2`}>
          {performance.level}
        </div>
      </div>

      {/* Achievements Section */}
      {(() => {
        const achievements = getAchievements();
        if (achievements.length > 0) {
          return (
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">🏆 Achievements Unlocked!</h2>
                <p className="text-gray-600">You've earned {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}!</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
                {achievements.map((achievement, index) => (
                  <div
                    key={achievement.id || index}
                    className={`p-4 rounded-xl border-2 ${getRarityColor(achievement.rarity || 'common')} shadow-lg bg-gradient-to-r ${achievement.color || 'from-green-400 to-blue-500'} text-white transform transition-all duration-300 hover:scale-105`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-3xl flex-shrink-0">{achievement.icon || '🏆'}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm mb-1 break-words">{achievement.title || 'Achievement'}</div>
                        <div className="text-xs opacity-90 break-words">{achievement.description || 'Great job!'}</div>
                        <div className="text-xs font-semibold uppercase tracking-wide opacity-75 mt-1">
                          {achievement.rarity || 'common'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        }
        return null;
      })()}

      {/* Quick Actions for Low Scores */}
      {percentage < 70 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
          <div className="text-center">
            <h3 className="text-lg font-bold text-red-800 mb-2">Want to improve your score?</h3>
            <p className="text-red-700 mb-4">Don't worry! Practice makes perfect. You can retake this quiz anytime.</p>
            <button
              onClick={onRetake}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🔄 Retake Quiz Now
            </button>
          </div>
        </div>
      )}

      {/* Main Results Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        {/* Score Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${performance.color}`}>
              {score}/{maxScore}
            </div>
            <div className="text-gray-600 font-semibold">Score</div>
          </div>
          
          <div className="text-center">
            <div className={`text-5xl font-bold mb-2 ${performance.color}`}>
              {percentage}%
            </div>
            <div className="text-gray-600 font-semibold">Percentage</div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 text-purple-600">
              {formatTime(timeTaken)}
            </div>
            <div className="text-gray-600 font-semibold">Time Taken</div>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2 text-blue-600">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-gray-600 font-semibold">Correct</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-600">Overall Progress</span>
            <span className="text-sm font-semibold text-gray-600">{percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-1000 ${showAnimation ? 'w-full' : 'w-0'} ${
                percentage >= 80 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                percentage >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                'bg-gradient-to-r from-red-400 to-red-600'
              }`}
              style={{ width: showAnimation ? `${percentage}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Quiz Info */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-gray-900">{quiz.title}</div>
              <div className="text-gray-600">Quiz Title</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{quiz.category || 'General'}</div>
              <div className="text-gray-600">Category</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{quiz.difficulty || 'Easy'}</div>
              <div className="text-gray-600">Difficulty</div>
            </div>
          </div>
        </div>
      </div>


      {/* Detailed Question Review */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Question Review</h2>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>

        {showDetails && (
          <div className="space-y-6">
            {actualResults.results ? actualResults.results.map((result, index) => {
              const isCorrect = result.isCorrect;
              // Find the corresponding question data to show full question and options
              const questionData = quiz.questions && quiz.questions[index];
              
              return (
                <div key={index} className={`p-6 rounded-xl border-l-4 ${
                  isCorrect 
                    ? 'bg-green-50 border-green-400' 
                    : 'bg-red-50 border-red-400'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <span className="text-lg font-semibold">Question {index + 1}</span>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.points} point{result.points !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  {/* Question Text */}
                  {questionData && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-600 mb-2">Question:</div>
                      <div className="p-3 bg-gray-50 rounded-lg text-gray-800">
                        {questionData.question_text}
                      </div>
                    </div>
                  )}

                  {/* Answer Options (if available) */}
                  {questionData && questionData.options && (
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-gray-600 mb-2">Options:</div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(questionData.options).map(([key, value]) => (
                          <div key={key} className={`p-2 rounded-lg text-sm ${
                            key === result.correctAnswer 
                              ? 'bg-green-100 text-green-800 font-semibold' 
                              : key === result.userAnswer && !isCorrect
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            <span className="font-medium">{key}.</span> {value}
                            {key === result.correctAnswer && <span className="ml-2 text-green-600">✓</span>}
                            {key === result.userAnswer && !isCorrect && <span className="ml-2 text-red-600">✗</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                </div>
              );
            }) : (
              <div className="text-center py-8 text-gray-500">
                <p>No detailed results available.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h2>
        
        {percentage < 70 ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <svg className="w-6 h-6 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <div className="font-semibold text-yellow-800">Review Recommended</div>
                <div className="text-yellow-700">Consider reviewing the learning materials and taking the quiz again to improve your understanding.</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <svg className="w-6 h-6 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="font-semibold text-green-800">Great Job!</div>
                <div className="text-green-700">You've demonstrated good understanding of this topic. Consider exploring more advanced quizzes.</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">What would you like to do next?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Retake Quiz Button */}
          <button
            onClick={onRetake}
            className="px-6 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center space-y-2"
          >
            <span className="text-2xl">🔄</span>
            <span>Take Quiz Again</span>
            <span className="text-xs opacity-90">Practice and improve your score</span>
          </button>
          
          {/* Continue Learning Button */}
          <button
            onClick={onContinue}
            className="px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center space-y-2"
          >
            <span className="text-2xl">📚</span>
            <span>Continue Learning</span>
            <span className="text-xs opacity-90">Explore more educational content</span>
          </button>
          
          {/* Back to Quizzes Button */}
          <button
            onClick={onBack}
            className="px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl flex flex-col items-center space-y-2"
          >
            <span className="text-2xl">📋</span>
            <span>Back to Quizzes</span>
            <span className="text-xs opacity-90">Return to quiz selection</span>
          </button>
        </div>
      </div>

      {/* Perfect Score Badge (if applicable) */}
      {percentage >= 90 && (
        <div className="mt-8 text-center">
          <div className="inline-block p-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-2xl">
            <div className="text-6xl mb-2">🏆</div>
            <div className="text-xl font-bold text-white">Perfect Score!</div>
            <div className="text-yellow-100">You've earned the Master Badge!</div>
          </div>
        </div>
      )}
    </div>
  );
}