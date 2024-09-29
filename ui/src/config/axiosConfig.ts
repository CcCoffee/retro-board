import axios from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

const axiosInstance = axios.create({
  baseURL: isDevelopment ? 'http://localhost:8080/api' : '/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;