// fe/src/api.js (updated with toggle completion for components and endpoints)

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

export const toggleComponentCompletion = async (id) => {
  const response = await api.patch(`/components/${id}/toggle-completion`);
  return response.data;
};

export const toggleChildComponentCompletion = async (parentId, childId) => {
  const response = await api.patch(`/components/${parentId}/children/${childId}/toggle-completion`);
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

export const toggleEndpointCompletion = async (id) => {
  const response = await api.patch(`/endpoints/${id}/toggle-completion`);
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

export const fetchImages = async () => {
  const response = await api.get('/images');
  return response.data;
};

export const fetchFeatureImages = async (featureId) => {
  const response = await api.get(`/features/${featureId}/images`);
  return response.data;
};

export const uploadImage = async (formData) => {
  const response = await api.post('/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteImage = async (id) => {
  const response = await api.delete(`/images/${id}`);
  return response.data;
};



// User API
export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const searchUsers = async (query) => {
  const response = await api.get(`/users/search/${query}`);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post('/users', user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Assignment functions for different item types
export const assignEndpoint = async (endpointId, assigneeId) => {
  const endpoint = await api.get(`/endpoints/${endpointId}`);
  const updatedEndpoint = {
    ...endpoint.data,
    assigneeId: assigneeId
  };
  const response = await api.put(`/endpoints/${endpointId}`, updatedEndpoint);
  return response.data;
};

export const assignDatabaseChange = async (changeId, assigneeId) => {
  const change = await api.get(`/database-changes/${changeId}`);
  const updatedChange = {
    ...change.data,
    assigneeId: assigneeId
  };
  const response = await api.put(`/database-changes/${changeId}`, updatedChange);
  return response.data;
};

export const assignComponent = async (componentId, assigneeId) => {
  const component = await api.get(`/components/${componentId}`);
  const updatedComponent = {
    ...component.data,
    assigneeId: assigneeId
  };
  const response = await api.put(`/components/${componentId}`, updatedComponent);
  return response.data;
};

export const assignChildComponent = async (parentId, childId, assigneeId) => {
  const parent = await api.get(`/components/${parentId}`);
  if (!parent.data || !parent.data.children) {
    throw new Error('Parent component or children not found');
  }
  
  const updatedChildren = parent.data.children.map(child => {
    if (child._id === childId) {
      return {
        ...child,
        assigneeId: assigneeId
      };
    }
    return child;
  });
  
  const updatedParent = {
    ...parent.data,
    children: updatedChildren
  };
  
  const response = await api.put(`/components/${parentId}`, updatedParent);
  return response.data;
};