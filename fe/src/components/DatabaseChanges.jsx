import React, { useState } from 'react';
import { ExternalLink, Plus, User, Check, Edit, Info } from 'lucide-react';
import AssignTaskDialog from './AssignTaskDialog';
import { markDatabaseChangeCompleted, updateDatabaseChange } from '../api';

const DatabaseChanges = ({ changes, onAddChange, onExternalLinkClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [showInfo, setShowInfo] = useState(null);
  const [selectedChange, setSelectedChange] = useState(null);
  const [newChange, setNewChange] = useState({
    type: 'Create Table',
    name: 'User Preferences',
    description: '',
    icon: 'user'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddChange(newChange);
    setNewChange({ 
      type: 'Create Table', 
      name: 'User Preferences', 
      description: '',
      icon: 'user' 
    });
    setIsAdding(false);
  };

  const handleAssign = (assignee, changeId, itemType) => {
    console.log(`Database change ${changeId} assigned to: ${assignee}`);
    // In a real implementation, we would update the change with the assignee
    
    // You could add a call to an API function here, for example:
    // updateDatabaseChange(changeId, { assignee })
    //   .then(() => {
    //     // Refresh the list
    //   })
    //   .catch((error) => {
    //     console.error('Error assigning database change:', error);
    //   });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateDatabaseChange(selectedChange._id, newChange)
      .then(() => {
        // Refresh the list by simulating an update in the parent component
        markDatabaseChangeCompleted(selectedChange._id, selectedChange.completed)
          .then(() => {
            setIsEditing(false);
            setSelectedChange(null);
            // Refresh would happen in parent component via onAddChange
          });
      })
      .catch((error) => {
        console.error('Error updating database change:', error);
      });
  };

  const handleToggleCompleted = (change) => {
    markDatabaseChangeCompleted(change._id, !change.completed)
      .then(() => {
        // Refresh would happen in parent component
      })
      .catch((error) => {
        console.error('Error toggling completion status:', error);
      });
  };
  
  const handleEditClick = (change) => {
    setSelectedChange(change);
    setNewChange({
      type: change.type,
      name: change.name,
      description: change.description || '',
      icon: change.icon
    });
    setIsEditing(true);
  };

  const handleAssignClick = (change) => {
    setSelectedChange(change);
    setIsAssigning(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Database Changes</h2>
        <button 
          className="btn btn-sm btn-ghost"
          onClick={onExternalLinkClick}
        >
          <ExternalLink size={16} />
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {changes.map((change) => (
            <div key={change._id} className="relative">
              <div className={`flex items-center p-2 border rounded ${change.completed ? 'bg-green-50 border-green-200' : 'border-gray-200 hover:bg-gray-50'}`}>
                <button 
                  className={`mr-3 ${change.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-500'}`}
                  onClick={() => handleToggleCompleted(change)}
                >
                  {change.completed ? (
                    <Check size={18} className="text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                  )}
                </button>
                <span className={`text-sm ${change.completed ? 'line-through text-gray-500' : ''}`}>
                  {change.type} {change.name}
                </span>
                <div className="ml-auto flex">
                  {change.description && (
                    <button 
                      className="btn btn-sm btn-ghost text-gray-500 mr-1"
                      onClick={() => setShowInfo(showInfo === change._id ? null : change._id)}
                    >
                      <Info size={16} />
                    </button>
                  )}
                  <button 
                    className="btn btn-sm btn-ghost text-gray-500 mr-1"
                    onClick={() => handleEditClick(change)}
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    className="btn btn-sm btn-ghost text-gray-500"
                    onClick={() => handleAssignClick(change)}
                  >
                    <User size={16} />
                  </button>
                </div>
              </div>
              {showInfo === change._id && change.description && (
                <div className="mt-1 ml-8 p-2 bg-gray-50 rounded text-sm text-gray-600 border border-gray-200">
                  {change.description}
                </div>
              )}
            </div>
          ))}

          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="border border-gray-200 rounded p-3">
              <div className="mb-2">
                <select 
                  className="select select-sm select-bordered w-full mb-2"
                  value={newChange.type}
                  onChange={(e) => setNewChange({...newChange, type: e.target.value})}
                >
                  <option>Create Table</option>
                  <option>Modify Table</option>
                  <option>Delete Table</option>
                  <option>Other</option>
                </select>
                <input 
                  type="text" 
                  className="input input-sm input-bordered w-full mb-2"
                  value={newChange.name}
                  onChange={(e) => setNewChange({...newChange, name: e.target.value})}
                  placeholder="Table Name"
                />
                <textarea 
                  className="textarea textarea-bordered textarea-sm w-full"
                  value={newChange.description}
                  onChange={(e) => setNewChange({...newChange, description: e.target.value})}
                  placeholder="Description (optional)"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedChange(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">Update</button>
              </div>
            </form>
          ) : isAdding ? (
            <form onSubmit={handleSubmit} className="border border-gray-200 rounded p-3">
              <div className="mb-2">
                <select 
                  className="select select-sm select-bordered w-full mb-2"
                  value={newChange.type}
                  onChange={(e) => setNewChange({...newChange, type: e.target.value})}
                >
                  <option>Create Table</option>
                  <option>Modify Table</option>
                  <option>Delete Table</option>
                  <option>Other</option>
                </select>
                <input 
                  type="text" 
                  className="input input-sm input-bordered w-full mb-2"
                  value={newChange.name}
                  onChange={(e) => setNewChange({...newChange, name: e.target.value})}
                  placeholder="Table Name"
                />
                <textarea 
                  className="textarea textarea-bordered textarea-sm w-full"
                  value={newChange.description}
                  onChange={(e) => setNewChange({...newChange, description: e.target.value})}
                  placeholder="Description (optional)"
                  rows={3}
                ></textarea>
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  type="button"
                  className="btn btn-sm btn-ghost"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-sm btn-primary">Save</button>
              </div>
            </form>
          ) : (
            <button 
              className="btn btn-circle btn-sm btn-ghost flex items-center justify-center w-full border border-dashed border-gray-300 hover:border-gray-400 mt-2"
              onClick={() => setIsAdding(true)}
            >
              <Plus size={20} />
            </button>
          )}
        </div>
      </div>
      
      {/* Assignment Dialog */}
      {isAssigning && selectedChange && (
        <AssignTaskDialog 
          isOpen={isAssigning} 
          onClose={() => {
            setIsAssigning(false);
            setSelectedChange(null);
          }} 
          onAssign={handleAssign}
          itemId={selectedChange._id}
          itemType="databaseChange"
        />
      )}
    </div>
  );
};

export default DatabaseChanges;