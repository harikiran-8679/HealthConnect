import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { healthTips as healthTipsApi } from '../services/api';
import { HiLightBulb } from 'react-icons/hi';

const categories = ['all', 'hygiene', 'nutrition', 'sanitation', 'seasonal'];

export default function HealthTips() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('id');
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = { language: i18n.language };
    if (activeCategory !== 'all') params.category = activeCategory;

    healthTipsApi.list(params)
      .then(res => setTips(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [i18n.language, activeCategory]);

  const isHighlighted = (tipId) => {
    if (!highlightId) return false;
    return Number(highlightId) === tipId;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="section-title">{t('healthTips.title')}</h1>
        <p className="section-subtitle">{t('healthTips.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50 hover:border-primary-200'
            }`}
          >
            {cat === 'all' ? t('healthTips.allCategories') : t(`healthTips.${cat}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            {t('common.retry')}
          </button>
        </div>
      ) : tips.length === 0 ? (
        <div className="text-center py-16">
          <HiLightBulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('healthTips.noTips')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tips.map(tip => (
            <div
              key={tip.id}
              className={`card ${isHighlighted(tip.id) ? 'ring-2 ring-primary-500 bg-primary-50' : ''}`}
            >
              {tip.imageUrl && (
                <img
                  src={tip.imageUrl}
                  alt={tip.title}
                  className="w-full h-44 object-cover rounded-xl mb-4"
                  loading="lazy"
                />
              )}
              <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-3">
                {t(`healthTips.${tip.category}`)}
              </span>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">{tip.title || ''}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{tip.description || ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
