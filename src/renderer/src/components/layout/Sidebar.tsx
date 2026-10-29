import React from 'react';
import { 
  Globe, 
  FolderKanban, 
  Bot, 
  Wrench, 
  Workflow, 
  History, 
  Settings,
  Sparkles,
  Search
} from 'lucide-react';
import { ActiveNavMenu } from '../../types';

interface SidebarProps {
  activeMenu: ActiveNavMenu;
  onSelectMenu: (menu: ActiveNavMenu) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onSelectMenu }) => {
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

  return (
    <aside className="w-56 bg-chirmo-secondary border-r border-chirmo-border flex flex-col justify-between select-none h-full z-20">
      {/* Brand Header */}
      <div>
        <div 
          onClick={() => onSelectMenu('home')}
          className="h-12 border-b border-chirmo-border flex items-center px-4 gap-2.5 bg-chirmo-bg cursor-pointer hover:bg-chirmo-secondary/50 transition-colors"
        >
          <div className="w-7 h-7 rounded-lg bg-chirmo-brand flex items-center justify-center text-white shadow-sm shadow-chirmo-brand/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-chirmo-text">CHIRMO</span>
            <span className="text-[10px] block text-chirmo-text-secondary leading-none">AI & Search Hub</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-2 space-y-0.5">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectMenu(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-chirmo-brand text-white shadow-sm'
                    : 'text-chirmo-text-secondary hover:bg-chirmo-bg hover:text-chirmo-text'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
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
      <div className="p-3 border-t border-chirmo-border bg-chirmo-bg/50 text-[11px] text-chirmo-text-secondary">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-chirmo-success animate-pulse"></span>
          <span className="font-medium text-chirmo-text">Yerel Zekâ Çevrimiçi</span>
        </div>
        <span className="text-[10px] text-chirmo-text-muted block">Chirmo Desktop v0.1.0</span>
      </div>
    </aside>
  );
};
