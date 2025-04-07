import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    language: 'tr',
    preferred_therapy_approach: 'cbt',
    voice_enabled: false,
    dark_mode: false,
  });
  const [formError, setFormError] = useState(null);

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    // Form doğrulama
    if (!formData.username) {
      setFormError(t('auth.usernameRequired'));
      return;
    }

    if (formData.username.length < 3) {
      setFormError(t('auth.usernameMinLength'));
      return;
    }

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      console.error('Register error:', err);
      setFormError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-soft">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.registerTitle')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('common.welcome')}
          </p>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => {}} />
        )}

        {formError && (
          <Alert type="error" message={formError} onClose={() => setFormError(null)} />
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <Input
            id="username"
            name="username"
            type="text"
            label={t('auth.username')}
            value={formData.username}
            onChange={handleChange}
            required
          />

          <Select
            id="language"
            name="language"
            label={t('profile.language')}
            value={formData.language}
            onChange={handleChange}
            options={languageOptions}
            required
          />

          <Select
            id="preferred_therapy_approach"
            name="preferred_therapy_approach"
            label={t('profile.therapyApproach')}
            value={formData.preferred_therapy_approach}
            onChange={handleChange}
            options={therapyOptions}
            required
          />

          <div className="flex items-center">
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

          <div className="flex items-center">
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

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? <Loading size="small" /> : t('common.register')}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.loginTitle')}?{' '}
              </span>
              <Link
                to="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                {t('common.login')}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;