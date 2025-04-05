import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../components/common/Button';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="text-6xl font-bold text-gray-300 dark:text-gray-700">404</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        {t('error.notFound')}
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Aradığınız sayfa bulunamadı.
      </p>
      <div className="mt-6">
        <Link to="/">
          <Button variant="primary">
            {t('common.home')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;