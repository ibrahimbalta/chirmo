import React from 'react';
import { 
  Home, 
  Globe, 
  FolderKanban, 
  Bot, 
  Wrench, 
  Workflow, 
  History, 
  Settings,
  Sparkles
} from 'lucide-react';
import { ActiveNavMenu } from '../../types';

interface SidebarProps {
  activeMenu: ActiveNavMenu;
  onSelectMenu: (menu: ActiveNavMenu) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onSelectMenu }) => {
  const menuItems: { id: ActiveNavMenu; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'browser', label: 'Tarayıcı', icon: <Globe className="w-4 h-4" /> },
    { id: 'agents', label: 'AI Ajanları', icon: <Bot className="w-4 h-4" /> },
    { id: 'projects', label: 'Projeler', icon: <FolderKanban className="w-4 h-4" /> },
    { id: 'history', label: 'Görev Geçmişi', icon: <History className="w-4 h-4" /> },
    { id: 'home', label: 'Ana Sayfa', icon: <Home className="w-4 h-4" /> },
    { id: 'tools', label: 'Araçlar', icon: <Wrench className="w-4 h-4" /> },
    { id: 'workflows', label: 'İş Akışları', icon: <Workflow className="w-4 h-4" /> },
    { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-56 bg-chirmo-secondary border-r border-chirmo-border flex flex-col justify-between select-none h-full z-20">
      {/* Brand Header */}
      <div>
        <div className="h-12 border-b border-chirmo-border flex items-center px-4 gap-2.5 bg-chirmo-bg">
          <div className="w-7 h-7 rounded-lg bg-chirmo-brand flex items-center justify-center text-white shadow-sm shadow-chirmo-brand/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight text-chirmo-text">CHIRMO</span>
            <span className="text-[10px] block text-chirmo-text-secondary leading-none">AI Workspace</span>
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
                  <span className={isActive ? 'text-white' : 'text-chirmo-text-secondary'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${
                    isActive ? 'bg-white/20 text-white' : 'bg-chirmo-border text-chirmo-text-secondary'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-chirmo-border text-[11px] text-chirmo-text-secondary bg-chirmo-bg/50">
        <div className="flex items-center justify-between font-mono text-[10px]">
          <span>Chirmo Desktop</span>
          <span className="bg-chirmo-brand-light text-chirmo-brand px-1.5 py-0.5 rounded font-semibold">v0.1.0</span>
        </div>
        <p className="mt-1 text-[10px] text-chirmo-text-muted truncate">
          Gezin. Düşün. İşlerini Tamamla.
        </p>
      </div>
    </aside>
  );
};
