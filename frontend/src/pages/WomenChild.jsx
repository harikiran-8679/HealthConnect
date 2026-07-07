import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { womenChild as womenChildApi } from '../services/api';
import { HiHeart, HiChevronDown, HiChevronUp } from 'react-icons/hi';

const categoryMap = {
  pregnancyCare: 'pregnancy_care',
  newbornCare: 'newborn_care',
  childGrowth: 'child_growth',
  maternalNutrition: 'maternal_nutrition',
};

const reverseCategoryMap = Object.fromEntries(
  Object.entries(categoryMap).map(([k, v]) => [v, k])
);

const categories = ['all', 'pregnancyCare', 'newbornCare', 'childGrowth', 'maternalNutrition'];

const categoryIcons = {
  pregnancyCare: '🤰',
  newbornCare: '👶',
  childGrowth: '📈',
  maternalNutrition: '🥗',
};

export default function WomenChild() {
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = { language: i18n.language };
    if (activeCategory !== 'all') params.category = categoryMap[activeCategory];

    womenChildApi.list(params)
      .then(res => setItems(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [i18n.language, activeCategory]);

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
        <h1 className="section-title">{t('womenChild.title')}</h1>
        <p className="section-subtitle">{t('womenChild.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeCategory === cat
                ? 'bg-pink-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-pink-50 hover:border-pink-200'
            }`}
          >
            {cat === 'all' ? t('womenChild.allCategories') : `${categoryIcons[cat] || ''} ${t(`womenChild.${cat}`)}`}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16">
          <HiHeart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('womenChild.noContent')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div key={item.id} className="card overflow-hidden">
              <button
                onClick={() => toggleExpand(item.id)}
                className="w-full flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-xl shrink-0">
                    {categoryIcons[reverseCategoryMap[item.category]] || '❤️'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{item.title || ''}</h3>
                    <span className="text-xs font-medium text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                      {t(`womenChild.${reverseCategoryMap[item.category] || item.category}`)}
                    </span>
                  </div>
                </div>
                {expandedId === item.id ? (
                  <HiChevronUp className="w-6 h-6 text-gray-400 shrink-0" />
                ) : (
                  <HiChevronDown className="w-6 h-6 text-gray-400 shrink-0" />
                )}
              </button>

              {expandedId === item.id && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                      loading="lazy"
                    />
                  )}
                  <p className="text-gray-700 text-base leading-relaxed">{item.body || ''}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
