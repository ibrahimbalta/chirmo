import React from 'react';
import { Plus, X, Globe, Loader2, Minus, Square } from 'lucide-react';
import { Tab } from '../../types';
import { ChirmoLogo } from '../common/ChirmoLogo';

interface TabBarProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
  onGoHome?: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onGoHome,
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
    <div className="h-10 bg-chirmo-secondary border-b border-chirmo-border flex items-center justify-between pl-2 pr-0 select-none draggable-header shrink-0">
      {/* Mobile Brand Icon */}
      <button
        onClick={onGoHome}
        className="md:hidden flex items-center gap-1.5 mr-2 py-0.5 non-draggable shrink-0"
        title="Ana Sayfa"
      >
        <ChirmoLogo size="xs" animated={false} />
      </button>

      {/* Tab List */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 h-full pt-1.5 non-draggable">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 h-full rounded-t-lg text-xs font-medium cursor-pointer border-t border-l border-r transition-all max-w-[150px] sm:max-w-[200px] min-w-[90px] sm:min-w-[120px] shrink-0 ${
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
                      (e.target as HTMLImageElement).src = './favicon.png';
                    }}
                  />
                ) : (
                  <img
                    src="./favicon.png"
                    alt=""
                    className="w-3.5 h-3.5 rounded-xs object-contain"
                  />
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
                  isActive
                    ? 'text-chirmo-text-secondary hover:text-chirmo-text'
                    : 'opacity-100 sm:opacity-0 group-hover:opacity-100 text-chirmo-text-muted hover:text-chirmo-text'
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
          className="p-1 rounded-md text-chirmo-text-secondary hover:bg-chirmo-bg hover:text-chirmo-brand transition-colors ml-1 shrink-0"
          title="Yeni Sekme Aç"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Windows Window Controls (Hidden on mobile screens) */}
      <div className="hidden md:flex items-center h-full non-draggable shrink-0">
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
