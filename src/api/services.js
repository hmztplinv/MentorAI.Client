import api from './config';

// Kullanıcı ile ilgili API çağrıları
export const userService = {
  // Kullanıcı oluşturma
  createUser: (userData) => {
    return api.post('/users', userData);
  },
  
  // Kullanıcı bilgilerini getirme
  getUser: (userId) => {
    return api.get(`/users/${userId}`);
  },
  
  // Kullanıcı bilgilerini güncelleme
  updateUser: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },
  
  // Tüm kullanıcıları getirme (admin)
  getUsers: (skip = 0, limit = 10) => {
    return api.get(`/users?skip=${skip}&limit=${limit}`);
  },
};

// Terapi oturumları ile ilgili API çağrıları
export const sessionService = {
  // Yeni oturum oluşturma
  createSession: (sessionData) => {
    return api.post('/sessions', sessionData);
  },
  
  // Bir kullanıcının tüm oturumlarını getirme
  getUserSessions: (userId, skip = 0, limit = 10) => {
    return api.get(`/sessions?user_id=${userId}&skip=${skip}&limit=${limit}`);
  },
  
  // Belirli bir oturumu getirme
  getSession: (sessionId) => {
    return api.get(`/sessions/${sessionId}`);
  },
  
  // Oturum güncelleme
  updateSession: (sessionId, sessionData) => {
    return api.put(`/sessions/${sessionId}`, sessionData);
  },
  
  // Oturumu sonlandırma
  endSession: (sessionId) => {
    return api.put(`/sessions/${sessionId}/end`);
  },
  
  // Oturumu silme
  deleteSession: (sessionId) => {
    return api.delete(`/sessions/${sessionId}`);
  },
};

// Sohbet ile ilgili API çağrıları
export const chatService = {
  // Mesaj gönderme
  sendMessage: (sessionId, message, isVoice = false) => {
    return api.post('/chat/send', {
      session_id: sessionId,
      message,
      is_voice: isVoice,
    });
  },
};

// Ses ile ilgili API çağrıları
export const voiceService = {
  // Ses dosyasını metin çevirme
  transcribeAudio: (audioBlob, language = 'tr') => {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('language', language);
    
    return api.post('/voice/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Ses kaydını doğrudan mesaj olarak gönderme
  sendVoiceMessage: (sessionId, audioBlob, language = 'tr') => {
    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('language', language);
    formData.append('session_id', sessionId);
    
    return api.post('/voice/send', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};