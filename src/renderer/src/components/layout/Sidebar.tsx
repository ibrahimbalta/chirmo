import React, { useState } from 'react'
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
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Compass,
  Image as ImageIcon,
  Scale
} from 'lucide-react'
import { ActiveNavMenu } from '../../types'
import { ChirmoLogo } from '../common/ChirmoLogo'

interface SidebarProps {
  activeMenu: ActiveNavMenu
  onSelectMenu: (menu: ActiveNavMenu) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeMenu, onSelectMenu }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState<string>('main')

  const menuGroups = [
    {
      id: 'main',
      title: 'Arama & Keşif',
      items: [
        {
          id: 'home' as ActiveNavMenu,
          label: 'AI Arama & Ana Sayfa',
          icon: <Search className="w-4 h-4 shrink-0" />
        },
        {
          id: 'discover' as ActiveNavMenu,
          label: 'Keşfet (Discover)',
          icon: <Compass className="w-4 h-4 shrink-0" />
        },
        {
          id: 'visual' as ActiveNavMenu,
          label: 'Görsel Keşif',
          icon: <ImageIcon className="w-4 h-4 shrink-0" />
        },
        {
          id: 'compare' as ActiveNavMenu,
          label: 'Akıllı Karşılaştırma',
          icon: <Scale className="w-4 h-4 shrink-0" />
        }
      ]
    },
    {
      id: 'workspace',
      title: 'Araştırma & Çalışma Alanı',
      items: [
        {
          id: 'agents' as ActiveNavMenu,
          label: 'Derin Araştırma (Research)',
          icon: <Bot className="w-4 h-4 shrink-0" />
        },
        {
          id: 'projects' as ActiveNavMenu,
          label: 'Kişisel Çalışma Alanı',
          icon: <FolderKanban className="w-4 h-4 shrink-0" />
        },
        {
          id: 'tools' as ActiveNavMenu,
          label: 'Sayfa Analiz Araçları',
          icon: <Wrench className="w-4 h-4 shrink-0" />
        },
        {
          id: 'workflows' as ActiveNavMenu,
          label: 'Toplu İş Akışları',
          icon: <Workflow className="w-4 h-4 shrink-0" />
        }
      ]
    },
    {
      id: 'system',
      title: 'Tarayıcı & Sistem',
      items: [
        {
          id: 'browser' as ActiveNavMenu,
          label: 'Web Tarayıcı',
          icon: <Globe className="w-4 h-4 shrink-0" />
        },
        {
          id: 'history' as ActiveNavMenu,
          label: 'Geçmiş',
          icon: <History className="w-4 h-4 shrink-0" />
        },
        {
          id: 'settings' as ActiveNavMenu,
          label: 'Ayarlar',
          icon: <Settings className="w-4 h-4 shrink-0" />
        }
      ]
    }
  ]

  const allItems = menuGroups.flatMap((g) => g.items)

  const handleMenuClick = (id: ActiveNavMenu): void => {
    onSelectMenu(id)
    setIsMobileDrawerOpen(false)
  }

  return (
    <>
      {/* 1. DESKTOP COLLAPSIBLE SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-white border-r border-slate-200 select-none h-full z-20 shrink-0 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-14' : 'w-60'
        }`}
      >
        <div className="overflow-y-auto no-scrollbar">
          {/* Top Brand & Slide Toggle Header */}
          <div className="h-12 border-b border-slate-100 flex items-center justify-between px-3">
            {!isCollapsed && (
              <div
                onClick={() => handleMenuClick('home')}
                className="cursor-pointer overflow-hidden"
              >
                <ChirmoLogo size="sm" />
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Menüyü Aç' : 'Menüyü Daralt'}
              className={`p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-chirmo-brand transition-colors ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title={isCollapsed ? 'Menüyü Aç' : 'Menüyü Daralt'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-2 space-y-2">
            {isCollapsed ? (
              <div className="space-y-1">
                {allItems.map((item) => {
                  const isActive = activeMenu === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      aria-label={item.label}
                      title={item.label}
                      className={`w-full flex items-center justify-center p-2.5 rounded-xl transition-colors ${
                        isActive
                          ? 'bg-chirmo-brand text-white shadow-xs'
                          : 'text-slate-500 hover:bg-chirmo-brand-light/50 hover:text-chirmo-brand'
                      }`}
                    >
                      {item.icon}
                    </button>
                  )
                })}
              </div>
            ) : (
              menuGroups.map((group) => {
                const isGroupOpen = openGroup === group.id
                return (
                  <div
                    key={group.id}
                    className="border-b border-slate-100 last:border-none pb-2"
                  >
                    <button
                      onClick={() => setOpenGroup(isGroupOpen ? '' : group.id)}
                      className="w-full flex items-center justify-between px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700"
                    >
                      <span>{group.title}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          isGroupOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {isGroupOpen && (
                      <div className="mt-1 space-y-0.5">
                        {group.items.map((item) => {
                          const isActive = activeMenu === item.id
                          return (
                            <button
                              key={item.id}
                              onClick={() => handleMenuClick(item.id)}
                              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                                isActive
                                  ? 'bg-chirmo-brand text-white font-semibold shadow-2xs'
                                  : 'text-slate-600 hover:bg-chirmo-brand-light/40 hover:text-chirmo-brand'
                              }`}
                            >
                              {item.icon}
                              <span className="truncate">{item.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </nav>
        </div>

        {/* Bottom Collapse */}
        <div className="p-2 border-t border-slate-100 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center gap-2 py-2 px-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Menüyü Daralt</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE SLIDE-OVER DRAWER */}
      {isMobileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          <div className="relative w-64 max-w-[82vw] bg-white h-full shadow-2xl flex flex-col justify-between z-10 overflow-y-auto">
            <div>
              <div className="h-14 border-b border-slate-100 flex items-center justify-between px-4">
                <ChirmoLogo size="sm" />
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  aria-label="Menüyü kapat"
                  className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-3 space-y-1">
                {allItems.map((item) => {
                  const isActive = activeMenu === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleMenuClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-chirmo-brand text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE BOTTOM BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-1">
        <button
          onClick={() => handleMenuClick('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            activeMenu === 'home' ? 'text-chirmo-brand font-bold' : 'text-slate-500'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Arama</span>
        </button>

        <button
          onClick={() => handleMenuClick('discover')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            activeMenu === 'discover' ? 'text-chirmo-brand font-bold' : 'text-slate-500'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Keşfet</span>
        </button>

        <button
          onClick={() => handleMenuClick('visual')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            activeMenu === 'visual' ? 'text-chirmo-brand font-bold' : 'text-slate-500'
          }`}
        >
          <ImageIcon className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Görsel</span>
        </button>

        <button
          onClick={() => handleMenuClick('projects')}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            activeMenu === 'projects' ? 'text-chirmo-brand font-bold' : 'text-slate-500'
          }`}
        >
          <FolderKanban className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Çalışma Al.</span>
        </button>

        <button
          onClick={() => setIsMobileDrawerOpen(true)}
          className="flex flex-col items-center justify-center flex-1 py-1 text-slate-500"
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Menü</span>
        </button>
      </div>
    </>
  )
}
