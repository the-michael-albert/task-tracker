import React from 'react';
import { ExternalLink } from 'lucide-react';

const UIMockup = ({ onExternalLinkClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold">UI Mockup</h2>
        <button 
          className="btn btn-sm btn-ghost"
          onClick={onExternalLinkClick}
        >
          <ExternalLink size={16} />
        </button>
      </div>
      <div className="p-4">
        <div className="border border-gray-200 rounded h-48 flex flex-col overflow-hidden">
          <div className="bg-gray-100 border-b border-gray-200 p-1 flex items-center text-xs">
            <div className="flex space-x-1 mr-2">
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
              <div className="w-3 h-3 rounded-full bg-gray-300"></div>
            </div>
            <div className="flex-1 bg-white rounded border border-gray-300 py-0.5 px-2 text-gray-500">
              https://
            </div>
          </div>
          <div className="flex-1 bg-gray-50 flex overflow-hidden">
            <div className="w-1/3 p-1 bg-gray-100 border-r border-gray-200 overflow-hidden">
              <div className="h-full w-full rounded bg-white text-xs font-mono p-1 text-gray-600 overflow-hidden">
                <span className="text-blue-600">function</span> <span className="text-purple-600">component</span>() &#123;<br />
                &nbsp;&nbsp;<span className="text-blue-600">return</span> (<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-600">div</span>&gt;<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&lt;/<span className="text-red-600">div</span>&gt;<br />
                &nbsp;&nbsp;);<br />
                &#125;
              </div>
            </div>
            <div className="flex-1 p-1 bg-gray-50">
              <div className="h-full w-full rounded bg-white border border-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIMockup;