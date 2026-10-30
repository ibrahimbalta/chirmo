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
  Layers
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
      <header className="w-full h-16 px-4 sm:px-6 lg:px-10 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-slate-100/90 z-40 shrink-0">
        {/* Left: Primary Navigation Pill Dock */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 overflow-x-auto no-scrollbar py-1">
          {/* Ana Sayfa */}
          <button
            onClick={handleGoHome}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
              activeMenu === 'home'
                ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/10 scale-[1.02]'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 hover:border-slate-300'
            }`}
            title="Ana Sayfaya Dön"
          >
            <Home className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ana Sayfa</span>
          </button>

          {/* Keşfet */}
          <button
            onClick={() => setActiveMenu('discover')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
              activeMenu === 'discover'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25 ring-2 ring-purple-200 scale-[1.02]'
                : 'bg-purple-50/70 hover:bg-purple-100/90 text-purple-700 border border-purple-200/80 hover:border-purple-300'
            }`}
            title="Canlı Gündem & Keşifler"
          >
            <Compass
              className={`w-3.5 h-3.5 ${activeMenu === 'discover' ? 'text-white' : 'text-purple-600'}`}
            />
            <span>Keşfet</span>
          </button>

          {/* AI Araştırma */}
          <button
            onClick={() => setActiveMenu('agents')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
              activeMenu === 'agents'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/25 ring-2 ring-emerald-200 scale-[1.02]'
                : 'bg-emerald-50/70 hover:bg-emerald-100/90 text-emerald-700 border border-emerald-200/80 hover:border-emerald-300'
            }`}
            title="Derin Yapay Zeka Ajanı & Araştırma"
          >
            <Sparkles
              className={`w-3.5 h-3.5 ${activeMenu === 'agents' ? 'text-white' : 'text-emerald-600'}`}
            />
            <span>Araştırma</span>
          </button>

          {/* Görsel */}
          <button
            onClick={() => setActiveMenu('visual')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
              activeMenu === 'visual'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md shadow-sky-500/25 ring-2 ring-sky-200 scale-[1.02]'
                : 'bg-sky-50/70 hover:bg-sky-100/90 text-sky-700 border border-sky-200/80 hover:border-sky-300'
            }`}
            title="Görsel & Medya Arama"
          >
            <ImageIcon
              className={`w-3.5 h-3.5 ${activeMenu === 'visual' ? 'text-white' : 'text-sky-600'}`}
            />
            <span>Görsel</span>
          </button>

          {/* Karşılaştır */}
          <button
            onClick={() => setActiveMenu('compare')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
              activeMenu === 'compare'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-200 scale-[1.02]'
                : 'bg-amber-50/70 hover:bg-amber-100/90 text-amber-700 border border-amber-200/80 hover:border-amber-300'
            }`}
            title="Çift Kaynak & Ürün Karşılaştırma"
          >
            <Scale
              className={`w-3.5 h-3.5 ${activeMenu === 'compare' ? 'text-white' : 'text-amber-600'}`}
            />
            <span>Karşılaştır</span>
          </button>

          {/* Çalışma Alanı */}
          <button
            onClick={() => setActiveMenu('projects')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-2xs ${
              activeMenu === 'projects'
                ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/25 ring-2 ring-rose-200 scale-[1.02]'
                : 'bg-rose-50/70 hover:bg-rose-100/90 text-rose-700 border border-rose-200/80 hover:border-rose-300'
            }`}
            title="Kişisel Proje & Görev Yönetimi"
          >
            <FolderKanban
              className={`w-3.5 h-3.5 ${activeMenu === 'projects' ? 'text-white' : 'text-rose-600'}`}
            />
            <span>Çalışma Alanı</span>
          </button>

          {/* "Daha Fazla Araçlar" Dropdown */}
          <div ref={moreMenuRef} className="relative shrink-0">
            <button
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                ['tools', 'workflows', 'browser', 'history', 'settings'].includes(activeMenu) ||
                showMoreMenu
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100/80 hover:bg-slate-200/80 text-slate-700 border border-slate-200/80'
              }`}
              title="Daha Fazla Araç"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Daha Fazla</span>
              <ChevronDown
                className={`w-3 h-3 transition-transform ${
                  showMoreMenu ? 'rotate-180 text-slate-400' : 'text-slate-500'
                }`}
              />
            </button>

            {showMoreMenu && (
              <div className="absolute left-0 mt-3 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 py-2.5 z-50 animate-fadeIn ring-1 ring-slate-900/5">
                <button
                  onClick={() => {
                    setActiveMenu('tools');
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                    <Wrench className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold">Web Analiz Araçları</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      SEO, hız ve sayfa denetimi
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveMenu('workflows');
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                    <Workflow className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold">Otomasyon İş Akışları</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Çoklu kaynak tarama robotları
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveMenu('browser');
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-600 flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
                    <Globe className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div>
                    <div className="text-slate-900 font-bold">Dahili Web Tarayıcı</div>
                    <div className="text-[10px] font-normal text-slate-400">
                      Sekmeli canlı web gezintisi
                    </div>
                  </div>
                </button>

                <div className="my-1.5 border-t border-slate-100" />

                <button
                  onClick={() => {
                    setActiveMenu('history');
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-purple-50 hover:text-[#6534F8] flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <History className="w-4 h-4 text-purple-500" />
                  <span>Arama & Gezinti Geçmişi</span>
                </button>

                <button
                  onClick={() => {
                    setActiveMenu('settings');
                    setShowMoreMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs font-medium text-slate-600 hover:bg-purple-50 hover:text-[#6534F8] flex items-center gap-3 transition-colors cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-slate-500" />
                  <span>Ayarlar & Tercihler</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Theme Icon + Giriş Yap + Kayıt Ol */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          <button
            onClick={() => setAmbientWarmMode((prev) => !prev)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer border border-transparent hover:border-slate-200"
            title="Görünüm Modunu Değiştir"
            aria-label="Görünüm Modu"
          >
            {ambientWarmMode ? (
              <Moon className="w-[18px] h-[18px] text-[#6534F8]" />
            ) : (
              <Sun className="w-[18px] h-[18px] text-amber-500" />
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
                className="px-4 sm:px-5 py-2 rounded-full border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-all shadow-2xs cursor-pointer"
              >
                Giriş Yap
              </button>
              <button
                onClick={() => setAuthModalMode('register')}
                className="px-4.5 sm:px-5.5 py-2 rounded-full bg-gradient-to-r from-[#6534F8] via-[#7846f7] to-[#8E51FF] hover:from-[#5724e8] hover:to-[#7b3df5] text-white text-xs sm:text-sm font-bold shadow-[0_4px_16px_rgba(101,52,248,0.35)] hover:shadow-[0_6px_20px_rgba(101,52,248,0.45)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                Kayıt Ol
              </button>
            </>
          )}
        </div>
      </header>

      {/* Mobile Secondary Quick Nav Bar */}
      <div className="flex md:hidden items-center justify-around border-b border-slate-100 bg-white/95 px-2 py-2 text-xs font-semibold text-slate-600 shrink-0 overflow-x-auto no-scrollbar gap-1">
        <button
          onClick={handleGoHome}
          className={`px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 transition-all ${
            activeMenu === 'home'
              ? 'bg-slate-900 text-white shadow-2xs font-bold'
              : 'bg-slate-50 text-slate-600 border border-slate-200/80'
          }`}
        >
          <Home className="w-3 h-3 text-indigo-500" />
          <span>Ana Sayfa</span>
        </button>
        <button
          onClick={() => setActiveMenu('discover')}
          className={`px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 transition-all ${
            activeMenu === 'discover'
              ? 'bg-purple-600 text-white font-bold shadow-2xs'
              : 'bg-purple-50/70 text-purple-700 border border-purple-200/80'
          }`}
        >
          <Compass className="w-3 h-3" />
          <span>Keşfet</span>
        </button>
        <button
          onClick={() => setActiveMenu('agents')}
          className={`px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 transition-all ${
            activeMenu === 'agents'
              ? 'bg-emerald-600 text-white font-bold shadow-2xs'
              : 'bg-emerald-50/70 text-emerald-700 border border-emerald-200/80'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Araştırma</span>
        </button>
        <button
          onClick={() => setActiveMenu('visual')}
          className={`px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 transition-all ${
            activeMenu === 'visual'
              ? 'bg-sky-600 text-white font-bold shadow-2xs'
              : 'bg-sky-50/70 text-sky-700 border border-sky-200/80'
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          <span>Görsel</span>
        </button>
        <button
          onClick={() => setActiveMenu('compare')}
          className={`px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 transition-all ${
            activeMenu === 'compare'
              ? 'bg-amber-600 text-white font-bold shadow-2xs'
              : 'bg-amber-50/70 text-amber-700 border border-amber-200/80'
          }`}
        >
          <Scale className="w-3 h-3" />
          <span>Karşılaştır</span>
        </button>
        <button
          onClick={() => setActiveMenu('projects')}
          className={`px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 transition-all ${
            activeMenu === 'projects'
              ? 'bg-rose-600 text-white font-bold shadow-2xs'
              : 'bg-rose-50/70 text-rose-700 border border-rose-200/80'
          }`}
        >
          <FolderKanban className="w-3 h-3" />
          <span>Alanım</span>
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
