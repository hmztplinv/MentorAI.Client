import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
  });
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    
    // Form doğrulama
    if (!formData.username) {
      setFormError(t('auth.usernameRequired'));
      return;
    }

    try {
      await login(formData.username);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setFormError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-gray-800 rounded-xl shadow-soft">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('auth.loginTitle')}
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

          <div className="flex flex-col space-y-4">
            <Button
              type="submit"
              fullWidth
              disabled={loading}
            >
              {loading ? <Loading size="small" /> : t('common.login')}
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.registerTitle')}?{' '}
              </span>
              <Link
                to="/register"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
              >
                {t('common.register')}
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;