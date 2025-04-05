import React, { createContext, useState, useContext, useEffect } from 'react';
import { userService } from '../api/services';

// Context oluştur
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sayfa yüklendiğinde kullanıcı bilgisini kontrol et
  useEffect(() => {
    const initAuth = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (userId) {
          const response = await userService.getUser(userId);
          setCurrentUser(response.data);
        }
      } catch (err) {
        console.error('Kimlik doğrulama hatası:', err);
        localStorage.removeItem('userId');
        setError('Oturumunuz sona erdi. Lütfen tekrar giriş yapın.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Kullanıcı kaydı
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await userService.createUser(userData);
      localStorage.setItem('userId', response.data.id);
      setCurrentUser(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || 'Kayıt sırasında bir hata oluştu.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı girişi - Basitleştirilmiş şifresiz versiyonu
  const login = async (username) => {
    try {
      setLoading(true);
      // Backend'de kullanıcıyı ara
      const users = await userService.getUsers(0, 100);
      const user = users.data.find(u => u.username === username);
      
      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }
      
      localStorage.setItem('userId', user.id);
      setCurrentUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.message || 'Giriş sırasında bir hata oluştu.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Çıkış yap
  const logout = () => {
    localStorage.removeItem('userId');
    setCurrentUser(null);
  };

  // Kullanıcı ayarlarını güncelle
  const updateUserSettings = async (userId, userData) => {
    try {
      setLoading(true);
      const response = await userService.updateUser(userId, userData);
      setCurrentUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Kullanıcı ayarları güncellenirken bir hata oluştu.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context değerleri
  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout,
    updateUserSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth hook must be used within an AuthProvider');
  }
  return context;
};