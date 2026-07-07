import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { diseases as diseasesApi } from '../services/api';
import { HiShieldCheck, HiChevronDown, HiChevronUp } from 'react-icons/hi';

export default function Diseases() {
  const { t, i18n } = useTranslation();
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    diseasesApi.list({ language: i18n.language })
      .then(res => setDiseases(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">{t('common.retry')}</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="section-title">{t('diseases.title')}</h1>
        <p className="section-subtitle">{t('diseases.subtitle')}</p>
      </div>

      {diseases.length === 0 ? (
        <div className="text-center py-16">
          <HiShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('diseases.noDiseases')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {diseases.map(disease => (
            <div key={disease.id} className="card overflow-hidden">
              <button
                onClick={() => toggleExpand(disease.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                    <HiShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{disease.name || ''}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1">{disease.symptoms || ''}</p>
                  </div>
                </div>
                {expandedId === disease.id ? (
                  <HiChevronUp className="w-6 h-6 text-gray-400 shrink-0" />
                ) : (
                  <HiChevronDown className="w-6 h-6 text-gray-400 shrink-0" />
                )}
              </button>

              {expandedId === disease.id && (
                <div className="mt-5 pt-5 border-t border-gray-100 space-y-5">
                  <div>
                    <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full" />
                      {t('diseases.symptoms')}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{disease.symptoms || ''}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-blue-500 rounded-full" />
                      {t('diseases.prevention')}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{disease.prevention || ''}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      {t('diseases.careTips')}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{disease.careTips || ''}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
