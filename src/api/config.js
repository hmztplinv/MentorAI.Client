import axios from 'axios';

// API temel URL'sini oluştur
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Axios instance oluştur
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek ve yanıt interceptor'ları
api.interceptors.request.use(
  (config) => {
    // İstek gönderilmeden önce yapılacak işlemler
    // Örneğin: Authorization header eklemek
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Başarılı yanıtları işleme
    return response;
  },
  (error) => {
    // Hata durumlarını işleme
    console.error('API Hatası:', error);
    
    // Kullanıcıya dost hata mesajları
    const customError = {
      message: error.response?.data?.detail || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.',
      status: error.response?.status || 500,
    };
    
    return Promise.reject(customError);
  }
);

export default api;