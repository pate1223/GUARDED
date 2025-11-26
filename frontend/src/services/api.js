import axios from 'axios';

// Create axios instance with base configuration
// Use /api as base URL - in production NGINX routes /api to backend, in dev vite proxy handles it
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Add any auth token if available
    const token = localStorage.getItem('firebase_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // User registration
  registerUser: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get user profile
  getUserProfile: async (token) => {
    try {
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Verify user in database
  verifyUser: async (token) => {
    try {
      const response = await api.get('/users/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return {
        success: true,
        user: response.data.user
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get Firebase config
  getFirebaseConfig: async () => {
    try {
      const response = await api.get('/config');
      return {
        success: true,
        config: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Health check (uses fetch directly since backend /health is at root, not /api)
  healthCheck: async () => {
    try {
      const response = await fetch('/health');
      const data = await response.json();
      return {
        success: true,
        data: data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Quiz methods
  getQuizzes: async () => {
    try {
      const response = await api.get('/quizzes');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

    // Get all users (Admin only)
  getAllUsers: async () => {
    try {
      const response = await api.get('/admin/users');

      return {
        success: true,
        data: response.data.users || response.data
      };
    } catch (error) {
      console.error('Error fetching users:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Create a new user (admin)
createUser: async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
},

// Delete a user by ID (admin only)
deleteUser: async (userId) => {
  try {
    const response = await api.delete(`/admin/users/${userId}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
},


  // Feedback API methods
submitFeedback: async (feedbackData) => {
  try {
    const response = await api.post('/feedback', feedbackData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Submit feedback error:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
},

getAllFeedback: async () => {
  try {
    const response = await api.get('/feedback');
    return { success: true, data: response.data.feedback || response.data };
  } catch (error) {
    console.error('Get feedback error:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
},



  getQuiz: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  submitQuiz: async (quizId, answers, timeTaken) => {
    try {
      const response = await api.post(`/quizzes/${quizId}/submit`, {
        answers,
        timeTaken
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  getUserProgress: async () => {
    try {
      const response = await api.get('/quizzes/progress/user');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get user achievements
  getUserAchievements: async () => {
    try {
      const response = await api.get('/quizzes/achievements/user');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get quiz history for a specific quiz
  getQuizHistory: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/history`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Reset user's quiz progress
  resetUserProgress: async () => {
    try {
      const response = await api.delete('/quizzes/progress/user');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get quiz statistics (Admin)
  getQuizStats: async (quizId) => {
    try {
      const response = await api.get(`/quizzes/${quizId}/stats`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Get dashboard statistics (Admin)
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return {
        success: true,
        data: response.data.stats
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // Update user profile
  updateProfile: async (name, language = null) => {
    try {
      const response = await api.put('/profile', { name, language });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
};



export default api;