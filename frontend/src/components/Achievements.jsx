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
      case 'legendary': return 'border-yellow-400 shadow-yellow-200 bg-gradient-to-r from-yellow-100 to-orange-100';
      case 'epic': return 'border-purple-400 shadow-purple-200 bg-gradient-to-r from-purple-100 to-pink-100';
      case 'rare': return 'border-blue-400 shadow-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100';
      default: return 'border-green-400 shadow-green-200 bg-gradient-to-r from-green-100 to-teal-100';
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
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h2>
          <p className="text-gray-600">Please sign in to view your achievements.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading achievements...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">🏆 Your Achievements</h1>
        <p className="text-xl text-gray-600">
          You've earned {achievements?.totalAchievements || 0} achievement{achievements?.totalAchievements !== 1 ? 's' : ''}!
        </p>
      </div>


      {/* Achievement Stats */}
      {achievements && achievements.totalAchievements > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Achievement Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{achievements.totalAchievements}</div>
              <div className="text-gray-600">Total Achievements</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {Object.keys(achievements.achievementsByCategory).length}
              </div>
              <div className="text-gray-600">Categories Mastered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {achievements.allAchievements.filter(a => a.rarity === 'legendary' || a.rarity === 'epic').length}
              </div>
              <div className="text-gray-600">Rare Achievements</div>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Filter by Category</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🎯 All ({achievements?.totalAchievements || 0})
          </button>
          <button
            onClick={() => setSelectedCategory('phishing')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === 'phishing'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📧 Email Security ({achievements?.achievementsByCategory?.phishing?.length || 0})
          </button>
          <button
            onClick={() => setSelectedCategory('phone_scams')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === 'phone_scams'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📞 Phone Security ({achievements?.achievementsByCategory?.phone_scams?.length || 0})
          </button>
          <button
            onClick={() => setSelectedCategory('social_media')}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === 'social_media'
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            👥 Social Media ({achievements?.achievementsByCategory?.social_media?.length || 0})
          </button>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {filteredAchievements().length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Achievements Yet</h3>
            <p className="text-gray-600">
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
                      <h3 className="font-bold text-lg text-gray-900">{achievement.title}</h3>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {achievement.rarity}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{achievement.description}</p>
                    
                    {/* Achievement Details */}
                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span>{getCategoryIcon(achievement.quizCategory)}</span>
                        <span>{achievement.quizTitle}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Score: {achievement.percentage}%</span>
                        <span>Attempt #{achievement.attemptNumber}</span>
                      </div>
                      <div className="text-gray-500">
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