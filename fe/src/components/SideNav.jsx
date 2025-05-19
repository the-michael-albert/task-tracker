import React from 'react';
import { LayoutDashboard, Bell, Users } from 'lucide-react';

const SideNav = () => {
  return (
    <div className="bg-white w-52 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-bold">Features</h2>
      </div>
      <nav className="flex-1">
        <ul className="p-2">
          <li className="mb-1">
            <a href="#" className="flex items-center p-2 rounded-lg bg-blue-100 text-blue-700">
              <LayoutDashboard className="mr-2 h-5 w-5" />
              <span>Dashboard Creation</span>
            </a>
          </li>
          <li className="mb-1">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <Bell className="mr-2 h-5 w-5" />
              <span>Notifications</span>
            </a>
          </li>
          <li className="mb-1">
            <a href="#" className="flex items-center p-2 rounded-lg hover:bg-gray-100">
              <Users className="mr-2 h-5 w-5" />
              <span>Onboarding</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default SideNav;