import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { vaccinations as vaccinationsApi } from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { HiCalendar, HiUserAdd, HiCheck, HiBell, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import toast from 'react-hot-toast';

export default function Vaccinations() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expandedMember, setExpandedMember] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [formData, setFormData] = useState({ name: '', dateOfBirth: '', relation: 'child' });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      vaccinationsApi.getFamilyMembers(),
      vaccinationsApi.getTemplates(),
      vaccinationsApi.getReminders(),
    ])
      .then(([membersRes, templatesRes, remindersRes]) => {
        setMembers(membersRes.data);
        setTemplates(templatesRes.data);
        setReminders(remindersRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const res = await vaccinationsApi.addFamilyMember(formData);
      setMembers(prev => [...prev, res.data]);
      setShowForm(false);
      setFormData({ name: '', dateOfBirth: '', relation: 'child' });
      toast.success('Family member added');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleMarkComplete = async (recordId) => {
    try {
      await vaccinationsApi.markComplete(recordId);
      const res = await vaccinationsApi.getFamilyMembers();
      setMembers(res.data);
      toast.success('Vaccination marked as complete');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteMember = async (id) => {
    if (!window.confirm('Delete this family member and all records?')) return;
    try {
      await vaccinationsApi.deleteFamilyMember(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      toast.success('Family member removed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <HiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">{t('vaccinations.title')}</h1>
        <p className="text-gray-500 mb-6">{t('auth.login')}</p>
        <Link to="/login" className="btn-primary">{t('nav.login')}</Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      default: return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="section-title">{t('vaccinations.title')}</h1>
          <p className="section-subtitle">{t('vaccinations.subtitle')}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <HiUserAdd className="w-5 h-5 mr-2" />
          {t('vaccinations.addMember')}
        </button>
      </div>

      {reminders.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <HiBell className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-amber-800">{t('vaccinations.reminders')}</h3>
          </div>
          <div className="space-y-2">
            {reminders.map(record => (
              <div key={record.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3">
                <div>
                  <span className="font-medium text-gray-900">{record.vaccine.vaccineName}</span>
                  <span className="text-gray-500 ml-3 text-sm">- {record.familyMember.name}</span>
                </div>
                <span className="text-sm text-amber-700 font-medium">
                  Due: {new Date(record.dueDate).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="card mb-8">
          <h3 className="font-bold text-gray-900 text-lg mb-4">{t('vaccinations.addMember')}</h3>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vaccinations.memberName')}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vaccinations.dateOfBirth')}</label>
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('vaccinations.relation')}</label>
              <select
                value={formData.relation}
                onChange={e => setFormData({ ...formData, relation: e.target.value })}
                className="input-field"
              >
                <option value="self">{t('vaccinations.self')}</option>
                <option value="child">{t('vaccinations.child')}</option>
                <option value="spouse">{t('vaccinations.spouse')}</option>
                <option value="parent">{t('vaccinations.parent')}</option>
                <option value="other">{t('vaccinations.other')}</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">{t('common.submit')}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">{t('admin.cancel')}</button>
            </div>
          </form>
        </div>
      )}

      {members.length === 0 ? (
        <div className="text-center py-16">
          <HiUserAdd className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">{t('vaccinations.noMembers')}</p>
        </div>
      ) : (
        <div className="space-y-6">
          {members.map(member => (
            <div key={member.id} className="card">
              <button
                onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                className="w-full flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                    <HiCalendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-500">
                      {member.relation} &middot; {new Date(member.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-primary-600">
                    {member.records.filter(r => r.status === 'completed').length}/{member.records.length}
                  </span>
                  {expandedMember === member.id ? <HiChevronUp className="w-5 h-5 text-gray-400" /> : <HiChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>

              {expandedMember === member.id && (
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <div className="space-y-2">
                    {member.records.map(record => (
                      <div key={record.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                        <div className="flex-1">
                          <span className="font-medium text-gray-900">{record.vaccine.vaccineName}</span>
                          <span className="text-gray-500 ml-3 text-sm">
                            {t('vaccinations.dueDate')}: {new Date(record.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                          {record.status === 'pending' && (
                            <button
                              onClick={() => handleMarkComplete(record.id)}
                              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                              title={t('vaccinations.markComplete')}
                            >
                              <HiCheck className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    className="mt-4 text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    {t('admin.delete')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{t('vaccinations.template')}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 font-semibold text-gray-700">{t('vaccinations.vaccine')}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">{t('vaccinations.age')}</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 hidden md:table-cell">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{t.vaccineName}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {t.recommendedAgeDays < 1 ? 'At birth' :
                     t.recommendedAgeDays < 30 ? `${t.recommendedAgeDays} days` :
                     t.recommendedAgeDays < 365 ? `${Math.round(t.recommendedAgeDays / 30)} months` :
                     `${Math.round(t.recommendedAgeDays / 365)} years`}
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{t.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
