import React, { useState } from 'react';
import { 
  Globe, 
  FolderKanban, 
  Bot, 
  Wrench, 
  Workflow, 
  History, 
  Settings,
  Search,
  Menu,
  X
} from 'lucide-react';
import { ActiveNavMenu } from '../../types';
import { ChirmoLogo } from '../common/ChirmoLogo';

interface SidebarProps {
  activeMenu: ActiveNavMenu;
  onSelectMenu: (menu: ActiveNavMenu) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onSelectMenu }) => {
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const menuItems: { id: ActiveNavMenu; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'home', label: 'Arama & Ana Sayfa', icon: <Search className="w-4 h-4" />, badge: 'AI Hub' },
    { id: 'browser', label: 'Tarayıcı', icon: <Globe className="w-4 h-4" /> },
    { id: 'agents', label: 'AI Ajanları', icon: <Bot className="w-4 h-4" /> },
    { id: 'projects', label: 'Projeler', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'tools', label: 'Araçlar', icon: <Wrench className="w-4 h-4" /> },
    { id: 'workflows', label: 'İş Akışları', icon: <Workflow className="w-4 h-4" /> },
    { id: 'history', label: 'Görev Geçmişi', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-4 h-4" /> },
  ];

  const handleMenuClick = (id: ActiveNavMenu) => {
    onSelectMenu(id);
    setIsMobileDrawerOpen(false);
  };

  return (
    <>
      {/* 1. DESKTOP SIDEBAR (Visible on md and larger screens) */}
      <aside className="hidden md:flex w-60 bg-[#FAF9FE] border-r border-chirmo-border/80 flex-col justify-between select-none h-full z-20 shrink-0">
        <div>
          <div 
            onClick={() => handleMenuClick('home')}
            className="h-14 border-b border-chirmo-border/70 flex items-center px-4 bg-white/80 backdrop-blur-md cursor-pointer hover:bg-chirmo-secondary/60 transition-colors"
          >
            <ChirmoLogo size="sm" showText={true} animated={true} />
          </div>

          <nav className="p-2.5 space-y-1">
            {menuItems.map((item) => {
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4338CA] via-[#6652C9] to-[#7C3AED] text-white shadow-md shadow-chirmo-brand/25'
                      : 'text-chirmo-text-secondary hover:bg-white hover:text-chirmo-text hover:shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-extrabold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-chirmo-brand/10 text-chirmo-brand'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System Status Footer */}
        <div className="p-3.5 m-2.5 rounded-2xl border border-chirmo-border/80 bg-white shadow-2xs text-[11px] text-chirmo-text-secondary">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-bold text-chirmo-text">Nöral Motor Aktif</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              0.4ms
            </span>
          </div>
          <span className="text-[10px] text-chirmo-text-muted block">Chirmo Enterprise OS v1.0</span>
        </div>
      </aside>

      {/* 2. MOBILE SLIDE-OVER DRAWER */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative w-64 max-w-[82vw] bg-chirmo-bg h-full shadow-2xl flex flex-col justify-between z-10">
            <div>
              <div className="h-14 border-b border-chirmo-border flex items-center justify-between px-4 bg-chirmo-bg">
                <ChirmoLogo size="sm" showText={true} animated={false} />
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-chirmo-text-secondary hover:bg-chirmo-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3 space-y-1">
                {menuItems.map((item) => {
                  const isActive = activeMenu === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-[#4338CA] to-[#6652C9] text-white shadow-sm'
                          : 'text-chirmo-text-secondary hover:bg-chirmo-secondary hover:text-chirmo-text'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                            isActive ? 'bg-white/20 text-white' : 'bg-chirmo-brand/10 text-chirmo-brand'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="p-4 border-t border-chirmo-border bg-chirmo-secondary/50 text-xs text-chirmo-text-secondary">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-chirmo-success animate-pulse"></span>
                <span className="font-semibold text-chirmo-text">Yerel Zekâ Aktif</span>
              </div>
              <span className="text-[10px] text-chirmo-text-muted block">Chirmo OS v1.0 PRO</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE BOTTOM NAVIGATION BAR (Visible on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white/95 backdrop-blur-md border-t border-chirmo-border z-40 flex items-center justify-around px-1 shadow-lg">
        <button
          onClick={() => handleMenuClick('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
            activeMenu === 'home' ? 'text-chirmo-brand font-bold' : 'text-chirmo-text-secondary'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Arama</span>
        </button>

        <button
          onClick={() => handleMenuClick('browser')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
            activeMenu === 'browser' ? 'text-chirmo-brand font-bold' : 'text-chirmo-text-secondary'
          }`}
        >
          <Globe className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Tarayıcı</span>
        </button>

        <button
          onClick={() => handleMenuClick('agents')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
            activeMenu === 'agents' ? 'text-chirmo-brand font-bold' : 'text-chirmo-text-secondary'
          }`}
        >
          <Bot className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">AI Ajan</span>
        </button>

        <button
          onClick={() => handleMenuClick('projects')}
          className={`flex flex-col items-center justify-center flex-1 py-1 rounded-lg transition-colors ${
            activeMenu === 'projects' ? 'text-chirmo-brand font-bold' : 'text-chirmo-text-secondary'
          }`}
        >
          <FolderKanban className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Projeler</span>
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 rounded-lg text-chirmo-text-secondary hover:text-chirmo-brand transition-colors"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Menü</span>
        </button>
      </div>
    </>
  );
};
