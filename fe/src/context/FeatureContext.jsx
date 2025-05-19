import React, { createContext, useState, useContext, useEffect } from 'react';
import { fetchFeatures, createFeature } from '../api';

// Create context
const FeatureContext = createContext();

// Create provider component
export const FeatureProvider = ({ children }) => {
  const [features, setFeatures] = useState([]);
  const [currentFeature, setCurrentFeature] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const data = await fetchFeatures();
        setFeatures(data);
        
        // Set the first feature as current if available
        if (data.length > 0) {
          setCurrentFeature(data[0]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading features:', error);
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const addFeature = async (name) => {
    try {
      const newFeature = await createFeature({ name });
      setFeatures([...features, newFeature]);
      return newFeature;
    } catch (error) {
      console.error('Error creating feature:', error);
      throw error;
    }
  };

  const selectFeature = (featureId) => {
    const feature = features.find(f => f._id === featureId);
    if (feature) {
      setCurrentFeature(feature);
    }
  };

  return (
    <FeatureContext.Provider value={{ 
      features, 
      currentFeature, 
      loading, 
      addFeature, 
      selectFeature 
    }}>
      {children}
    </FeatureContext.Provider>
  );
};

// Custom hook to use the context
export const useFeatures = () => {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatures must be used within a FeatureProvider');
  }
  return context;
};