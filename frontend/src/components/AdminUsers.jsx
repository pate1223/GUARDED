import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminUsers({ lang, i18n }) {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    displayName: '',
    role: 'user'
  });

  // ---------------------------
  // FETCH USERS
  // ---------------------------
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await currentUser.getIdToken();

      let url = '/api/admin/users';
      const params = new URLSearchParams();

      if (searchQuery) params.append('query', searchQuery);
      if (roleFilter !== 'all') params.append('role', roleFilter);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await response.json();
      if (data.success) setUsers(data.users);
      else setError(data.message);

    } catch (err) {
      console.error('Fetch users error:', err);
      setError(i18n(lang, 'failedToLoadUsers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) fetchUsers();
    else {
      setLoading(false);
      setError(i18n(lang, 'pleaseLogInAccess'));
    }
  }, [currentUser, roleFilter]);

  // ---------------------------
  // SEARCH
  // ---------------------------
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  // ---------------------------
  // ADD NEW USER
  // ---------------------------
  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = await currentUser.getIdToken();

      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(i18n(lang, 'userCreatedSuccess'));
        setShowAddModal(false);
        setNewUser({ email: '', password: '', displayName: '', role: 'user' });
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(i18n(lang, 'failedToCreateUser'));
      console.error(err);
    }
  };

  // ---------------------------
  // UPDATE ROLE
  // ---------------------------
  const handleUpdateRole = async (userId, newRole) => {
    try {
      const token = await currentUser.getIdToken();

      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newRole })
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(i18n(lang, 'roleUpdatedSuccess'));
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(i18n(lang, 'failedToUpdateRole'));
      console.error(err);
    }
  };

  // ---------------------------
  // DELETE USER
  // ---------------------------
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const token = await currentUser.getIdToken();

      const res = await fetch(`/api/admin/users/${selectedUser.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(i18n(lang, 'userDeletedSuccess'));
        setShowDeleteConfirm(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(i18n(lang, 'failedToDeleteUser'));
      console.error(err);
    }
  };

  // ---------------------------
  // HELPERS
  // ---------------------------
  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

  const badgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'user': return 'bg-blue-100 text-blue-800';
      default:      return 'bg-gray-100 text-gray-800';
    }
  };

  // ---------------------------
  // UI START
  // ---------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-purple-300">
            {i18n(lang, 'userManagement')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {i18n(lang, 'manageUsersRoles')}
          </p>
        </div>

        {/* ERRORS / SUCCESS */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>{error}</span>
              <button onClick={() => setError('')}>✖</button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-300 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>{success}</span>
              <button onClick={() => setSuccess('')}>✖</button>
            </div>
          </div>
        )}

        {/* CONTROLS */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">

            {/* SEARCH */}
            <form className="flex-1" onSubmit={handleSearch}>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                {i18n(lang, 'searchUsers')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={i18n(lang, 'searchByEmailOrName')}
                  className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-gray-100"
                />
                <button
                  className="px-6 py-2 bg-[#5c52ff] text-white rounded-lg"
                  type="submit"
                >
                  {i18n(lang, 'search')}
                </button>
              </div>
            </form>

            {/* ROLE FILTER */}
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">
                {i18n(lang, 'filterByRole')}
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg dark:bg-gray-900 dark:text-gray-100"
              >
                <option value="all">{i18n(lang, 'allRoles')}</option>
                <option value="admin">{i18n(lang, 'adminRole')}</option>
                <option value="user">{i18n(lang, 'userRole')}</option>
                <option value="guest">{i18n(lang, 'guestRole')}</option>
              </select>
            </div>

            {/* ADD BUTTON */}
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-green-600 text-white rounded-lg"
            >
              {i18n(lang, 'addUser')}
            </button>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">{i18n(lang, 'loadingUsers')}</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">{i18n(lang, 'noUsersFound')}</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    {i18n(lang, 'userRole')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    {i18n(lang, 'roleHeader')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    {i18n(lang, 'statsHeader')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs uppercase">
                    {i18n(lang, 'joinedHeader')}
                  </th>
                  <th className="px-6 py-3 text-right text-xs uppercase">
                    {i18n(lang, 'actionsHeader')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-[#5c52ff] text-white rounded-full flex items-center justify-center">
                          {user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium dark:text-gray-100">
                            {user.display_name || i18n(lang, 'notApplicable')}
                          </div>
                          <div className="text-gray-500 dark:text-gray-400">{user.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* ROLE DROPDOWN */}
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
                          user.role
                        )}`}
                      >
                        <option value="guest">{i18n(lang, 'guestRole')}</option>
                        <option value="user">{i18n(lang, 'userRole')}</option>
                        <option value="admin">{i18n(lang, 'adminRole')}</option>
                      </select>
                    </td>

                    {/* STATS */}
                    <td className="px-6 py-4">
                      <div className="dark:text-gray-100">
                        {user.stats?.quizzes_completed || 0} {i18n(lang, 'quizzes')}
                      </div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {user.stats?.badges_earned || 0} {i18n(lang, 'badgesLowercase')}
                      </div>
                    </td>

                    {/* JOIN DATE */}
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                      {formatDate(user.created_at)}
                    </td>

                    {/* DELETE */}
                    <td className="px-6 py-4 text-right">
                      <button
                        className="text-red-600 dark:text-red-400"
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        {i18n(lang, 'deleteAction')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* USER COUNT */}
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          {i18n(lang, 'showingUsers')
            .replace('{0}', users.length)
            .replace('{1}', users.length !== 1 ? 's' : '')}
        </p>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl">

            <h2 className="text-2xl font-bold dark:text-purple-300 mb-4">
              {i18n(lang, 'addNewUser')}
            </h2>

            <form onSubmit={handleAddUser} className="space-y-4">

              <div>
                <label className="text-sm">{i18n(lang, 'emailRequired')}</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg dark:bg-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm">{i18n(lang, 'passwordRequired')}</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg dark:bg-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm">{i18n(lang, 'displayNameLabel')}</label>
                <input
                  type="text"
                  value={newUser.displayName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, displayName: e.target.value })
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg dark:bg-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="text-sm">{i18n(lang, 'roleRequired')}</label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full px-4 py-2 mt-1 border rounded-lg dark:bg-gray-900 dark:text-gray-100"
                >
                  <option value="guest">{i18n(lang, 'guestRole')}</option>
                  <option value="user">{i18n(lang, 'userRole')}</option>
                  <option value="admin">{i18n(lang, 'adminRole')}</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setNewUser({
                      email: '',
                      password: '',
                      displayName: '',
                      role: 'user'
                    });
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
                >
                  {i18n(lang, 'cancelButton')}
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#5c52ff] text-white rounded-lg"
                >
                  {i18n(lang, 'createUserButton')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteConfirm && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-xl">

            <h2 className="text-xl font-bold dark:text-red-300 text-center mb-4">
              {i18n(lang, 'deleteUserTitle')}
            </h2>

            <p className="text-center mb-6 text-gray-600 dark:text-gray-300">
              {i18n(lang, 'deleteUserConfirm').replace('{0}', selectedUser.email)}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded-lg"
              >
                {i18n(lang, 'cancelButton')}
              </button>

              <button
                onClick={handleDeleteUser}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                {i18n(lang, 'deleteButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
