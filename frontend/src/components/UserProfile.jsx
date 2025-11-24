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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [quizHistory, setQuizHistory] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  // Quiz settings state
  const [quizSettings, setQuizSettings] = useState({
    shuffleQuestions: true,
    shuffleAnswers: true,
    showCorrectAnswers: true,
    allowRetry: true,
    autoSaveProgress: true
  });

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inWebNotifications: true,
    weeklySummary: true,
    quizAlerts: true
  });

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

  useEffect(() => {
    loadUserBadges();
  }, []);

  const loadUserBadges = async () => {
    setLoadingBadges(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:3000/api/users/badges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setBadges(data.badges || []);
      }
    } catch (error) {
      console.error('Failed to load badges:', error);
    } finally {
      setLoadingBadges(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'quiz-references') {
      loadQuizHistory();
    }
  }, [activeTab]);

  const loadQuizHistory = async () => {
    setLoadingQuizzes(true);
    try {
      const result = await apiService.getUserProgress();
      if (result.success) {
        setQuizHistory(result.data.progress || []);
      }
    } catch (error) {
      console.error('Failed to load quiz history:', error);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const toggleQuizSetting = (setting) => {
    setQuizSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const toggleNotificationSetting = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Toggle Switch Component
  const ToggleSwitch = ({ enabled, onToggle }) => {
    return (
      <button
        onClick={onToggle}
        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:ring-offset-2 ${
          enabled ? 'bg-[#5c52ff]' : 'bg-gray-300'
        }`}
      >
        <span
          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
            enabled ? 'translate-x-7' : 'translate-x-1'
          }`}
        />
      </button>
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      // Here you would call your API to update user profile
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsSaving(true);
    try {
      // Password change logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Password changed successfully!');
      setShowPasswordChange(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoUrlInput.trim()) {
      alert('Please enter a photo URL');
      return;
    }

    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:3000/api/profile/photo', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ photoUrl: photoUrlInput })
      });

      const data = await response.json();
      if (data.success) {
        setPhotoUrl(photoUrlInput);
        setShowPhotoUpload(false);
        setPhotoUrlInput('');
        alert('Photo updated successfully!');
      } else {
        alert(data.message || 'Failed to update photo');
      }
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Failed to update photo. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:3000/api/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert('Account deleted successfully');
        const { signOutUser } = await import('../services/firebase');
        await signOutUser();
        window.location.href = '/';
      } else {
        alert(data.message || 'Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Failed to delete account. Please try again.');
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleResetQuizProgress = async () => {
    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('http://localhost:3000/api/quizzes/progress/user', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert(`Successfully reset ${data.deletedCount} quiz completion(s)`);
        setShowResetQuizConfirm(false);
        // Reload quiz history to reflect changes
        loadQuizHistory();
      } else {
        alert(data.message || 'Failed to reset quiz progress');
      }
    } catch (error) {
      console.error('Error resetting quiz progress:', error);
      alert('Failed to reset quiz progress. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please sign in to access your profile</h1>
          <button
            onClick={() => setView('signin')}
            className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition"
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
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Tabs and Search */}
          <div className="border-b border-gray-200">
            <div className="flex items-center justify-between px-8 pt-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'profile'
                      ? 'text-[#5c52ff] border-b-2 border-[#5c52ff]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab('quiz-references')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'quiz-references'
                      ? 'text-[#5c52ff] border-b-2 border-[#5c52ff]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Quiz References
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'notifications'
                      ? 'text-[#5c52ff] border-b-2 border-[#5c52ff]'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notifications
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent w-64"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {activeTab === 'profile' && (
              <div className="max-w-2xl">
                {/* Profile Image */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="Profile"
                        className="w-32 h-32 rounded-full shadow-lg object-cover"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center shadow-lg">
                        <span className="text-5xl text-white font-bold">
                          {formData.name ? formData.name[0].toUpperCase() : user?.email?.[0].toUpperCase() || 'U'}
                        </span>
                      </div>
                    )}
                    <button
                      onClick={() => setShowPhotoUpload(true)}
                      className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition border-2 border-gray-200"
                      aria-label="Edit profile photo"
                    >
                      <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
                      placeholder="your.email@example.com"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="password"
                        value="••••••••"
                        disabled
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                      />
                      <button
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition font-semibold"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  {/* Password Change Form */}
                  {showPasswordChange && (
                    <div className="border-t pt-6 space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent"
                          placeholder="Enter new password"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent"
                          placeholder="Confirm new password"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Update Password'}
                        </button>
                        <button
                          onClick={() => {
                            setShowPasswordChange(false);
                            setFormData(prev => ({
                              ...prev,
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            }));
                          }}
                          className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 px-6 py-4 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition font-semibold text-lg"
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                          className="flex-1 px-6 py-4 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition font-semibold text-lg disabled:opacity-50"
                        >
                          {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setFormData(prev => ({
                              ...prev,
                              name: user?.displayName || userInfo?.user_id || '',
                            }));
                          }}
                          className="px-6 py-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>

                  {/* Role Badge */}
                  <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Account Role:</span>
                      <span className="px-4 py-2 bg-[#5c52ff] text-white rounded-full text-sm font-semibold">
                        {userInfo?.role || 'User'}
                      </span>
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Badges</h3>
                    {loadingBadges ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5c52ff]"></div>
                        <p className="mt-2 text-gray-600">Loading badges...</p>
                      </div>
                    ) : badges.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <p className="text-gray-600">No badges earned yet</p>
                        <p className="text-sm text-gray-500 mt-2">Complete quizzes and watch videos to earn badges!</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {badges.map((badge) => (
                          <div
                            key={badge.id}
                            className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition"
                          >
                            <div className="text-center">
                              <div className="text-4xl mb-2">{badge.icon}</div>
                              <h4 className="font-bold text-gray-900 text-sm">{badge.name}</h4>
                              <p className="text-xs text-gray-600 mt-1">{badge.description}</p>
                              <p className="text-xs text-gray-500 mt-2">
                                Earned {new Date(badge.earned_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Delete Account Section */}
                  <div className="mt-8 p-6 bg-red-50 rounded-lg border-2 border-red-200">
                    <h3 className="text-lg font-bold text-red-900 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quiz-references' && (
              <div className="max-w-4xl">
                <div className="space-y-8">
                  {/* Left Column Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">Shuffle Questions</span>
                        <ToggleSwitch
                          enabled={quizSettings.shuffleQuestions}
                          onToggle={() => toggleQuizSetting('shuffleQuestions')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">Shuffle Answers</span>
                        <ToggleSwitch
                          enabled={quizSettings.shuffleAnswers}
                          onToggle={() => toggleQuizSetting('shuffleAnswers')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">Show Correct Answers After submission</span>
                        <ToggleSwitch
                          enabled={quizSettings.showCorrectAnswers}
                          onToggle={() => toggleQuizSetting('showCorrectAnswers')}
                        />
                      </div>
                    </div>

                    {/* Right Column Settings */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">Allow Retry</span>
                        <ToggleSwitch
                          enabled={quizSettings.allowRetry}
                          onToggle={() => toggleQuizSetting('allowRetry')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">Auto-Save Progress</span>
                        <ToggleSwitch
                          enabled={quizSettings.autoSaveProgress}
                          onToggle={() => toggleQuizSetting('autoSaveProgress')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reset Quiz Progress Section */}
                  <div className="mt-8 p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <h3 className="text-lg font-bold text-orange-900 mb-2">Reset Quiz Progress</h3>
                    <p className="text-sm text-orange-700 mb-4">
                      This will delete all your completed quizzes, allowing you to retake them. Your badges will remain unchanged.
                    </p>
                    <button
                      onClick={() => setShowResetQuizConfirm(true)}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
                    >
                      Reset All Quiz Progress
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="max-w-4xl">
                <div className="space-y-8">
                  {/* Notification Settings in Two Columns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">Email Notifications</span>
                        <ToggleSwitch
                          enabled={notificationSettings.emailNotifications}
                          onToggle={() => toggleNotificationSetting('emailNotifications')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">In-Web Notifications</span>
                        <ToggleSwitch
                          enabled={notificationSettings.inWebNotifications}
                          onToggle={() => toggleNotificationSetting('inWebNotifications')}
                        />
                      </div>
                    </div>

                    {/* Right Column Settings */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">Weekly Summary</span>
                        <ToggleSwitch
                          enabled={notificationSettings.weeklySummary}
                          onToggle={() => toggleNotificationSetting('weeklySummary')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 font-medium">Quiz Alerts</span>
                        <ToggleSwitch
                          enabled={notificationSettings.quizAlerts}
                          onToggle={() => toggleNotificationSetting('quizAlerts')}
                        />
                      </div>
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
            className="text-gray-600 hover:text-gray-900 font-medium transition"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Photo Upload Modal */}
      {showPhotoUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Profile Photo</h2>
            <p className="text-sm text-gray-600 mb-4">
              Enter the URL of your profile photo. You can use images from services like Gravatar, or upload to image hosting services.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL
                </label>
                <input
                  type="url"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff]"
                />
              </div>

              {photoUrlInput && (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Preview:</p>
                  <img
                    src={photoUrlInput}
                    alt="Preview"
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                    onError={(e) => {
                      e.target.src = '';
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowPhotoUpload(false);
                    setPhotoUrlInput('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePhotoUpload}
                  disabled={isSaving || !photoUrlInput}
                  className="flex-1 px-4 py-2 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition font-semibold disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Update Photo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Delete Account</h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently delete:
            </p>

            <ul className="text-left mb-6 space-y-2 bg-red-50 p-4 rounded-lg">
              <li className="flex items-center text-red-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                All quiz progress and scores
              </li>
              <li className="flex items-center text-red-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                All earned badges
              </li>
              <li className="flex items-center text-red-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                All video progress
              </li>
              <li className="flex items-center text-red-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                Your account and personal data
              </li>
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
              >
                {isSaving ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Quiz Progress Confirmation Modal */}
      {showResetQuizConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Reset Quiz Progress?</h2>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to reset all your quiz progress? This will:
            </p>

            <ul className="text-left mb-6 space-y-2 bg-orange-50 p-4 rounded-lg">
              <li className="flex items-center text-orange-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Delete all completed quiz records
              </li>
              <li className="flex items-center text-orange-800">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Allow you to retake all quizzes
              </li>
              <li className="flex items-center text-green-700">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Keep your earned badges
              </li>
            </ul>

            <div className="flex gap-3">
              <button
                onClick={() => setShowResetQuizConfirm(false)}
                className="flex-1 px-4 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleResetQuizProgress}
                disabled={isSaving}
                className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold disabled:opacity-50"
              >
                {isSaving ? 'Resetting...' : 'Reset Progress'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}