import React, { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

const ComponentsList = ({ components, endpoints }) => {
  const [selectingComponents, setSelectingComponents] = useState(false);

  return (
    <div>
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Components</h2>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1">
          <div className="mb-3 flex justify-between">
            <h3 className="text-md font-medium">Available Components</h3>
            <div className="flex items-center">
              <button 
                className={`btn btn-sm ${selectingComponents ? 'btn-error' : 'btn-ghost'}`}
                onClick={() => setSelectingComponents(!selectingComponents)}
              >
                {selectingComponents ? <Trash2 size={14} /> : 'Select'}
              </button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded">
            <div className="p-3 border-b border-gray-200 bg-gray-50">
              <span className="font-medium">Component Tree</span>
            </div>
            <div className="p-3">
              {components.length === 0 ? (
                <div className="text-sm text-gray-500">No components available</div>
              ) : (
                <ul className="list-none">
                  {components.map((component) => (
                    <li key={component._id} className="mb-2 flex items-start">
                      {selectingComponents && (
                        <input type="checkbox" className="checkbox checkbox-sm mt-0.5 mr-2" />
                      )}
                      <div>
                        <div className="font-medium">{component.name}</div>
                        {component.children && (
                          <ul className="list-none pl-5 pt-1">
                            {component.children.map((child) => (
                              <li key={child._id} className="mb-1 flex items-start">
                                {selectingComponents && (
                                  <input type="checkbox" className="checkbox checkbox-sm mt-0.5 mr-2" />
                                )}
                                <span>{child.name}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex space-x-2">
            <button className="btn btn-sm btn-outline btn-error flex-1" disabled={!selectingComponents}>
              <Trash2 size={14} className="mr-1" /> Delete
            </button>
            <button className="btn btn-sm btn-outline btn-primary flex-1">
              <Plus size={14} className="mr-1" /> Add
            </button>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="mb-3">
            <h3 className="text-md font-medium">Component Detail</h3>
          </div>
          
          <div className="border border-gray-200 rounded p-3">
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Name:</label>
              <input type="text" className="input input-bordered w-full" placeholder="Component name" />
            </div>
            
            <div className="flex-1 border border-gray-200 rounded-lg h-64 bg-gray-50 flex items-center justify-center">
              <span className="text-gray-400">Component preview area</span>
            </div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <button className="btn btn-sm btn-ghost">
                &lt; Previous
              </button>
              <button className="btn btn-sm btn-ghost">
                Next &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsList;