import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { admin as adminApi, languages as languagesApi, healthTips, diseases, emergencyContacts, womenChild, vaccinations } from '../services/api';
import toast from 'react-hot-toast';
import {
  HiOutlineLightBulb, HiOutlineShieldCheck, HiOutlineCalendar,
  HiOutlinePhone, HiOutlineHeart, HiOutlineTranslate,
  HiChartBar, HiPlus, HiPencil, HiTrash, HiSave, HiX
} from 'react-icons/hi';

const TABS = {
  TIPS: 'tips',
  DISEASES: 'diseases',
  VACCINES: 'vaccines',
  CONTACTS: 'contacts',
  WOMEN_CHILD: 'womenChild',
  LANGUAGES: 'languages',
  ANALYTICS: 'analytics',
};

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(TABS.TIPS);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [communityUsers, setCommunityUsers] = useState([]);
  const [usersError, setUsersError] = useState('');

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const tabs = [
    { id: TABS.TIPS, label: t('admin.manageTips'), icon: HiOutlineLightBulb },
    { id: TABS.DISEASES, label: t('admin.manageDiseases'), icon: HiOutlineShieldCheck },
    { id: TABS.VACCINES, label: t('admin.manageVaccines'), icon: HiOutlineCalendar },
    { id: TABS.CONTACTS, label: t('admin.manageContacts'), icon: HiOutlinePhone },
    { id: TABS.WOMEN_CHILD, label: t('admin.manageWomenChild'), icon: HiOutlineHeart },
    { id: TABS.LANGUAGES, label: t('admin.manageLanguages'), icon: HiOutlineTranslate },
    { id: TABS.ANALYTICS, label: t('admin.analytics'), icon: HiChartBar },
  ];

  const fetchItems = async () => {
    setLoading(true);
    try {
      let res;
      switch (activeTab) {
        case TABS.TIPS:
          res = await healthTips.list({ limit: 100 });
          setItems(res.data);
          break;
        case TABS.DISEASES:
          res = await diseases.list({ limit: 100 });
          setItems(res.data);
          break;
        case TABS.VACCINES:
          res = await adminApi.getAnalytics();
          setItems(res.data);
          break;
        case TABS.CONTACTS:
          res = await emergencyContacts.list({ limit: 100 });
          setItems(res.data);
          break;
        case TABS.WOMEN_CHILD:
          res = await womenChild.list({ limit: 100 });
          setItems(res.data);
          break;
        case TABS.LANGUAGES:
          res = await languagesApi.list();
          setItems(res.data);
          break;
        case TABS.ANALYTICS:
          res = await adminApi.getAnalytics();
          setAnalytics(res.data);
          break;
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== TABS.VACCINES && activeTab !== TABS.ANALYTICS) {
      fetchItems();
    } else if (activeTab === TABS.VACCINES) {
      fetchVaccineTemplates();
    } else if (activeTab === TABS.ANALYTICS) {
      fetchAnalytics();
    }
  }, [activeTab]);

  const fetchVaccineTemplates = async () => {
    setLoading(true);
    try {
      const res = await vaccinations.getTemplates();
      setItems(res.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const fetchAnalytics = async () => {
    setLoading(true);
    setUsersError('');
  
    try {
      const res = await adminApi.getAnalytics();
      setAnalytics(res.data);
    } catch (err) {
      toast.error(err.message);
    }
  
    try {
      const res = await adminApi.getCommunityUsers();
      setCommunityUsers(res.data || []);
    } catch (err) {
      setUsersError(err.message);
      setCommunityUsers([]);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id, type) => {
    if (!window.confirm(t('admin.confirmDelete'))) return;
    try {
      switch (type) {
        case TABS.TIPS: await adminApi.deleteHealthTip(id); break;
        case TABS.DISEASES: await adminApi.deleteDisease(id); break;
        case TABS.VACCINES: await adminApi.deleteVaccineTemplate(id); break;
        case TABS.CONTACTS: await adminApi.deleteEmergencyContact(id); break;
        case TABS.WOMEN_CHILD: await adminApi.deleteWomenChild(id); break;
        case TABS.LANGUAGES: await adminApi.deleteLanguage(id); break;
      }
      toast.success('Deleted successfully');
      fetchItems();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const renderForm = () => {
    if (!showForm && !editingItem) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">
              {editingItem ? t('admin.edit') : t('admin.addNew')}
            </h3>
            <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="p-2 hover:bg-gray-100 rounded-lg">
              <HiX className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Use the API to manage content. This is a simplified admin interface.
          </p>
          <p className="text-sm text-gray-500">
            For full content management with translations, use the API endpoints directly.
          </p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => { setShowForm(false); setEditingItem(null); }} className="btn-secondary flex-1">
              {t('admin.cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-16">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">{t('common.loading')}</p>
        </div>
      );
    }

    if (activeTab === TABS.ANALYTICS && analytics) {
      return (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="card text-center">
              <p className="text-3xl font-bold text-gray-900">{analytics.totalViews}</p>
              <p className="text-sm text-gray-500">{t('admin.totalViews')}</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-gray-900">{analytics.totalUsers}</p>
              <p className="text-sm text-gray-500">{t('admin.totalUsers')}</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-gray-900">{analytics.totalTips}</p>
              <p className="text-sm text-gray-500">{t('admin.manageTips')}</p>
            </div>
            <div className="card text-center">
              <p className="text-3xl font-bold text-gray-900">{analytics.totalDiseases}</p>
              <p className="text-sm text-gray-500">{t('admin.manageDiseases')}</p>
            </div>
          </div>

          <div className="card mb-6">
            <h4 className="font-bold text-gray-900 mb-4">{t('admin.topPages')}</h4>
            <div className="space-y-2">
              {analytics.topPages?.map((page, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{page.path}</span>
                  <span className="text-sm font-semibold text-gray-900">{page.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h4 className="font-bold text-gray-900 mb-4">{t('admin.viewsByDay')}</h4>
            <div className="space-y-1">
              {analytics.viewsByDay?.slice(-14).map((day, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 w-24 shrink-0">{day.date}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-primary-500 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(100, (day.count / Math.max(...analytics.viewsByDay.map(d => d.count))) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 w-8 text-right">{day.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Community Users - admin-only list of registered community accounts */}
          <div className="card mt-6">
            <h4 className="font-bold text-gray-900 mb-4">Community Users</h4>

            {usersError ? (
              <p className="text-sm text-red-600">
                Unable to load community users: {usersError}
              </p>
            ) : communityUsers.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No community users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {communityUsers.map((communityUser, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-900">{communityUser.name}</td>
                        <td className="px-4 py-3 text-gray-600">{communityUser.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    }

    if (activeTab === TABS.VACCINES) {
      return (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">{t('admin.manageVaccines')}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Vaccine Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Age (days)</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Description</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.vaccineName}</td>
                    <td className="px-4 py-3 text-gray-600">{item.recommendedAgeDays}</td>
                    <td className="px-4 py-3 text-gray-500">{item.description}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(item.id, TABS.VACCINES)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (activeTab === TABS.LANGUAGES) {
      return (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Code</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
                  <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.code}</td>
                    <td className="px-4 py-3 text-gray-600">{item.name}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(item.id, TABS.LANGUAGES)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">ID</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">Title/Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Category/Type</th>
                <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{item.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{item.title || item.name}</td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{item.category || item.type}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleDelete(item.id, activeTab)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <h1 className="section-title mb-8">{t('admin.dashboard')}</h1>

      <div className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-primary-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="card">
        {renderContent()}
      </div>

      {renderForm()}
    </div>
  );
}
