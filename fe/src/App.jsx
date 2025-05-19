import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import SideNav from './components/SideNav';
import { fetchComponents, fetchEndpoints, fetchDatabaseChanges } from './api';
import { FeatureProvider } from './context/FeatureContext';

function App() {
  const [components, setComponents] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [databaseChanges, setDatabaseChanges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [componentsData, endpointsData, databaseChangesData] = await Promise.all([
          fetchComponents(),
          fetchEndpoints(),
          fetchDatabaseChanges()
        ]);
        
        setComponents(componentsData);
        setEndpoints(endpointsData);
        setDatabaseChanges(databaseChangesData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <FeatureProvider>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <SideNav />
        <main className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <Dashboard 
              components={components} 
              endpoints={endpoints} 
              databaseChanges={databaseChanges}
              setEndpoints={setEndpoints}
              setDatabaseChanges={setDatabaseChanges}
              setComponents={setComponents}
            />
          )}
        </main>
      </div>
    </FeatureProvider>
  );
}

export default App;