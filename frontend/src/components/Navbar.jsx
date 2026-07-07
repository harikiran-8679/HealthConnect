import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguages } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { HiMenu, HiX, HiHome, HiLightBulb, HiShieldCheck, HiCalendar, HiPhone, HiHeart, HiSearch, HiTranslate, HiSun, HiAdjustments, HiUser, HiLogout, HiLogin } from 'react-icons/hi';

export default function Navbar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguages();
  const { highContrast, toggleHighContrast, largeText, toggleLargeText } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langOpen, setLangOpen] = useState(false);

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: HiHome },
    { path: '/health-tips', label: t('nav.healthTips'), icon: HiLightBulb },
    { path: '/diseases', label: t('nav.diseases'), icon: HiShieldCheck },
    { path: '/vaccinations', label: t('nav.vaccinations'), icon: HiCalendar },
    { path: '/emergency', label: t('nav.emergency'), icon: HiPhone },
    { path: '/women-child', label: t('nav.womenChild'), icon: HiHeart },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setMenuOpen(false)}>
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-extrabold text-lg md:text-xl">HC</span>
            </div>
            <span className="text-lg md:text-xl font-bold text-gray-900 hidden sm:block">{t('app.name')}</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link ${isActive(link.path) ? 'nav-link-active' : ''}`}
              >
                <link.icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="btn-ghost p-2.5 rounded-xl"
              aria-label="Search"
            >
              <HiSearch className="w-5 h-5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="btn-ghost p-2.5 rounded-xl"
                aria-label={t('common.language')}
              >
                <HiTranslate className="w-5 h-5" />
                <span className="ml-1 text-xs font-bold uppercase hidden md:block">{currentLanguage}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  {supportedLanguages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => { changeLanguage(lang.code); setLangOpen(false); }}
                      className={`w-full text-left px-4 py-3 text-sm hover:bg-primary-50 transition-colors ${currentLanguage === lang.code ? 'bg-primary-50 text-primary-700 font-semibold' : 'text-gray-700'}`}
                    >
                      <span className="font-medium">{lang.nativeName}</span>
                      <span className="text-gray-400 ml-2">({lang.name})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={toggleHighContrast}
              className={`btn-ghost p-2.5 rounded-xl ${highContrast ? 'bg-gray-100' : ''}`}
              aria-label={t('common.highContrast')}
            >
              <HiAdjustments className="w-5 h-5" />
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/profile" className="btn-ghost p-2.5 rounded-xl">
                  <HiUser className="w-5 h-5" />
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={`btn-ghost p-2.5 rounded-xl ${isActive('/admin') ? 'nav-link-active' : ''}`}>
                    <span className="text-sm font-medium">{t('nav.admin')}</span>
                  </Link>
                )}
                <button onClick={logout} className="btn-ghost p-2.5 rounded-xl" aria-label={t('nav.logout')}>
                  <HiLogout className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login" className="btn-ghost p-2.5 rounded-xl">
                  <HiLogin className="w-5 h-5" />
                  <span className="ml-1 text-sm font-medium">{t('nav.login')}</span>
                </Link>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden btn-ghost p-2.5 rounded-xl"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-3">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('nav.search')}
              className="input-field flex-1"
              autoFocus
            />
            <button type="submit" className="btn-primary px-6">
              <HiSearch className="w-5 h-5" />
              <span className="ml-2">{t('common.search')}</span>
            </button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                isActive(link.path) ? 'bg-primary-50 text-primary-700' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
          <hr className="my-3 border-gray-100" />
          {user ? (
            <>
              <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50">
                <HiUser className="w-5 h-5" />
                {t('nav.profile')}
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-gray-600 hover:bg-gray-50">
                  {t('nav.admin')}
                </Link>
              )}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 w-full">
                <HiLogout className="w-5 h-5" />
                {t('nav.logout')}
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium text-primary-600 hover:bg-primary-50">
              <HiLogin className="w-5 h-5" />
              {t('nav.login')}
            </Link>
          )}
          <hr className="my-3 border-gray-100" />
          <div className="px-4 py-2">
            <p className="text-xs font-medium text-gray-400 uppercase mb-2">{t('common.language')}</p>
            <div className="flex gap-2 flex-wrap">
              {supportedLanguages.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { changeLanguage(lang.code); setMenuOpen(false); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentLanguage === lang.code ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
