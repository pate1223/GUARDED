// ============================
// apiService.js (FULL VERSION)
// ============================

import axios from "axios";
import { getAuth } from "firebase/auth";

// -----------------------------
// AXIOS INSTANCE
// -----------------------------
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// -----------------------------
// REQUEST INTERCEPTOR
// Always attach fresh Firebase ID token
// -----------------------------
api.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        const token = await currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error fetching Firebase token:", error);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// -----------------------------
// RESPONSE INTERCEPTOR
// -----------------------------
api.interceptors.response.use(
  (res) => res,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// -----------------------------
// Helper: Format safe result
// -----------------------------
const ok = (data) => ({ success: true, data });
const fail = (err) => ({
  success: false,
  error: err?.response?.data?.message || err?.message || "Unknown error",
});

// -----------------------------
// EXPORTED API SERVICE
// -----------------------------
export const apiService = {
  // ======================
  // AUTH
  // ======================
  registerUser: async (userData) => {
    try {
      const res = await api.post("/users/register", userData);
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  getUserProfile: async () => {
    try {
      const res = await api.get("/users/profile");
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  verifyUser: async () => {
    try {
      const res = await api.get("/users/profile");
      return { success: true, user: res.data.user };
    } catch (err) {
      return fail(err);
    }
  },

  getFirebaseConfig: async () => {
    try {
      const res = await api.get("/config");
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  // ======================
  // HEALTH CHECK
  // ======================
  healthCheck: async () => {
    try {
      const res = await api.get("/health");
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  // ======================
  // QUIZZES
  // ======================
  getQuizzes: async (lang = "EN") => {
    try {
      const res = await api.get("/quizzes", { params: { lang } });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  getQuiz: async (quizId, lang = "EN") => {
    try {
      const res = await api.get(`/quizzes/${quizId}`, { params: { lang } });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  submitQuiz: async (quizId, answers, timeTaken, lang = "EN") => {
    try {
      const res = await api.post(`/quizzes/${quizId}/submit`, {
        answers,
        timeTaken,
        lang,
      });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  getUserProgress: async (lang = "EN") => {
    try {
      const res = await api.get("/quizzes/progress/user", {
        params: { lang },
      });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  getUserAchievements: async (lang = "EN") => {
    try {
      const res = await api.get("/quizzes/achievements/user", {
        params: { lang },
      });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  getQuizHistory: async (quizId, lang = "EN") => {
    try {
      const res = await api.get(`/quizzes/${quizId}/history`, {
        params: { lang },
      });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  resetUserProgress: async (lang = "EN") => {
    try {
      const res = await api.delete("/quizzes/progress/user", {
        params: { lang },
      });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  getQuizStats: async (quizId, lang = "EN") => {
    try {
      const res = await api.get(`/quizzes/${quizId}/stats`, {
        params: { lang },
      });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  // ======================
  // FEEDBACK
  // ======================
  submitFeedback: async (feedbackData) => {
    try {
      const res = await api.post("/feedback", feedbackData);
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  getAllFeedback: async () => {
    try {
      const res = await api.get("/feedback");
      return ok(res.data.feedback || res.data);
    } catch (err) {
      return fail(err);
    }
  },

  // ======================
  // ADMIN
  // ======================
  getDashboardStats: async () => {
    try {
      const res = await api.get("/admin/dashboard-stats");
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  getAllUsers: async () => {
    try {
      const res = await api.get("/admin/users");
      return ok(res.data.users || res.data);
    } catch (err) {
      return fail(err);
    }
  },

  deleteUser: async (userId) => {
    try {
      const res = await api.delete(`/admin/users/${userId}`);
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  // ======================
  // PROFILE
  // ======================
  updateProfile: async (name) => {
    try {
      const res = await api.put("/profile", { name });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },

  updateProfilePhoto: async (photoURL) => {
    try {
      const res = await api.put("/profile/photo", { photoURL });
      return ok(res.data);
    } catch (err) {
      return fail(err);
    }
  },
};

export default api;
