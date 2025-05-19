import React, { useState } from 'react';
import { ExternalLink, Plus, User } from 'lucide-react';
import AssignTaskDialog from './AssignTaskDialog';

const DatabaseChanges = ({ changes, onAddChange, onExternalLinkClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [newChange, setNewChange] = useState({
    type: 'Create Table',
    name: 'User Preferences',
    icon: 'user'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddChange(newChange);
    setNewChange({ type: 'Create Table', name: 'User Preferences', icon: 'user' });
    setIsAdding(false);
  };

  const handleAssign = (assignee) => {
    console.log(`Task assigned to: ${assignee}`);
    // In a real implementation, we would update the change with the assignee
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
            <div key={change._id} className="flex items-center p-2 border border-gray-200 rounded hover:bg-gray-50">
              <input type="checkbox" className="checkbox checkbox-sm mr-3" checked={change.completed} readOnly />
              <span className="text-sm">{change.type} {change.name} Table</span>
              <div className="ml-auto">
                <button 
                  className="btn btn-sm btn-ghost text-gray-500"
                  onClick={() => setIsAssigning(true)}
                >
                  <User size={16} />
                </button>
              </div>
            </div>
          ))}

          {isAdding ? (
            <form onSubmit={handleSubmit} className="border border-gray-200 rounded p-3">
              <div className="flex mb-2">
                <select 
                  className="select select-sm select-bordered mr-2"
                  value={newChange.type}
                  onChange={(e) => setNewChange({...newChange, type: e.target.value})}
                >
                  <option>Create Table</option>
                  <option>Modify Table</option>
                  <option>Delete Table</option>
                </select>
                <input 
                  type="text" 
                  className="input input-sm input-bordered flex-1"
                  value={newChange.name}
                  onChange={(e) => setNewChange({...newChange, name: e.target.value})}
                  placeholder="Table Name"
                />
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
      
      {isAssigning && (
        <AssignTaskDialog 
          isOpen={isAssigning} 
          onClose={() => setIsAssigning(false)} 
          onAssign={handleAssign}
        />
      )}
    </div>
  );
};

export default DatabaseChanges;