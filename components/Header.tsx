
import React from 'react';
import type { NavItemType } from '../constants';
import { NAV_ITEMS } from '../constants';

interface HeaderProps {
    activeTool: NavItemType['id'];
}

const Header: React.FC<HeaderProps> = ({ activeTool }) => {
  const currentTool = NAV_ITEMS.find(item => item.id === activeTool);

  return (
    <header className="h-20 bg-surface border-b border-border flex items-center justify-between px-8">
      <h2 className="text-2xl font-semibold text-text-primary">{currentTool?.label}</h2>
      <div>
        <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-sm">
            Generate Report
        </button>
      </div>
    </header>
  );
};

export default Header;
