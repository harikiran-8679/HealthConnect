import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { search as searchApi } from '../services/api';
import { HiSearch, HiLightBulb, HiShieldCheck, HiHeart } from 'react-icons/hi';

export default function Search() {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length >= 2) {
      setLoading(true);
      searchApi.search({ q: query, language: i18n.language })
        .then(res => setResults(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setResults([]);
    }
  }, [query, i18n.language]);

  const getIcon = (type) => {
    switch (type) {
      case 'health_tip': return <HiLightBulb className="w-5 h-5 text-emerald-600" />;
      case 'disease': return <HiShieldCheck className="w-5 h-5 text-blue-600" />;
      case 'women_child': return <HiHeart className="w-5 h-5 text-pink-600" />;
      default: return <HiSearch className="w-5 h-5 text-gray-400" />;
    }
  };

  const getLink = (result) => {
    switch (result.type) {
      case 'health_tip': return `/health-tips?id=${result.id}`;
      case 'disease': return `/diseases?id=${result.id}`;
      case 'women_child': return `/women-child?id=${result.id}`;
      default: return '/';
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'health_tip': return t('nav.healthTips');
      case 'disease': return t('nav.diseases');
      case 'women_child': return t('nav.womenChild');
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="section-title">
          {query ? `Results for "${query}"` : t('common.search')}
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-16">
          <HiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {results.map((result, index) => (
            <Link
              key={`${result.type}-${result.id}-${index}`}
              to={getLink(result)}
              className="card flex items-start gap-4 hover:bg-gray-50 cursor-pointer"
            >
              <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                {getIcon(result.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{result.title}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full shrink-0">
                    {getTypeLabel(result.type)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{result.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
