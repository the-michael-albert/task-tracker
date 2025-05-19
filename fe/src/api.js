import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchComponents = async () => {
  const response = await api.get('/components');
  return response.data;
};

export const fetchEndpoints = async () => {
  const response = await api.get('/endpoints');
  return response.data;
};

export const createEndpoint = async (endpoint) => {
  const response = await api.post('/endpoints', endpoint);
  return response.data;
};

export const updateEndpoint = async (id, endpoint) => {
  const response = await api.put(`/endpoints/${id}`, endpoint);
  return response.data;
};

export const deleteEndpoint = async (id) => {
  const response = await api.delete(`/endpoints/${id}`);
  return response.data;
};

export const fetchDatabaseChanges = async () => {
  const response = await api.get('/database-changes');
  return response.data;
};

export const createDatabaseChange = async (change) => {
  const response = await api.post('/database-changes', change);
  return response.data;
};
