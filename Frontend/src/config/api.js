// API Configuration
// Supports environment variables for Firebase deployment
// Usage:
//   - Local development: http://localhost:5000/api
//   - Firebase deployment: Set VITE_API_URL in Firebase console

// VITE_API_URL is automatically available from Vite environment variables
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Helper function to get API endpoint
const getEndpoint = (path) => `${API_URL}${path}`;

// API Configuration Object
export const apiConfig = {
  baseUrl: API_URL,
  
  // Auth endpoints
  login: getEndpoint('/auth/login'),
  register: getEndpoint('/auth/register'),
  changePassword: getEndpoint('/auth/password'),
  getProfile: getEndpoint('/auth/profile'),
  
  // Transaction endpoints
  transactions: getEndpoint('/transactions'),
  getTransactions: getEndpoint('/transactions'),
  
  // Goal endpoints
  goals: getEndpoint('/goals'),
  getGoals: getEndpoint('/goals'),
  
  // Investment endpoints
  investments: getEndpoint('/investments'),
  getInvestments: getEndpoint('/investments'),
  
  // Report endpoints
  reports: getEndpoint('/reports/summary'),
  
  // Notification endpoints
  notifications: getEndpoint('/notifications'),
  unreadCount: getEndpoint('/notifications/unread-count'),
  markAsRead: (id) => getEndpoint(`/notifications/${id}/read`),
};

export default apiConfig;
