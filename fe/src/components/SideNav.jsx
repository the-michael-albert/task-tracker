import React, { useState } from 'react';
import { LayoutDashboard, Plus, Edit, X, Trash2, Check } from 'lucide-react';
import { useFeatures } from '../context/FeatureContext';
import ConfirmDialog from './ConfirmDialog';
import { deleteFeature, updateFeature } from '../api';

const SideNav = () => {
  const { features, currentFeature, selectFeature, addFeature } = useFeatures();
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [editingFeature, setEditingFeature] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ show: false, feature: null });
  
  const handleAddFeature = async () => {
    if (!newFeatureName.trim()) return;
    
    try {
      const feature = await addFeature(newFeatureName);
      selectFeature(feature._id);
      setNewFeatureName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Failed to add feature:', error);
    }
  };
  
  const handleUpdateFeature = async () => {
    if (!newFeatureName.trim() || !editingFeature) return;
    
    try {
      await updateFeature(editingFeature._id, { 
        ...editingFeature, 
        name: newFeatureName 
      });
      
      // Refresh page to simplify state management
      window.location.reload();
    } catch (error) {
      console.error('Failed to update feature:', error);
    }
  };
  
  const handleDeleteFeature = async (feature) => {
    try {
      await deleteFeature(feature._id);
      window.location.reload(); // Simple refresh to update state completely
    } catch (error) {
      console.error('Failed to delete feature:', error);
    }
  };

  return (
    <div className="bg-white w-64 border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold">Features</h2>
        <button 
          className="btn btn-sm btn-ghost text-blue-500"
          onClick={() => {
            setIsAdding(true);
            setIsEditing(false);
          }}
        >
          <Plus size={18} />
        </button>
      </div>
      
      {isAdding && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <input 
              type="text" 
              className="input input-sm input-bordered flex-1 mr-2" 
              placeholder="Feature name"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
              autoFocus
            />
            <button 
              className="btn btn-sm btn-ghost text-red-500"
              onClick={() => {
                setIsAdding(false);
                setNewFeatureName('');
              }}
            >
              <X size={16} />
            </button>
            <button 
              className="btn btn-sm btn-ghost text-green-500 ml-1"
              onClick={handleAddFeature}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      )}
      
      {isEditing && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <input 
              type="text" 
              className="input input-sm input-bordered flex-1 mr-2" 
              placeholder="Feature name"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleUpdateFeature()}
              autoFocus
            />
            <button 
              className="btn btn-sm btn-ghost text-red-500"
              onClick={() => {
                setIsEditing(false);
                setEditingFeature(null);
              }}
            >
              <X size={16} />
            </button>
            <button 
              className="btn btn-sm btn-ghost text-green-500 ml-1"
              onClick={handleUpdateFeature}
            >
              <Check size={16} />
            </button>
          </div>
        </div>
      )}
      
      <nav className="flex-1 overflow-y-auto">
        <ul className="p-2">
          {features.map((feature) => (
            <li className="mb-1" key={feature._id}>
              <a 
                href="#" 
                className={`flex items-center p-2 rounded-lg ${currentFeature && currentFeature._id === feature._id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'hover:bg-gray-100'}`}
                onClick={(e) => {
                  e.preventDefault();
                  selectFeature(feature._id);
                }}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <span className="flex-1">{feature.name}</span>
                <div className="flex space-x-1">
                  <button 
                    className="btn btn-xs btn-ghost" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingFeature(feature);
                      setNewFeatureName(feature.name);
                      setIsEditing(true);
                    }}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="btn btn-xs btn-ghost text-red-500" 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setConfirmDelete({ show: true, feature });
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </a>
            </li>
          ))}
          
          {features.length === 0 && !isAdding && (
            <li className="px-2 py-4 text-center text-gray-500">
              No features yet. Click the + button to add one.
            </li>
          )}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-2">
            U
          </div>
          <div>
            <div className="font-medium">User</div>
            <div className="text-xs text-gray-500">user@example.com</div>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDelete.show}
        title="Delete Feature"
        message={`Are you sure you want to delete "${confirmDelete.feature?.name}"? This action cannot be undone.`}
        onConfirm={() => {
          handleDeleteFeature(confirmDelete.feature);
          setConfirmDelete({ show: false, feature: null });
        }}
        onCancel={() => setConfirmDelete({ show: false, feature: null })}
      />
    </div>
  );
};

export default SideNav;