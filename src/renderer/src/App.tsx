import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  ChevronDown,
  FolderKanban,
  Wrench,
  Workflow,
  Globe,
  History,
  Settings,
  Sparkles,
  Check,
  X,
  User,
  Home,
  Compass,
  Image as ImageIcon,
  Scale,
  Layers,
  LayoutGrid,
  Search,
  ArrowLeft
} from 'lucide-react';
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
import { ChirmoLogo } from './components/common/ChirmoLogo';
import { Tab, ActiveNavMenu } from './types';

export const App: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<ActiveNavMenu>('home');
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isTaskPanelOpen, setIsTaskPanelOpen] = useState(false);
  const [agentInitialPrompt, setAgentInitialPrompt] = useState<string>('');
  const [sharedSearchQuery, setSharedSearchQuery] = useState<string>('');
  const [homeResetTrigger, setHomeResetTrigger] = useState<number>(0);
  const [visualInitialQuery, setVisualInitialQuery] = useState<string>('');
  const [comparePair, setComparePair] = useState<{ a: string; b: string }>({
    a: 'Elektrikli otomobil',
    b: 'Hibrit otomobil'
  });

  // Top Header Dropdown & Auth Modal State
  const [showAppLauncher, setShowAppLauncher] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | null>(null);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('chirmo_user_profile_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [ambientWarmMode, setAmbientWarmMode] = useState(false);

  const appLauncherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (appLauncherRef.current && !appLauncherRef.current.contains(e.target as Node)) {
        setShowAppLauncher(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (window.chirmo) {
      window.chirmo.getTabs().then((initialTabs) => {
        if (initialTabs && initialTabs.length > 0) {
          setTabs(initialTabs);
        } else {
          window.chirmo.createTab().then((tab) => {
            setTabs([tab]);
            setActiveTabId(tab.id);
          });
        }
      });

      window.chirmo.getActiveTabId().then((id) => {
        if (id) setActiveTabId(id);
      });

      const unsubTabs = window.chirmo.onTabsUpdated((updatedTabs, currentActiveId) => {
        setTabs(updatedTabs);
        setActiveTabId(currentActiveId);
      });

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

  const handleGoHome = () => {
    setSharedSearchQuery('');
    setHomeResetTrigger((prev) => prev + 1);
    setActiveMenu('home');
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

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return;
    const displayName =
      authName.trim() || authEmail.split('@')[0] || 'COGKO Kullanıcısı';
    const profile = { name: displayName, email: authEmail.trim() };
    setUserProfile(profile);
    try {
      localStorage.setItem('chirmo_user_profile_v1', JSON.stringify(profile));
    } catch {
      // ignore
    }
    setAuthModalMode(null);
    setAuthName('');
    setAuthEmail('');
    setAuthPassword('');
  };

  const isBrowserActive = activeMenu === 'browser';

  return (
    <div
      className={`flex flex-col h-screen w-screen overflow-hidden text-chirmo-text ${
        ambientWarmMode ? 'bg-[#FDFCFE]' : 'bg-white'
      }`}
    >
      {/* ==================== TOP MINIMAL HEADER (GOOGLE APPS STYLE) ==================== */}
      <header className="w-full h-14 sm:h-16 px-4 sm:px-8 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-100/90 z-40 shrink-0">
        {/* Left: Return to Home button when away from Home */}
        <div className="flex items-center">
          {activeMenu !== 'home' ? (
            <button
              onClick={handleGoHome}
              className="px-3.5 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
              <span>Ana Sayfaya Dön</span>
            </button>
          ) : (
            <div className="w-4" />
          )}
        </div>

        {/* Right: Quick Links + 9-Dot Apps Launcher (Google Style) + Theme + Auth */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setActiveMenu('discover')}
            className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeMenu === 'discover'
                ? 'text-[#6534F8] font-bold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Keşfet
          </button>

          <button
            onClick={() => setActiveMenu('visual')}
            className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
              activeMenu === 'visual'
                ? 'text-[#6534F8] font-bold'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            Görseller
          </button>

          {/* 9-DOT WAFFLE APP LAUNCHER */}
          <div ref={appLauncherRef} className="relative">
            <button
              onClick={() => setShowAppLauncher((prev) => !prev)}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                showAppLauncher
                  ? 'bg-slate-200 text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title="COGKO Uygulamaları"
              aria-label="COGKO Uygulamaları"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>

            {/* FLOATING APP LAUNCHER POPOVER (MATCHING GOOGLE WAFFLE APPS) */}
            {showAppLauncher && (
              <div className="absolute right-0 top-12 w-80 sm:w-88 rounded-3xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-200/90 p-4 sm:p-5 z-50 animate-fadeIn ring-1 ring-slate-900/5">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-800 tracking-wide">
                    Favorileriniz
                  </span>
                  <span className="text-[11px] font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    COGKO Apps
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-y-3.5 gap-x-2 text-center max-h-[70vh] overflow-y-auto no-scrollbar py-1">
                  {[
                    {
                      id: 'search',
                      label: 'Arama',
                      icon: <Search className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-blue-500/20',
                      action: () => handleGoHome()
                    },
                    {
                      id: 'discover',
                      label: 'Keşfet',
                      icon: <Compass className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-purple-500 to-violet-600 shadow-purple-500/20',
                      action: () => setActiveMenu('discover')
                    },
                    {
                      id: 'agents',
                      label: 'Araştırma',
                      icon: <Sparkles className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/20',
                      action: () => setActiveMenu('agents')
                    },
                    {
                      id: 'visual',
                      label: 'Görseller',
                      icon: <ImageIcon className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-sky-400 to-blue-500 shadow-sky-500/20',
                      action: () => setActiveMenu('visual')
                    },
                    {
                      id: 'compare',
                      label: 'Karşılaştır',
                      icon: <Scale className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-amber-400 to-orange-500 shadow-amber-500/20',
                      action: () => setActiveMenu('compare')
                    },
                    {
                      id: 'projects',
                      label: 'Projeler',
                      icon: <FolderKanban className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-rose-500 to-pink-600 shadow-rose-500/20',
                      action: () => setActiveMenu('projects')
                    },
                    {
                      id: 'browser',
                      label: 'Tarayıcı',
                      icon: <Globe className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/20',
                      action: () => setActiveMenu('browser')
                    },
                    {
                      id: 'tools',
                      label: 'Web Analiz',
                      icon: <Wrench className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-indigo-500 to-purple-700 shadow-indigo-500/20',
                      action: () => setActiveMenu('tools')
                    },
                    {
                      id: 'workflows',
                      label: 'İş Akışları',
                      icon: <Workflow className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-teal-500 to-emerald-600 shadow-teal-500/20',
                      action: () => setActiveMenu('workflows')
                    },
                    {
                      id: 'history',
                      label: 'Geçmiş',
                      icon: <History className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-slate-600 to-slate-800 shadow-slate-600/20',
                      action: () => setActiveMenu('history')
                    },
                    {
                      id: 'settings',
                      label: 'Ayarlar',
                      icon: <Settings className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-slate-400 to-slate-600 shadow-slate-400/20',
                      action: () => setActiveMenu('settings')
                    },
                    {
                      id: 'account',
                      label: userProfile ? userProfile.name : 'Hesap',
                      icon: <User className="w-5 h-5 text-white" />,
                      bg: 'bg-gradient-to-tr from-[#6534F8] to-[#9055FA] shadow-purple-500/20',
                      action: () => {
                        if (userProfile) {
                          setActiveMenu('projects');
                        } else {
                          setAuthModalMode('login');
                        }
                      }
                    }
                  ].map((app) => (
                    <button
                      key={app.id}
                      onClick={() => {
                        app.action();
                        setShowAppLauncher(false);
                      }}
                      className="flex flex-col items-center group p-2.5 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer"
                    >
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 shadow-md ${app.bg}`}
                      >
                        {app.icon}
                      </div>
                      <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900 truncate max-w-full">
                        {app.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setAmbientWarmMode((prev) => !prev)}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
            title="Görünüm Modu"
            aria-label="Görünüm Modu"
          >
            {ambientWarmMode ? (
              <Moon className="w-[18px] h-[18px] text-[#6534F8]" />
            ) : (
              <Sun className="w-[18px] h-[18px] text-amber-500" />
            )}
          </button>

          {/* User Profile or Giriş Yap */}
          {userProfile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMenu('projects')}
                className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#6534F8] to-[#8B5CF6] text-white text-xs font-bold flex items-center justify-center shadow-xs cursor-pointer hover:scale-105 transition-transform"
                title={userProfile.name}
              >
                {userProfile.name.slice(0, 1).toUpperCase()}
              </button>
              <button
                onClick={() => {
                  setUserProfile(null);
                  localStorage.removeItem('chirmo_user_profile_v1');
                }}
                className="text-xs text-slate-400 hover:text-slate-600 px-1 py-1"
                title="Çıkış Yap"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalMode('login')}
              className="px-5 py-2 rounded-full bg-[#6534F8] hover:bg-[#5625e6] text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              Giriş yapın
            </button>
          )}
        </div>
      </header>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Browser TabBar & AddressBar only when built-in browser view is active */}
        {isBrowserActive && (
          <>
            <TabBar
              tabs={tabs}
              activeTabId={activeTabId}
              onSelectTab={handleSelectTab}
              onCloseTab={handleCloseTab}
              onNewTab={handleNewTab}
              onGoHome={handleGoHome}
            />
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
          </>
        )}

        {/* Content Viewports */}
        <div className="flex-1 relative overflow-hidden flex flex-row">
          <div className="flex-1 relative overflow-hidden flex flex-col">
            <BrowserContainer isVisible={isBrowserActive} />

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

            {activeMenu === 'agents' && (
              <div className="absolute inset-0 z-10 flex">
                <AgentsView initialPrompt={agentInitialPrompt} />
              </div>
            )}

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

            {activeMenu === 'tools' && (
              <div className="absolute inset-0 z-10 flex">
                <ToolsView currentTab={activeTab} />
              </div>
            )}

            {activeMenu === 'workflows' && (
              <div className="absolute inset-0 z-10 flex">
                <WorkflowsView />
              </div>
            )}

            {activeMenu === 'history' && (
              <div className="absolute inset-0 z-10 flex">
                <HistoryView />
              </div>
            )}

            {activeMenu === 'settings' && (
              <div className="absolute inset-0 z-10 flex">
                <SettingsView />
              </div>
            )}

            {activeMenu === 'home' && (
              <div className="absolute inset-0 z-10 flex">
                <HomeSearchHub
                  key={homeResetTrigger}
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

          {isBrowserActive && isTaskPanelOpen && (
            <TaskSidebar
              currentTab={activeTab}
              onClose={() => setIsTaskPanelOpen(false)}
            />
          )}
        </div>
      </div>

      {/* ==================== GİRİŞ YAP / KAYIT OL MODAL ==================== */}
      {authModalMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative">
            <button
              onClick={() => setAuthModalMode(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <ChirmoLogo size="md" variant="header" />
              <h3 className="text-xl font-bold text-slate-900 mt-4">
                {authModalMode === 'login' ? 'COGKO Hesabına Giriş Yap' : 'Yeni COGKO Hesabı Oluştur'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Araştırmalarınızı, koleksiyonlarınızı ve kişisel çalışma alanınızı senkronize edin.
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Örn: İbrahim Balta"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#6534F8] outline-none"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="ornek@cogko.com"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#6534F8] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Şifre
                </label>
                <input
                  type="password"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#6534F8] outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#6C38FF] to-[#5624E0] hover:from-[#5E2CE6] hover:to-[#4A1CC4] text-white text-sm font-semibold shadow-md transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{authModalMode === 'login' ? 'Giriş Yap' : 'Ücretsiz Kayıt Ol'}</span>
              </button>
            </form>

            <div className="mt-5 text-center text-xs text-slate-500">
              {authModalMode === 'login' ? (
                <>
                  Hesabınız yok mu?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('register')}
                    className="text-[#6534F8] font-semibold hover:underline"
                  >
                    Kayıt Olun
                  </button>
                </>
              ) : (
                <>
                  Zaten hesabınız var mı?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-[#6534F8] font-semibold hover:underline"
                  >
                    Giriş Yapın
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
