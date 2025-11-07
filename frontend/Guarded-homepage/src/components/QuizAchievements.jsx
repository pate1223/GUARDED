import React, { useState, useEffect } from 'react';

export default function QuizAchievements({ results, quiz, onClose }) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentAchievement, setCurrentAchievement] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const getAchievements = () => {
    const achievements = [];
    const percentage = results.percentage;

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
    const timePerQuestion = results.timeTaken / results.results.length;
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
    if (results.percentage >= 70) {
      achievements.push({
        id: 'learner',
        title: 'Dedicated Learner!',
        description: 'Keep up the great learning!',
        icon: '📚',
        color: 'from-indigo-400 to-purple-500',
        rarity: 'common'
      });
    }

    return achievements;
  };

  const achievements = getAchievements();

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 shadow-yellow-200';
      case 'epic': return 'border-purple-400 shadow-purple-200';
      case 'rare': return 'border-blue-400 shadow-blue-200';
      default: return 'border-green-400 shadow-green-200';
    }
  };

  if (!showCelebration || achievements.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Achievements Unlocked!</h2>
            <p className="text-gray-600">You've earned {achievements.length} achievement{achievements.length !== 1 ? 's' : ''}!</p>
          </div>

          {/* Achievements List */}
          <div className="space-y-6 mb-8">
            {achievements.map((achievement, index) => (
              <div
                key={achievement.id}
                className={`p-6 rounded-xl border-2 ${getRarityColor(achievement.rarity)} shadow-lg bg-gradient-to-r ${achievement.color} text-white transform transition-all duration-500 hover:scale-105`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="text-xl font-bold mb-1">{achievement.title}</div>
                    <div className="text-sm opacity-90">{achievement.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold uppercase tracking-wide opacity-75">
                      {achievement.rarity}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Your Performance</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-purple-600">{results.percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.floor(results.timeTaken / 60)}:{(results.timeTaken % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-600">Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {results.results.filter(r => r.isCorrect).length}/{results.results.length}
                </div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center">
            <button
              onClick={onClose}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🎉 View My Results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}