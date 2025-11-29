import React, { useState, useEffect } from 'react';
import Logo from './assets/logo.png';
import { useAuth } from './contexts/AuthContext';
import FeedbackList from './FeedbackList';
import AdminUsers from './components/AdminUsers';
import AdminQuizStats from './components/AdminQuizStats';
import { apiService } from './services/api';

export default function AdminDashboard({ lang, i18n }) {
  const { user } = useAuth() || {};
  const [active, setActive] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const menu = [
    { key: 'dashboard', label: i18n(lang, 'dashboard'), icon: '📊' },
    { key: 'analytics', label: i18n(lang, 'quizAnalytics'), icon: '📈' },
    { key: 'feedback', label: i18n(lang, 'feedback'), icon: '💬' },
    { key: 'users', label: i18n(lang, 'users'), icon: '👥' },
    { key: 'settings', label: i18n(lang, 'settings'), icon: '⚙️' },
  ];

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await apiService.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        } else {
          setError(response.error);
        }
      } catch (err) {
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    if (active === 'dashboard') fetchStats();
  }, [active]);

  const maxChartValue = stats?.chartData ? Math.max(...stats.chartData, 1) : 12;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white/90 dark:bg-gray-800/90 border-r border-gray-200/50 dark:border-gray-700/50 p-6 backdrop-blur-lg">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-700 border border-purple-200 dark:border-purple-500/50 flex items-center justify-center">
            <img src={Logo} alt="GuardEd" className="w-10 h-10" />
          </div>
          <span className="text-[#5c52ff] dark:text-purple-400 font-extrabold">
            GuardEd
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menu.map((m) => (
            <button
              key={m.key}
              onClick={() => setActive(m.key)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all ${
                active === m.key
                  ? 'bg-[#5c52ff] dark:bg-purple-600 text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <span className="text-lg">{m.icon}</span>
              <span className="font-medium">{m.label}</span>
            </button>
          ))}
        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2b2360] dark:text-purple-300">
              {i18n(lang, 'dashboard')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              {i18n(lang, 'welcomeBackAdmin')},{' '}
              {user?.displayName || user?.email || i18n(lang, 'adminRole')}!
            </p>
          </div>

          <div className="flex items-center gap-4">
            <input
              placeholder={i18n(lang, 'search')}
              className="px-4 py-2 rounded-lg border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />

            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
              onClick={async () => {
                const { signOutUser } = await import('./services/firebase');
                await signOutUser();
                window.location.href = '/';
              }}
            >
              {i18n(lang, 'signOut')}
            </button>
          </div>
        </div>

        {/* DASHBOARD SECTION */}
        {active === 'dashboard' && (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">
                Loading dashboard...
              </div>
            ) : error ? (
              <div className="p-4 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
                {error}
              </div>
            ) : (
              <>
                {/* Main Stats */}
                <div className="grid grid-cols-3 gap-6 mb-6">

                  {/* Attempts Chart */}
                  <div className="col-span-2 bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 border dark:border-gray-700/50 shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {i18n(lang, 'totalAttempts')}
                        </p>
                        <p className="text-3xl font-extrabold text-[#5c52ff] dark:text-purple-400">
                          {stats?.totalAttempts || 0}
                        </p>
                      </div>
                    </div>

                    <div className="h-44 mt-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg flex items-end p-4">
                      <div className="w-full flex items-end gap-3">
                        {stats?.chartData?.map((v, i) => (
                          <div key={i} className="flex-1 flex items-end">
                            <div
                              className="w-full rounded-t-lg bg-gradient-to-b from-[#5c52ff] to-[#bfb7ff] dark:from-purple-500 dark:to-purple-700"
                              style={{ height: `${(v / maxChartValue) * 100}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Completion Rate */}
                  <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 border dark:border-gray-700/50 shadow-xl">
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      {i18n(lang, 'completionRate')}
                    </p>
                    <p className="text-3xl font-extrabold text-[#5c52ff] dark:text-purple-400">
                      {stats?.completionRate || 0}%
                    </p>
                  </div>

                </div>

                {/* Feedback + Recent Attempts */}
                <div className="grid grid-cols-3 gap-6">

                  {/* Feedback */}
                  <section className="col-span-2 bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 border dark:border-gray-700/50 shadow-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-bold text-[#2b2360] dark:text-purple-300">
                        {i18n(lang, 'latestFeedback')}
                      </h3>
                      <button
                        onClick={() => setActive('feedback')}
                        className="text-sm text-[#5c52ff] dark:text-purple-400 hover:underline"
                      >
                        {i18n(lang, 'seeAll')}
                      </button>
                    </div>

                    {stats?.latestFeedback?.length ? (
                      stats.latestFeedback.map((f) => (
                        <div key={f.id} className="p-4 mb-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <strong className="dark:text-purple-200">{f.name}</strong>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{f.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500 text-center py-4">
                        {i18n(lang, 'noFeedbackYet')}
                      </p>
                    )}
                  </section>

                  {/* Side Stats */}
                  <aside className="space-y-6">
                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 border dark:border-gray-700/50 shadow-xl">
                      <p className="text-sm text-gray-400 dark:text-gray-500">{i18n(lang, 'totalUsers')}</p>
                      <p className="text-3xl font-extrabold text-[#5c52ff] dark:text-purple-400">{stats?.totalUsers || 0}</p>
                    </div>

                    <div className="bg-white/90 dark:bg-gray-800/90 rounded-xl p-6 border dark:border-gray-700/50 shadow-xl">
                      <p className="text-sm text-gray-400 dark:text-gray-500">{i18n(lang, 'topQuiz')}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats?.topQuiz || '—'}</p>
                    </div>
                  </aside>

                </div>
              </>
            )}
          </>
        )}

        {active === 'analytics' && <AdminQuizStats lang={lang} i18n={i18n} />}

        {active === 'feedback' && <FeedbackList lang={lang} i18n={i18n} />}

        {active === 'users' && <AdminUsers lang={lang} i18n={i18n} />}

      </main>
    </div>
  );
}
