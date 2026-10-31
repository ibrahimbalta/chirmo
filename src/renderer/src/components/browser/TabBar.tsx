import React, { useState } from 'react';
import {
  Plus,
  X,
  Loader2,
  Minus,
  Square,
  Sparkles,
  Pin,
  ChevronDown,
  ChevronRight,
  FolderMinus,
  Palette
} from 'lucide-react';
import { Tab, TabGroup } from '../../types';
import { ChirmoLogo } from '../common/ChirmoLogo';
import { GROUP_COLOR_THEMES } from '../../services/tabGroupService';

interface TabBarProps {
  tabs: Tab[];
  groups?: TabGroup[];
  activeTabId: string | null;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTab: () => void;
  onGoHome?: () => void;
  onAutoGroupTabs?: () => void;
  onToggleGroupCollapse?: (groupId: string) => void;
  onUngroup?: (groupId: string) => void;
  onTogglePinTab?: (tabId: string) => void;
  onChangeGroupColor?: (groupId: string, color: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  groups = [],
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onGoHome,
  onAutoGroupTabs,
  onToggleGroupCollapse,
  onUngroup,
  onTogglePinTab,
  onChangeGroupColor
}) => {
  const [activeGroupMenuId, setActiveGroupMenuId] = useState<string | null>(null);

  const handleMinimize = () => {
    window.chirmo?.minimizeWindow();
  };

  const handleMaximize = () => {
    window.chirmo?.maximizeWindow();
  };

  const handleClose = () => {
    window.chirmo?.closeWindow();
  };

  // 1. Separate pinned tabs vs normal tabs
  const pinnedTabs = tabs.filter((t) => t.isPinned);
  const unpinnedTabs = tabs.filter((t) => !t.isPinned);

  // Group collapsed lookup map
  const collapsedGroupIds = new Set(groups.filter((g) => g.isCollapsed).map((g) => g.id));

  // Partition unpinned tabs into groups and standalone
  const groupTabsMap = new Map<string, Tab[]>();
  const standaloneTabs: Tab[] = [];

  unpinnedTabs.forEach((tab) => {
    if (tab.groupId) {
      if (!groupTabsMap.has(tab.groupId)) {
        groupTabsMap.set(tab.groupId, []);
      }
      groupTabsMap.get(tab.groupId)!.push(tab);
    } else {
      standaloneTabs.push(tab);
    }
  });

  return (
    <div className="h-10 bg-chirmo-secondary border-b border-chirmo-border flex items-center justify-between pl-2 pr-0 select-none draggable-header shrink-0">
      {/* Mobile Brand Icon */}
      <button
        onClick={onGoHome}
        className="md:hidden flex items-center gap-1.5 mr-2 py-0.5 non-draggable shrink-0 cursor-pointer"
        title="Ana Sayfa"
      >
        <ChirmoLogo size="xs" animated={false} />
      </button>

      {/* Main Tab Bar Scrollable List */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1 h-full pt-1.5 non-draggable">
        {/* ================= PINNED TABS ================= */}
        {pinnedTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center justify-center px-2 py-1.5 h-full rounded-t-lg cursor-pointer border-t border-l border-r transition-all w-9 shrink-0 ${
                isActive
                  ? 'bg-chirmo-bg text-chirmo-text border-chirmo-border shadow-xs'
                  : 'bg-transparent text-chirmo-text-secondary border-transparent hover:bg-chirmo-bg/60'
              }`}
              title={`${tab.title || 'Sabitlenmiş Sekme'} (Sabitlendi)`}
            >
              <div className="relative flex items-center justify-center">
                {tab.favicon ? (
                  <img
                    src={tab.favicon}
                    alt=""
                    className="w-3.5 h-3.5 rounded-xs object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './favicon.png';
                    }}
                  />
                ) : (
                  <img src="./favicon.png" alt="" className="w-3.5 h-3.5 rounded-xs object-contain" />
                )}
                <Pin className="w-2.5 h-2.5 text-purple-600 absolute -top-1 -right-1 opacity-80" />
              </div>
            </div>
          );
        })}

        {pinnedTabs.length > 0 && <div className="w-px h-5 bg-slate-300/80 mx-1 shrink-0" />}

        {/* ================= GROUPED TABS ================= */}
        {groups.map((group) => {
          const groupTabs = groupTabsMap.get(group.id) || [];
          if (groupTabs.length === 0) return null;

          const isCollapsed = collapsedGroupIds.has(group.id);
          const colorTheme = GROUP_COLOR_THEMES[group.color] || GROUP_COLOR_THEMES.purple;

          return (
            <div key={group.id} className="flex items-center h-full shrink-0">
              {/* Group Pill Header */}
              <div className="relative shrink-0">
                <div
                  onClick={() => onToggleGroupCollapse?.(group.id)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setActiveGroupMenuId(activeGroupMenuId === group.id ? null : group.id);
                  }}
                  className={`flex items-center gap-1 px-2 py-1 mr-1 rounded-t-md text-[11px] font-bold border-t border-l border-r cursor-pointer transition-all ${colorTheme.badge}`}
                  title={`${group.title} (Aç/Kapat için tıkla, seçenekler için sağ tıkla)`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${colorTheme.dot}`} />
                  <span className="truncate max-w-[110px]">{group.title}</span>
                  <span className="text-[9px] opacity-70">({groupTabs.length})</span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3 h-3 opacity-60" />
                  ) : (
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  )}
                </div>

                {/* Group Context Menu */}
                {activeGroupMenuId === group.id && (
                  <div className="absolute left-0 top-8 z-50 w-44 rounded-xl bg-white shadow-xl border border-slate-200 p-1.5 animate-fadeIn">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 py-1">
                      Grup Ayarları
                    </span>
                    <button
                      onClick={() => {
                        onUngroup?.(group.id);
                        setActiveGroupMenuId(null);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 flex items-center gap-2 cursor-pointer"
                    >
                      <FolderMinus className="w-3.5 h-3.5 text-slate-500" />
                      <span>Grubu Dağıt</span>
                    </button>
                    <div className="px-2 py-1 border-t border-slate-100 mt-1">
                      <span className="text-[10px] text-slate-500 font-medium block mb-1">
                        Grup Rengi:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {Object.entries(GROUP_COLOR_THEMES).map(([colorKey, th]) => (
                          <button
                            key={colorKey}
                            onClick={() => {
                              onChangeGroupColor?.(group.id, colorKey);
                              setActiveGroupMenuId(null);
                            }}
                            className={`w-4 h-4 rounded-full ${th.dot} hover:scale-110 transition-transform cursor-pointer`}
                            title={th.name}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Render tabs if not collapsed */}
              {!isCollapsed &&
                groupTabs.map((tab) => {
                  const isActive = tab.id === activeTabId;
                  return (
                    <div
                      key={tab.id}
                      onClick={() => onSelectTab(tab.id)}
                      className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 h-full rounded-t-lg text-xs font-medium cursor-pointer border-t border-l border-r transition-all max-w-[140px] sm:max-w-[180px] min-w-[80px] sm:min-w-[110px] shrink-0 ${
                        isActive
                          ? 'bg-chirmo-bg text-chirmo-text border-chirmo-border shadow-xs font-semibold'
                          : 'bg-transparent text-chirmo-text-secondary border-transparent hover:bg-chirmo-bg/60 hover:text-chirmo-text'
                      }`}
                    >
                      {/* Favicon or Spinner */}
                      <div className="shrink-0 flex items-center justify-center w-3.5 h-3.5">
                        {tab.isLoading ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-600" />
                        ) : tab.favicon ? (
                          <img
                            src={tab.favicon}
                            alt=""
                            className="w-3.5 h-3.5 rounded-xs object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = './favicon.png';
                            }}
                          />
                        ) : (
                          <img src="./favicon.png" alt="" className="w-3.5 h-3.5 rounded-xs object-contain" />
                        )}
                      </div>

                      {/* Title */}
                      <span className="truncate flex-1 text-[11px] leading-tight">
                        {tab.title || 'Yeni Sekme'}
                      </span>

                      {/* Close Tab Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCloseTab(tab.id);
                        }}
                        className={`p-0.5 rounded hover:bg-slate-200 transition-colors ${
                          isActive
                            ? 'text-slate-600 hover:text-slate-900'
                            : 'opacity-100 sm:opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-700'
                        }`}
                        title="Sekmeyi Kapat"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
            </div>
          );
        })}

        {/* ================= STANDALONE UNGROUPED TABS ================= */}
        {standaloneTabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 h-full rounded-t-lg text-xs font-medium cursor-pointer border-t border-l border-r transition-all max-w-[150px] sm:max-w-[200px] min-w-[90px] sm:min-w-[120px] shrink-0 ${
                isActive
                  ? 'bg-chirmo-bg text-chirmo-text border-chirmo-border shadow-xs font-semibold'
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
                    className="w-3.5 h-3.5 rounded-xs object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = './favicon.png';
                    }}
                  />
                ) : (
                  <img src="./favicon.png" alt="" className="w-3.5 h-3.5 rounded-xs object-contain" />
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

        {/* AI Auto-Group Action Button */}
        {tabs.length >= 2 && onAutoGroupTabs && (
          <button
            onClick={onAutoGroupTabs}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 text-[11px] font-semibold transition-all shrink-0 ml-1 cursor-pointer shadow-2xs"
            title="Açık Sekmeleri Yapay Zekâ ile Otomatik Grupla"
          >
            <Sparkles className="w-3 h-3 text-purple-600 animate-pulse" />
            <span className="hidden sm:inline">AI Grupla</span>
          </button>
        )}

        {/* New Tab Button */}
        <button
          onClick={onNewTab}
          className="p-1 rounded-md text-chirmo-text-secondary hover:bg-chirmo-bg hover:text-chirmo-brand transition-colors ml-1 shrink-0 cursor-pointer"
          title="Yeni Sekme Aç"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Windows Window Controls (Hidden on mobile screens) */}
      <div className="hidden md:flex items-center h-full non-draggable shrink-0">
        <button
          onClick={handleMinimize}
          className="h-full px-3 hover:bg-chirmo-border/60 text-chirmo-text-secondary hover:text-chirmo-text transition-colors flex items-center justify-center cursor-pointer"
          title="Küçült"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleMaximize}
          className="h-full px-3 hover:bg-chirmo-border/60 text-chirmo-text-secondary hover:text-chirmo-text transition-colors flex items-center justify-center cursor-pointer"
          title="Ekranı Kapla"
        >
          <Square className="w-3 h-3" />
        </button>
        <button
          onClick={handleClose}
          className="h-full px-3 hover:bg-chirmo-error hover:text-white text-chirmo-text-secondary transition-colors flex items-center justify-center cursor-pointer"
          title="Kapat"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
