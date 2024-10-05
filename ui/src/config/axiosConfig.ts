import axios from 'axios';
import { authService } from '@/services/authService';
import { showToast } from '@/utils/toast';

const isDevelopment = process.env.NODE_ENV === 'development';

const axiosInstance = axios.create({
  baseURL: isDevelopment ? 'http://localhost:8080/api' : '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add this line to ensure credentials are sent
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        authService.logout();
        showToast.error("Your session has expired. Please log in again.");
        if (confirm("Your session has expired. Please log in again.")) {
          window.location.href = '/login';
        }
      } else {
        // Handle other error status codes
        showToast.error("An error occurred. Please try again later.");
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.log(error.request);
      showToast.error("Network error. Please check your internet connection.");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      showToast.error("An unknown error occurred.");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;