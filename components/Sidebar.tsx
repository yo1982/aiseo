
import React from 'react';
import { NAV_ITEMS } from '../constants';
import type { NavItemType } from '../constants';

interface SidebarProps {
  activeTool: NavItemType['id'];
  setActiveTool: (toolId: NavItemType['id']) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTool, setActiveTool }) => {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-gray-700">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h1 className="text-2xl font-bold ml-2">SEO AI</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {NAV_ITEMS.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveTool(item.id)}
                className={`flex items-center w-full px-4 py-3 my-1 rounded-lg transition-colors duration-200 ${
                  activeTool === item.id
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-4 font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
            <img src="https://picsum.photos/40/40" alt="User Avatar" className="h-10 w-10 rounded-full" />
            <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-gray-400">Control Panel</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
