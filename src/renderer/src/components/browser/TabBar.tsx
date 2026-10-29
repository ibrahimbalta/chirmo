import React from 'react';
import { Plus, X, Globe, Loader2, Minus, Square, Copy } from 'lucide-react';
import { Tab } from '../../types';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
}) => {
  const handleMinimize = () => {
    window.chirmo?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.chirmo?.maximizeWindow();
  };

  const handleClose = () => {
    window.chirmo?.closeWindow();
  };

  return (
    <div className="h-10 bg-chirmo-secondary border-b border-chirmo-border flex items-center justify-between pl-2 pr-0 select-none draggable-header">
      {/* Tab List */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 h-full pt-1.5 non-draggable">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3 py-1.5 h-full rounded-t-lg text-xs font-medium cursor-pointer border-t border-l border-r transition-all max-w-[200px] min-w-[120px] ${
                isActive
                  ? 'bg-chirmo-bg text-chirmo-text border-chirmo-border shadow-sm font-semibold'
                  : 'bg-transparent text-chirmo-text-secondary border-transparent hover:bg-chirmo-bg/60 hover:text-chirmo-text'
              }`}
            >
              {/* Favicon or Spinner */}
              <div className="shrink-0 flex items-center justify-center w-3.5 h-3.5">
                {tab.isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-chirmo-brand" />
                ) : tab.favicon ? (
                  <img
                    src={tab.favicon}
                    alt=""
                    className="w-3.5 h-3.5 rounded-sm object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <Globe className="w-3.5 h-3.5 text-chirmo-text-muted" />
                )}
              </div>

              {/* Title */}
              <span className="truncate flex-1 text-[11px] leading-tight">
                {tab.title || 'Yeni Sekme'}
              </span>

              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`p-0.5 rounded hover:bg-chirmo-border/80 transition-colors ${
                  isActive ? 'text-chirmo-text-secondary hover:text-chirmo-text' : 'opacity-0 group-hover:opacity-100 text-chirmo-text-muted hover:text-chirmo-text'
                }`}
                title="Sekmeyi Kapat"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          className="p-1 rounded-md text-chirmo-text-secondary hover:bg-chirmo-bg hover:text-chirmo-brand transition-colors ml-1"
          title="Yeni Sekme Aç"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Windows Window Controls */}
      <div className="flex items-center h-full non-draggable">
        <button
          onClick={handleMinimize}
          className="h-full px-3 hover:bg-chirmo-border/60 text-chirmo-text-secondary hover:text-chirmo-text transition-colors flex items-center justify-center"
          title="Küçült"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-full px-3 hover:bg-chirmo-border/60 text-chirmo-text-secondary hover:text-chirmo-text transition-colors flex items-center justify-center"
          title="Ekranı Kapla"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="h-full px-3 hover:bg-chirmo-error hover:text-white text-chirmo-text-secondary transition-colors flex items-center justify-center"
          title="Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
