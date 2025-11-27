import axios from 'axios';

// ========================
//  AXIOS INSTANCE
// ========================
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

// ========================
//  INTERCEPTORS
// ========================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebase_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ========================
//  API SERVICE
// ========================
export const apiService = {

  // ------------------------
  // USER AUTH
  // ------------------------
  registerUser: async (userData) => {
    try {
      const res = await api.post('/users/register', userData);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getUserProfile: async (token) => {
    try {
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  verifyUser: async (token) => {
    try {
      const res = await api.get('/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return { success: true, user: res.data.user };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getFirebaseConfig: async () => {
    try {
      const res = await api.get('/config');
      return { success: true, config: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ------------------------
  // HEALTH CHECK
  // ------------------------
  healthCheck: async () => {
    try {
      const res = await api.get('/health');
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ========================
  //  QUIZ API (LANG-AWARE)
  // ========================
  getQuizzes: async (lang = 'EN') => {
    try {
      const res = await api.get('/quizzes', { params: { lang } });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getQuiz: async (quizId, lang = 'EN') => {
    try {
      const res = await api.get(`/quizzes/${quizId}`, { params: { lang } });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  submitQuiz: async (quizId, answers, timeTaken, lang = 'EN') => {
    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, {
        answers,
        timeTaken,
        lang
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getUserProgress: async (lang = 'EN') => {
    try {
      const res = await api.get('/quizzes/progress/user', {
        params: { lang }
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getUserAchievements: async (lang = 'EN') => {
    try {
      const res = await api.get('/quizzes/achievements/user', {
        params: { lang }
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getQuizHistory: async (quizId, lang = 'EN') => {
    try {
      const res = await api.get(`/quizzes/${quizId}/history`, {
        params: { lang }
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  resetUserProgress: async (lang = 'EN') => {
    try {
      const res = await api.delete('/quizzes/progress/user', {
        params: { lang }
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getQuizStats: async (quizId, lang = 'EN') => {
    try {
      const res = await api.get(`/quizzes/${quizId}/stats`, {
        params: { lang }
      });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ------------------------
  // FEEDBACK
  // ------------------------
  submitFeedback: async (feedbackData) => {
    try {
      const res = await api.post('/feedback', feedbackData);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getAllFeedback: async () => {
    try {
      const res = await api.get('/feedback');
      return { success: true, data: res.data.feedback || res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ------------------------
  // ADMIN
  // ------------------------
  getAllUsers: async () => {
    try {
      const res = await api.get('/admin/users');
      return { success: true, data: res.data.users || res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  deleteUser: async (userId) => {
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  // ------------------------
  // PROFILE
  // ------------------------
  updateProfile: async (name) => {
    try {
      const res = await api.put('/profile', { name });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  updateProfilePhoto: async (photoURL) => {
    try {
      const res = await api.put('/profile/photo', { photoURL });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message };
    }
  }
};

export default api;
