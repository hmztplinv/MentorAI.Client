import React from 'react';
import { useTranslation } from 'react-i18next';

const Loading = ({ fullScreen = false, size = 'medium', text }) => {
  const { t } = useTranslation();
  
  // Spinner boyutları
  const sizes = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-4',
    large: 'h-12 w-12 border-4',
  };

  // Tam ekran loading
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 z-50">
        <div className="text-center">
          <div
            className={`${sizes.large} inline-block animate-spin rounded-full border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400`}
            role="status"
          ></div>
          <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
            {text || t('common.loading')}
          </p>
        </div>
      </div>
    );
  }

  // Inline loading
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`${sizes[size]} inline-block animate-spin rounded-full border-gray-300 border-t-blue-600 dark:border-gray-700 dark:border-t-blue-400`}
        role="status"
      ></div>
      {text && (
        <p className="ml-3 text-gray-700 dark:text-gray-300">{text}</p>
      )}
    </div>
  );
};

export default Loading;