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
  User
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
  const [showMoreMenu, setShowMoreMenu] = useState(false);
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

  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
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
      authName.trim() || authEmail.split('@')[0] || 'Chirmo Kullanıcısı';
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
      {/* ==================== TOP GLOBAL NAVIGATION HEADER ==================== */}
      <header className="w-full h-16 px-4 sm:px-8 lg:px-12 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-slate-100/80 z-40 shrink-0">
        {/* Left: Brand Logo + Primary Navigation Links */}
        <div className="flex items-center gap-6 lg:gap-10">
          <button
            onClick={handleGoHome}
            className="flex items-center cursor-pointer focus:outline-none group"
            title="Chirmo Ana Sayfa"
          >
            <ChirmoLogo size="md" variant="header" />
          </button>

          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => setActiveMenu('discover')}
              className={`text-sm lg:text-[15px] font-semibold transition-colors cursor-pointer ${
                activeMenu === 'discover'
                  ? 'text-[#6534F8]'
                  : 'text-slate-700 hover:text-[#6534F8]'
              }`}
            >
              Keşfet
            </button>

            <button
              onClick={() => setActiveMenu('agents')}
              className={`text-sm lg:text-[15px] font-semibold transition-colors cursor-pointer ${
                activeMenu === 'agents'
                  ? 'text-[#6534F8]'
                  : 'text-slate-700 hover:text-[#6534F8]'
              }`}
            >
              Araştırma
            </button>

            <button
              onClick={() => setActiveMenu('visual')}
              className={`text-sm lg:text-[15px] font-semibold transition-colors cursor-pointer ${
                activeMenu === 'visual'
                  ? 'text-[#6534F8]'
                  : 'text-slate-700 hover:text-[#6534F8]'
              }`}
            >
              Görsel
            </button>

            <button
              onClick={() => setActiveMenu('compare')}
              className={`text-sm lg:text-[15px] font-semibold transition-colors cursor-pointer ${
                activeMenu === 'compare'
                  ? 'text-[#6534F8]'
                  : 'text-slate-700 hover:text-[#6534F8]'
              }`}
            >
              Karşılaştır
            </button>

            {/* "Daha Fazla" Dropdown */}
            <div ref={moreMenuRef} className="relative">
              <button
                onClick={() => setShowMoreMenu((prev) => !prev)}
                className={`flex items-center gap-1 text-sm lg:text-[15px] font-semibold transition-colors cursor-pointer ${
                  ['projects', 'tools', 'workflows', 'browser', 'history', 'settings'].includes(
                    activeMenu
                  )
                    ? 'text-[#6534F8]'
                    : 'text-slate-700 hover:text-[#6534F8]'
                }`}
              >
                <span>Daha Fazla</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    showMoreMenu ? 'rotate-180 text-[#6534F8]' : 'text-slate-500'
                  }`}
                />
              </button>

              {showMoreMenu && (
                <div className="absolute left-0 mt-3 w-60 rounded-2xl bg-white shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                  <button
                    onClick={() => {
                      setActiveMenu('projects');
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#6534F8] flex items-center gap-3 transition-colors"
                  >
                    <FolderKanban className="w-4 h-4 text-[#6534F8]" />
                    <div>
                      <div className="text-slate-900">Kişisel Çalışma Alanı</div>
                      <div className="text-[11px] font-normal text-slate-400">
                        Koleksiyonlar, projeler ve kayıtlar
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenu('tools');
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#6534F8] flex items-center gap-3 transition-colors"
                  >
                    <Wrench className="w-4 h-4 text-indigo-600" />
                    <div>
                      <div className="text-slate-900">Web Analiz Araçları</div>
                      <div className="text-[11px] font-normal text-slate-400">
                        SEO, okunabilirlik ve sayfa denetimi
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenu('workflows');
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#6534F8] flex items-center gap-3 transition-colors"
                  >
                    <Workflow className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-slate-900">Otomasyon İş Akışları</div>
                      <div className="text-[11px] font-normal text-slate-400">
                        Çoklu kaynak tarama şablonları
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenu('browser');
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-purple-50 hover:text-[#6534F8] flex items-center gap-3 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="text-slate-900">Dahili Web Tarayıcı</div>
                      <div className="text-[11px] font-normal text-slate-400">
                        Sekmeli web gezintisi
                      </div>
                    </div>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setActiveMenu('history');
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-purple-50 hover:text-[#6534F8] flex items-center gap-3 transition-colors"
                  >
                    <History className="w-4 h-4 text-slate-400" />
                    <span>Gezinti & İşlem Geçmişi</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveMenu('settings');
                      setShowMoreMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-purple-50 hover:text-[#6534F8] flex items-center gap-3 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span>Ayarlar & Veri Yönetimi</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Right: Theme Icon + Giriş Yap + Kayıt Ol */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          <button
            onClick={() => setAmbientWarmMode((prev) => !prev)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Görünüm Modu"
            aria-label="Görünüm Modu"
          >
            {ambientWarmMode ? (
              <Moon className="w-[18px] h-[18px] text-[#6534F8]" />
            ) : (
              <Sun className="w-[18px] h-[18px]" />
            )}
          </button>

          {userProfile ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveMenu('projects')}
                className="px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-[#6534F8] text-xs sm:text-sm font-semibold flex items-center gap-2 hover:bg-purple-100 transition-all cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>{userProfile.name}</span>
              </button>
              <button
                onClick={() => {
                  setUserProfile(null);
                  localStorage.removeItem('chirmo_user_profile_v1');
                }}
                className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
                title="Çıkış Yap"
              >
                Çıkış
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setAuthModalMode('login')}
                className="px-4 sm:px-5 py-2 rounded-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium transition-all cursor-pointer"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setAuthModalMode('register')}
                className="px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-[#6C38FF] to-[#5624E0] hover:from-[#5E2CE6] hover:to-[#4A1CC4] text-white text-xs sm:text-sm font-medium shadow-[0_4px_14px_rgba(101,52,248,0.35)] transition-all cursor-pointer"
              >
                Kayıt Ol
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Secondary Quick Nav Bar */}
      <div className="flex md:hidden items-center justify-around border-b border-slate-100 bg-white/95 px-2 py-1.5 text-xs font-medium text-slate-600 shrink-0">
        <button
          onClick={handleGoHome}
          className={`px-2.5 py-1 rounded-full ${
            activeMenu === 'home' ? 'bg-purple-50 text-[#6534F8] font-semibold' : ''
          }`}
        >
          Arama
        </button>
        <button
          onClick={() => setActiveMenu('discover')}
          className={`px-2.5 py-1 rounded-full ${
            activeMenu === 'discover' ? 'bg-purple-50 text-[#6534F8] font-semibold' : ''
          }`}
        >
          Keşfet
        </button>
        <button
          onClick={() => setActiveMenu('agents')}
          className={`px-2.5 py-1 rounded-full ${
            activeMenu === 'agents' ? 'bg-purple-50 text-[#6534F8] font-semibold' : ''
          }`}
        >
          Araştırma
        </button>
        <button
          onClick={() => setActiveMenu('visual')}
          className={`px-2.5 py-1 rounded-full ${
            activeMenu === 'visual' ? 'bg-purple-50 text-[#6534F8] font-semibold' : ''
          }`}
        >
          Görsel
        </button>
        <button
          onClick={() => setActiveMenu('compare')}
          className={`px-2.5 py-1 rounded-full ${
            activeMenu === 'compare' ? 'bg-purple-50 text-[#6534F8] font-semibold' : ''
          }`}
        >
          Karşılaştır
        </button>
        <button
          onClick={() => setActiveMenu('projects')}
          className={`px-2.5 py-1 rounded-full ${
            activeMenu === 'projects' ? 'bg-purple-50 text-[#6534F8] font-semibold' : ''
          }`}
        >
          Alanım
        </button>
      </div>

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
                {authModalMode === 'login' ? 'Chirmo Hesabına Giriş Yap' : 'Yeni Chirmo Hesabı Oluştur'}
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
                  placeholder="ornek@chirmo.ai"
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
