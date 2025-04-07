import api from './config';

export const userService = {

  createUser: (userData) => {
    return api.post('/users', userData);
  },
  

  getUser: (userId) => {
    return api.get(`/users/${userId}`);
  },
  

  updateUser: (userId, userData) => {
    return api.put(`/users/${userId}`, userData);
  },
  

  getUsers: (skip = 0, limit = 10) => {
    return api.get(`/users?skip=${skip}&limit=${limit}`);
  },
};


export const sessionService = {
  createSession: (sessionData) => {
    return api.post('/sessions', sessionData);
  },

  getUserSessions: (userId, skip = 0, limit = 10) => {
    return api.get(`/sessions?user_id=${userId}&skip=${skip}&limit=${limit}`);
  },
  
  getSession: (sessionId) => {
    return api.get(`/sessions/${sessionId}`);
  },
  
  updateSession: (sessionId, sessionData) => {
    return api.put(`/sessions/${sessionId}`, sessionData);
  },
  
  endSession: (sessionId) => {
    return api.put(`/sessions/${sessionId}/end`);
  },
  
  deleteSession: (sessionId) => {
    return api.delete(`/sessions/${sessionId}`);
  },
};

export const chatService = {
  sendMessage: (sessionId, message, isVoice = false) => {
    return api.post('/chat/send', {
      session_id: sessionId,
      message,
      is_voice: isVoice,
    });
  },
};

export const voiceService = {
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