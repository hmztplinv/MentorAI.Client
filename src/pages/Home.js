import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';
import {
  SparklesIcon, 
  LightBulbIcon, 
  ChatBubbleLeftRightIcon, 
  GlobeAltIcon, 
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Kullanıcı girişi yapmışsa dashboard'a yönlendir
  if (currentUser) {
    return <AuthenticatedHome user={currentUser} />;
  }

  // Kullanıcı girişi yapmamışsa karşılama sayfası göster
  return (
    <div className="py-12">
      {/* Hero Bölümü */}
      <div className="text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">
            {t('landing.title')}
          </span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {t('landing.subtitle')}
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <div className="rounded-md shadow">
            <Link
              to="/register"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
            >
              {t('landing.getStarted')}
            </Link>
          </div>
          <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
            <Link
              to="/login"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 dark:text-blue-400 dark:bg-gray-800 dark:hover:bg-gray-700 md:py-4 md:text-lg md:px-10"
            >
              {t('common.login')}
            </Link>
          </div>
        </div>
      </div>

      {/* Özellikler Bölümü */}
      <div className="py-12 bg-gray-50 dark:bg-gray-800 rounded-xl mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Mentor AI
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Gizlilik odaklı, AI destekli psikolojik destek uygulaması
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <ShieldCheckIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t('landing.featureTitle1')}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  {t('landing.featureDesc1')}
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <LightBulbIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t('landing.featureTitle2')}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  {t('landing.featureDesc2')}
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <GlobeAltIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    {t('landing.featureTitle3')}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500 dark:text-gray-400">
                  {t('landing.featureDesc3')}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Yasal Uyarı */}
      <div className="mt-16 text-center text-gray-500 dark:text-gray-400 text-sm">
        <p>{t('landing.disclaimer')}</p>
      </div>
    </div>
  );
};

// Giriş yapmış kullanıcılar için ana sayfa
const AuthenticatedHome = ({ user }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Terapi yaklaşımlarının bilgileri
  const therapies = [
    {
      id: 'cbt',
      title: t('therapy.approaches.cbt'),
      icon: <SparklesIcon className="h-6 w-6" />,
      color: 'bg-therapist-cbt',
    },
    {
      id: 'psychoanalytic',
      title: t('therapy.approaches.psychoanalytic'),
      icon: <ShieldCheckIcon className="h-6 w-6" />,
      color: 'bg-therapist-psychoanalytic',
    },
    {
      id: 'humanistic',
      title: t('therapy.approaches.humanistic'),
      icon: <ChatBubbleLeftRightIcon className="h-6 w-6" />,
      color: 'bg-therapist-humanistic',
    },
    {
      id: 'existential',
      title: t('therapy.approaches.existential'),
      icon: <GlobeAltIcon className="h-6 w-6" />,
      color: 'bg-therapist-existential',
    },
    {
      id: 'act',
      title: t('therapy.approaches.act'),
      icon: <SparklesIcon className="h-6 w-6" />,
      color: 'bg-therapist-act',
    },
    {
      id: 'dbt',
      title: t('therapy.approaches.dbt'),
      icon: <LightBulbIcon className="h-6 w-6" />,
      color: 'bg-therapist-dbt',
    },
  ];

  // Yeni seans başlat
  const startNewSession = (therapyApproach) => {
    navigate('/new-session', { state: { therapyApproach } });
  };

  return (
    <div className="py-6">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          {t('common.welcome')}, {user.username}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('therapy.selectApproach')}
        </p>
      </div>

      {/* Hızlı Başlangıç */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Hızlı Başlangıç
        </h2>
        <Button
          onClick={() => startNewSession(user.preferred_therapy_approach)}
          variant="primary"
          className="flex items-center"
        >
          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
          {t('therapy.newSession')} ({t(`therapy.approaches.${user.preferred_therapy_approach}`)})
        </Button>
      </div>
      
      {/* Terapi Yaklaşımları */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Terapi Yaklaşımları
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {therapies.map((therapy) => (
            <div
              key={therapy.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => startNewSession(therapy.id)}
            >
              <div className={`inline-flex items-center justify-center p-2 rounded-md ${therapy.color} text-white mb-3`}>
                {therapy.icon}
              </div>
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                {therapy.title}
              </h3>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/therapies"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            Tüm terapi yaklaşımlarını görüntüle
          </Link>
        </div>
      </div>

      {/* Son Oturumlar */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t('therapy.sessionHistory')}
        </h2>
        <Link
          to="/sessions"
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
        >
          Tüm oturumlarımı görüntüle
        </Link>
      </div>
    </div>
  );
};

export default Home;