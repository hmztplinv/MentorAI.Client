import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';

const Settings = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  const [showAlert, setShowAlert] = React.useState(false);

  const handleDataExport = () => {
    const userData = {
      user: currentUser,
      settings: {
        darkMode,
        language
      },
      exportDate: new Date().toISOString()
    };
    
    const jsonString = JSON.stringify(userData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-psikolog-${currentUser.username}-data.json`;
    document.body.appendChild(a);
    a.click();
    
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setShowAlert(true);
    }, 100);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('common.settings')}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('profile.title')}
          </p>
        </div>
        
        {showAlert && (
          <Alert
            type="success"
            message="Verileriniz başarıyla indirildi."
            autoClose
            duration={3000}
            onClose={() => setShowAlert(false)}
            className="mx-4"
          />
        )}
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                {t('profile.language')}
              </h3>
              <div className="mt-2 flex space-x-4">
                <Button
                  variant={language === 'tr' ? 'primary' : 'secondary'}
                  onClick={() => changeLanguage('tr')}
                >
                  Türkçe
                </Button>
                <Button
                  variant={language === 'en' ? 'primary' : 'secondary'}
                  onClick={() => changeLanguage('en')}
                >
                  English
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                {t('profile.darkMode')}
              </h3>
              <div className="mt-2">
                <Button
                  variant={darkMode ? 'secondary' : 'primary'}
                  onClick={toggleTheme}
                >
                  {darkMode ? 'Açık Tema' : 'Koyu Tema'}
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                Veri Yönetimi
              </h3>
              <div className="mt-2 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button
                  variant="success"
                  onClick={handleDataExport}
                >
                  Verileri Dışa Aktar
                </Button>
                <Button
                  variant="danger"
                >
                  Sohbet Geçmişini Temizle
                </Button>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-md font-medium text-gray-900 dark:text-white">
                Uygulama Bilgileri
              </h3>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                <p>Versiyon: 0.1.0</p>
                <p className="mt-1">AI Model: Phi-4</p>
                <p className="mt-3">
                  Bu uygulama profesyonel psikolojik destek hizmeti sunmamaktadır. 
                  Lütfen ciddi psikolojik sorunlar için bir uzmana başvurun.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;