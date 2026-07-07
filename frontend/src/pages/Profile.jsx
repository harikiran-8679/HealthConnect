import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguages } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Link, Navigate } from 'react-router-dom';
import { HiUser, HiAdjustments, HiTranslate, HiEye } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Profile() {
  const { t } = useTranslation();
  const { user, updateProfile, logout } = useAuth();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguages();
  const { highContrast, largeText, minDataMode, toggleHighContrast, toggleLargeText, toggleMinDataMode } = useTheme();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ name, phone, preferredLanguage: currentLanguage });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-12">
      <h1 className="section-title mb-8">{t('auth.profile')}</h1>

      <div className="space-y-6">
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center">
              <HiUser className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <span className="inline-block mt-1 px-3 py-0.5 bg-primary-50 text-primary-700 text-xs font-semibold rounded-full capitalize">
                {user.role}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.name')}</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phone')}</label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.preferredLanguage')}</label>
              <select
                value={currentLanguage}
                onChange={e => changeLanguage(e.target.value)}
                className="input-field"
              >
                {supportedLanguages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.nativeName} ({lang.name})</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? t('common.loading') : t('auth.updateProfile')}
            </button>
          </form>
        </div>

        <div className="card">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <HiEye className="w-5 h-5" />
            {t('common.highContrast')} & {t('common.largeText')}
          </h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{t('common.highContrast')}</span>
              <button
                onClick={toggleHighContrast}
                className={`w-12 h-7 rounded-full transition-colors relative ${highContrast ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${highContrast ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{t('common.largeText')}</span>
              <button
                onClick={toggleLargeText}
                className={`w-12 h-7 rounded-full transition-colors relative ${largeText ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${largeText ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer">
              <span className="text-sm font-medium text-gray-700">{t('common.minData')}</span>
              <button
                onClick={toggleMinDataMode}
                className={`w-12 h-7 rounded-full transition-colors relative ${minDataMode ? 'bg-primary-600' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${minDataMode ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </label>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={logout} className="btn-secondary text-red-600 border-red-200 hover:bg-red-50 w-full justify-center">
            {t('nav.logout')}
          </button>
        </div>
      </div>
    </div>
  );
}
