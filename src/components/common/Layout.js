import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { 
  HomeIcon, 
  ChatBubbleLeftRightIcon, 
  UserIcon, 
  Cog6ToothIcon, 
  MoonIcon, 
  SunIcon, 
  ArrowRightOnRectangleIcon,
  LanguageIcon
} from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const location = useLocation();

  // Akif sayfayı kontrol et
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Sidebar - Sadece giriş yapmış kullanıcılar için */}
      {currentUser && (
        <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-gray-700">
            <a href="/"><h2 className="text-xl font-semibold text-gray-800 dark:text-white">Mentor AI</h2></a>
          </div>
          <div className="flex flex-col flex-grow p-4 overflow-y-auto">
            <nav className="flex-1 space-y-2">
              <Link
                to="/"
                className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive('/') ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <HomeIcon className="w-5 h-5 mr-3" />
                <span>{t('common.home')}</span>
              </Link>
              <Link
                to="/sessions"
                className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive('/sessions') ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <ChatBubbleLeftRightIcon className="w-5 h-5 mr-3" />
                <span>{t('therapy.sessionHistory')}</span>
              </Link>
              <Link
                to="/profile"
                className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive('/profile') ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <UserIcon className="w-5 h-5 mr-3" />
                <span>{t('profile.title')}</span>
              </Link>
              <Link
                to="/settings"
                className={`flex items-center px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  isActive('/settings') ? 'bg-gray-100 dark:bg-gray-700' : ''
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5 mr-3" />
                <span>{t('common.settings')}</span>
              </Link>
            </nav>
          </div>
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <UserIcon className="w-5 h-5 mr-2 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {currentUser.username}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={t('common.logout')}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="flex justify-between">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={darkMode ? 'Açık Tema' : 'Koyu Tema'}
              >
                {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => changeLanguage(language === 'tr' ? 'en' : 'tr')}
                className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                title={language === 'tr' ? 'English' : 'Türkçe'}
              >
                <LanguageIcon className="w-5 h-5" />
                <span className="ml-1 text-xs">{language === 'tr' ? 'EN' : 'TR'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobil menü - Sadece giriş yapmış kullanıcılar için */}
      {currentUser && (
        <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="grid h-full grid-cols-5">
            <Link
              to="/"
              className={`flex flex-col items-center justify-center ${
                isActive('/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">{t('common.home')}</span>
            </Link>
            <Link
              to="/sessions"
              className={`flex flex-col items-center justify-center ${
                isActive('/sessions') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              <span className="text-xs">{t('therapy.sessionHistory')}</span>
            </Link>
            <Link
              to="/profile"
              className={`flex flex-col items-center justify-center ${
                isActive('/profile') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <UserIcon className="w-6 h-6" />
              <span className="text-xs">{t('profile.title')}</span>
            </Link>
            <Link
              to="/settings"
              className={`flex flex-col items-center justify-center ${
                isActive('/settings') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Cog6ToothIcon className="w-6 h-6" />
              <span className="text-xs">{t('common.settings')}</span>
            </Link>
            <button
              onClick={() => {
                const menu = document.getElementById('mobile-menu');
                if (menu) {
                  menu.classList.toggle('hidden');
                }
              }}
              className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-400"
            >
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="space-y-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </div>
              <span className="text-xs">Daha Fazla</span>
            </button>
          </div>
          
          {/* Mobil menü açılır panel */}
          <div
            id="mobile-menu"
            className="hidden fixed inset-0 z-40 bg-black bg-opacity-50"
            onClick={(e) => {
              if (e.target.id === 'mobile-menu') {
                e.target.classList.add('hidden');
              }
            }}
          >
            <div className="absolute bottom-16 right-0 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-lg">
              <div className="p-4 space-y-3">
                <button
                  onClick={toggleTheme}
                  className="flex items-center w-full px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {darkMode ? <SunIcon className="w-5 h-5 mr-2" /> : <MoonIcon className="w-5 h-5 mr-2" />}
                  <span>{darkMode ? 'Açık Tema' : 'Koyu Tema'}</span>
                </button>
                <button
                  onClick={() => {
                    changeLanguage(language === 'tr' ? 'en' : 'tr');
                    document.getElementById('mobile-menu').classList.add('hidden');
                  }}
                  className="flex items-center w-full px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <LanguageIcon className="w-5 h-5 mr-2" />
                  <span>{language === 'tr' ? 'English' : 'Türkçe'}</span>
                </button>
                <button
                  onClick={() => {
                    logout();
                    document.getElementById('mobile-menu').classList.add('hidden');
                  }}
                  className="flex items-center w-full px-2 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-2" />
                  <span>{t('common.logout')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ana içerik */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Üst navigasyon - Sadece giriş yapmamış kullanıcılar için */}
        {!currentUser && (
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
                    Mentor AI
                  </Link>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={darkMode ? 'Açık Tema' : 'Koyu Tema'}
                  >
                    {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => changeLanguage(language === 'tr' ? 'en' : 'tr')}
                    className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                    title={language === 'tr' ? 'English' : 'Türkçe'}
                  >
                    <span className="text-sm">{language === 'tr' ? 'EN' : 'TR'}</span>
                  </button>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:bg-transparent dark:hover:bg-blue-900"
                  >
                    {t('common.register')}
                  </Link>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Sayfa içeriği */}
        <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 ${currentUser ? 'pb-20 md:pb-6' : ''}`}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;