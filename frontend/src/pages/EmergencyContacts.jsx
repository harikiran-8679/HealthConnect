import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { emergencyContacts as contactsApi } from '../services/api';
import { HiPhone, HiOutlineFilter } from 'react-icons/hi';

const contactTypes = ['all', 'ambulance', 'hospital', 'clinic', 'police', 'fire', 'womenHelpline', 'childHelpline', 'poisonControl'];

const typeColors = {
  ambulance: 'bg-red-500',
  hospital: 'bg-blue-500',
  clinic: 'bg-teal-500',
  police: 'bg-indigo-500',
  fire: 'bg-orange-500',
  womenHelpline: 'bg-pink-500',
  childHelpline: 'bg-purple-500',
  poisonControl: 'bg-amber-500',
};

const typeIcons = {
  ambulance: '🚑',
  hospital: '🏥',
  clinic: '🏪',
  police: '👮',
  fire: '🔥',
  womenHelpline: '👩',
  childHelpline: '👶',
  poisonControl: '☠️',
};

export default function EmergencyContacts() {
  const { t } = useTranslation();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (activeType !== 'all') {
      const typeMap = {
        ambulance: 'ambulance',
        hospital: 'hospital',
        clinic: 'clinic',
        police: 'police',
        fire: 'fire',
        womenHelpline: 'women_helpline',
        childHelpline: 'child_helpline',
        poisonControl: 'poison_control',
      };
      params.type = typeMap[activeType];
    }

    contactsApi.list(params)
      .then(res => setContacts(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [activeType]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="section-title">{t('emergency.title')}</h1>
        <p className="section-subtitle">{t('emergency.subtitle')}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {contactTypes.map(type => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
              activeType === type
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50'
            }`}
          >
            {type === 'all' ? t('emergency.allTypes') : `${typeIcons[type] || ''} ${t(`emergency.${type}`)}`}
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
          <button onClick={() => window.location.reload()} className="btn-primary">{t('common.retry')}</button>
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16">
          <HiPhone className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('emergency.noContacts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contacts.map(contact => (
            <div key={contact.id} className="card flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${typeColors[contact.type] || 'bg-gray-400'} rounded-xl flex items-center justify-center text-white text-xl shrink-0`}>
                  {typeIcons[contact.type] || '📞'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{contact.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">{t(`emergency.${contact.type}`)}</p>
                  {contact.district && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {[contact.state, contact.district, contact.village].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-2 px-5 py-3 bg-green-100 text-green-700 font-bold rounded-xl hover:bg-green-200 transition-all text-lg min-h-[48px]"
              >
                <HiPhone className="w-5 h-5" />
                {contact.phone}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
