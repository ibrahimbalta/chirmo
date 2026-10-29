import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TabBar } from './components/browser/TabBar';
import { AddressBar } from './components/browser/AddressBar';
import { BrowserContainer } from './components/browser/BrowserContainer';
import { TaskSidebar } from './components/browser/TaskSidebar';
import { ProjectsView } from './components/projects/ProjectsView';
import { AgentsView } from './components/agents/AgentsView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { PlaceholderView } from './components/views/PlaceholderView';
import { Tab, ActiveNavMenu } from './types';

export const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<ActiveNavMenu>('browser');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);

  useEffect(() => {
    // Initial load
    if (window.chirmo) {
      window.chirmo.getTabs().then((initialTabs) => {
        if (initialTabs && initialTabs.length > 0) {
          setTabs(initialTabs);
        } else {
          // Create first tab if empty
          window.chirmo.createTab().then((tab) => {
            setTabs([tab]);
            setActiveTabId(tab.id);
          });
        }
      });

      window.chirmo.getActiveTabId().then((id) => {
        if (id) setActiveTabId(id);
      });

      // Listen for tab list updates
      const unsubTabs = window.chirmo.onTabsUpdated((updatedTabs, currentActiveId) => {
        setTabs(updatedTabs);
        setActiveTabId(currentActiveId);
      });

      // Listen for tab state updates (url, title, favicon, loading)
      const unsubState = window.chirmo.onTabStateChanged((updatedTab) => {
        setTabs((prev) =>
          prev.map((t) => (t.id === updatedTab.id ? { ...t, ...updatedTab } : t))
        );
      });

      return () => {
        unsubTabs();
        unsubState();
      };
    }
  }, []);

  const activeTab = tabs.find((t) => t.id === activeTabId) || null;

  const handleSelectMenu = (menu: ActiveNavMenu) => {
    setActiveMenu(menu);
  };

  const handleNewTab = async () => {
    if (window.chirmo) {
      const newTab = await window.chirmo.createTab();
      setActiveTabId(newTab.id);
      setActiveMenu('browser');
    }
  };

  const handleCloseTab = async (tabId: string) => {
    if (window.chirmo) {
      await window.chirmo.closeTab(tabId);
    }
  };

  const handleSelectTab = async (tabId: string) => {
    if (window.chirmo) {
      await window.chirmo.switchTab(tabId);
      setActiveTabId(tabId);
      setActiveMenu('browser');
    }
  };

  const handleNavigate = (url: string) => {
    if (window.chirmo && activeTabId) {
      window.chirmo.navigate(activeTabId, url);
    }
  };

  const handleGoBack = () => {
    if (window.chirmo && activeTabId) {
      window.chirmo.goBack(activeTabId);
    }
  };

  const handleGoForward = () => {
    if (window.chirmo && activeTabId) {
      window.chirmo.goForward(activeTabId);
    }
  };

  const handleReload = () => {
    if (window.chirmo && activeTabId) {
      window.chirmo.reload(activeTabId);
    }
  };

  const handleStop = () => {
    if (window.chirmo && activeTabId) {
      window.chirmo.stopLoading(activeTabId);
    }
  };

  const handleGoHome = async () => {
    if (window.chirmo && activeTabId) {
      const settings = await window.chirmo.getSettings();
      window.chirmo.navigate(activeTabId, settings.homePage || 'https://www.google.com');
    }
  };

  const isBrowserActive = activeMenu === 'browser';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-chirmo-secondary text-chirmo-text">
      {/* Left Navigation Menu */}
      <Sidebar activeMenu={activeMenu} onSelectMenu={handleSelectMenu} />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-chirmo-bg relative">
        {/* Top Tab Bar & Window Controls */}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={handleSelectTab}
          onCloseTab={handleCloseTab}
          onNewTab={handleNewTab}
        />

        {/* Browser Top Navigation (Address bar, back/forward) */}
        {isBrowserActive && (
          <AddressBar
            activeTab={activeTab}
            isTaskPanelOpen={isTaskPanelOpen}
            onToggleTaskPanel={() => setIsTaskPanelOpen(!isTaskPanelOpen)}
            onNavigate={handleNavigate}
            onGoBack={handleGoBack}
            onGoForward={handleGoForward}
            onReload={handleReload}
            onStop={handleStop}
            onGoHome={handleGoHome}
          />
        )}

        {/* Content Viewports */}
        <div className="flex-1 relative overflow-hidden flex flex-row">
          {/* Main Content Area */}
          <div className="flex-1 relative overflow-hidden flex flex-col">
            {/* WebContentsView container */}
            <BrowserContainer isVisible={isBrowserActive} />

            {/* AI Agents View */}
            {activeMenu === 'agents' && (
              <div className="absolute inset-0 z-10 flex">
                <AgentsView />
              </div>
            )}

            {/* Projects View */}
            {activeMenu === 'projects' && (
              <div className="absolute inset-0 z-10 flex">
                <ProjectsView />
              </div>
            )}

            {/* History View */}
            {activeMenu === 'history' && (
              <div className="absolute inset-0 z-10 flex">
                <HistoryView />
              </div>
            )}

            {/* Settings View */}
            {activeMenu === 'settings' && (
              <div className="absolute inset-0 z-10 flex">
                <SettingsView />
              </div>
            )}

            {/* Placeholder views for other future modules */}
            {activeMenu !== 'browser' &&
              activeMenu !== 'agents' &&
              activeMenu !== 'projects' &&
              activeMenu !== 'history' &&
              activeMenu !== 'settings' && (
                <div className="absolute inset-0 z-10 flex">
                  <PlaceholderView
                    view={activeMenu}
                    onOpenBrowser={() => setActiveMenu('browser')}
                  />
                </div>
              )}
          </div>

          {/* Right Task & AI Sidebar in Browser View */}
          {isBrowserActive && isTaskPanelOpen && (
            <TaskSidebar
              currentTab={activeTab}
              onClose={() => setIsTaskPanelOpen(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
