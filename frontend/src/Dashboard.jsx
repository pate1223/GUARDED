import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { signOutUser } from './services/firebase';
import UserProfile from './components/UserProfile';

export default function Dashboard({ setView }) {
  const { user, userInfo, isAuthenticated, isAdmin } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOutUser();
      localStorage.removeItem('firebase_token');
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // If not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Please sign in to access the dashboard
          </h1>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {userInfo?.user_id || user?.displayName || user?.email}!
              </p>
            </div>

            <button
              onClick={handleSignOut}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {userInfo?.user_id || 'N/A'}</p>
              <p><span className="font-medium">Email:</span> {user?.email || 'N/A'}</p>
              <p><span className="font-medium">Role:</span> {userInfo?.role || 'N/A'}</p>
              <p><span className="font-medium">User ID:</span> {userInfo?.id || 'N/A'}</p>
            </div>
          </div>

          {/* Firebase User Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Firebase User</h2>
            <div className="space-y-2">
              <p><span className="font-medium">UID:</span> {user?.uid || 'N/A'}</p>
              <p><span className="font-medium">Email Verified:</span> {user?.emailVerified ? 'Yes' : 'No'}</p>
              <p><span className="font-medium">Provider:</span> {user?.providerData?.[0]?.providerId || 'N/A'}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-[#5c52ff] text-white rounded-lg hover:bg-[#4335d1] transition">
                Take Quiz
              </button>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                Learn More
              </button>
              <button
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => setView && setView('dashboard')}
              >
                View Profile
              </button>

              {/* Admin Access Button */}
              {isAdmin && (
                <button
                  className="w-full px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition"
                  onClick={() => setView && setView('admin')}
                >
                  Click here to access admin dashboard
                </button>
              )}
            </div>
          </div>

          {/* ⭐ NEW: UserProfile Displayed Inside Dashboard ⭐ */}
          <div className="bg-white rounded-lg shadow p-6 md:col-span-2 lg:col-span-3">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Profile Details
            </h2>

            <UserProfile setView={setView} />
          </div>

        </div>
      </div>
    </div>
  );
}
