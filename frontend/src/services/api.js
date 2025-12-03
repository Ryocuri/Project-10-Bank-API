import axios from 'axios';

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired or invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Optionally redirect to login page
      window.location.href = '/sign-in';
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    console.error('API Error:', errorMessage);
    
    return Promise.reject(error);
  }
);

// API Service Functions

/**
 * Login user
 * @param {Object} credentials - User credentials (email, password)
 * @returns {Promise} API response
 */
export const login = async (credentials) => {
  try {
    const response = await apiClient.post('/user/login', credentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Sign up new user
 * @param {Object} userData - User data (email, password, firstName, lastName)
 * @returns {Promise} API response
 */
export const signup = async (userData) => {
  try {
    const response = await apiClient.post('/user/signup', userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get user profile
 * @returns {Promise} API response with user profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.post('/user/profile');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update (firstName, lastName)
 * @returns {Promise} API response with updated profile
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Token management utilities

/**
 * Save token to localStorage
 * @param {string} token - JWT token
 */
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

/**
 * Get token from localStorage
 * @returns {string|null} JWT token or null
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Remove token from localStorage
 */
export const removeToken = () => {
  localStorage.removeItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if token exists
 */
export const isAuthenticated = () => {
  return !!getToken();
};

export default apiClient;