const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('healthconnect_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body === 'object' && !(config.body instanceof FormData)) {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
}

export const auth = {
  register: (body) => request('/auth/register', { method: 'POST', body }),
  login: (body) => request('/auth/login', { method: 'POST', body }),
  refresh: (token) => request('/auth/refresh', { method: 'POST', body: { token } }),
  getProfile: () => request('/auth/profile'),
  updateProfile: (body) => request('/auth/profile', { method: 'PUT', body }),
};

export const healthTips = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/health-tips${query ? `?${query}` : ''}`);
  },
  getById: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/health-tips/${id}${query ? `?${query}` : ''}`);
  },
};

export const diseases = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/diseases${query ? `?${query}` : ''}`);
  },
  getById: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/diseases/${id}${query ? `?${query}` : ''}`);
  },
};

export const vaccinations = {
  getTemplates: () => request('/vaccinations/templates'),
  getFamilyMembers: () => request('/vaccinations/family'),
  addFamilyMember: (body) => request('/vaccinations/family', { method: 'POST', body }),
  updateFamilyMember: (id, body) => request(`/vaccinations/family/${id}`, { method: 'PUT', body }),
  deleteFamilyMember: (id) => request(`/vaccinations/family/${id}`, { method: 'DELETE' }),
  markComplete: (id) => request(`/vaccinations/records/${id}/complete`, { method: 'PUT' }),
  getReminders: () => request('/vaccinations/reminders'),
};

export const emergencyContacts = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/emergency-contacts${query ? `?${query}` : ''}`);
  },
};

export const womenChild = {
  list: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/women-child${query ? `?${query}` : ''}`);
  },
  getById: (id, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/women-child/${id}${query ? `?${query}` : ''}`);
  },
};

export const languages = {
  list: () => request('/languages'),
};

export const admin = {
  createHealthTip: (body) => request('/admin/health-tips', { method: 'POST', body }),
  updateHealthTip: (id, body) => request(`/admin/health-tips/${id}`, { method: 'PUT', body }),
  deleteHealthTip: (id) => request(`/admin/health-tips/${id}`, { method: 'DELETE' }),
  createDisease: (body) => request('/admin/diseases', { method: 'POST', body }),
  updateDisease: (id, body) => request(`/admin/diseases/${id}`, { method: 'PUT', body }),
  deleteDisease: (id) => request(`/admin/diseases/${id}`, { method: 'DELETE' }),
  createVaccineTemplate: (body) => request('/admin/vaccination-templates', { method: 'POST', body }),
  updateVaccineTemplate: (id, body) => request(`/admin/vaccination-templates/${id}`, { method: 'PUT', body }),
  deleteVaccineTemplate: (id) => request(`/admin/vaccination-templates/${id}`, { method: 'DELETE' }),
  createEmergencyContact: (body) => request('/admin/emergency-contacts', { method: 'POST', body }),
  updateEmergencyContact: (id, body) => request(`/admin/emergency-contacts/${id}`, { method: 'PUT', body }),
  deleteEmergencyContact: (id) => request(`/admin/emergency-contacts/${id}`, { method: 'DELETE' }),
  createWomenChild: (body) => request('/admin/women-child', { method: 'POST', body }),
  updateWomenChild: (id, body) => request(`/admin/women-child/${id}`, { method: 'PUT', body }),
  deleteWomenChild: (id) => request(`/admin/women-child/${id}`, { method: 'DELETE' }),
  createLanguage: (body) => request('/admin/languages', { method: 'POST', body }),
  deleteLanguage: (id) => request(`/admin/languages/${id}`, { method: 'DELETE' }),
  getAnalytics: () => request('/analytics/dashboard'),
};

export const search = {
  search: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/search${query ? `?${query}` : ''}`);
  },
};

export const analytics = {
  trackView: (path) => request('/analytics/track', { method: 'POST', body: { path } }),
};
