import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { healthTips as healthTipsApi } from '../services/api';
import { HiLightBulb, HiShieldCheck, HiCalendar, HiPhone, HiHeart, HiArrowRight, HiSparkles } from 'react-icons/hi';

export default function Home() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [tips, setTips] = useState([]);

  useEffect(() => {
    healthTipsApi.list({ language: i18n.language, limit: 4 })
      .then(res => setTips(res.data))
      .catch(() => {});
  }, [i18n.language]);

  const quickLinks = [
    { path: '/health-tips', label: t('home.sectionTips'), desc: t('home.sectionTipsDesc'), icon: HiLightBulb, color: 'from-emerald-500 to-teal-600' },
    { path: '/diseases', label: t('home.sectionDiseases'), desc: t('home.sectionDiseasesDesc'), icon: HiShieldCheck, color: 'from-blue-500 to-indigo-600' },
    { path: '/vaccinations', label: t('home.sectionVaccination'), desc: t('home.sectionVaccinationDesc'), icon: HiCalendar, color: 'from-purple-500 to-violet-600' },
    { path: '/emergency', label: t('home.sectionEmergency'), desc: t('home.sectionEmergencyDesc'), icon: HiPhone, color: 'from-red-500 to-rose-600' },
    { path: '/women-child', label: t('home.sectionWomenChild'), desc: t('home.sectionWomenChildDesc'), icon: HiHeart, color: 'from-pink-500 to-fuchsia-600' },
  ];

  return (
    <div>
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
              <HiSparkles className="w-4 h-4" />
              <span>{t('home.quickAccess')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight text-balance">
              {t('home.heroTitle')}
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8 leading-relaxed max-w-2xl">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/health-tips" className="btn-primary bg-white text-primary-700 hover:bg-gray-100 shadow-xl">
                {t('home.learnMore')}
                <HiArrowRight className="ml-2 w-5 h-5" />
              </Link>
              {!user && (
                <Link to="/register" className="btn-secondary border-white/30 text-white hover:bg-white/10">
                  {t('auth.register')}
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {quickLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="card group hover:-translate-y-1 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-all`}>
                <link.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1.5 text-base">{link.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {tips.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">{t('home.sectionTips')}</h2>
              <p className="section-subtitle">{t('home.sectionTipsDesc')}</p>
            </div>
            <Link to="/health-tips" className="btn-ghost text-primary-600 font-semibold hidden sm:flex items-center gap-1">
              {t('home.viewAll')}
              <HiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tips.map(tip => (
              <Link key={tip.id} to={`/health-tips?id=${tip.id}`} className="card group cursor-pointer">
                {tip.imageUrl && (
                  <img
                    src={tip.imageUrl}
                    alt={tip.title}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    loading="lazy"
                  />
                )}
                <span className="inline-block px-3 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full mb-2">
                  {t(`healthTips.${tip.category}`)}
                </span>
                <h3 className="font-semibold text-gray-900 mb-1">{tip.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2">{tip.description}</p>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link to="/health-tips" className="btn-primary">
              {t('home.viewAll')}
              <HiArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </section>
      )}

      <section className="bg-primary-50 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="section-title text-center">{t('app.tagline')}</h2>
          <p className="section-subtitle text-center max-w-2xl mx-auto mb-8">
            {t('home.heroSubtitle')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/emergency" className="btn-primary bg-red-600 hover:bg-red-700 shadow-lg">
              <HiPhone className="w-5 h-5 mr-2" />
              {t('nav.emergency')}
            </Link>
            {!user && (
              <Link to="/register" className="btn-secondary border-primary-300 text-primary-700 hover:bg-primary-100">
                {t('auth.registerBtn')}
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
