import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { sessionService } from '../api/services';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import Loading from '../components/common/Loading';

const NewSession = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Eğer terapist yaklaşımı location state üzerinden geldiyse onu kullan
  const preSelectedTherapy = location.state?.therapyApproach || currentUser?.preferred_therapy_approach || 'cbt';
  
  const [formData, setFormData] = useState({
    title: '',
    therapy_approach: preSelectedTherapy,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Terapi yaklaşımları için seçenekler
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Eğer başlık boşsa, otomatik bir başlık oluştur
      const sessionData = {
        ...formData,
        user_id: currentUser.id,
        title: formData.title || `${t('therapy.approaches.' + formData.therapy_approach)} Seansı - ${new Date().toLocaleString('tr-TR', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}`,
      };
      
      const response = await sessionService.createSession(sessionData);
      setSuccess(true);
      
      // Kısa bir süre sonra yeni oluşturulan seansa yönlendir
      setTimeout(() => {
        navigate(`/sessions/${response.data.id}`);
      }, 1500);
    } catch (err) {
      console.error('Error creating session:', err);
      setError(err.message || 'Seans oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t('therapy.newSession')}
          </h1>
          
          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError(null)}
              className="mb-4"
            />
          )}
          
          {success && (
            <Alert
              type="success"
              message={t('therapy.sessionCreated')}
              className="mb-4"
            />
          )}
          
          <form onSubmit={handleSubmit}>
            <Input
              id="title"
              name="title"
              label={t('therapy.sessionTitle')}
              value={formData.title}
              onChange={handleChange}
              placeholder="Opsiyonel - Boş bırakırsanız otomatik oluşturulur"
            />
            
            <Select
              id="therapy_approach"
              name="therapy_approach"
              label={t('therapy.selectApproach')}
              value={formData.therapy_approach}
              onChange={handleChange}
              options={therapyOptions}
              required
            />
            
            <div className="mt-6 flex items-center justify-between">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(-1)}
              >
                {t('common.cancel')}
              </Button>
              
              <Button
                type="submit"
                disabled={loading}
              >
                {loading ? <Loading size="small" /> : t('therapy.newSession')}
              </Button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            {t(`therapy.approaches.${formData.therapy_approach}`)}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {getTherapyDescription(formData.therapy_approach)}
          </p>
        </div>
      </div>
    </div>
  );
};

// Terapi yaklaşımlarının açıklamaları
const getTherapyDescription = (approach) => {
  const descriptions = {
    cbt: 'Bilişsel Davranışçı Terapi (BDT), düşüncelerin, duyguların ve davranışların nasıl birbiriyle bağlantılı olduğunu anlamaya odaklanır. Olumsuz düşünce kalıplarını değiştirmeye yardımcı olur.',
    psychoanalytic: 'Psikanalitik Terapi, bilinçaltı süreçleri ve erken yaşam deneyimlerini keşfederek, bugünkü davranışlarınızı ve ilişkilerinizi etkileyen bilinçdışı motivasyonları anlamaya yardımcı olur.',
    humanistic: 'Hümanistik Terapi, kişisel büyüme ve kendini gerçekleştirme potansiyelinizi artırmaya odaklanır. Koşulsuz olumlu kabul ve empatiye dayanır.',
    existential: 'Varoluşçu Terapi, hayatın anlamı, özgürlük, ölüm ve yalnızlık gibi varoluşsal konuları ele alır. Kendi değerlerinizi keşfetmenize ve otantik bir hayat sürmenize yardımcı olur.',
    gestalt: 'Gestalt Terapi, "şimdi ve burada" odaklı, farkındalığı artırmayı hedefleyen bir yaklaşımdır. Bütünsel deneyimlere ve duyguların kabulüne odaklanır.',
    act: 'Kabul ve Kararlılık Terapisi (ACT), kabul, bilinçli farkındalık ve değerler doğrultusunda harekete geçmeye odaklanır. Zor düşünce ve duygularla birlikte yaşamayı öğretir.',
    positive: 'Pozitif Psikoloji, güçlü yönlerinize odaklanarak refahınızı ve mutluluğunuzu artırmayı hedefler. Olumlu duygular, bağlılık ve anlamlı yaşam üzerine çalışır.',
    schema: 'Şema Terapi, çocuklukta oluşan uyumsuz şemaları tanımlayıp değiştirmeye odaklanır. Tekrarlayan olumsuz duygu ve davranış kalıplarının köklerini anlamaya yardımcı olur.',
    solution_focused: 'Çözüm Odaklı Kısa Terapi, problemler yerine çözümlere odaklanır. Güçlü yönlerinizi ve geçmiş başarılarınızı kullanarak somut hedefler oluşturmanıza yardımcı olur.',
    narrative: 'Naratif Terapi, hayat hikayenizi yeniden yazmanıza yardımcı olur. Problemlerinizi kendinizden ayırarak, kendi hikayeniz üzerinde kontrol sahibi olmanızı sağlar.',
    family_systems: 'Aile Sistemleri Terapisi, davranışlarınızı aile sistemi bağlamında anlamaya odaklanır. Aile içi kalıplar, roller ve ilişkiler üzerine çalışır.',
    dbt: 'Diyalektik Davranış Terapisi (DBT), bilinçli farkındalık, duygu düzenleme, sıkıntı toleransı ve kişilerarası beceriler üzerine odaklanır. Yoğun duyguları yönetmeye yardımcı olur.'
  };
  
  return descriptions[approach] || '';
};

export default NewSession;