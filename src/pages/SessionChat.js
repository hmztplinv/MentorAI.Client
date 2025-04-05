import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { sessionService, chatService, voiceService } from '../api/services';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';
import {
  PaperAirplaneIcon,
  MicrophoneIcon,
  StopIcon,
  ArrowLeftIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';

const SessionChat = () => {
  const { t } = useTranslation();
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [confirmEndSession, setConfirmEndSession] = useState(false);
  const [crisisInfo, setCrisisInfo] = useState(null);
  
  // Otomatik kaydırma için
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Seans ve mesajları yükle
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await sessionService.getSession(sessionId);
        setSession(response.data);
        setMessages(response.data.messages || []);
      } catch (err) {
        console.error('Error fetching session:', err);
        setError(err.message || 'Seans verileri yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);
  
  // Yeni mesajlar geldiğinde otomatik kaydır
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Ses kaydı için gereken bileşenleri hazırla
  useEffect(() => {
    let mounted = true;
    
    // Ses kaydı yapılabilir mi kontrol et
    const checkAudioPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (mounted) {
          // MediaRecorder oluştur
          const recorder = new MediaRecorder(stream);
          
          // Veri topla
          recorder.ondataavailable = (e) => {
            if (e.data.size > 0) {
              setAudioChunks((chunks) => [...chunks, e.data]);
            }
          };
          
          // Kayıt tamamlandığında
          recorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            await handleVoiceSubmit(audioBlob);
            setAudioChunks([]);
          };
          
          setMediaRecorder(recorder);
        }
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };
    
    if (currentUser?.voice_enabled) {
      checkAudioPermission();
    }
    
    return () => {
      mounted = false;
    };
  }, [currentUser, audioChunks]);
  
  // Mesaj gönder
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim() || sending) return;
    
    try {
      setSending(true);
      
      // Mesajı kullanıcı tarafından ekle
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: inputValue,
        is_voice: false,
        created_at: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setInputValue('');
      
      // API'ye gönder
      const response = await chatService.sendMessage(sessionId, inputValue);
      
      // AI yanıtını ekle
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        created_at: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // Kriz durumu bildirimi
      if (response.data.crisis_detected && response.data.emergency_info) {
        setCrisisInfo(response.data.emergency_info);
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message || 'Mesaj gönderilirken bir hata oluştu.');
    } finally {
      setSending(false);
    }
  };
  
  // Ses kaydını başlat
  const startRecording = () => {
    if (mediaRecorder) {
      setIsRecording(true);
      setAudioChunks([]);
      mediaRecorder.start();
    }
  };
  
  // Ses kaydını durdur
  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      setIsRecording(false);
      mediaRecorder.stop();
    }
  };
  
  // Ses dosyasını gönder
  const handleVoiceSubmit = async (audioBlob) => {
    if (!audioBlob || sending) return;
    
    try {
      setSending(true);
      
      // API'ye ses dosyasını gönder
      const response = await voiceService.sendVoiceMessage(sessionId, audioBlob);
      
      // Kullanıcı mesajını ekle (transcribe edilmiş içerikle)
      const userMessage = {
        id: Date.now(),
        role: 'user',
        content: response.data.transcribed_text || "Ses mesajı",
        is_voice: true,
        created_at: new Date().toISOString()
      };
      
      // AI yanıtını ekle
      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.data.response,
        created_at: new Date().toISOString()
      };
      
      setMessages((prev) => [...prev, userMessage, aiMessage]);
      
      // Kriz durumu bildirimi
      if (response.data.crisis_detected && response.data.emergency_info) {
        setCrisisInfo(response.data.emergency_info);
      }
      
    } catch (err) {
      console.error('Error sending voice message:', err);
      setError(err.message || 'Ses mesajı gönderilirken bir hata oluştu.');
    } finally {
      setSending(false);
    }
  };
  
  // Dosya seçildiğinde
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      try {
        setSending(true);
        
        // Ses dosyasını gönder
        const response = await voiceService.sendVoiceMessage(sessionId, file);
        
        // Kullanıcı mesajını ekle
        const userMessage = {
          id: Date.now(),
          role: 'user',
          content: response.data.transcribed_text || "Ses mesajı",
          is_voice: true,
          created_at: new Date().toISOString()
        };
        
        // AI yanıtını ekle
        const aiMessage = {
          id: Date.now() + 1,
          role: 'assistant',
          content: response.data.response,
          created_at: new Date().toISOString()
        };
        
        setMessages((prev) => [...prev, userMessage, aiMessage]);
        
      } catch (err) {
        console.error('Error uploading audio file:', err);
        setError(err.message || 'Ses dosyası yüklenirken bir hata oluştu.');
      } finally {
        setSending(false);
        e.target.value = null; // Input'u sıfırla
      }
    }
  };
  
  // Seansı bitir
  const handleEndSession = async () => {
    try {
      await sessionService.endSession(sessionId);
      setSession((prev) => ({ ...prev, ended_at: new Date().toISOString() }));
      setConfirmEndSession(false);
    } catch (err) {
      console.error('Error ending session:', err);
      setError(err.message || 'Seans sonlandırılırken bir hata oluştu.');
    }
  };
  
  if (loading) {
    return <Loading fullScreen />;
  }
  
  if (!session) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Alert
          type="error"
          message="Seans bulunamadı."
          onClose={() => navigate('/sessions')}
        />
        <div className="mt-4">
          <Button
            onClick={() => navigate('/sessions')}
            variant="primary"
          >
            Seanslara Dön
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Başlık ve bilgi alanı */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/sessions')}
              className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-medium text-gray-900 dark:text-white">
                {session.title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t(`therapy.approaches.${session.therapy_approach}`)}
              </p>
            </div>
          </div>
          <div>
            {!session.ended_at ? (
              <Button
                onClick={() => setConfirmEndSession(true)}
                variant="outline"
                size="small"
              >
                {t('therapy.endSession')}
              </Button>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                Tamamlandı
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Ana sohbet alanı */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Mesajlar */}
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">
                {t('therapy.startConversation')}
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700'
                  } ${message.is_voice ? 'italic' : ''}`}
                >
                  {message.is_voice && <span className="text-xs mr-1">🎤</span>}
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <div
                    className={`text-xs mt-1 ${
                      message.role === 'user'
                        ? 'text-blue-200'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {new Date(message.created_at).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Kriz durumu uyarısı */}
          {crisisInfo && (
            <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-30 border-l-4 border-red-500 p-4 rounded-md my-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                    {t('chat.crisisDetected')}
                  </h3>
                  <div className="mt-2 text-sm text-red-700 dark:text-red-200">
                    <p>{t('chat.crisisMessage')}</p>
                    <p className="mt-2 font-semibold">{t('chat.emergencyContacts')}:</p>
                    <ul className="list-disc list-inside mt-1">
                      {Object.entries(crisisInfo).map(([key, value]) => (
                        <li key={key}>
                          {key}: <span className="font-bold">{value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setCrisisInfo(null)}
                      className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 dark:hover:bg-red-800 focus:outline-none"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Seans sonu bilgisi */}
          {session.ended_at && (
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-center my-4">
              <div className="flex justify-center mb-2">
                <InformationCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                Bu seans {new Date(session.ended_at).toLocaleDateString('tr-TR', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} tarihinde tamamlanmıştır.
              </p>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => navigate('/new-session')}
              >
                {t('therapy.newSession')}
              </Button>
            </div>
          )}
          
          {/* Mesajları gördüğümüzden emin olmak için boş div */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input alanı */}
      {!session.ended_at && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="flex items-center">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('chat.messagePlaceholder')}
                disabled={sending || isRecording}
                className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              />
              
              {currentUser?.voice_enabled && !isRecording && (
                <button
                  type="button"
                  onClick={startRecording}
                  disabled={sending}
                  className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 disabled:opacity-50"
                >
                  <MicrophoneIcon className="h-5 w-5" />
                </button>
              )}
              
              {isRecording && (
                <button
                  type="button"
                  onClick={stopRecording}
                  className="p-2 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:hover:bg-red-800 text-red-600 dark:text-red-300"
                >
                  <StopIcon className="h-5 w-5" />
                </button>
              )}
              
              <button
                type="submit"
                disabled={!inputValue.trim() || sending || isRecording}
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-r-lg disabled:opacity-50"
              >
                {sending ? (
                  <Loading size="small" />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5" />
                )}
              </button>
              
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
                className="hidden"
              />
            </form>
            
            {isRecording && (
              <div className="text-center mt-2 text-sm font-medium text-red-600 dark:text-red-400 animate-pulse">
                {t('chat.voiceRecording')}
              </div>
            )}
            
            {error && (
              <Alert
                type="error"
                message={error}
                onClose={() => setError(null)}
                className="mt-2"
              />
            )}
          </div>
        </div>
      )}
      
      {/* Seansı sonlandırma onay modalı */}
      {confirmEndSession && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setConfirmEndSession(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 sm:mx-0 sm:h-10 sm:w-10">
                    <InformationCircleIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      {t('therapy.endSession')}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Seansı sonlandırmak istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={handleEndSession}
                  variant="primary"
                  className="sm:ml-3"
                >
                  {t('therapy.endSession')}
                </Button>
                <Button
                  onClick={() => setConfirmEndSession(false)}
                  variant="secondary"
                  className="mt-3 sm:mt-0"
                >
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionChat;