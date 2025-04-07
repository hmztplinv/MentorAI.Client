import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

const Profile = () => {
  const { t } = useTranslation();
  const { currentUser, updateUserSettings, loading } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();
  
  const [formData, setFormData] = useState({
    username: '',
    language: '',
    preferred_therapy_approach: '',
    voice_enabled: false,
    dark_mode: false,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  const therapyOptions = [
    { value: 'cbt', label: t('therapy.approaches.cbt') },
    { value: 'psychoanalytic', label: t('therapy.approaches.psychoanalytic') },
    { value: 'humanistic', label: t('therapy.approaches.humanistic') },
    { value: 'existential', label: t('therapy.approaches.existential') },
    { value: 'gestalt', label: t('therapy.approaches.gestalt') },
    { value: 'act', label: t('therapy.approaches.act') },
    { value: 'positive', label: t('therapy.approaches.positive') },
    { value: 'schema', label: t('therapy.approaches.schema') },
    { value: 'solution_focused', label: t('therapy.approaches.solution_focused') },
    { value: 'narrative', label: t('therapy.approaches.narrative') },
    { value: 'family_systems', label: t('therapy.approaches.family_systems') },
    { value: 'dbt', label: t('therapy.approaches.dbt') },
  ];


  const languageOptions = [
    { value: 'tr', label: 'Türkçe' },
    { value: 'en', label: 'English' },
  ];

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || '',
        language: currentUser.language || 'tr',
        preferred_therapy_approach: currentUser.preferred_therapy_approach || 'cbt',
        voice_enabled: currentUser.voice_enabled || false,
        dark_mode: darkMode,
      });
    }
  }, [currentUser, darkMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      if (formData.dark_mode !== darkMode) {
        toggleTheme();
      }
      
      if (formData.language !== language) {
        changeLanguage(formData.language);
      }
      
      await updateUserSettings(currentUser.id, formData);
      setSuccessMessage(t('profile.updateSuccess'));
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message);
    }
  };

  if (!currentUser) {
    return <Loading fullScreen />;
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            {t('profile.title')}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
            {t('common.settings')}
          </p>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-5 sm:p-6">
          {successMessage && (
            <Alert
              type="success"
              message={successMessage}
              autoClose
              onClose={() => setSuccessMessage('')}
              className="mb-4"
            />
          )}
          
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
              className="mb-4"
            />
          )}
          
          <form onSubmit={handleSubmit}>
            <Input
              id="username"
              name="username"
              label={t('auth.username')}
              value={formData.username}
              onChange={handleChange}
              disabled
            />
            
            <Select
              id="language"
              name="language"
              label={t('profile.language')}
              value={formData.language}
              onChange={handleChange}
              options={languageOptions}
            />
            
            <Select
              id="preferred_therapy_approach"
              name="preferred_therapy_approach"
              label={t('profile.therapyApproach')}
              value={formData.preferred_therapy_approach}
              onChange={handleChange}
              options={therapyOptions}
            />
            
            <div className="mt-4">
              <div className="flex items-center mb-4">
                <input
                  id="voice_enabled"
                  name="voice_enabled"
                  type="checkbox"
                  checked={formData.voice_enabled}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="voice_enabled"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  {t('profile.voiceEnabled')}
                </label>
              </div>
              
              <div className="flex items-center mb-6">
                <input
                  id="dark_mode"
                  name="dark_mode"
                  type="checkbox"
                  checked={formData.dark_mode}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="dark_mode"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  {t('profile.darkMode')}
                </label>
              </div>
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                fullWidth
                disabled={loading}
              >
                {loading ? <Loading size="small" /> : t('common.save')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;