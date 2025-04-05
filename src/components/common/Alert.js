import React, { useState, useEffect } from 'react';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

const Alert = ({
  type = 'info',
  title,
  message,
  autoClose = false,
  duration = 5000,
  onClose,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  // Alert tipine göre simge ve renk belirle
  const getAlertProps = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircleIcon className="h-5 w-5 text-green-400" />,
          bgColor: 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20',
          borderColor: 'border-green-400',
          textColor: 'text-green-800 dark:text-green-300',
        };
      case 'error':
        return {
          icon: <ExclamationCircleIcon className="h-5 w-5 text-red-400" />,
          bgColor: 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20',
          borderColor: 'border-red-400',
          textColor: 'text-red-800 dark:text-red-300',
        };
      case 'warning':
        return {
          icon: <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />,
          bgColor: 'bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20',
          borderColor: 'border-yellow-400',
          textColor: 'text-yellow-800 dark:text-yellow-300',
        };
      case 'info':
      default:
        return {
          icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" />,
          bgColor: 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20',
          borderColor: 'border-blue-400',
          textColor: 'text-blue-800 dark:text-blue-300',
        };
    }
  };

  const { icon, bgColor, borderColor, textColor } = getAlertProps();

  // Otomatik kapanma
  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoClose, duration]);

  // Kapatma fonksiyonu
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`rounded-md border-l-4 p-4 ${bgColor} ${borderColor} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{icon}</div>
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${textColor}`}>{title}</h3>
          )}
          {message && (
            <div className={`mt-1 text-sm ${textColor}`}>{message}</div>
          )}
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={handleClose}
              className={`inline-flex rounded-md p-1.5 ${textColor} hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-${type === 'info' ? 'blue' : type === 'success' ? 'green' : type === 'warning' ? 'yellow' : 'red'}-500`}
            >
              <span className="sr-only">Kapat</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alert;