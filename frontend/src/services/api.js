import axios from 'axios';

// Workshop API functions
export const workshopAPI = {
  // Get all workshops with filters
  getWorkshops: async (params = {}) => {
    const response = await axios.get('/workshops', { params });
    return response.data;
  },

  // Get single workshop
  getWorkshop: async (id) => {
    const response = await axios.get(`/workshops/${id}`);
    return response.data;
  },

  // Create workshop (admin only)
  createWorkshop: async (workshopData) => {
    const response = await axios.post('/workshops', workshopData);
    return response.data;
  },

  // Update workshop (admin only)
  updateWorkshop: async (id, workshopData) => {
    const response = await axios.put(`/workshops/${id}`, workshopData);
    return response.data;
  },

  // Delete workshop (admin only)
  deleteWorkshop: async (id) => {
    const response = await axios.delete(`/workshops/${id}`);
    return response.data;
  },

  // Get categories
  getCategories: async () => {
    const response = await axios.get('/workshops/categories/list');
    return response.data;
  }
};

// Booking API functions
export const bookingAPI = {
  // Create booking
  createBooking: async (bookingData) => {
    const response = await axios.post('/bookings', bookingData);
    return response.data;
  },

  // Get user's bookings
  getUserBookings: async (params = {}) => {
    const response = await axios.get('/bookings/my-bookings', { params });
    return response.data;
  },

  // Cancel booking
  cancelBooking: async (id) => {
    const response = await axios.delete(`/bookings/${id}`);
    return response.data;
  },

  // Get all bookings (admin only)
  getAllBookings: async (params = {}) => {
    const response = await axios.get('/bookings/all', { params });
    return response.data;
  },

  // Get workshop participants (admin only)
  getWorkshopParticipants: async (workshopId) => {
    const response = await axios.get(`/bookings/workshop/${workshopId}/participants`);
    return response.data;
  }
};

// Admin API functions
export const adminAPI = {
  // Get dashboard data
  getDashboard: async () => {
    const response = await axios.get('/admin/dashboard');
    return response.data;
  },

  // Get workshop analytics
  getWorkshopAnalytics: async () => {
    const response = await axios.get('/admin/workshops/analytics');
    return response.data;
  },

  // Get user analytics
  getUserAnalytics: async () => {
    const response = await axios.get('/admin/users/analytics');
    return response.data;
  },

  // Get financial reports
  getFinancialReports: async (params = {}) => {
    const response = await axios.get('/admin/financial', { params });
    return response.data;
  },

  // Export participant list
  exportParticipants: async (workshopId) => {
    const response = await axios.get(`/admin/workshops/${workshopId}/export`);
    return response.data;
  }
};

// User API functions
export const userAPI = {
  // Get profile
  getProfile: async () => {
    const response = await axios.get('/users/profile');
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await axios.put('/users/profile', profileData);
    return response.data;
  },

  // Get booking history
  getBookingHistory: async () => {
    const response = await axios.get('/users/bookings');
    return response.data;
  }
};
