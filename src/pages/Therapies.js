import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';
import {
  SparklesIcon,
  LightBulbIcon,
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  StarIcon,
  HeartIcon,
  PuzzlePieceIcon,
  BookOpenIcon,
  ArrowPathIcon,
  PencilIcon,
  HomeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const Therapies = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Tüm terapi yaklaşımları
  const therapies = [
    {
      id: 'cbt',
      title: t('therapy.approaches.cbt'),
      description: 'Düşüncelerin, duyguların ve davranışların nasıl birbiriyle bağlantılı olduğunu anlamaya odaklanır. Olumsuz düşünce kalıplarını değiştirmeye yardımcı olur.',
      icon: <SparklesIcon className="h-8 w-8" />,
      color: 'bg-therapist-cbt',
    },
    {
      id: 'psychoanalytic',
      title: t('therapy.approaches.psychoanalytic'),
      description: 'Bilinçaltı süreçleri ve erken yaşam deneyimlerini keşfederek, bugünkü davranışlarınızı ve ilişkilerinizi etkileyen bilinçdışı motivasyonları anlamaya yardımcı olur.',
      icon: <BookOpenIcon className="h-8 w-8" />,
      color: 'bg-therapist-psychoanalytic',
    },
    {
      id: 'humanistic',
      title: t('therapy.approaches.humanistic'),
      description: 'Kişisel büyüme ve kendini gerçekleştirme potansiyelinizi artırmaya odaklanır. Koşulsuz olumlu kabul ve empatiye dayanır.',
      icon: <HeartIcon className="h-8 w-8" />,
      color: 'bg-therapist-humanistic',
    },
    {
      id: 'existential',
      title: t('therapy.approaches.existential'),
      description: 'Hayatın anlamı, özgürlük, ölüm ve yalnızlık gibi varoluşsal konuları ele alır. Kendi değerlerinizi keşfetmenize ve otantik bir hayat sürmenize yardımcı olur.',
      icon: <GlobeAltIcon className="h-8 w-8" />,
      color: 'bg-therapist-existential',
    },
    {
      id: 'gestalt',
      title: t('therapy.approaches.gestalt'),
      description: '"Şimdi ve burada" odaklı, farkındalığı artırmayı hedefleyen bir yaklaşım. Bütünsel deneyimlere ve duyguların kabulüne odaklanır.',
      icon: <PuzzlePieceIcon className="h-8 w-8" />,
      color: 'bg-therapist-gestalt',
    },
    {
      id: 'act',
      title: t('therapy.approaches.act'),
      description: 'Kabul, bilinçli farkındalık ve değerler doğrultusunda harekete geçmeye odaklanır. Zor düşünce ve duygularla birlikte yaşamayı öğretir.',
      icon: <LightBulbIcon className="h-8 w-8" />,
      color: 'bg-therapist-act',
    },
    {
      id: 'positive',
      title: t('therapy.approaches.positive'),
      description: 'Güçlü yönlerinize odaklanarak refahınızı ve mutluluğunuzu artırmayı hedefler. Olumlu duygular, bağlılık ve anlamlı yaşam üzerine çalışır.',
      icon: <StarIcon className="h-8 w-8" />,
      color: 'bg-therapist-positive',
    },
    {
      id: 'schema',
      title: t('therapy.approaches.schema'),
      description: 'Çocuklukta oluşan uyumsuz şemaları tanımlayıp değiştirmeye odaklanır. Tekrarlayan olumsuz duygu ve davranış kalıplarının köklerini anlamaya yardımcı olur.',
      icon: <StarIcon className="h-8 w-8" />,
      color: 'bg-therapist-schema',
    },
    {
      id: 'solution_focused',
      title: t('therapy.approaches.solution_focused'),
      description: 'Problemler yerine çözümlere odaklanır. Güçlü yönlerinizi ve geçmiş başarılarınızı kullanarak somut hedefler oluşturmanıza yardımcı olur.',
      icon: <ArrowPathIcon className="h-8 w-8" />,
      color: 'bg-therapist-solution_focused',
    },
    {
      id: 'narrative',
      title: t('therapy.approaches.narrative'),
      description: 'Hayat hikayenizi yeniden yazmanıza yardımcı olur. Problemlerinizi kendinizden ayırarak, kendi hikayeniz üzerinde kontrol sahibi olmanızı sağlar.',
      icon: <PencilIcon className="h-8 w-8" />,
      color: 'bg-therapist-narrative',
    },
    {
      id: 'family_systems',
      title: t('therapy.approaches.family_systems'),
      description: 'Davranışlarınızı aile sistemi bağlamında anlamaya odaklanır. Aile içi kalıplar, roller ve ilişkiler üzerine çalışır.',
      icon: <UserGroupIcon className="h-8 w-8" />,
      color: 'bg-therapist-family_systems',
    },
    {
      id: 'dbt',
      title: t('therapy.approaches.dbt'),
      description: 'Bilinçli farkındalık, duygu düzenleme, sıkıntı toleransı ve kişilerarası beceriler üzerine odaklanır. Yoğun duyguları yönetmeye yardımcı olur.',
      icon: <ChatBubbleLeftRightIcon className="h-8 w-8" />,
      color: 'bg-therapist-dbt',
    }
  ];

  // Yeni seans başlat
  const startNewSession = (therapyApproach) => {
    navigate('/new-session', { state: { therapyApproach } });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Terapi Yaklaşımları
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400">
          Her yaklaşım farklı bir perspektif sunar. Size uygun olanı seçerek seans başlatabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {therapies.map((therapy) => (
          <div
            key={therapy.id}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300 flex flex-col"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className={`inline-flex items-center justify-center p-3 rounded-md ${therapy.color} text-white mb-4`}>
                {therapy.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {therapy.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 flex-grow mb-4">
                {therapy.description}
              </p>
              <Button
                onClick={() => startNewSession(therapy.id)}
                variant="outline"
                fullWidth
                className="mt-2"
              >
                Bu yaklaşımla başla
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="inline-flex items-center"
        >
          <HomeIcon className="h-5 w-5 mr-2" />
          {t('common.home')}
        </Button>
      </div>
    </div>
  );
};

export default Therapies;