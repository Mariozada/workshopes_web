import axios from 'axios';

// Configure Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach auth token if available
api.interceptors.request.use((config) => {
  try {
    let token;
    const rawAuth = localStorage.getItem('auth');
    if (rawAuth) {
      try {
        const parsed = JSON.parse(rawAuth);
        token = parsed?.token || parsed?.accessToken;
      } catch {
        // If not JSON, treat as raw token string
        token = rawAuth;
      }
    }
    // Fallback to legacy 'token' key
    if (!token) {
      token = localStorage.getItem('token');
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

// Workshop API functions
export const workshopAPI = {
  // Get all workshops with filters
  getWorkshops: async (params = {}) => {
    const response = await api.get('/workshops', { params });
    return response.data;
  },

  // Get single workshop
  getWorkshop: async (id) => {
    const response = await api.get(`/workshops/${id}`);
    return response.data;
  },

  // Create workshop (admin only)
  createWorkshop: async (workshopData) => {
    const response = await api.post('/workshops', workshopData);
    return response.data;
  },

  // Update workshop (admin only)
  updateWorkshop: async (id, workshopData) => {
    const response = await api.put(`/workshops/${id}`, workshopData);
    return response.data;
  },

  // Delete workshop (admin only)
  deleteWorkshop: async (id) => {
    const response = await api.delete(`/workshops/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/workshops/categories/list');
    return response.data;
  }
};

// Booking API functions
export const bookingAPI = {
  // Create booking
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async (params = {}) => {
    const response = await api.get('/bookings/my-bookings', { params });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },

  // Get all bookings (admin only)
  getAllBookings: async (params = {}) => {
    const response = await api.get('/bookings/all', { params });
    return response.data;
  },

  // Get workshop participants (admin only)
  getWorkshopParticipants: async (workshopId) => {
    const response = await api.get(`/bookings/workshop/${workshopId}/participants`);
    return response.data;
  },

  // Update booking status (admin only)
  updateBookingStatus: async (id, status) => {
    const response = await api.patch(`/bookings/${id}/status`, { status });
    return response.data;
  },
};

// Admin API functions
export const adminAPI = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await api.get('/admin/dashboard');
    return response.data;
  },

  // Get workshop analytics
  getWorkshopAnalytics: async () => {
    const response = await api.get('/admin/workshops/analytics');
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async () => {
    const response = await api.get('/admin/users/analytics');
    return response.data;
  },

  // Get financial reports
  getFinancialReports: async (params = {}) => {
    const response = await api.get('/admin/financial', { params });
    return response.data;
  },

  // Export participant list
  exportParticipants: async (workshopId) => {
    const response = await api.get(`/admin/workshops/${workshopId}/export`);
    return response.data;
  }
};

// User API functions
export const userAPI = {
  // Get profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // Get booking history
  getBookingHistory: async () => {
    const response = await api.get('/users/bookings');
    return response.data;
  }
};
