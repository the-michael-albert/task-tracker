import React from 'react';
import { LayoutDashboard, Plus } from 'lucide-react';
import { useFeatures } from '../context/FeatureContext';

const NoFeatureSelected = () => {
  const { addFeature } = useFeatures();
  const [newFeatureName, setNewFeatureName] = React.useState('');
  const [isAddingFeature, setIsAddingFeature] = React.useState(false);

  const handleAddFeature = async () => {
    if (!newFeatureName.trim()) return;
    
    try {
      await addFeature(newFeatureName);
      setNewFeatureName('');
      setIsAddingFeature(false);
    } catch (error) {
      console.error('Failed to add feature:', error);
    }
  };

  return (
    <div className="container mx-auto p-8 flex flex-col items-center justify-center h-screen">
      <div className="text-center max-w-lg">
        <div className="bg-blue-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <LayoutDashboard size={28} className="text-blue-500" />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">No Feature Selected</h2>
        <p className="text-gray-600 mb-8">
          Select a feature from the sidebar to start working on it, or create a new feature below.
        </p>
        
        {isAddingFeature ? (
          <div className="border rounded-lg p-4 bg-white shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Feature Name
              </label>
              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Enter feature name"
                value={newFeatureName}
                onChange={(e) => setNewFeatureName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                autoFocus
              />
            </div>
            <div className="flex space-x-2 justify-end">
              <button
                className="btn btn-ghost"
                onClick={() => setIsAddingFeature(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddFeature}
                disabled={!newFeatureName.trim()}
              >
                Create Feature
              </button>
            </div>
          </div>
        ) : (
          <button
            className="btn btn-primary"
            onClick={() => setIsAddingFeature(true)}
          >
            <Plus size={20} className="mr-2" />
            Create New Feature
          </button>
        )}
      </div>
    </div>
  );
};

export default NoFeatureSelected;