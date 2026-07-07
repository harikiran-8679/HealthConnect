import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { HiExclamation } from 'react-icons/hi';

export default function OfflineBanner() {
  const { isOffline } = useTheme();
  const { t } = useTranslation();

  if (!isOffline) return null;

  return (
    <div className="bg-amber-500 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
      <HiExclamation className="w-5 h-5 shrink-0" />
      {t('common.offline')}
    </div>
  );
}
