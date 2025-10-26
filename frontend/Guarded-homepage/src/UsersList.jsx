import React, { useEffect, useState } from 'react';
import { apiService } from './services/api';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeFirebase } from "./services/firebase";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [adding, setAdding] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    const result = await apiService.getAllUsers();
    if (result.success) {
      setUsers(result.data);
    } else {
      setError(result.error || 'Failed to fetch users');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAdding(true);

    try {
      const { auth } = await initializeFirebase();
      const userCred = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );

      const firebase_uid = userCred.user.uid;
      const result = await apiService.createUser({
        firebase_uid,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      });

      if (result.success) {
        alert("✅ User created successfully!");
        setNewUser({ name: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        alert("❌ " + result.error);
      }
    } catch (error) {
      alert("⚠️ Firebase error: " + error.message);
    } finally {
      setAdding(false);
    }
  };

  // Delete user
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    const result = await apiService.deleteUser(userId);
    if (result.success) {
      alert("✅ User deleted successfully!");
      fetchUsers();
    } else {
      alert("❌ " + result.error);
    }
  };

  // Filter users by email only (since name is not displayed)
  const filteredUsers = users.filter(
    (u) => u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return <div className="p-8 text-center text-gray-600">Loading users...</div>;

  if (error)
    return (
      <div className="p-8 text-center text-red-500">
        ❌ {error}
      </div>
    );

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#2b2360]">User Management</h2>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5c52ff]"
        />
      </div>

      {/* Add User Form */}
      <form
        onSubmit={handleAddUser}
        className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6 bg-[#faf8ff] p-4 rounded-lg"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="px-3 py-2 border rounded-md focus:ring-[#5c52ff]"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="px-3 py-2 border rounded-md focus:ring-[#5c52ff]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="px-3 py-2 border rounded-md focus:ring-[#5c52ff]"
          required
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="px-3 py-2 border rounded-md focus:ring-[#5c52ff]"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={adding}
          className="px-4 py-2 bg-[#5c52ff] text-white rounded-md hover:bg-[#4638ff] transition disabled:opacity-50"
        >
          {adding ? 'Adding...' : '➕ Add User'}
        </button>
      </form>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="pb-3">Email</th>
              <th className="pb-3">Role</th>
              <th className="pb-3">Created</th>
              <th className="pb-3 w-32">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user.id || user._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-3">{user.email}</td>
                  <td className="py-3 capitalize">{user.role || 'User'}</td>
                  <td className="py-3">
                    {user.created_at || user.createdAt
                      ? new Date(user.created_at || user.createdAt).toLocaleDateString()
                      : '—'}
                  </td>
                  <td className="py-3">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-3 py-1 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
