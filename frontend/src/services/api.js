import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
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
      const response = await api.post('/api/users/register', userData);
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
      const response = await api.get('/api/users/profile', {
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
      const response = await api.get('/api/users/profile', {
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
      const response = await api.get('/api/config');
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

  // Health check
  healthCheck: async () => {
    try {
      const response = await api.get('/health');
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

  // Quiz methods
  getQuizzes: async () => {
    try {
      const response = await api.get('/api/quizzes');
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
      const response = await api.get('/api/admin/users');

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

  // Feedback API methods
submitFeedback: async (feedbackData) => {
  try {
    const response = await api.post('/api/feedback', feedbackData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Submit feedback error:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
},

getAllFeedback: async () => {
  try {
    const response = await api.get('/api/feedback');
    return { success: true, data: response.data.feedback };
  } catch (error) {
    console.error('Get feedback error:', error);
    return { success: false, error: error.response?.data?.message || error.message };
  }
},

// Fetch all feedback (Admin only)
getAllFeedback: async () => {
  try {
    const response = await api.get('/api/feedback');
    return { success: true, data: response.data.feedback || response.data };
  } catch (error) {
    console.error('Error fetching feedback:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message
    };
  }
},



  getQuiz: async (quizId) => {
    try {
      const response = await api.get(`/api/quizzes/${quizId}`);
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
      const response = await api.post(`/api/quizzes/${quizId}/submit`, {
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
      const response = await api.get('/api/quizzes/progress/user');
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
