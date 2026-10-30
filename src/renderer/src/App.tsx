import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TabBar } from './components/browser/TabBar';
import { AddressBar } from './components/browser/AddressBar';
import { BrowserContainer } from './components/browser/BrowserContainer';
import { TaskSidebar } from './components/browser/TaskSidebar';
import { ProjectsView } from './components/projects/ProjectsView';
import { AgentsView } from './components/agents/AgentsView';
import { ToolsView } from './components/tools/ToolsView';
import { WorkflowsView } from './components/workflows/WorkflowsView';
import { HistoryView } from './components/history/HistoryView';
import { SettingsView } from './components/settings/SettingsView';
import { HomeSearchHub } from './components/home/HomeSearchHub';
import { DiscoverView } from './components/discover/DiscoverView';
import { VisualDiscoveryView } from './components/visual/VisualDiscoveryView';
import { CompareView } from './components/compare/CompareView';
import { Tab, ActiveNavMenu } from './types';

export const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<ActiveNavMenu>('home');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [agentInitialPrompt, setAgentInitialPrompt] = useState<string>('');
  const [sharedSearchQuery, setSharedSearchQuery] = useState<string>('');
  const [visualInitialQuery, setVisualInitialQuery] = useState<string>('');
  const [comparePair, setComparePair] = useState<{ a: string; b: string }>({
    a: 'Elektrikli otomobil',
    b: 'Hibrit otomobil'
  });

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

  const handleGoHome = () => {
    setActiveMenu('home');
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
          onGoHome={handleGoHome}
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

            {/* Discover View */}
            {activeMenu === 'discover' && (
              <div className="absolute inset-0 z-10 flex">
                <DiscoverView
                  onSearchTopic={(topic: string) => {
                    setSharedSearchQuery(topic);
                    setActiveMenu('home');
                  }}
                  onOpenVisualDiscovery={(q: string) => {
                    setVisualInitialQuery(q);
                    setActiveMenu('visual');
                  }}
                  onCompareTopics={(a: string, b: string) => {
                    setComparePair({ a, b });
                    setActiveMenu('compare');
                  }}
                />
              </div>
            )}

            {/* Visual Discovery View */}
            {activeMenu === 'visual' && (
              <div className="absolute inset-0 z-10 flex">
                <VisualDiscoveryView
                  initialQuery={visualInitialQuery}
                  onExploreTopic={(topic: string) => {
                    setSharedSearchQuery(topic);
                    setActiveMenu('home');
                  }}
                />
              </div>
            )}

            {/* Smart Comparison View */}
            {activeMenu === 'compare' && (
              <div className="absolute inset-0 z-10 flex">
                <CompareView
                  initialOptionA={comparePair.a}
                  initialOptionB={comparePair.b}
                  onExploreTopic={(topic: string) => {
                    setSharedSearchQuery(topic);
                    setActiveMenu('home');
                  }}
                />
              </div>
            )}

            {/* AI Agents / Deep Research View */}
            {activeMenu === 'agents' && (
              <div className="absolute inset-0 z-10 flex">
                <AgentsView initialPrompt={agentInitialPrompt} />
              </div>
            )}

            {/* Personal Workspace / Projects View */}
            {activeMenu === 'projects' && (
              <div className="absolute inset-0 z-10 flex">
                <ProjectsView
                  onOpenSearch={(q: string) => {
                    setSharedSearchQuery(q);
                    setActiveMenu('home');
                  }}
                  onOpenComparison={(a: string, b: string) => {
                    setComparePair({ a, b });
                    setActiveMenu('compare');
                  }}
                />
              </div>
            )}

            {/* Tools View */}
            {activeMenu === 'tools' && (
              <div className="absolute inset-0 z-10 flex">
                <ToolsView currentTab={activeTab} />
              </div>
            )}

            {/* Workflows View */}
            {activeMenu === 'workflows' && (
              <div className="absolute inset-0 z-10 flex">
                <WorkflowsView />
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

            {/* Home / Omnisearch AI Hub View */}
            {activeMenu === 'home' && (
              <div className="absolute inset-0 z-10 flex">
                <HomeSearchHub
                  initialQuery={sharedSearchQuery}
                  onNavigateToBrowser={(url: string) => {
                    if (activeTabId && window.chirmo) {
                      window.chirmo.navigate(activeTabId, url);
                      setActiveMenu('browser');
                    } else if (window.chirmo) {
                      window.chirmo.createTab(url).then((tab) => {
                        setActiveTabId(tab.id);
                        setActiveMenu('browser');
                      });
                    }
                  }}
                  onNavigateToAgents={(prompt: string) => {
                    setAgentInitialPrompt(prompt);
                    setActiveMenu('agents');
                  }}
                  onNavigateToProjects={() => setActiveMenu('projects')}
                  onNavigateToTools={() => setActiveMenu('tools')}
                  onNavigateToVisual={(q: string) => {
                    setVisualInitialQuery(q);
                    setActiveMenu('visual');
                  }}
                  onNavigateToCompare={(a: string, b: string) => {
                    setComparePair({ a, b });
                    setActiveMenu('compare');
                  }}
                  onNavigateToDiscover={() => setActiveMenu('discover')}
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
