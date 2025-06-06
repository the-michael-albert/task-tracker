import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Trash2, Upload, ArrowLeftCircle } from 'lucide-react';

const MockupScreengrabs = ({ onBack }) => {
  const [mockupName, setMockupName] = useState('');

  return (
    <div>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            className="btn btn-sm btn-ghost mr-2"
            onClick={onBack}
          >
            <ArrowLeftCircle size={16} />
          </button>
          <h2 className="text-lg font-semibold">Mockup Screengrabs</h2>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-3">
          <div className="flex-1">
            <label className="block mb-1 text-sm font-medium">Name:</label>
            <input 
              type="text" 
              className="input input-bordered w-full" 
              value={mockupName}
              onChange={(e) => setMockupName(e.target.value)}
              placeholder="Mockup name"
            />
          </div>
          <div className="ml-4 flex space-x-2">
            <button className="btn btn-sm btn-ghost">
              <Trash2 size={16} />
            </button>
            <button className="btn btn-sm btn-ghost">
              <Upload size={16} />
            </button>
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg h-64 flex items-center justify-center bg-white">
          <span className="text-gray-400">Preview area for mockup screenshots</span>
        </div>
        
        <div className="flex justify-between mt-4">
          <button className="btn btn-sm btn-circle">
            <ArrowLeft size={16} />
          </button>
          <button className="btn btn-sm btn-circle">
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockupScreengrabs;