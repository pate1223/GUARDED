import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function Achievements() {
  const { isAuthenticated } = useAuth();
  const [achievements, setAchievements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAchievements();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const result = await apiService.getUserAchievements();
      if (result.success) {
        setAchievements(result.data.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      console.error('Error fetching achievements:', error);
      setError('Failed to fetch achievements');
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 dark:border-yellow-500 shadow-yellow-200 dark:shadow-yellow-900/50 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20';
      case 'epic': return 'border-purple-400 dark:border-purple-500 shadow-purple-200 dark:shadow-purple-900/50 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20';
      case 'rare': return 'border-blue-400 dark:border-blue-500 shadow-blue-200 dark:shadow-blue-900/50 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20';
      default: return 'border-green-400 dark:border-green-500 shadow-green-200 dark:shadow-green-900/50 bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/20 dark:to-teal-900/20';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'phishing': return '📧';
      case 'phone_scams': return '📞';
      case 'social_media': return '👥';
      default: return '🎯';
    }
  };

  const getCategoryTitle = (category) => {
    switch (category) {
      case 'phishing': return 'Email Security';
      case 'phone_scams': return 'Phone Security';
      case 'social_media': return 'Social Media Security';
      default: return 'General';
    }
  };

  const filteredAchievements = () => {
    if (!achievements) return [];

    if (selectedCategory === 'all') {
      return achievements.allAchievements;
    }

    return achievements.achievementsByCategory[selectedCategory] || [];
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 text-center transition-colors duration-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">Sign In Required</h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Please sign in to view your achievements.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 text-center transition-colors duration-300">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 dark:border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 text-center transition-colors duration-300">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4 transition-colors duration-300">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">🏆 Your Achievements</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors duration-300">
          You've earned {achievements?.totalAchievements || 0} achievement{achievements?.totalAchievements !== 1 ? 's' : ''}!
        </p>
      </div>


      {/* Achievement Stats */}
      {achievements && achievements.totalAchievements > 0 && (
        <div className="mt-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 transition-colors duration-300">
          <h2 className="text-xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">Achievement Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 transition-colors duration-300">{achievements.totalAchievements}</div>
              <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Total Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                {Object.keys(achievements.achievementsByCategory).length}
              </div>
              <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Categories Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 transition-colors duration-300">
                {achievements.allAchievements.filter(a => a.rarity === 'legendary' || a.rarity === 'epic').length}
              </div>
              <div className="text-gray-600 dark:text-gray-400 transition-colors duration-300">Rare Achievements</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-6 mb-8 mt-8 transition-colors duration-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-purple-300 mb-4 transition-colors duration-300">Filter by Category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === 'all'
                ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-lg dark:shadow-purple-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            🎯 All ({achievements?.totalAchievements || 0})
          </button>
          <button
            onClick={() => setSelectedCategory('phishing')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === 'phishing'
                ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-lg dark:shadow-purple-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            📧 Email Security ({achievements?.achievementsByCategory?.phishing?.length || 0})
          </button>
          <button
            onClick={() => setSelectedCategory('phone_scams')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === 'phone_scams'
                ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-lg dark:shadow-purple-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            📞 Phone Security ({achievements?.achievementsByCategory?.phone_scams?.length || 0})
          </button>
          <button
            onClick={() => setSelectedCategory('social_media')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              selectedCategory === 'social_media'
                ? 'bg-purple-600 dark:bg-purple-700 text-white shadow-lg dark:shadow-purple-500/30'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            👥 Social Media ({achievements?.achievementsByCategory?.social_media?.length || 0})
          </button>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-xl dark:shadow-purple-500/20 border border-gray-200/50 dark:border-gray-700/50 p-8 transition-colors duration-300">
        {filteredAchievements().length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-purple-300 mb-2 transition-colors duration-300">No Achievements Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              {selectedCategory === 'all'
                ? "Complete quizzes with a score of 3 or more to start earning achievements!"
                : `Complete ${getCategoryTitle(selectedCategory)} quizzes with a score of 3 or more to earn achievements!`
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements().map((achievement, index) => (
              <div
                key={`${achievement.id}-${achievement.quizTitle}-${index}`}
                className={`p-6 rounded-xl border-2 ${getRarityColor(achievement.rarity)} shadow-lg transform transition-all duration-300 hover:scale-105`}
              >
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 transition-colors duration-300">{achievement.title}</h3>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 transition-colors duration-300">
                        {achievement.rarity}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 transition-colors duration-300">{achievement.description}</p>

                    {/* Achievement Details */}
                    <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300">
                      <div className="flex items-center space-x-2">
                        <span>{getCategoryIcon(achievement.quizCategory)}</span>
                        <span>{achievement.quizTitle}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Score: {achievement.percentage}%</span>
                        <span>Attempt #{achievement.attemptNumber}</span>
                      </div>
                      <div className="text-gray-500 dark:text-gray-500">
                        Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}