import axios from 'axios';

// Axios instance configuration
const api = axios.create({
  baseURL: window._env_.API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// ✅ Request interceptor – attach Firebase auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebase_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Auth token attached:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ No auth token found in localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor – central error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ✅ Helper to normalize API responses
const handleRequest = async (fn) => {
  try {
    const response = await fn();
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// ✅ Unified API Service
export const apiService = {
  // 🔹 AUTH & USER
  registerUser: (data) => handleRequest(() => api.post('/api/users/register', data)),
  getUserProfile: (token) =>
    handleRequest(() =>
      api.get('/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
    ),
  verifyUser: (token) =>
    handleRequest(() =>
      api.get('/api/users/profile', { headers: { Authorization: `Bearer ${token}` } })
    ),

  // 🔹 CONFIG
  getFirebaseConfig: () => handleRequest(() => api.get('/api/config')),
  healthCheck: () => handleRequest(() => api.get('/health')),

  // 🔹 QUIZZES
  getQuizzes: () => handleRequest(() => api.get('/api/quizzes')),
  getQuiz: (quizId) => handleRequest(() => api.get(`/api/quizzes/${quizId}`)),

  submitQuiz: async (quizId, answers, timeTaken) => {
    try {
      console.log('🧠 Submitting quiz:', { quizId, answers, timeTaken });
      const response = await api.post(`/api/quizzes/${quizId}/submit`, { answers, timeTaken });
      console.log('✅ Quiz submitted:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Quiz submission error:', error);
      return { success: false, error: error.response?.data?.message || error.message };
    }
  },

  getUserProgress: () => handleRequest(() => api.get('/api/quizzes/progress/user')),
  resetQuizProgress: (quizId) => handleRequest(() => api.delete(`/api/quizzes/${quizId}/progress`)),
  getQuizHistory: (quizId) => handleRequest(() => api.get(`/api/quizzes/${quizId}/history`)),
  getUserAchievements: () => handleRequest(() => api.get('/api/quizzes/achievements/user')),

  // 🔹 ADMIN
  getAllUsers: () => handleRequest(() => api.get('/api/admin/users')),
  createUser: (data) => handleRequest(() => api.post('/api/users/register', data)),
  deleteUser: (userId) => handleRequest(() => api.delete(`/api/admin/users/${userId}`)),

  // 🔹 FEEDBACK
  submitFeedback: (data) => handleRequest(() => api.post('/api/feedback', data)),
  getAllFeedback: () => handleRequest(() => api.get('/api/feedback')),
};

export default api;
