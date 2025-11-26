import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';

export default function UserProfile({ setView }) {
  const { user, userInfo, isAuthenticated } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetQuizConfirm, setShowResetQuizConfirm] = useState(false);

  const [photoUrl, setPhotoUrl] = useState('');
  const [photoUrlInput, setPhotoUrlInput] = useState('');

  const [badges, setBadges] = useState([]);
  const [loadingBadges, setLoadingBadges] = useState(false);

  const [achievements, setAchievements] = useState([]);
  const [loadingAchievements, setLoadingAchievements] = useState(false);

  const [quizHistory, setQuizHistory] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Quiz settings
  const [quizSettings, setQuizSettings] = useState({
    shuffleQuestions: true,
    shuffleAnswers: true,
    showCorrectAnswers: true,
    allowRetry: true,
    autoSaveProgress: true
  });

  // Notifications
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inWebNotifications: true,
    weeklySummary: true,
    quizAlerts: true
  });

  // ----------------------------
  // Load initial user data
  // ----------------------------
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user?.displayName || userInfo?.user_id || '',
        email: user?.email || ''
      }));
      setPhotoUrl(user?.photoURL || userInfo?.photo_url || '');
    }
  }, [user, userInfo]);

  // ----------------------------
  // Load Badges + Achievements
  // ----------------------------
  useEffect(() => {
    if (user) {
      loadUserBadges();
      loadAchievements();
    }
  }, [user]);

  const loadUserBadges = async () => {
    setLoadingBadges(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/users/badges', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setBadges(data.badges || []);
    } catch (e) {
      console.error('Failed to load badges:', e);
    } finally {
      setLoadingBadges(false);
    }
  };

  const loadAchievements = async () => {
    setLoadingAchievements(true);
    try {
      const result = await apiService.getUserAchievements();
      if (result.success && result.data?.data) {
        const all = result.data.data.allAchievements || [];

        // Remove duplicates by title
        const seen = new Set();
        const unique = [];
        all.forEach(a => {
          if (!seen.has(a.title)) {
            seen.add(a.title);
            unique.push(a);
          }
        });
        setAchievements(unique);
      }
    } catch (e) {
      console.error('Failed to load achievements:', e);
    } finally {
      setLoadingAchievements(false);
    }
  };

  // ----------------------------
  // Quiz History Loading
  // ----------------------------
  useEffect(() => {
    if (activeTab === 'quiz-references') loadQuizHistory();
  }, [activeTab]);

  const loadQuizHistory = async () => {
    setLoadingQuizzes(true);
    try {
      const res = await apiService.getUserProgress();
      if (res.success) setQuizHistory(res.data.progress || []);
    } catch (e) {
      console.error('Failed to load quiz history:', e);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  // ----------------------------
  // Helpers
  // ----------------------------
  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'legendary': return 'border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50';
      case 'epic':      return 'border-purple-400 bg-gradient-to-br from-purple-50 to-pink-50';
      case 'rare':      return 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50';
      default:          return 'border-green-400 bg-gradient-to-br from-green-50 to-teal-50';
    }
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors 
        focus:outline-none focus:ring-2 focus:ring-[#5c52ff] 
        ${enabled ? 'bg-[#5c52ff]' : 'bg-gray-300'}`}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform 
          ${enabled ? 'translate-x-7' : 'translate-x-1'}`}
      />
    </button>
  );

  // ----------------------------
  // Profile Changes
  // ----------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!formData.name.trim()) {
      alert('Please enter a valid name');
      return;
    }

    setIsSaving(true);
    try {
      const result = await apiService.updateProfile(formData.name.trim());

      if (result.success) {
        // Update Firebase profile as well
        if (user) {
          await user.updateProfile({ displayName: formData.name.trim() });
          await user.getIdToken(true); // Refresh token
        }

        alert('Profile updated successfully! Reloading...');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        alert(result.error || 'Profile update failed.');
      }
    } catch (e) {
      console.error('Error saving profile:', e);
      alert('An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------
  // Password Change
  // ----------------------------
  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match.');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters.');
      return;
    }

    setIsSaving(true);
    // TODO: Implement backend + Firebase password change
    setTimeout(() => {
      alert('Password changed successfully!');
      setShowPasswordChange(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      setIsSaving(false);
    }, 1000);
  };

  // ----------------------------
  // Photo Upload
  // ----------------------------
  const handlePhotoUpload = async () => {
    if (!photoUrlInput.trim()) {
      alert('Enter a photo URL');
      return;
    }

    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/profile/photo', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photoUrl: photoUrlInput })
      });

      const data = await res.json();
      if (data.success) {
        setPhotoUrl(photoUrlInput);
        setShowPhotoUpload(false);
        setPhotoUrlInput('');
        alert('Photo updated successfully!');
      } else {
        alert(data.message || 'Failed to update photo.');
      }
    } catch (e) {
      console.error(e);
      alert('Error updating photo.');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------
  // Delete Account
  // ----------------------------
  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/profile', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();

      if (data.success) {
        const { signOutUser } = await import('../services/firebase');
        await signOutUser();
        window.location.href = '/';
      } else {
        alert(data.message || 'Failed to delete account.');
      }
    } catch (e) {
      console.error(e);
      alert('Error deleting account.');
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  // ----------------------------
  // Reset Quiz Progress
  // ----------------------------
  const handleResetQuizProgress = async () => {
    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/quizzes/progress/user', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        alert(`Reset ${data.deletedCount} quizzes.`);
        loadQuizHistory();
        setShowResetQuizConfirm(false);
      } else {
        alert(data.message || 'Reset failed.');
      }
    } catch (e) {
      console.error(e);
      alert('Error resetting quizzes.');
    } finally {
      setIsSaving(false);
    }
  };

  // ----------------------------
  // UI Rendering
  // ----------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your profile</h1>
          <button
            onClick={() => setView('signin')}
            className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1]"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-8">

      <div className="max-w-5xl mx-auto px-4">

        {/* -------------------- PROFILE CARD -------------------- */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* TABS HEADER */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-8 pt-6">
              <div className="flex gap-8">
                {['profile', 'quiz-references', 'notifications'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 px-2 font-semibold transition-colors relative ${
                      activeTab === tab
                        ? 'text-[#5c52ff] border-b-2 border-[#5c52ff]'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'profile' ? 'Profile' : tab === 'quiz-references' ? 'Quiz References' : 'Notifications'}
                  </button>
                ))}
              </div>

              {/* SEARCH INPUT */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="p-8">

            {/* -------------------- PROFILE TAB -------------------- */}
            {activeTab === 'profile' && (
              <div className="max-w-2xl">

                {/* PROFILE PHOTO */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {photoUrl ? (
                      <img src={photoUrl} alt="Profile" className="w-32 h-32 rounded-full shadow-lg object-cover" />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                        <span className="text-5xl text-white font-bold">
                          {formData.name ? formData.name[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => setShowPhotoUpload(true)}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-gray-200 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* NAME FIELD */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  {/* EMAIL FIELD */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                  </div>

                  {/* PASSWORD */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">Password</label>
                    <div className="flex gap-4">
                      <input type="password" value="••••••••" disabled className="flex-1 px-4 py-3 border rounded-lg bg-gray-50" />
                      <button
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* CHANGE PASSWORD */}
                  {showPasswordChange && (
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-lg font-semibold">Change Password</h3>

                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        placeholder="Current password"
                        className="w-full px-4 py-3 border rounded-lg"
                      />

                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        placeholder="New password"
                        className="w-full px-4 py-3 border rounded-lg"
                      />

                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 border rounded-lg"
                      />

                      <div className="flex gap-4">
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg"
                        >
                          {isSaving ? 'Saving...' : 'Update Password'}
                        </button>

                        <button
                          onClick={() => setShowPasswordChange(false)}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* SAVE BUTTONS */}
                  <div className="flex gap-4 pt-6">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 px-6 py-4 bg-[#5c52ff] text-white rounded-lg"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                          className="flex-1 px-6 py-4 bg-[#5c52ff] text-white rounded-lg"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>

                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setFormData(prev => ({
                              ...prev,
                              name: user?.displayName || userInfo?.user_id || ''
                            }));
                          }}
                          className="px-6 py-4 bg-gray-300 text-gray-700 rounded-lg"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>

                  {/* ROLE */}
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Account Role:</span>
                      <span className="px-4 py-2 bg-[#5c52ff] text-white rounded-full">
                        {userInfo?.role || 'User'}
                      </span>
                    </div>
                  </div>

                  {/* BADGES */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">Your Badges</h3>

                    {loadingBadges ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-b-2 border-[#5c52ff] rounded-full mx-auto"></div>
                        <p className="mt-2 text-gray-600">Loading badges...</p>
                      </div>
                    ) : badges.length === 0 ? (
                      <div className="p-6 bg-gray-50 rounded-lg text-center">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeWidth={2} d="M12 8v4l3 3"/>
                        </svg>
                        <p>No badges earned yet</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {badges.map(badge => (
                          <div key={badge.id} className="p-4 rounded-xl border bg-gradient-to-br from-purple-50 to-blue-50">
                            <div className="text-center">
                              <div className="text-4xl mb-2">{badge.icon}</div>
                              <h4 className="font-bold text-gray-900 text-sm">{badge.name}</h4>
                              <p className="text-xs text-gray-600">{badge.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Earned: {new Date(badge.earned_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* ACHIEVEMENTS */}
                  <div className="mt-10">
                    <h3 className="text-xl font-bold mb-4">Your Achievements</h3>

                    {loadingAchievements ? (
                      <div className="text-center py-8">
                        <div className="animate-spin h-8 w-8 border-b-2 border-[#5c52ff] rounded-full mx-auto"></div>
                      </div>
                    ) : achievements.length === 0 ? (
                      <p className="text-gray-600">You haven't unlocked any achievements yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {achievements.map((achievement, index) => (
                          <div
                            key={`${achievement.id}-${index}`}
                            className={`p-4 rounded-xl border-2 ${getRarityColor(achievement.rarity)} transition hover:shadow-lg`}
                          >
                            <div className="text-center">
                              <div className="text-3xl mb-2">{achievement.icon}</div>
                              <h4 className="font-bold text-gray-900 text-sm">{achievement.title}</h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* DANGER ZONE */}
                  <div className="mt-12 p-6 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="text-lg font-bold text-red-800 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-4">Deleting your account is permanent.</p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------- QUIZ REFERENCES -------------------- */}
            {activeTab === 'quiz-references' && (
              <div className="max-w-4xl space-y-8">

                {/* SETTINGS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span>Shuffle Questions</span>
                      <ToggleSwitch
                        enabled={quizSettings.shuffleQuestions}
                        onToggle={() => {
                          setQuizSettings(prev => ({ ...prev, shuffleQuestions: !prev.shuffleQuestions }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Shuffle Answers</span>
                      <ToggleSwitch
                        enabled={quizSettings.shuffleAnswers}
                        onToggle={() => {
                          setQuizSettings(prev => ({ ...prev, shuffleAnswers: !prev.shuffleAnswers }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Show Correct Answers</span>
                      <ToggleSwitch
                        enabled={quizSettings.showCorrectAnswers}
                        onToggle={() => {
                          setQuizSettings(prev => ({ ...prev, showCorrectAnswers: !prev.showCorrectAnswers }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span>Allow Retake</span>
                      <ToggleSwitch
                        enabled={quizSettings.allowRetry}
                        onToggle={() => {
                          setQuizSettings(prev => ({ ...prev, allowRetry: !prev.allowRetry }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Auto Save Progress</span>
                      <ToggleSwitch
                        enabled={quizSettings.autoSaveProgress}
                        onToggle={() => {
                          setQuizSettings(prev => ({ ...prev, autoSaveProgress: !prev.autoSaveProgress }));
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* RESET PROGRESS */}
                <div className="p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-bold text-orange-900 mb-2">
                    Reset Quiz Progress
                  </h3>
                  <p className="text-sm text-orange-700 mb-4">
                    Deletes all completed quizzes. Badges stay.
                  </p>
                  <button
                    onClick={() => setShowResetQuizConfirm(true)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Reset All Progress
                  </button>
                </div>
              </div>
            )}

            {/* -------------------- NOTIFICATIONS -------------------- */}
            {activeTab === 'notifications' && (
              <div className="max-w-4xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <ToggleSwitch
                        enabled={notificationSettings.emailNotifications}
                        onToggle={() => {
                          setNotificationSettings(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>In-Web Notifications</span>
                      <ToggleSwitch
                        enabled={notificationSettings.inWebNotifications}
                        onToggle={() => {
                          setNotificationSettings(prev => ({ ...prev, inWebNotifications: !prev.inWebNotifications }));
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span>Weekly Summary</span>
                      <ToggleSwitch
                        enabled={notificationSettings.weeklySummary}
                        onToggle={() => {
                          setNotificationSettings(prev => ({ ...prev, weeklySummary: !prev.weeklySummary }));
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Quiz Alerts</span>
                      <ToggleSwitch
                        enabled={notificationSettings.quizAlerts}
                        onToggle={() => {
                          setNotificationSettings(prev => ({ ...prev, quizAlerts: !prev.quizAlerts }));
                        }}
                      />
                    </div>

                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setView('home')}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* -------------------- PHOTO UPLOAD MODAL -------------------- */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Update Profile Photo</h2>

            <input
              type="url"
              value={photoUrlInput}
              onChange={(e) => setPhotoUrlInput(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              className="w-full px-4 py-2 border rounded-lg"
            />

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setShowPhotoUpload(false);
                  setPhotoUrlInput('');
                }}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handlePhotoUpload}
                disabled={isSaving || !photoUrlInput}
                className="flex-1 px-4 py-2 bg-[#5c52ff] text-white rounded-lg"
              >
                {isSaving ? 'Saving...' : 'Update Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- DELETE ACCOUNT MODAL -------------------- */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">

            <h2 className="text-2xl font-bold text-center mb-4">Delete Account?</h2>
            <p className="text-center mb-6">This action is permanent.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg"
              >
                {isSaving ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- RESET QUIZ PROGRESS MODAL -------------------- */}
      {showResetQuizConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">

            <h2 className="text-2xl font-bold text-center mb-4">Reset All Quiz Progress?</h2>
            <p className="text-center mb-6">This cannot be undone.</p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetQuizConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleResetQuizProgress}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg"
              >
                {isSaving ? 'Resetting...' : 'Reset'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
