import React, { useState } from 'react';
import { ExternalLink, Plus, ArrowUpDown, MoreVertical } from 'lucide-react';

const APIEndpoints = ({ endpoints, onAddEndpoint, onSelectEndpoint, onExternalLinkClick }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newEndpoint, setNewEndpoint] = useState({
    method: 'GET',
    path: '/api/auth/endpoint'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEndpoint(newEndpoint);
    setNewEndpoint({ method: 'GET', path: '/api/auth/endpoint' });
    setIsAdding(false);
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
              className="flex items-center p-2 border border-gray-200 rounded cursor-pointer hover:bg-gray-50"
              onClick={() => onSelectEndpoint(endpoint)}
            >
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800 mr-2">
                {endpoint.method}
              </div>
              <span className="text-sm flex-1 truncate">{endpoint.path}</span>
              <div className="flex items-center space-x-1">
                <button className="btn btn-sm btn-ghost">
                  <ArrowUpDown size={14} />
                </button>
                <button className="btn btn-sm btn-ghost">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          ))}

          {isAdding ? (
            <form onSubmit={handleSubmit} className="border border-gray-200 rounded p-3">
              <div className="flex mb-2">
                <select 
                  className="select select-sm select-bordered mr-2"
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
                  className="input input-sm input-bordered flex-1"
                  value={newEndpoint.path}
                  onChange={(e) => setNewEndpoint({...newEndpoint, path: e.target.value})}
                  placeholder="/api/path"
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
    </div>
  );
};

export default APIEndpoints;