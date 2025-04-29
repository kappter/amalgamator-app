import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  getUser: async () => {
    const response = await api.get('/auth/user');
    return response.data;
  }
};

// Amalgamation services
export const amalgamationService = {
  getAmalgamations: async () => {
    const response = await api.get('/amalgamations');
    return response.data;
  },
  getAmalgamation: async (id) => {
    const response = await api.get(`/amalgamations/${id}`);
    return response.data;
  },
  createAmalgamation: async (amalgamationData) => {
    const response = await api.post('/amalgamations', amalgamationData);
    return response.data;
  },
  updateAmalgamation: async (id, amalgamationData) => {
    const response = await api.put(`/amalgamations/${id}`, amalgamationData);
    return response.data;
  },
  getRandomAmalgamation: async () => {
    const response = await api.get('/amalgamations/random');
    return response.data;
  }
};

// Contribution services
export const contributionService = {
  getContributions: async (amalgamationId) => {
    const response = await api.get(`/contributions/amalgamation/${amalgamationId}`);
    return response.data;
  },
  createContribution: async (contributionData) => {
    const response = await api.post('/contributions', contributionData);
    return response.data;
  },
  updateContribution: async (id, contributionData) => {
    const response = await api.put(`/contributions/${id}`, contributionData);
    return response.data;
  },
  deleteContribution: async (id) => {
    const response = await api.delete(`/contributions/${id}`);
    return response.data;
  },
  likeContribution: async (id) => {
    const response = await api.post(`/contributions/${id}/like`);
    return response.data;
  }
};

// Badge services
export const badgeService = {
  getBadges: async () => {
    const response = await api.get('/badges');
    return response.data;
  },
  getUserBadges: async (userId) => {
    const response = await api.get(`/badges/user/${userId}`);
    return response.data;
  }
};

// Data services
export const dataService = {
  getHierarchicalData: async () => {
    const response = await api.get('/data/hierarchical');
    return response.data;
  },
  getHierarchicalDataBySource: async (source) => {
    const response = await api.get(`/data/hierarchical/${source}`);
    return response.data;
  },
  searchTerm: async (term) => {
    const response = await api.get(`/data/search/${term}`);
    return response.data;
  }
};
