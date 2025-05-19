import React from 'react';
import { ExternalLink } from 'lucide-react';

const UIMockup = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">UI Mockup</h2>
        <button className="btn btn-sm btn-ghost">
          <ExternalLink size={16} />
        </button>
      </div>
      <div className="p-4">
        <div className="border border-gray-200 rounded h-48 flex items-center justify-center bg-gray-50">
          <img 
            src="/api/placeholder/400/200" 
            alt="UI Mockup Preview" 
            className="max-h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default UIMockup;