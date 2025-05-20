import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Plus, ArrowUpDown, MoreVertical, Check, Edit, Trash2 } from 'lucide-react';
import { toggleEndpointCompletion } from '../api';
import AssignTaskDialog from './AssignTaskDialog';

const APIEndpoints = ({ endpoints, onAddEndpoint, onSelectEndpoint, onExternalLinkClick, onDeleteEndpoint }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    method: 'GET',
    path: '/api/auth/endpoint',
    description: '',
  });
  const [showDropdown, setShowDropdown] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [selectedEndpointForAssign, setSelectedEndpointForAssign] = useState(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(null);
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEndpoint(newEndpoint);
    setNewEndpoint({ 
      method: 'GET', 
      path: '/api/auth/endpoint', 
      description: '' 
    });
    setIsAdding(false);
  };

  const handleToggleCompletion = (e, endpoint) => {
    e.stopPropagation(); // Prevent the click from triggering endpoint selection
    toggleEndpointCompletion(endpoint._id)
      .then(() => {
        // The parent component should refresh the data
      })
      .catch((error) => {
        console.error('Error toggling endpoint completion:', error);
      });
  };

  const handleDeleteClick = (e, endpoint) => {
    e.stopPropagation();
    setShowDropdown(null);
    if (confirm('Are you sure you want to delete this endpoint?')) {
      if (onDeleteEndpoint) {
        onDeleteEndpoint(endpoint._id);
      }
    }
  };

  const handleAssign = (assignee, endpointId, itemType) => {
    console.log(`Endpoint ${endpointId} assigned to: ${assignee}`);
    // In a real implementation, we would update the endpoint with the assignee
  };

  const handleAssignClick = (e, endpoint) => {
    e.stopPropagation();
    setShowDropdown(null);
    setSelectedEndpointForAssign(endpoint);
    setIsAssigning(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">API Endpoints</h2>
        <button 
          className="btn btn-sm btn-ghost"
          onClick={onExternalLinkClick}
        >
          <ExternalLink size={16} />
        </button>
      </div>
      <div className="p-4">
        <div className="space-y-2">
          {endpoints.map((endpoint) => (
            <div 
              key={endpoint._id} 
              className={`flex items-center p-2 border rounded cursor-pointer ${
                endpoint.completed ? 'bg-green-50 border-green-200' : 'border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onSelectEndpoint(endpoint)}
            >
              <button 
                className={`mr-2 ${endpoint.completed ? 'text-green-500' : 'text-gray-300 hover:text-gray-500'}`}
                onClick={(e) => handleToggleCompletion(e, endpoint)}
              >
                {endpoint.completed ? (
                  <Check size={18} className="text-green-500" />
                ) : (
                  <div className="w-4 h-4 border border-gray-300 rounded-sm"></div>
                )}
              </button>
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mr-2 ${
                endpoint.completed ? 'opacity-70' : ''
              }`}>
                {endpoint.method}
              </div>
              <span className={`text-sm flex-1 truncate ${endpoint.completed ? 'line-through text-gray-500' : ''}`}>
                {endpoint.path}
              </span>
              <div className="flex items-center space-x-1 relative" ref={dropdownRef}>
                <button 
                  className="btn btn-sm btn-ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(showDropdown === endpoint._id ? null : endpoint._id);
                  }}
                >
                  <MoreVertical size={14} />
                </button>
                
                {showDropdown === endpoint._id && (
                  <div className="absolute right-0 top-8 w-48 bg-white rounded shadow-lg border border-gray-200 z-10">
                    <div className="py-1">
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowDropdown(null);
                          onSelectEndpoint(endpoint);
                        }}
                      >
                        <Edit size={14} className="mr-2" /> Edit Endpoint
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        onClick={(e) => handleToggleCompletion(e, endpoint)}
                      >
                        <Check size={14} className="mr-2" /> 
                        {endpoint.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                        onClick={(e) => handleAssignClick(e, endpoint)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Assign Task
                      </button>
                      <button 
                        className="flex items-center w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100"
                        onClick={(e) => handleDeleteClick(e, endpoint)}
                      >
                        <Trash2 size={14} className="mr-2" /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAdding ? (
            <form onSubmit={handleSubmit} className="border border-gray-200 rounded p-3">
              <div className="mb-2">
                <select 
                  className="select select-sm select-bordered mr-2 mb-2"
                  value={newEndpoint.method}
                  onChange={(e) => setNewEndpoint({...newEndpoint, method: e.target.value})}
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <input 
                  type="text" 
                  className="input input-sm input-bordered w-full mb-2"
                  value={newEndpoint.path}
                  onChange={(e) => setNewEndpoint({...newEndpoint, path: e.target.value})}
                  placeholder="/api/path"
                />
                <input 
                  type="text" 
                  className="input input-sm input-bordered w-full"
                  value={newEndpoint.description}
                  onChange={(e) => setNewEndpoint({...newEndpoint, description: e.target.value})}
                  placeholder="Description (optional)"
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

      {/* Assignment Dialog */}
      {isAssigning && selectedEndpointForAssign && (
        <AssignTaskDialog 
          isOpen={isAssigning} 
          onClose={() => {
            setIsAssigning(false);
            setSelectedEndpointForAssign(null);
          }} 
          onAssign={handleAssign}
          itemId={selectedEndpointForAssign._id}
          itemType="endpoint"
        />
      )}
    </div>
  );
};

export default APIEndpoints;