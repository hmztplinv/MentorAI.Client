import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Hatası:', error);
    
    const customError = {
      message: error.response?.data?.detail || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      status: error.response?.status || 500,
    };
    
    return Promise.reject(customError);
  }
);

export default api;