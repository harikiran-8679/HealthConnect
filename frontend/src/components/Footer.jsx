import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { HiHeart } from 'react-icons/hi';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-extrabold">HC</span>
              </div>
              <span className="text-xl font-bold text-white">{t('app.name')}</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('app.tagline')}
            </p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              {[
                { path: '/health-tips', label: t('nav.healthTips') },
                { path: '/diseases', label: t('nav.diseases') },
                { path: '/vaccinations', label: t('nav.vaccinations') },
                { path: '/emergency', label: t('nav.emergency') },
                { path: '/women-child', label: t('nav.womenChild') },
              ].map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="block text-sm text-gray-400 hover:text-white transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Emergency</h3>
            <div className="space-y-3">
              <a href="tel:108" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">108</span>
                National Ambulance
              </a>
              <a href="tel:181" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <span className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">181</span>
                Women's Helpline
              </a>
              <a href="tel:1098" className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors">
                <span className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">1098</span>
                Child Helpline
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-1">
            &copy; {new Date().getFullYear()} {t('app.name')}. Made with <HiHeart className="text-red-500" /> for healthier communities.
          </p>
        </div>
      </div>
    </footer>
  );
}
