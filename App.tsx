
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import KeywordResearch from './components/KeywordResearch';
import ContentAnalyzer from './components/ContentAnalyzer';
import SiteAudit from './components/SiteAudit';
import type { NavItemType } from './constants';
import { NAV_ITEMS } from './constants';

const App: React.FC = () => {
  const [activeTool, setActiveTool] = useState<NavItemType['id']>(NAV_ITEMS[0].id);

  const renderActiveTool = () => {
    switch (activeTool) {
      case 'dashboard':
        return <Dashboard />;
      case 'keyword_research':
        return <KeywordResearch />;
      case 'content_analyzer':
        return <ContentAnalyzer />;
      case 'site_audit':
        return <SiteAudit />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background text-text-primary">
      <Sidebar activeTool={activeTool} setActiveTool={setActiveTool} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header activeTool={activeTool} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-4 md:p-8">
          {renderActiveTool()}
        </main>
      </div>
    </div>
  );
};

export default App;
