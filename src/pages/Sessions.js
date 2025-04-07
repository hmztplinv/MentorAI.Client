import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { sessionService } from '../api/services';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import Alert from '../components/common/Alert';
import {
  ChatBubbleLeftRightIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

const Sessions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [totalSessions, setTotalSessions] = useState(0);

  const fetchSessions = async (page = currentPage) => {
    try {
      setLoading(true);
      setError(null);
      
 
      const skip = (page - 1) * pageSize;
      
      const response = await sessionService.getUserSessions(currentUser.id, skip, pageSize);
      
      if (response.data && response.data.total !== undefined) {
        setSessions(response.data.items || response.data.sessions || []);
        setTotalSessions(response.data.total);
        setTotalPages(Math.ceil(response.data.total / pageSize));
      } else {
        setSessions(response.data);
        setTotalSessions(response.data.length); 
        setTotalPages(Math.ceil(response.data.length / pageSize));
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      setError(err.message || 'Oturumlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchSessions();
    }
  }, [currentUser, pageSize]);

  const handleDeleteSession = async (sessionId) => {
    try {
      await sessionService.deleteSession(sessionId);
      setSessions(sessions.filter(session => session.id !== sessionId));
      setDeleteModalOpen(false);
      setSessionToDelete(null);
      
      if (sessions.length === 1 && currentPage > 1) {
        handlePageChange(currentPage - 1);
      } else {
        fetchSessions(currentPage);
      }
    } catch (err) {
      console.error('Error deleting session:', err);
      setError(err.message || 'Oturum silinirken bir hata oluştu.');
    }
  };

  const openDeleteModal = (session) => {
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    fetchSessions(newPage);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const getTherapyApproachName = (approachKey) => {
    return t(`therapy.approaches.${approachKey}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t('therapy.sessionHistory')}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Geçmiş terapi oturumlarınızın listesi
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => navigate('/new-session')}
            variant="primary"
            className="inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            {t('therapy.newSession')}
          </Button>
        </div>
      </div>
      
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}
      
      {sessions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
            {t('therapy.noSessions')}
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Yeni bir seans başlatarak terapistlerimizle konuşmaya başlayabilirsiniz.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => navigate('/new-session')}
              variant="primary"
            >
              {t('therapy.newSession')}
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {sessions.map((session) => (
              <li key={session.id}>
                <Link
                  to={`/sessions/${session.id}`}
                  className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-full bg-therapist-${session.therapy_approach} flex items-center justify-center text-white`}>
                          <ChatBubbleLeftRightIcon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {session.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {getTherapyApproachName(session.therapy_approach)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="text-right text-sm text-gray-500 dark:text-gray-400 mr-4">
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <time dateTime={session.created_at}>
                              {formatDate(session.created_at)}
                            </time>
                          </div>
                          {session.ended_at && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 mt-1">
                              Tamamlandı
                            </span>
                          )}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            openDeleteModal(session);
                          }}
                          className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Pagination Controls */}
          {sessions.length > 0 && (
            <div className="px-4 py-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-medium">{((currentPage - 1) * pageSize) + 1}</span> - <span className="font-medium">{Math.min(currentPage * pageSize, totalSessions)}</span> / <span className="font-medium">{totalSessions}</span> oturum
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    variant="ghost"
                    size="small"
                    className="px-2 py-1"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-1" />
                    Önceki
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 rounded text-sm ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <Button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    variant="ghost"
                    size="small"
                    className="px-2 py-1"
                  >
                    Sonraki
                    <ChevronRightIcon className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Silme onay modalı */}
      {deleteModalOpen && sessionToDelete && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setDeleteModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white" id="modal-title">
                      Seans Silme
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        "{sessionToDelete.title}" başlıklı seansı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <Button
                  onClick={() => handleDeleteSession(sessionToDelete.id)}
                  variant="danger"
                  className="sm:ml-3"
                >
                  Sil
                </Button>
                <Button
                  onClick={() => setDeleteModalOpen(false)}
                  variant="secondary"
                  className="mt-3 sm:mt-0"
                >
                  İptal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sessions;