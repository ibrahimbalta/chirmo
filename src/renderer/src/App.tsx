import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  CheckSquare,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Home,
  X,
  Volume2,
  Lock,
  Globe,
  Smartphone,
  Download,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Mic,
  Compass,
  Smile,
  Film,
  Layers,
  GraduationCap
} from 'lucide-react';
import { ChirmoLogo } from './components/common/ChirmoLogo';
import { BrowserContainer, PageSentenceItem } from './components/browser/BrowserContainer';
import { ChirmoHeroLandingPortal } from './components/landing/ChirmoHeroLandingPortal';
import { SimpleSearchHome } from './components/home/SimpleSearchHome';
import { SimpleLearningHub } from './components/learning/SimpleLearningHub';
import { SimpleTaskWorkspace } from './components/tasks/SimpleTaskWorkspace';
import { SimpleAiTutorDrawer } from './components/learning/SimpleAiTutorDrawer';
import { LearningCenterSidebar } from './components/home/LearningCenterSidebar';
import { ChirmoAiTeacherSidebar } from './components/home/ChirmoAiTeacherSidebar';
import { SmartReaderModal } from './components/learning/SmartReaderModal';
import { InstallAppModal } from './components/common/InstallAppModal';
import { ProfileEditModal } from './components/common/ProfileEditModal';
import { ChirmoOnboardingModal } from './components/learning/ChirmoOnboardingModal';
import { RealLifeSimulatorStudio } from './components/learning/RealLifeSimulatorStudio';
import { EnglishGameArcade } from './components/learning/EnglishGameArcade';
import { ChirmoKidsDedicatedHub } from './components/kids/ChirmoKidsDedicatedHub';
import { WatchingView } from './components/learning/WatchingView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { LifePhraseBankView } from './components/learning/LifePhraseBankView';
import { ChirmoMasterTeacherModal } from './components/learning/ChirmoMasterTeacherModal';
import { LearningStorageService } from './services/learningStorage';
import { UserProfileService, UserProfile } from './services/userProfileService';
import { PrivacyAuthService, SafeUserSession } from './services/privacyAuthService';
import { TargetLanguageService, SupportedLanguage } from './services/targetLanguageService';
import { Tab, CEFRLevel, DailyGoalProgress } from './types';
import { CampStorageService, StudentCampProgress } from './services/curriculumData';

export type AppNavTab = 'portal' | 'search' | 'learn' | 'phrases' | 'kids' | 'games' | 'speak' | 'tasks' | 'video' | 'admin';

export const App: React.FC = () => {
  // Açılış Vitrini ('portal') varsayılan başlangıç ekranıdır
  const [activeTab, setActiveTab] = useState<AppNavTab>('portal');

  // Tarayıcı Durumu
  const [isBrowserNavigating, setIsBrowserNavigating] = useState(false);
  const [tabs, setTabs] = useState<Tab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [addressBarUrl, setAddressBarUrl] = useState('');

  // Öğrenme & Seviye Durumu (Varsayılan A1 Başlangıç)
  const [learningProgress, setLearningProgress] = useState<DailyGoalProgress>(() =>
    LearningStorageService.getProgress()
  );
  const [campProgress, setCampProgress] = useState<StudentCampProgress>(() =>
    CampStorageService.getProgress()
  );
  // Varsayılan olarak sağ asistanı kapalı başlatarak ana sahneye maksimum ferahlık sağlıyoruz
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [isSmartReaderOpen, setIsSmartReaderOpen] = useState(false);
  const [activeLearningText, setActiveLearningText] = useState(
    'Artificial intelligence is helping businesses improve their services and reduce costs.'
  );
  const [selectedSentenceItem, setSelectedSentenceItem] = useState<PageSentenceItem | null>(null);

  // İş Takibi Görev Sayısı
  const [pendingTaskCount, setPendingTaskCount] = useState(2);

  // Mobil Uygulama & APK İndirme Modalı
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  // 50 Yıllık Hoca Masası Modalı
  const [isMasterTeacherOpen, setIsMasterTeacherOpen] = useState(false);

  // Kişiye Özel Kullanıcı Profili (Her tarayıcıda bağımsız ve özel)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => UserProfileService.getProfile());
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  // Mobilde tüm modülleri gösteren açılır menü durumu
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Sıfır Kişisel Veri SaaS Kimlik Durumu
  const [currentUser, setCurrentUser] = useState<SafeUserSession | null>(() =>
    PrivacyAuthService.getCurrentUser()
  );

  // Aktif Hedef Çalışma Dili (İngilizce 🇬🇧 / Almanca 🇩🇪)
  const [targetLanguage, setTargetLanguage] = useState<SupportedLanguage>(() =>
    TargetLanguageService.getTargetLanguage()
  );

  useEffect(() => {
    const unsubAuth = PrivacyAuthService.onAuthStateChanged((u) => {
      setCurrentUser(u);
    });
    const unsubProfile = UserProfileService.subscribe((updated) => {
      setUserProfile(updated);
    });
    const unsubLang = TargetLanguageService.subscribe((lang) => {
      setTargetLanguage(lang);
    });

    const handleHash = () => {
      if (typeof window !== 'undefined') {
        if (window.location.hash === '#admin') {
          setActiveTab('admin');
        } else if (window.location.hash === '#panel') {
          setActiveTab('search');
        }
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);

    return () => {
      unsubAuth();
      unsubProfile();
      unsubLang();
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  // Sol Öğrenme Merkezi Paneli (Mobil uygulama sadeliği için varsayılan kapalı)
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);
  // Masaüstü "Diğer Araçlar" kompakt açılır menüsü
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  // Seviye ve İhtiyaç Analizi Modalı (Diagnostic Onboarding)
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sayfaya ilk girişte yaş ve seviye analizi sorup kişisel plan oluşturma
  useEffect(() => {
    try {
      const isCompleted = localStorage.getItem('chirmo_onboarding_completed_v1');
      if (!isCompleted) {
        const timer = setTimeout(() => {
          setIsOnboardingOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  const handleLeftSidebarSelect = (itemId: string) => {
    if (itemId === 'portal') {
      setActiveTab('portal');
      setIsBrowserNavigating(false);
    } else if (itemId === 'home') {
      setActiveTab('search');
      setIsBrowserNavigating(false);
    } else if (itemId === 'games') {
      setActiveTab('games');
    } else if (itemId === 'speaking' || itemId === 'simulator') {
      setActiveTab('speak');
    } else if (itemId === 'kids') {
      setActiveTab('kids');
    } else if (itemId === 'report' || itemId === 'tasks') {
      setActiveTab('tasks');
    } else if (itemId === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('learn');
    }
  };

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
        const current = updatedTabs.find((t) => t.id === currentActiveId);
        if (current && current.url && !current.url.startsWith('data:')) {
          setAddressBarUrl(current.url);
        }
      });

      const unsubText = window.chirmo.onTextSelected?.((selectedText) => {
        if (selectedText && selectedText.trim().length > 0) {
          setActiveLearningText(selectedText.trim());
          setIsTutorOpen(true);
        }
      });

      return () => {
        unsubTabs();
        unsubText?.();
      };
    }
  }, []);

  // WebContentsView görünürlük kontrolü
  useEffect(() => {
    const shouldShowBrowser = activeTab === 'search' && isBrowserNavigating;
    window.chirmo?.setWebContentsVisible(shouldShowBrowser);
  }, [activeTab, isBrowserNavigating]);

  // Arama veya Web Sayfasına Gitme
  const handleNavigate = (queryOrUrl: string) => {
    let target = queryOrUrl.trim();
    if (!target) return;

    if (!target.includes('.') || target.includes(' ')) {
      target = `https://www.google.com/search?q=${encodeURIComponent(target)}`;
    } else if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = `https://${target}`;
    }

    setAddressBarUrl(target);
    setIsBrowserNavigating(true);
    setActiveTab('search');

    if (activeTabId && window.chirmo) {
      window.chirmo.navigate(activeTabId, target);
    } else if (window.chirmo) {
      window.chirmo.createTab(target).then((t) => {
        setActiveTabId(t.id);
      });
    }
  };

  const handleGoHome = () => {
    setIsBrowserNavigating(false);
    setActiveTab('portal');
  };

  const handleLevelChange = (lvl: CEFRLevel) => {
    const updated = LearningStorageService.setUserLevel(lvl);
    setLearningProgress({ ...updated });
  };

  const activeTabData = tabs.find((t) => t.id === activeTabId) || null;

  if (activeTab === 'portal') {
    return (
      <ChirmoHeroLandingPortal
        onEnterStudentPanel={() => setActiveTab('search')}
        onEnterKidsWorld={() => setActiveTab('kids')}
        onEnterCamp={() => setActiveTab('learn')}
        onEnterPhraseBank={() => setActiveTab('phrases')}
        onEnterSimulator={() => setActiveTab('speak')}
        onEnterGames={() => setActiveTab('games')}
        onEnterTasks={() => setActiveTab('tasks')}
        onEnterVideo={() => setActiveTab('video')}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gradient-to-b from-[#EEF2FF] via-[#F5F7FF] to-[#F8FAFC] dark:bg-slate-950 text-slate-800 select-none font-sans">
      {/* ==================== ÜST PRO STUDIO KOMUTA BARI (20 YILLIK TASARIM MİMARİSİ) ==================== */}
      <header className="h-16 bg-gradient-to-r from-[#0B1120] via-[#141138] to-[#1F103E] text-white border-b border-indigo-400/20 shadow-[0_8px_30px_rgba(15,23,42,0.3)] flex items-center justify-between z-30 shrink-0 select-none px-3 sm:px-5">
        {/* Sol: Prestijli Logo + Mobilde Modül Açılır Menüsü */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div
            onClick={handleGoHome}
            className="cursor-pointer flex items-center hover:scale-[1.02] active:scale-95 transition-transform shrink-0"
            title="Chirmo Ana Sayfa - 30 Günde Konuşma Garantili Sanal Öğretmen"
            aria-label="30 Günde Konuşma Garantili Sanal Öğretmen"
          >
            <img
              src="./chirmo-header-brand-logo.png"
              alt="Chirmo"
              className="h-9 sm:h-11 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(168,85,247,0.5)]"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.endsWith('/chirmo-logo.png')) {
                  target.src = './chirmo-logo.png';
                }
              }}
            />
          </div>

          {/* Mobilde Tüm Modülleri Gösteren Açılır Menü Butonu */}
          <div className="relative md:hidden shrink-0">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="h-9 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/15 text-xs font-black inline-flex items-center space-x-1.5 transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
              title="Modüller Menüsü"
              aria-label="Tüm Modülleri Göster"
              aria-expanded={isMobileNavOpen}
            >
              <Compass className="w-3.5 h-3.5 text-cyan-300 shrink-0" />
              <span className="font-extrabold max-w-[70px] truncate">
                {activeTab === 'video'
                  ? 'Film'
                  : activeTab === 'search'
                  ? '1. Bugün'
                  : activeTab === 'learn'
                  ? '2. Kamp'
                  : activeTab === 'phrases'
                  ? '3. Kalıplar'
                  : activeTab === 'speak'
                  ? '4. Simülatör'
                  : activeTab === 'kids'
                  ? '5. Kids'
                  : activeTab === 'games'
                  ? 'Oyunlar'
                  : activeTab === 'tasks'
                  ? 'Hedef'
                  : 'Modüller'}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-purple-200 transition-transform duration-200 shrink-0 ${
                  isMobileNavOpen ? 'rotate-180 text-cyan-300' : ''
                }`}
              />
            </button>

            {/* Arka Plan Tıklama Kapatıcı */}
            {isMobileNavOpen && (
              <div
                className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-xs"
                onClick={() => setIsMobileNavOpen(false)}
              />
            )}

            {/* Açılan Menü (2. Görseldeki 7 Modülün Tümü) */}
            {isMobileNavOpen && (
              <div className="absolute left-0 top-9.5 z-50 w-64 p-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {/* Dil Seçimi (İngilizce 🇬🇧 / Almanca 🇩🇪 / Fransızca 🇫🇷) */}
                <div className="p-1.5 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:bg-slate-800/80 rounded-xl flex items-center justify-between text-xs font-bold border border-indigo-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-300 pl-1 text-[11px] font-black">🎯 Dil:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        TargetLanguageService.setTargetLanguage('en');
                        setIsMobileNavOpen(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                        targetLanguage === 'en'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                      title="İngilizce"
                    >
                      <span>🇬🇧</span>
                      <span>EN</span>
                    </button>
                    <button
                      onClick={() => {
                        TargetLanguageService.setTargetLanguage('de');
                        setIsMobileNavOpen(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                        targetLanguage === 'de'
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                      title="Almanca"
                    >
                      <span>🇩🇪</span>
                      <span>DE</span>
                    </button>
                    <button
                      onClick={() => {
                        TargetLanguageService.setTargetLanguage('fr');
                        setIsMobileNavOpen(false);
                      }}
                      className={`px-2 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                        targetLanguage === 'fr'
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                      title="Fransızca"
                    >
                      <span>🇫🇷</span>
                      <span>FR</span>
                    </button>
                  </div>
                </div>

                {/* --- 5 TEMEL KONUŞMA SÜTUNU --- */}
                <div className="px-1 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  🎯 30 Günde Konuşma Devrimi
                </div>
{/* 0. Açılış Vitrini */}
                <button
                  onClick={() => {
                    setActiveTab('portal');
                    setIsMobileNavOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  title="Açılış Vitrini (Karşılama)"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                    <Home className="w-4 h-4 text-indigo-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Açılış Vitrini</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">Ana Karşılama Sayfası</div>
                  </div>
                </button>

                {/* 1. Ana Sayfa */}
                <button
                  onClick={() => {
                    setActiveTab('search');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'search'
                      ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shadow-2xs ring-1 ring-indigo-200 dark:ring-indigo-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Chirmo Ana Sayfa"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Ana Sayfa</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">Robot Öğretmen & Stüdyo</div>
                  </div>
                  {activeTab === 'search' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                </button>

                {/* 2. Kamp */}
                <button
                  onClick={() => {
                    setActiveTab('learn');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'learn'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-2xs ring-1 ring-emerald-200 dark:ring-emerald-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="30 Günlük Kamp"
                >
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4 text-emerald-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">30 Günlük Kamp</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">Günün 10 Dakikalık Görevi</div>
                  </div>
                  {activeTab === 'learn' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                </button>

                {/* 3. Hayat Kurtaran Konuşma Deposu */}
                <button
                  onClick={() => {
                    setActiveTab('phrases');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'phrases'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-2xs ring-1 ring-blue-200 dark:ring-blue-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Hayat Kurtaran Konuşma Deposu"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4 text-blue-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Konuşma Deposu</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">1000+ Hazır Kalıp & Kelime</div>
                  </div>
                  {activeTab === 'phrases' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                </button>

                {/* 4. Simülatör */}
                <button
                  onClick={() => {
                    setActiveTab('speak');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'speak'
                      ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 shadow-2xs ring-1 ring-purple-200 dark:ring-purple-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Gerçek Yaşam Simülatörü"
                >
                  <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4 text-purple-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Simülatör</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">Gerçek Yaşam Rol Yapma</div>
                  </div>
                  {activeTab === 'speak' && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />}
                </button>

                {/* 5. Film */}
                <button
                  onClick={() => {
                    setActiveTab('video');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'video'
                      ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 shadow-2xs ring-1 ring-rose-200 dark:ring-rose-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="YouTube, Film ve Dizi ile Konuşma Stüdyosu"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center shrink-0">
                    <Film className="w-4 h-4 text-rose-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Film & Video</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">YouTube & Dizi Shadowing</div>
                  </div>
                  {activeTab === 'video' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />}
                </button>

                {/* --- EK ARAÇLAR & OYUNLAR --- */}
                <div className="px-1 pt-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  🛠️ Ek Alanlar & Oyunlar
                </div>

                {/* 6. Kids */}
                <button
                  onClick={() => {
                    setActiveTab('kids');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'kids'
                      ? 'bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 shadow-2xs ring-1 ring-pink-200 dark:ring-pink-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Chirmo Kids (5-17 Yaş)"
                >
                  <div className="w-7 h-7 rounded-lg bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center shrink-0">
                    <Smile className="w-4 h-4 text-pink-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Kids</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">5-17 Yaş Çocuk Alanı</div>
                  </div>
                  {activeTab === 'kids' && <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0" />}
                </button>

                {/* 7. Oyunlar */}
                <button
                  onClick={() => {
                    setActiveTab('games');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'games'
                      ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 shadow-2xs ring-1 ring-violet-200 dark:ring-violet-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Eğitici Oyunlar"
                >
                  <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4 text-violet-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Oyunlar</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">Eğitici Mini Oyunlar</div>
                  </div>
                  {activeTab === 'games' && <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0" />}
                </button>

                {/* 8. Hedeflerim */}
                <button
                  onClick={() => {
                    setActiveTab('tasks');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'tasks'
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shadow-2xs ring-1 ring-blue-200 dark:ring-blue-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="İş & Günlük Hedefler"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
                    <CheckSquare className="w-4 h-4 text-blue-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Hedeflerim</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">İş & Günlük Planlar</div>
                  </div>
                  {activeTab === 'tasks' && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orta: PRO STÜDYO KOMUTA DOCK'U — 5 NUMARALI SEKME + HOCA MASASI + DİĞER ARAÇLAR */}
        <div className="flex-1 flex items-center justify-center px-2 sm:px-4 min-w-0 py-1">
          <nav className="hidden md:flex items-center bg-white/[0.06] backdrop-blur-xl p-1 rounded-2xl border border-white/10 gap-1 shrink-0 shadow-inner relative">
            {/* 1. Bugün (Ana Stüdyo) */}
            <button
              onClick={() => setActiveTab('search')}
              className={`h-9 px-3.5 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap group ${
                activeTab === 'search'
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-black shadow-[0_4px_18px_rgba(99,102,241,0.45)] ring-1 ring-white/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 font-bold active:scale-95'
              }`}
              title="Bugünün Konuşma Görevi & Chirmo Stüdyo"
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'search' ? 'text-amber-300' : 'text-indigo-400'}`} />
              <span>1. Bugün</span>
            </button>

            {/* 2. 30 Günlük Kamp */}
            <button
              onClick={() => setActiveTab('learn')}
              className={`h-9 px-3.5 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap group ${
                activeTab === 'learn'
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-black shadow-[0_4px_18px_rgba(99,102,241,0.45)] ring-1 ring-white/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 font-bold active:scale-95'
              }`}
              title="30 Günde Günlük Konuşma Kampı"
            >
              <BookOpen className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'learn' ? 'text-emerald-300' : 'text-emerald-400'}`} />
              <span>2. 30 Günlük Kamp</span>
            </button>

            {/* 3. Kalıp Deposu */}
            <button
              onClick={() => setActiveTab('phrases')}
              className={`h-9 px-3.5 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap group ${
                activeTab === 'phrases'
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-black shadow-[0_4px_18px_rgba(99,102,241,0.45)] ring-1 ring-white/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 font-bold active:scale-95'
              }`}
              title="Hayat Kurtaran Hazır Konuşma Kalıpları"
            >
              <Layers className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'phrases' ? 'text-cyan-300' : 'text-cyan-400'}`} />
              <span>3. Kalıp Deposu</span>
            </button>

            {/* 4. Canlı Simülatör */}
            <button
              onClick={() => setActiveTab('speak')}
              className={`h-9 px-3.5 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap group ${
                activeTab === 'speak'
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-black shadow-[0_4px_18px_rgba(99,102,241,0.45)] ring-1 ring-white/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 font-bold active:scale-95'
              }`}
              title="Gerçek Yaşam Konuşma Simülatörü"
            >
              <Mic className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'speak' ? 'text-amber-300' : 'text-purple-400'}`} />
              <span>4. Simülatör</span>
            </button>

            {/* 5. Chirmo Kids (5-17 Yaş) */}
            <button
              onClick={() => setActiveTab('kids')}
              className={`h-9 px-3.5 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap group ${
                activeTab === 'kids'
                  ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-black shadow-[0_4px_18px_rgba(99,102,241,0.45)] ring-1 ring-white/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10 font-bold active:scale-95'
              }`}
              title="Chirmo Kids (5-17 Yaş) Çocuk & Genç Alanı"
            >
              <Smile className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'kids' ? 'text-pink-200' : 'text-pink-400'}`} />
              <span>5. Kids</span>
            </button>

            {/* İnce Dikey Ayırıcı Çizgi */}
            <div className="h-4 w-px bg-white/15 mx-0.5 shrink-0" />

            {/* 🎓 Hoca Masası (Özel Eğitim Araçları) */}
            <button
              type="button"
              onClick={() => setIsMasterTeacherOpen(true)}
              className="h-9 px-3 rounded-xl text-xs font-black transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 shadow-sm active:scale-95 group"
              title="Pratik Dil ve Konuşma İstasyonu (Gölgeleme, Sık Yapılan Hatalar, Almanca Artikel, Hazır Kalıplar)"
            >
              <GraduationCap className="w-3.5 h-3.5 text-slate-950" />
              <span>Hoca Masası</span>
            </button>

            {/* ✨ Diğer Araçlar Açılır Menüsü (Depo, Oyunlar, Hedeflerim, Vitrin, APK) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`h-9 px-3 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer inline-flex items-center space-x-1 shrink-0 whitespace-nowrap ${
                  ['games', 'tasks', 'video'].includes(activeTab)
                    ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 text-white font-black shadow-xs'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
                title="Diğer Modüller (Oyunlar, Film Stüdyosu, Hedeflerim, APK)"
              >
                <span>Diğer</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMoreMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMoreMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-11 z-50 w-56 p-1.5 bg-[#0F172A] text-white rounded-2xl shadow-2xl border border-indigo-400/25 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('video');
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'video' ? 'bg-indigo-600 text-white' : 'text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <Film className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Film & Video Stüdyosu</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('games');
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'games' ? 'bg-indigo-600 text-white' : 'text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <Gamepad2 className="w-4 h-4 text-purple-400 shrink-0" />
                      <span>Oyunlar & 1v1 Düello</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('tasks');
                        setIsMoreMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        activeTab === 'tasks' ? 'bg-indigo-600 text-white' : 'text-slate-200 hover:bg-white/10'
                      }`}
                    >
                      <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Hedeflerim & Rapor</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('portal');
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <Home className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Vitrin (Ana Karşılama)</span>
                    </button>

                    <div className="border-t border-white/10 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreMenuOpen(false);
                          setIsInstallModalOpen(true);
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-black text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 transition-all cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-amber-300 shrink-0" />
                        <span>Mobil Uygulama (APK)</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </nav>
        </div>

        {/* Sağ: Tutarlı İlerleme, Dil Seçici & Profil Barı */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-auto">
          {/* Gün Serisi & XP Rozeti */}
          <div
            onClick={() => setActiveTab('learn')}
            className="hidden sm:flex h-9 px-3 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/15 items-center space-x-1.5 text-xs font-bold cursor-pointer transition-all shrink-0"
            title="30 Günlük Kamp Kesintisiz Serisi ve Toplam XP"
          >
            <div className="flex items-center space-x-1 text-amber-300 font-black">
              <span>🔥</span>
              <span>{campProgress.streakDays}</span>
            </div>
            <span className="text-white/30 font-light">•</span>
            <div className="flex items-center space-x-1 text-cyan-300 font-black">
              <span>⭐</span>
              <span>{campProgress.totalXp} XP</span>
            </div>
          </div>

          {/* Akıllı Dil Değiştirici Kapsülü (🇬🇧 EN / 🇩🇪 DE / 🇫🇷 FR) */}
          <button
            onClick={() => TargetLanguageService.toggleLanguage()}
            className="h-9 px-3 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-xs font-black transition-all flex items-center space-x-1.5 shrink-0 cursor-pointer text-white active:scale-95"
            title="Çalışma Dilini Değiştir (Tıkla: İngilizce / Almanca / Fransızca)"
          >
            <span>{targetLanguage === 'de' ? '🇩🇪' : targetLanguage === 'fr' ? '🇫🇷' : '🇬🇧'}</span>
            <span className="hidden sm:inline">{targetLanguage === 'de' ? 'Deutsch' : targetLanguage === 'fr' ? 'Français' : 'English'}</span>
            <span className="text-[10px] text-cyan-300 font-bold">⇄</span>
          </button>

          {/* Kullanıcı Profili */}
          {currentUser && (
            <div className="flex items-center space-x-1 shrink-0">
              <button
                onClick={() => setActiveTab('portal')}
                className="h-9 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-indigo-500/20 border border-emerald-400/40 text-emerald-200 hover:text-white text-xs font-black cursor-pointer hover:border-emerald-300 transition-all inline-flex items-center space-x-1.5 whitespace-nowrap"
                title={`Kullanıcı Sayfası ve Profil Detayları: @${currentUser.username}`}
              >
                <span>{userProfile.avatarEmoji || '👤'}</span>
                <span className="max-w-[75px] truncate hidden md:inline">@{currentUser.username}</span>
                {currentUser.plan === 'pro' && (
                  <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black">
                    PRO
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ==================== ANA ÇALIŞMA ALANI ==================== */}
      <main className="flex-1 relative overflow-hidden flex flex-col pb-14 sm:pb-0">
        {/* BÖLÜM 1: ARAMA & TARAYICI */}
        {activeTab === 'search' && (
          <div className="flex-1 relative flex flex-col h-full overflow-hidden">
            {/* Eğer bir siteye girilmemişse: Tam Genişlikte Sade Mobil Uygulama Stüdyosu */}
            {!isBrowserNavigating ? (
              <div className="flex-1 flex flex-row h-full overflow-hidden relative">
                <div className="flex-1 h-full overflow-y-auto transition-all duration-300">
                  <SimpleSearchHome
                    onSearch={handleNavigate}
                    onNavigateToLearn={() => setActiveTab('learn')}
                    onNavigateToKids={() => setActiveTab('kids')}
                    onNavigateToGames={() => setActiveTab('games')}
                    onNavigateToSpeak={() => setActiveTab('speak')}
                    onNavigateToTasks={() => setActiveTab('tasks')}
                    onNavigateToPortal={() => setActiveTab('portal')}
                    onOpenInstallModal={() => setIsInstallModalOpen(true)}
                    userLevel={learningProgress.currentLevel}
                    pendingTaskCount={pendingTaskCount}
                  />
                </div>
              </div>
            ) : (
              /* Bir siteye girilmişse: Sade Tarayıcı Barı + Chromium Web Sayfası */
              <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Sade Adres Çubuğu */}
                <div className="h-12 bg-white border-b border-slate-200 px-3 flex items-center space-x-2 shrink-0 z-20">
                  <button
                    onClick={handleGoHome}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Arama Ana Sayfasına Dön"
                  >
                    <Home className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => activeTabId && window.chirmo?.goBack(activeTabId)}
                    disabled={!activeTabData?.canGoBack}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                    title="Geri"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => activeTabId && window.chirmo?.goForward(activeTabId)}
                    disabled={!activeTabData?.canGoForward}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                    title="İleri"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => activeTabId && window.chirmo?.reload(activeTabId)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Yenile"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  {/* Adres Giriş Alanı */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNavigate(addressBarUrl);
                    }}
                    className="flex-1 max-w-2xl"
                  >
                    <div className="flex items-center bg-slate-100 hover:bg-slate-200/80 focus-within:bg-white rounded-full px-3 py-1.5 border border-slate-200 text-xs transition-colors">
                      <Lock className="w-3.5 h-3.5 text-emerald-600 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={addressBarUrl}
                        onChange={(e) => setAddressBarUrl(e.target.value)}
                        className="w-full bg-transparent outline-none text-slate-800 font-medium"
                      />
                    </div>
                  </form>

                  {/* Akıllı Sadeleştirici Butonu */}
                  <button
                    onClick={() => setIsSmartReaderOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer"
                    title="Sayfayı Seviyeme Göre Sadeleştir ve Testini Gör"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sayfayı Kolaylaştır</span>
                  </button>
                </div>

                {/* Web Sayfası Görüntüleyici ve Sağ Türkçe Yardımcı */}
                <div className="flex-1 relative flex flex-row overflow-hidden">
                  <BrowserContainer
                    isVisible={isBrowserNavigating}
                    currentUrl={addressBarUrl}
                    onSentenceSelected={(item) => {
                      setSelectedSentenceItem(item);
                      setActiveLearningText(item.en);
                    }}
                    activeSentenceId={selectedSentenceItem?.id}
                  />

                  {isTutorOpen && (
                    <SimpleAiTutorDrawer
                      isOpen={isTutorOpen}
                      onClose={() => setIsTutorOpen(false)}
                      selectedText={activeLearningText}
                      selectedSentenceItem={selectedSentenceItem}
                      userLevel={learningProgress.currentLevel}
                      onWordAdded={() => {
                        setLearningProgress({ ...LearningStorageService.getProgress() });
                      }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* BÖLÜM 2: İNGİLİZCE ÖĞRENME MERKEZİ (30 GÜNLÜK KAMP) */}
        {activeTab === 'learn' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <SimpleLearningHub
              userLevel={learningProgress.currentLevel}
              onLevelChange={handleLevelChange}
              onOpenInBrowser={(url) => handleNavigate(url)}
            />
          </div>
        )}

        {/* BÖLÜM: HAYAT KURTARAN KONUŞMA DEPOSU (KELİME & CÜMLE BANKASI) */}
        {activeTab === 'phrases' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <LifePhraseBankView
              onNavigateToSimulator={() => setActiveTab('speak')}
            />
          </div>
        )}

        {/* BÖLÜM: CHIRMO KIDS (5-17 YAŞ ÇOCUKLAR İÇİN EĞLENCELİ ÖĞRENME ALANI) */}
        {activeTab === 'kids' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <ChirmoKidsDedicatedHub onBackToMain={() => setActiveTab('search')} />
          </div>
        )}

        {/* BÖLÜM 3: OYUN ALANI (ARCADE) */}
        {activeTab === 'games' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <EnglishGameArcade />
          </div>
        )}

        {/* BÖLÜM 4: GERÇEK YAŞAM SİMÜLATÖRÜ */}
        {activeTab === 'speak' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <RealLifeSimulatorStudio />
          </div>
        )}

        
        {/* BÖLÜM 7: VİDEO, YOUTUBE & FİLM İLE KONUŞMA STÜDYOSU */}
        {activeTab === 'video' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <WatchingView
              onWordAdded={() => setLearningProgress({ ...LearningStorageService.getProgress() })}
              onOpenInTutor={() => setIsAiTeacherOpen(true)}
            />
          </div>
        )}
        {/* BÖLÜM 5: İŞ, HEDEFLER & GELİŞİM KARNESİ */}
        {activeTab === 'tasks' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <SimpleTaskWorkspace
              onNavigateTab={(tab, subTab) => {
                setActiveTab(tab as any);
                if (subTab) {
                  try {
                    localStorage.setItem('chirmo_learn_initial_tab', subTab);
                    window.dispatchEvent(new CustomEvent('chirmo_switch_learn_subtab', { detail: subTab }));
                  } catch {}
                }
              }}
              onOpenPlanModal={() => setIsOnboardingOpen(true)}
            />
          </div>
        )}

        {/* BÖLÜM 8: YÖNETİCİ & SAAS KONTROL PANELİ */}
        {activeTab === 'admin' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <AdminDashboard
              onBackToApp={() => {
                if (typeof window !== 'undefined' && window.location.hash === '#admin') {
                  history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                setActiveTab('search');
              }}
            />
          </div>
        )}
      </main>

      {/* Sayfa Sadeleştirici Modal */}
      <SmartReaderModal
        isOpen={isSmartReaderOpen}
        onClose={() => setIsSmartReaderOpen(false)}
        pageTitle={activeTabData?.title || 'Web Sayfası'}
        pageUrl={activeTabData?.url}
        userLevel={learningProgress.currentLevel}
        onWordAdded={() => setLearningProgress({ ...LearningStorageService.getProgress() })}
      />

      {/* Seviye & İhtiyaç Analizi Onboarding Modalı */}
      <ChirmoOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onComplete={(lvl, targetTab) => {
          handleLevelChange(lvl);
          if (targetTab) {
            setActiveTab(targetTab as any);
          }
        }}
      />

      {/* Mobil Uygulama & APK İndirme Modalı */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* Kişiye Özel Profil Düzenleme Modalı */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onProfileUpdated={(updated) => setUserProfile(updated)}
      />

      {/* 50 Yıllık Hocanın Dil Çözüm İstasyonu (Gölgeleme, 100 Hata Radarı, Almanca Artikel, Cankurtaran Kiti, Alet Çantası) */}
      <ChirmoMasterTeacherModal
        isOpen={isMasterTeacherOpen}
        onClose={() => setIsMasterTeacherOpen(false)}
        onRewardXP={() => setLearningProgress({ ...LearningStorageService.getProgress() })}
      />

      {/* ==================== MOBİL ALT MENÜ (PRO GLASSMORPHIC DOCK - 5 SİMETRİK ANA SEKME) ==================== */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-r from-[#0B1120]/95 via-[#141138]/95 to-[#1F103E]/95 backdrop-blur-2xl border-t border-indigo-400/25 shadow-[0_-8px_30px_rgba(15,23,42,0.4)] px-1.5 py-1.5 grid grid-cols-5 gap-1 select-none text-white">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            activeTab === 'search'
              ? 'text-white font-black bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_4px_15px_rgba(99,102,241,0.5)]'
              : 'text-slate-300 hover:text-white font-bold'
          }`}
        >
          <Sparkles className={`w-4 h-4 mb-0.5 shrink-0 ${activeTab === 'search' ? 'text-amber-300' : 'text-indigo-300'}`} />
          <span className="text-[10px] leading-tight truncate">1. Bugün</span>
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            activeTab === 'learn'
              ? 'text-white font-black bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_4px_15px_rgba(99,102,241,0.5)]'
              : 'text-slate-300 hover:text-white font-bold'
          }`}
        >
          <BookOpen className={`w-4 h-4 mb-0.5 shrink-0 ${activeTab === 'learn' ? 'text-emerald-300' : 'text-emerald-400'}`} />
          <span className="text-[10px] leading-tight truncate">2. Kamp</span>
        </button>

        <button
          onClick={() => setActiveTab('phrases')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            activeTab === 'phrases'
              ? 'text-white font-black bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_4px_15px_rgba(99,102,241,0.5)]'
              : 'text-slate-300 hover:text-white font-bold'
          }`}
        >
          <Layers className={`w-4 h-4 mb-0.5 shrink-0 ${activeTab === 'phrases' ? 'text-cyan-300' : 'text-cyan-400'}`} />
          <span className="text-[10px] leading-tight truncate">3. Kalıplar</span>
        </button>

        <button
          onClick={() => setActiveTab('speak')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            activeTab === 'speak'
              ? 'text-white font-black bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_4px_15px_rgba(99,102,241,0.5)]'
              : 'text-slate-300 hover:text-white font-bold'
          }`}
        >
          <Mic className={`w-4 h-4 mb-0.5 shrink-0 ${activeTab === 'speak' ? 'text-amber-300' : 'text-purple-400'}`} />
          <span className="text-[10px] leading-tight truncate">4. Simülatör</span>
        </button>

        <button
          onClick={() => setActiveTab('kids')}
          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl text-center transition-all cursor-pointer min-h-[48px] active:scale-95 ${
            activeTab === 'kids'
              ? 'text-white font-black bg-gradient-to-r from-indigo-500 to-purple-600 shadow-[0_4px_15px_rgba(99,102,241,0.5)]'
              : 'text-slate-300 hover:text-white font-bold'
          }`}
        >
          <Smile className={`w-4 h-4 mb-0.5 shrink-0 ${activeTab === 'kids' ? 'text-pink-200' : 'text-pink-400'}`} />
          <span className="text-[10px] leading-tight truncate">5. Kids</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
