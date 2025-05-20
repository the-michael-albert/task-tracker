import React, { useState, useEffect } from 'react';
import { Trash2, ArrowDown, Check } from 'lucide-react';

const EndpointDetail = ({ endpoint, onUpdate, onDelete, onCancel }) => {
  const [formData, setFormData] = useState({
    method: endpoint.method || 'GET',
    path: endpoint.path || '',
    queryParams: endpoint.queryParams || [],
    requestBody: endpoint.requestBody || '{}',
    responseBody: endpoint.responseBody || '{}',
    description: endpoint.description || '',
    completed: endpoint.completed || false
  });

  const [newParamKey, setNewParamKey] = useState('');
  const [newParamValue, setNewParamValue] = useState('');

  useEffect(() => {
    setFormData({
      method: endpoint.method || 'GET',
      path: endpoint.path || '',
      queryParams: endpoint.queryParams || [],
      requestBody: endpoint.requestBody || '{}',
      responseBody: endpoint.responseBody || '{}',
      description: endpoint.description || '',
      completed: endpoint.completed || false
    });
  }, [endpoint]);

  const handleMethodChange = (e) => {
    setFormData({ ...formData, method: e.target.value });
  };

  const handlePathChange = (e) => {
    setFormData({ ...formData, path: e.target.value });
  };

  const handleToggleCompleted = () => {
    setFormData({ ...formData, completed: !formData.completed });
  };

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleAddParam = () => {
    if (newParamKey.trim()) {
      const newParam = {
        key: newParamKey,
        value: newParamValue
      };
      
      setFormData({
        ...formData,
        queryParams: [...formData.queryParams, newParam]
      });
      
      setNewParamKey('');
      setNewParamValue('');
    }
  };

  const handleRemoveParam = (index) => {
    const updatedParams = [...formData.queryParams];
    updatedParams.splice(index, 1);
    setFormData({ ...formData, queryParams: updatedParams });
  };

  const handleRequestBodyChange = (e) => {
    setFormData({ ...formData, requestBody: e.target.value });
  };

  const handleResponseBodyChange = (e) => {
    setFormData({ ...formData, responseBody: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(endpoint._id, formData);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this endpoint?')) {
      onDelete(endpoint._id);
    }
  };

  return (
    <div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Edit Endpoint</h2>
        <div className="flex space-x-2">
          <button 
            className="btn btn-sm btn-error"
            onClick={handleDelete}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="col-span-1">
            <div className="border border-gray-200 rounded p-3 mb-4">
              <div className="flex items-center mb-3">
                <select 
                  className="select select-sm select-bordered mr-2"
                  value={formData.method}
                  onChange={handleMethodChange}
                >
                  <option>GET</option>
                  <option>POST</option>
                  <option>PUT</option>
                  <option>DELETE</option>
                </select>
                <input 
                  type="text" 
                  className="input input-sm input-bordered flex-1"
                  value={formData.path}
                  onChange={handlePathChange}
                  placeholder="/api/path"
                />
              </div>
              
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Description:</label>
                <textarea 
                  className="textarea textarea-bordered w-full"
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  placeholder="Add a description for this endpoint"
                  rows={3}
                ></textarea>
              </div>
              
              <div className="flex items-center mb-3">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="checkbox checkbox-sm mr-2"
                    checked={formData.completed}
                    onChange={handleToggleCompleted}
                  />
                  <span className="text-sm font-medium">
                    Mark as Completed
                  </span>
                </label>
              </div>
            </div>

            <div className="border border-gray-200 rounded">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <span className="font-medium">Query Params</span>
              </div>
              <div className="p-3">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-1">Key</th>
                      <th className="text-left py-1">Value</th>
                      <th className="w-8"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.queryParams.map((param, index) => (
                      <tr key={index} className="border-b last:border-b-0">
                        <td className="py-1">{param.key}</td>
                        <td className="py-1">{param.value}</td>
                        <td>
                          <button 
                            type="button"
                            className="btn btn-xs btn-ghost text-red-500"
                            onClick={() => handleRemoveParam(index)}
                          >
                            &times;
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-1">
                        <input 
                          type="text" 
                          className="input input-xs input-bordered w-full"
                          value={newParamKey}
                          onChange={(e) => setNewParamKey(e.target.value)}
                          placeholder="Key"
                        />
                      </td>
                      <td className="py-1">
                        <input 
                          type="text" 
                          className="input input-xs input-bordered w-full"
                          value={newParamValue}
                          onChange={(e) => setNewParamValue(e.target.value)}
                          placeholder="Value"
                        />
                      </td>
                      <td>
                        <button 
                          type="button"
                          className="btn btn-xs btn-primary"
                          onClick={handleAddParam}
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <span className="font-medium">Request Body</span>
              </div>
              <div className="p-3">
                <textarea 
                  className="textarea textarea-bordered w-full h-32 font-mono text-sm"
                  value={formData.requestBody}
                  onChange={handleRequestBodyChange}
                  placeholder="{}"
                ></textarea>
              </div>
            </div>

            <div className="border border-gray-200 rounded">
              <div className="p-3 border-b border-gray-200 bg-gray-50">
                <span className="font-medium">Response Body</span>
              </div>
              <div className="p-3">
                <textarea 
                  className="textarea textarea-bordered w-full h-32 font-mono text-sm"
                  value={formData.responseBody}
                  onChange={handleResponseBodyChange}
                  placeholder="{}"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button 
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-sm btn-primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EndpointDetail;