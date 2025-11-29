import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import ProfilePhotoUpload from './ProfilePhotoUpload';

export default function UserProfile({ setView }) {
  const { t } = useLanguage();
  const { user, userInfo, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetQuizConfirm, setShowResetQuizConfirm] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
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
      const response = await fetch('/api/users/badges', {
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
      // Update user profile via API
      const result = await apiService.updateProfile(formData.name);
      if (result.success) {
        alert(t('profileUpdatedSuccessfully'));
        setIsEditing(false);
      } else {
        alert(result.error || t('failedToSaveChanges'));
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert(t('failedToSaveChanges'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      alert(t('passwordsDoNotMatch'));
      return;
    }

    if (formData.newPassword.length < 6) {
      alert(t('passwordMinLength'));
      return;
    }

    setIsSaving(true);
    try {
      // Update password via Firebase
      const { updatePassword, reauthenticateWithCredential, EmailAuthProvider } = await import('firebase/auth');
      const { auth } = await import('../services/firebase');

      // Get the current Firebase user
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No authenticated user found');
      }

      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(currentUser.email, formData.currentPassword);
      await reauthenticateWithCredential(currentUser, credential);

      // Update password
      await updatePassword(currentUser, formData.newPassword);

      alert(t('passwordChangedSuccessfully'));
      setShowPasswordChange(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error changing password:', error);
      if (error.code === 'auth/wrong-password') {
        alert(t('currentPasswordIncorrect') || 'Current password is incorrect');
      } else {
        alert(t('failedToChangePassword'));
      }
    } finally {
      setIsSaving(false);
    }
  };


  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/profile', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert(t('accountDeletedSuccessfully'));
        const { signOutUser } = await import('../services/firebase');
        await signOutUser();
        window.location.href = '/';
      } else {
        alert(data.message || t('failedToDeleteAccount'));
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert(t('failedToDeleteAccount'));
    } finally {
      setIsSaving(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleResetQuizProgress = async () => {
    setIsSaving(true);
    try {
      const token = await user.getIdToken();
      const response = await fetch('/api/quizzes/progress/user', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        alert(t('quizProgressResetSuccess'));
        setShowResetQuizConfirm(false);
        // Reload quiz history to reflect changes
        loadQuizHistory();
      } else {
        alert(data.message || t('failedToResetQuiz'));
      }
    } catch (error) {
      console.error('Error resetting quiz progress:', error);
      alert(t('failedToResetQuiz'));
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('pleaseSignInProfile')}</h1>
          <button
            onClick={() => setView('signin')}
            className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition"
          >
            {t('signIn')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4">
        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl dark:shadow-purple-500/20 overflow-hidden transition-colors duration-300">
          {/* Header with Tabs and Search */}
          <div className="border-b border-gray-200 dark:border-gray-700 transition-colors">
            <div className="flex items-center justify-between px-8 pt-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'profile'
                      ? 'text-[#5c52ff] dark:text-purple-400 border-b-2 border-[#5c52ff] dark:border-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t('profileTab')}
                </button>
                <button
                  onClick={() => setActiveTab('quiz-references')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'quiz-references'
                      ? 'text-[#5c52ff] dark:text-purple-400 border-b-2 border-[#5c52ff] dark:border-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t('quizPreferences')}
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`pb-4 px-2 font-semibold transition-colors relative ${
                    activeTab === 'notifications'
                      ? 'text-[#5c52ff] dark:text-purple-400 border-b-2 border-[#5c52ff] dark:border-purple-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  }`}
                >
                  {t('notificationsTab')}
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent w-64 transition-colors"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 transition-colors"
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
                  <ProfilePhotoUpload
                    currentPhotoURL={photoUrl}
                    onPhotoUpdate={(newPhotoUrl) => setPhotoUrl(newPhotoUrl)}
                  />
                </div>

                {/* Profile Form */}
                <div className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 transition-colors"
                      placeholder={t('enterFullName')}
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                      {t('emailAddress')}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={true}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:text-gray-500 dark:disabled:text-gray-400 transition-colors"
                      placeholder={t('emailPlaceholder')}
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 transition-colors">{t('emailCannotBeChanged')}</p>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                      {t('password')}
                    </label>
                    <div className="flex gap-4">
                      <input
                        type="password"
                        value="••••••••"
                        disabled
                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                      />
                      <button
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                        className="px-6 py-3 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-lg hover:bg-[#4335d1] dark:hover:bg-purple-500 transition font-semibold"
                      >
                        {t('changePassword')}
                      </button>
                    </div>
                  </div>

                  {/* Password Change Form */}
                  {showPasswordChange && (
                    <div className="border-t dark:border-gray-700 pt-6 space-y-4 transition-colors">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors">{t('changePasswordTitle')}</h3>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                          {t('currentPassword')}
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent transition-colors"
                          placeholder={t('enterCurrentPassword')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                          {t('newPassword')}
                        </label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent transition-colors"
                          placeholder={t('enterNewPassword')}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors">
                          {t('confirmNewPassword')}
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff] focus:border-transparent transition-colors"
                          placeholder={t('confirmPasswordPlaceholder')}
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={handlePasswordChange}
                          disabled={isSaving}
                          className="px-6 py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition font-semibold disabled:opacity-50"
                        >
                          {isSaving ? t('saving') : t('updatePassword')}
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
                          className="px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-semibold"
                        >
                          {t('cancel')}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 px-6 py-4 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-lg hover:bg-[#4335d1] dark:hover:bg-purple-500 transition font-semibold text-lg"
                      >
                        {t('editProfile')}
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSaveChanges}
                          disabled={isSaving}
                          className="flex-1 px-6 py-4 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-lg hover:bg-[#4335d1] dark:hover:bg-purple-500 transition font-semibold text-lg disabled:opacity-50"
                        >
                          {isSaving ? t('saving') : t('saveChanges')}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setFormData(prev => ({
                              ...prev,
                              name: user?.displayName || userInfo?.user_id || '',
                            }));
                          }}
                          className="px-6 py-4 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition font-semibold"
                        >
                          {t('cancel')}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Role Badge */}
                  <div className="mt-6 p-4 bg-purple-50 dark:bg-gray-700 rounded-lg border border-purple-200 dark:border-gray-600 transition-colors duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">{t('accountRole')}:</span>
                      <span className="px-4 py-2 bg-[#5c52ff] dark:bg-purple-600 text-white rounded-full text-sm font-semibold">
                        {userInfo?.role || t('userRole')}
                      </span>
                    </div>
                  </div>

                  {/* Badges Section */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 transition-colors">{t('yourBadgesTitle')}</h3>
                    {loadingBadges ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#5c52ff] dark:border-purple-400"></div>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 transition-colors">{t('loadingBadges')}</p>
                      </div>
                    ) : badges.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors">
                        <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        <p className="text-gray-600 dark:text-gray-300 transition-colors">{t('noBadgesYet')}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 transition-colors">{t('completQuizzesToEarnBadges')}</p>
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
                    <h3 className="text-lg font-bold text-red-900 mb-2">{t('dangerZone')}</h3>
                    <p className="text-sm text-red-700 mb-4">
                      {t('deleteAccountWarning')}
                    </p>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      {t('deleteAccount')}
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
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('shuffleQuestions')}</span>
                        <ToggleSwitch
                          enabled={quizSettings.shuffleQuestions}
                          onToggle={() => toggleQuizSetting('shuffleQuestions')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('shuffleAnswers')}</span>
                        <ToggleSwitch
                          enabled={quizSettings.shuffleAnswers}
                          onToggle={() => toggleQuizSetting('shuffleAnswers')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('showCorrectAnswersAfter')}</span>
                        <ToggleSwitch
                          enabled={quizSettings.showCorrectAnswers}
                          onToggle={() => toggleQuizSetting('showCorrectAnswers')}
                        />
                      </div>
                    </div>

                    {/* Right Column Settings */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('allowRetry')}</span>
                        <ToggleSwitch
                          enabled={quizSettings.allowRetry}
                          onToggle={() => toggleQuizSetting('allowRetry')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('autoSaveProgress')}</span>
                        <ToggleSwitch
                          enabled={quizSettings.autoSaveProgress}
                          onToggle={() => toggleQuizSetting('autoSaveProgress')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reset Quiz Progress Section */}
                  <div className="mt-8 p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                    <h3 className="text-lg font-bold text-orange-900 mb-2">{t('resetQuizProgress')}</h3>
                    <p className="text-sm text-orange-700 mb-4">
                      {t('resetQuizProgressDesc')}
                    </p>
                    <button
                      onClick={() => setShowResetQuizConfirm(true)}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-semibold"
                    >
                      {t('resetAllQuizProgress')}
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
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('emailNotifications')}</span>
                        <ToggleSwitch
                          enabled={notificationSettings.emailNotifications}
                          onToggle={() => toggleNotificationSetting('emailNotifications')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('inWebNotifications')}</span>
                        <ToggleSwitch
                          enabled={notificationSettings.inWebNotifications}
                          onToggle={() => toggleNotificationSetting('inWebNotifications')}
                        />
                      </div>
                    </div>

                    {/* Right Column Settings */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('weeklySummary')}</span>
                        <ToggleSwitch
                          enabled={notificationSettings.weeklySummary}
                          onToggle={() => toggleNotificationSetting('weeklySummary')}
                        />
                      </div>

                      <div className="flex items-center justify-between py-4">
                        <span className="text-gray-700 dark:text-gray-200 font-medium transition-colors">{t('quizAlerts')}</span>
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
            ← {t('backToHome')}
          </button>
        </div>
      </div>

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