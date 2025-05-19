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

// Features API
export const fetchFeatures = async () => {
  const response = await api.get('/features');
  return response.data;
};

export const createFeature = async (feature) => {
  const response = await api.post('/features', feature);
  return response.data;
};

export const updateFeature = async (id, feature) => {
  const response = await api.put(`/features/${id}`, feature);
  return response.data;
};

export const deleteFeature = async (id) => {
  const response = await api.delete(`/features/${id}`);
  return response.data;
};

// Feature-specific data
export const fetchFeatureComponents = async (featureId) => {
  const response = await api.get(`/features/${featureId}/components`);
  return response.data;
};

export const fetchFeatureEndpoints = async (featureId) => {
  const response = await api.get(`/features/${featureId}/endpoints`);
  return response.data;
};

export const fetchFeatureDatabaseChanges = async (featureId) => {
  const response = await api.get(`/features/${featureId}/database-changes`);
  return response.data;
};

// Components API
export const fetchComponents = async () => {
  const response = await api.get('/components');
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

// Endpoints API
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

// Database Changes API
export const fetchDatabaseChanges = async () => {
  const response = await api.get('/database-changes');
  return response.data;
};

export const createDatabaseChange = async (change) => {
  const response = await api.post('/database-changes', change);
  return response.data;
};

export const updateDatabaseChange = async (id, change) => {
  const response = await api.put(`/database-changes/${id}`, change);
  return response.data;
};

export const markDatabaseChangeCompleted = async (id, completed) => {
  const response = await api.patch(`/database-changes/${id}/complete`, { completed });
  return response.data;
};

export const deleteDatabaseChange = async (id) => {
  const response = await api.delete(`/database-changes/${id}`);
  return response.data;
};