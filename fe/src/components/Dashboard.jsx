import React, { useState, useEffect } from 'react';
import UIMockup from './UIMockup';
import APIEndpoints from './APIEndpoints';
import DatabaseChanges from './DatabaseChanges';
import EnhancedComponentsList from './EnhancedComponentsList';
import EndpointDetail from './EndpointDetail';
import NoFeatureSelected from './NoFeatureSelected';
import { 
  createEndpoint, 
  updateEndpoint, 
  deleteEndpoint, 
  createDatabaseChange,
  fetchFeatureComponents,
  fetchFeatureEndpoints,
  fetchFeatureDatabaseChanges
} from '../api';
import { ArrowUp } from 'lucide-react';
import { useFeatures } from '../context/FeatureContext';

const Dashboard = ({ components: initialComponents, endpoints: initialEndpoints, databaseChanges: initialDatabaseChanges, setEndpoints, setDatabaseChanges, setComponents }) => {
  const { currentFeature } = useFeatures();
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [showComponentsList, setShowComponentsList] = useState(true);
  
  const [components, setLocalComponents] = useState(initialComponents);
  const [endpoints, setLocalEndpoints] = useState(initialEndpoints);
  const [databaseChanges, setLocalDatabaseChanges] = useState(initialDatabaseChanges);
  const [loading, setLoading] = useState(false);

  // Load data specific to the selected feature
  useEffect(() => {
    if (!currentFeature) return;
    
    const loadFeatureData = async () => {
      setLoading(true);
      try {
        const [componentsData, endpointsData, databaseChangesData] = await Promise.all([
          fetchFeatureComponents(currentFeature._id),
          fetchFeatureEndpoints(currentFeature._id),
          fetchFeatureDatabaseChanges(currentFeature._id)
        ]);
        
        setLocalComponents(componentsData);
        setLocalEndpoints(endpointsData);
        setLocalDatabaseChanges(databaseChangesData);
        
        // Update the parent state
        setComponents(componentsData);
        setEndpoints(endpointsData);
        setDatabaseChanges(databaseChangesData);
      } catch (error) {
        console.error('Error loading feature data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatureData();
  }, [currentFeature]);

  const handleAddEndpoint = async (newEndpoint) => {
    if (!currentFeature) return;
    
    try {
      const withFeatureId = {
        ...newEndpoint,
        featureId: currentFeature._id
      };
      
      const created = await createEndpoint(withFeatureId);
      const updatedEndpoints = [...endpoints, created];
      
      setLocalEndpoints(updatedEndpoints);
      setEndpoints(updatedEndpoints);
    } catch (error) {
      console.error('Error adding endpoint:', error);
    }
  };

  const handleUpdateEndpoint = async (id, updatedEndpoint) => {
    try {
      const updated = await updateEndpoint(id, updatedEndpoint);
      const updatedEndpoints = endpoints.map(ep => ep._id === id ? updated : ep);
      
      setLocalEndpoints(updatedEndpoints);
      setEndpoints(updatedEndpoints);
      setSelectedEndpoint(null);
    } catch (error) {
      console.error('Error updating endpoint:', error);
    }
  };

  const handleDeleteEndpoint = async (id) => {
    try {
      await deleteEndpoint(id);
      const filteredEndpoints = endpoints.filter(ep => ep._id !== id);
      
      setLocalEndpoints(filteredEndpoints);
      setEndpoints(filteredEndpoints);
      setSelectedEndpoint(null);
    } catch (error) {
      console.error('Error deleting endpoint:', error);
    }
  };

  const handleAddDatabaseChange = async (newChange) => {
    if (!currentFeature) return;
    
    try {
      const withFeatureId = {
        ...newChange,
        featureId: currentFeature._id
      };
      
      const created = await createDatabaseChange(withFeatureId);
      const updatedChanges = [...databaseChanges, created];
      
      setLocalDatabaseChanges(updatedChanges);
      setDatabaseChanges(updatedChanges);
    } catch (error) {
      console.error('Error adding database change:', error);
    }
  };
  
  const handleSelectEndpoint = (endpoint) => {
    setSelectedEndpoint(endpoint);
    setShowComponentsList(false);
  };
  
  const handleComponentsChange = (updatedComponents) => {
    setLocalComponents(updatedComponents);
    setComponents(updatedComponents);
  };

  if (!currentFeature) {
    return <NoFeatureSelected />;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">{currentFeature.name}</h1>
          <button className="btn btn-circle">
            <ArrowUp size={20} />
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
        {!showComponentsList && selectedEndpoint ? (
          <EndpointDetail 
            endpoint={selectedEndpoint} 
            onUpdate={handleUpdateEndpoint} 
            onDelete={handleDeleteEndpoint}
            onCancel={() => {
              setSelectedEndpoint(null);
              setShowComponentsList(true);
            }}
          />
        ) : (
          <div>
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Components</h2>
            </div>
            <div className="p-4">
              <EnhancedComponentsList 
                components={components} 
                endpoints={endpoints}
                onComponentsChange={handleComponentsChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;