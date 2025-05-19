import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
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

export const createComponent = async (component) => {
  const response = await api.post('/components', component);
  return response.data;
};

export const updateComponent = async (id, component) => {
  const response = await api.put(`/components/${id}`, component);
  return response.data;
};

export const deleteComponent = async (id) => {
  const response = await api.delete(`/components/${id}`);
  return response.data;
};

export const addChildComponent = async (parentId, childData) => {
  const response = await api.post(`/components/${parentId}/children`, childData);
  return response.data;
};

export const deleteChildComponent = async (parentId, childId) => {
  const response = await api.delete(`/components/${parentId}/children/${childId}`);
  return response.data;
};
