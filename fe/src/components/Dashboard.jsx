import React, { useState } from 'react';
import UIMockup from './UIMockup';
import APIEndpoints from './APIEndpoints';
import DatabaseChanges from './DatabaseChanges';
import ComponentsList from './ComponentsList';
import EndpointDetail from './EndpointDetail';
import { createEndpoint, updateEndpoint, deleteEndpoint, createDatabaseChange } from '../api';

const Dashboard = ({ components, endpoints, databaseChanges, setEndpoints, setDatabaseChanges }) => {
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  
  const handleAddEndpoint = async (newEndpoint) => {
    try {
      const created = await createEndpoint(newEndpoint);
      setEndpoints([...endpoints, created]);
    } catch (error) {
      console.error('Error adding endpoint:', error);
    }
  };

  const handleUpdateEndpoint = async (id, updatedEndpoint) => {
    try {
      const updated = await updateEndpoint(id, updatedEndpoint);
      setEndpoints(endpoints.map(ep => ep._id === id ? updated : ep));
      setSelectedEndpoint(null);
    } catch (error) {
      console.error('Error updating endpoint:', error);
    }
  };

  const handleDeleteEndpoint = async (id) => {
    try {
      await deleteEndpoint(id);
      setEndpoints(endpoints.filter(ep => ep._id !== id));
      setSelectedEndpoint(null);
    } catch (error) {
      console.error('Error deleting endpoint:', error);
    }
  };

  const handleAddDatabaseChange = async (newChange) => {
    try {
      const created = await createDatabaseChange(newChange);
      setDatabaseChanges([...databaseChanges, created]);
    } catch (error) {
      console.error('Error adding database change:', error);
    }
  };
  
  const handleSelectEndpoint = (endpoint) => {
    setSelectedEndpoint(endpoint);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard Creation</h1>
          <button className="btn btn-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 2.5-2-2.5"/><path d="M11 22.4V4"/></svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <UIMockup />
        <APIEndpoints 
          endpoints={endpoints} 
          onAddEndpoint={handleAddEndpoint} 
          onSelectEndpoint={handleSelectEndpoint}
        />
        <DatabaseChanges 
          changes={databaseChanges} 
          onAddChange={handleAddDatabaseChange} 
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {selectedEndpoint ? (
          <EndpointDetail 
            endpoint={selectedEndpoint} 
            onUpdate={handleUpdateEndpoint} 
            onDelete={handleDeleteEndpoint}
            onCancel={() => setSelectedEndpoint(null)}
          />
        ) : (
          <ComponentsList components={components} endpoints={endpoints} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
