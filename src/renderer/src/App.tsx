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
  Layers
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

  // Öğrenme & Seviye Durumu (Türk kullanıcılar için varsayılan A1 Başlangıç)
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

  // Sol Öğrenme Merkezi Paneli
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAF9FE] text-slate-800 select-none font-sans">
      {/* ==================== ÜST KUSURSUZ SİMETRİK & TAM SIĞAN MODERN ANA BAŞLIK ==================== */}
      <header className="h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-start z-30 shrink-0 select-none">
        {/* Sol: Temiz Logo + Mobilde Modül Açılır Menüsü */}
        <div
          className={`flex items-center justify-between h-full px-3 sm:px-4 shrink-0 transition-all duration-300 ${
            activeTab === 'search' && isLeftSidebarOpen
              ? 'md:w-64 md:border-r md:border-slate-200/90 dark:md:border-slate-800'
              : 'w-auto'
          }`}
        >
          <div
            onClick={handleGoHome}
            className="cursor-pointer flex items-center hover:opacity-90 transition-opacity shrink-0"
            title="Chirmo Ana Sayfa - 30 Günde Konuşma Garantili Sanal Öğretmen"
            aria-label="30 Günde Konuşma Garantili Sanal Öğretmen"
          >
            <ChirmoLogo size="lg" variant="header" className="drop-shadow-xs" />
          </div>

          {/* Mobilde 2. Görseldeki Tüm Modülleri Gösteren Açılır Menü Butonu */}
          <div className="relative md:hidden shrink-0">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="h-8 px-2.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 dark:bg-slate-800/90 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700 text-xs font-bold inline-flex items-center space-x-1.5 transition-all shadow-2xs shrink-0 cursor-pointer active:scale-95"
              title="Modüller Menüsü"
              aria-label="Tüm Modülleri Göster"
              aria-expanded={isMobileNavOpen}
            >
              <Compass className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-extrabold max-w-[65px] truncate">
                {activeTab === 'video'
                  ? 'Film'
                  : activeTab === 'search'
                  ? 'Stüdyo'
                  : activeTab === 'learn'
                  ? 'Kamp'
                  : activeTab === 'kids'
                  ? 'Kids'
                  : activeTab === 'games'
                  ? 'Oyunlar'
                  : activeTab === 'speak'
                  ? 'Simülatör'
                  : activeTab === 'tasks'
                  ? 'Hedef'
                  : 'Modüller'}
              </span>
              <ChevronDown
                className={`w-3 h-3 text-slate-400 transition-transform duration-200 shrink-0 ${
                  isMobileNavOpen ? 'rotate-180 text-indigo-500' : ''
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
              <div className="absolute left-0 top-9.5 z-50 w-56 p-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 dark:border-slate-800 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                {/* Dil Seçimi (İngilizce 🇬🇧 / Almanca 🇩🇪) */}
                <div className="p-1.5 bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:bg-slate-800/80 rounded-xl flex items-center justify-between text-xs font-bold border border-indigo-100 dark:border-slate-700">
                  <span className="text-slate-600 dark:text-slate-300 pl-1 text-[11px] font-black">🎯 Dil:</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        TargetLanguageService.setTargetLanguage('en');
                        setIsMobileNavOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                        targetLanguage === 'en'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>🇬🇧</span>
                      <span>İngilizce</span>
                    </button>
                    <button
                      onClick={() => {
                        TargetLanguageService.setTargetLanguage('de');
                        setIsMobileNavOpen(false);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center space-x-1 ${
                        targetLanguage === 'de'
                          ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>🇩🇪</span>
                      <span>Almanca</span>
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

        {/* Orta: SIFIR KAFA KARIŞIKLIĞI — TÜM ÖĞRENME MODÜLLERİ SOL SINIRDAN BAŞLAYARAK AÇIK VE ERİŞİLEBİLİR */}
        <div className="flex-1 flex items-center justify-start pl-2 sm:pl-3 overflow-x-auto min-w-0 py-1">
          <nav className="hidden md:flex items-center bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 gap-0.5 shrink-0 shadow-2xs relative overflow-x-auto max-w-full">
            {/* 0. Açılış Vitrini */}
            <button
              onClick={() => setActiveTab('portal')}
              className="h-8 px-2.5 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1 shrink-0 text-slate-600 hover:text-indigo-600 hover:bg-white/60 font-bold"
              title="Chirmo Açılış Vitrinine Dön"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span>Vitrin</span>
            </button>

            {/* 1. Ana Sayfa */}
            <button
              onClick={() => setActiveTab('search')}
              className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'search'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-extrabold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 font-semibold'
              }`}
              title="Chirmo Stüdyo & Ana Sayfa"
            >
              <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'search' ? 'text-indigo-500' : 'text-slate-400'}`} />
              <span>Chirmo Stüdyo</span>
            </button>

            {/* 2. 30 Günlük Kamp */}
            <button
              onClick={() => setActiveTab('learn')}
              className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'learn'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 font-extrabold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 font-semibold'
              }`}
              title="30 Günde Günlük Konuşma Kampı & Günün Görevi"
            >
              <BookOpen className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'learn' ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span>30 Günlük Kamp</span>
            </button>

            {/* 3. Hayat Kurtaran Konuşma Deposu */}
            <button
              onClick={() => setActiveTab('phrases')}
              className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'phrases'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-extrabold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 font-semibold'
              }`}
              title="1000+ Günlük Yaşam Kalıbı & Kelime Deposu"
            >
              <Layers className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'phrases' ? 'text-blue-500' : 'text-slate-400'}`} />
              <span>Konuşma Deposu</span>
            </button>

            {/* 4. Simülatör */}
            <button
              onClick={() => setActiveTab('speak')}
              className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'speak'
                  ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 font-extrabold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 font-semibold'
              }`}
              title="Gerçek Yaşam Konuşma Simülatörü"
            >
              <Mic className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'speak' ? 'text-purple-500' : 'text-slate-400'}`} />
              <span>Simülatör</span>
            </button>

            {/* 5. Film & Video */}
            <button
              onClick={() => setActiveTab('video')}
              className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'video'
                  ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 font-extrabold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 font-semibold'
              }`}
              title="YouTube, Film ve Dizi ile Konuşma Stüdyosu"
            >
              <Film className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'video' ? 'text-rose-500' : 'text-slate-400'}`} />
              <span>Film</span>
            </button>

            {/* 6. Chirmo Kids (5-17 Yaş) */}
            <button
              onClick={() => setActiveTab('kids')}
              className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'kids'
                  ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 font-extrabold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 font-semibold'
              }`}
              title="Chirmo Kids (5-17 Yaş) Çocuk & Genç Alanı"
            >
              <Smile className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'kids' ? 'text-pink-500' : 'text-slate-400'}`} />
              <span>Kids (5-17)</span>
            </button>

            {/* 7. Eğitici Oyunlar */}
            <button
              onClick={() => setActiveTab('games')}
              className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'games'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 font-extrabold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 font-semibold'
              }`}
              title="Eğitici Dil Oyunları"
            >
              <Gamepad2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'games' ? 'text-violet-500' : 'text-slate-400'}`} />
              <span>Oyunlar</span>
            </button>

            {/* 8. Hedeflerim & Rapor */}
            <button
              onClick={() => setActiveTab('tasks')}
              className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
                activeTab === 'tasks'
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-extrabold shadow-xs ring-1 ring-slate-200/80 dark:ring-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-700/50 font-semibold'
              }`}
              title="İş & Günlük Hedeflerim, Raporlar"
            >
              <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'tasks' ? 'text-blue-500' : 'text-slate-400'}`} />
              <span>Hedeflerim</span>
            </button>
          </nav>
        </div>

        {/* Sağ: İlerleme & Modern Rafine Aksiyon Butonları (Öğrenci Paneli / search aktifken bu alanlar altındaki kartta yer aldığı için tekrar etmez) */}
        {activeTab !== 'search' && (
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0 ml-auto pr-2.5 sm:pr-4">
            {/* APK İndir - Zarif Ghost Buton */}
            <button
              onClick={() => setIsInstallModalOpen(true)}
              className="hidden lg:inline-flex h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/90 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 text-xs font-bold shadow-2xs cursor-pointer transition-all items-center space-x-1.5 whitespace-nowrap shrink-0"
              title="Chirmo Android APK ve PWA İndir"
            >
              <Download className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>APK</span>
            </button>

            {/* Gün Serisi & XP Rozeti - Zarif & Kompakt */}
            <div
              onClick={() => setActiveTab('learn')}
              className="hidden sm:flex h-8 px-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 items-center space-x-1.5 text-xs font-bold cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-all shrink-0"
              title="30 Günlük Kamp Kesintisiz Serisi ve Toplam XP"
            >
              <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-black">
                <span>🔥</span>
                <span>{campProgress.streakDays}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-600 font-light">•</span>
              <div className="flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 font-black">
                <span>⭐</span>
                <span>{campProgress.totalXp} XP</span>
              </div>
            </div>

            {/* Akıllı Dil Değiştirici Kapsülü (Tek Tıkla Hızlı Geçiş: 🇬🇧 EN / 🇩🇪 DE) */}
            <button
              onClick={() => TargetLanguageService.setTargetLanguage(targetLanguage === 'en' ? 'de' : 'en')}
              className="h-8 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 text-xs font-extrabold transition-all flex items-center space-x-1.5 shrink-0 shadow-2xs cursor-pointer text-slate-800 dark:text-slate-100 active:scale-95"
              title="Çalışma Dilini Değiştir (Tıkla: İngilizce / Almanca)"
            >
              <span>{targetLanguage === 'de' ? '🇩🇪' : '🇬🇧'}</span>
              <span>{targetLanguage === 'de' ? 'Almanca' : 'İngilizce'}</span>
              <span className="text-[10px] text-slate-400 font-normal">⇄</span>
            </button>

            {/* Giriş yapılmışsa profil göstergesi; panelde ayrı giriş butonu gösterilmez (tek giriş portalda) */}
            {currentUser && (
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={() => setActiveTab('portal')}
                  className="h-8 px-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold cursor-pointer hover:bg-indigo-100 transition-colors inline-flex items-center space-x-1.5 whitespace-nowrap"
                  title={`Kullanıcı Sayfası ve Profil Detayları: @${currentUser.username}`}
                >
                  <span>{userProfile.avatarEmoji || '👤'}</span>
                  <span className="max-w-[70px] truncate">@{currentUser.username}</span>
                  {currentUser.plan === 'pro' && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-indigo-600 text-white font-black">
                      PRO
                    </span>
                  )}
                </button>
                <button
                  onClick={() => PrivacyAuthService.logout()}
                  className="h-8 w-8 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-400 hover:text-rose-600 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center shrink-0"
                  title="Çıkış Yap"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ==================== ANA ÇALIŞMA ALANI ==================== */}
      <main className="flex-1 relative overflow-hidden flex flex-col pb-14 sm:pb-0">
        {/* BÖLÜM 1: ARAMA & TARAYICI */}
        {activeTab === 'search' && (
          <div className="flex-1 relative flex flex-col h-full overflow-hidden">
            {/* Eğer bir siteye girilmemişse: 3 Panelli Masaüstü Arama & Öğrenme Paneli */}
            {!isBrowserNavigating ? (
              <div className="flex-1 flex flex-row h-full overflow-hidden relative">
                {/* SOL AKORDİYON PANEL: ÖĞRENME MERKEZİ (Masaüstü/Tablet) */}
                <div
                  className={`hidden md:flex shrink-0 h-full transition-all duration-300 ease-in-out relative ${
                    isLeftSidebarOpen ? 'w-64' : 'w-0'
                  } overflow-hidden`}
                >
                  <div className="w-64 h-full shrink-0">
                    <LearningCenterSidebar
                      isOpen={true}
                      onSelectItem={handleLeftSidebarSelect}
                      onToggle={() => setIsLeftSidebarOpen(false)}
                    />
                  </div>
                </div>

                {/* SOL KENAR AKORDİYON KAYDIRMA / GENİŞLETME BUTONU */}
                <button
                  onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                  className={`hidden md:flex absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-in-out items-center justify-center w-5 h-14 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-700 shadow-md hover:shadow-lg hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-600 rounded-r-xl cursor-pointer select-none group ${
                    isLeftSidebarOpen ? 'left-64' : 'left-0'
                  }`}
                  title={
                    isLeftSidebarOpen
                      ? 'Sol Paneli Sola Kaydırarak Kapat (Sayfayı Genişlet)'
                      : 'Öğrenme Merkezini Sağa Kaydırarak Aç'
                  }
                  aria-label={isLeftSidebarOpen ? 'Sol Paneli Daralt' : 'Sol Paneli Genişlet'}
                >
                  {isLeftSidebarOpen ? (
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-indigo-600" />
                  )}
                </button>

                {/* ORTA PANEL: ARAMA & GÖREVLER (Akordiyon kayarak kapandıkça tam genişler) */}
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

                {/* SAĞ KENAR AKORDİYON KAYDIRMA / GENİŞLETME BUTONU */}
                <button
                  onClick={() => setIsTutorOpen(!isTutorOpen)}
                  className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-in-out items-center justify-center w-5 h-14 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xs border border-slate-200/90 dark:border-slate-700 shadow-md hover:shadow-lg hover:bg-purple-50 dark:hover:bg-slate-700 text-slate-500 hover:text-purple-600 rounded-l-xl cursor-pointer select-none group ${
                    isTutorOpen ? 'right-72' : 'right-0'
                  }`}
                  title={
                    isTutorOpen
                      ? 'Sağ Paneli Sağa Kaydırarak Kapat (Sayfayı Genişlet)'
                      : 'Chirmo AI Öğretmeni Sola Kaydırarak Aç'
                  }
                  aria-label={isTutorOpen ? 'Sağ Paneli Daralt' : 'Sağ Paneli Genişlet'}
                >
                  {isTutorOpen ? (
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  ) : (
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform text-purple-600" />
                  )}
                </button>

                {/* SAĞ AKORDİYON PANEL: CHIRMO AI ÖĞRETMENİ */}
                <div
                  className={`hidden lg:flex shrink-0 h-full transition-all duration-300 ease-in-out relative ${
                    isTutorOpen ? 'w-72' : 'w-0'
                  } overflow-hidden`}
                >
                  <div className="w-72 h-full shrink-0">
                    <ChirmoAiTeacherSidebar
                      isOpen={true}
                      onClose={() => setIsTutorOpen(false)}
                      userLevel={learningProgress.currentLevel}
                    />
                  </div>
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

      {/* ==================== MOBİL ALT MENÜ (SMARTPHONE BOTTOM NAV - 7 TEMEL BÖLÜM) ==================== */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-xl px-1 py-1 flex items-center justify-around select-none">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl flex-1 text-center transition-all cursor-pointer min-h-[46px] active:scale-95 ${
            activeTab === 'search'
              ? 'text-indigo-600 dark:text-indigo-400 font-black bg-indigo-50/80 dark:bg-indigo-950/50 shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] leading-tight truncate">Stüdyo</span>
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl flex-1 text-center transition-all cursor-pointer min-h-[46px] active:scale-95 ${
            activeTab === 'video'
              ? 'text-rose-600 dark:text-rose-400 font-black bg-rose-50/80 dark:bg-rose-950/50 shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Film className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] leading-tight truncate">Film</span>
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl flex-1 text-center transition-all cursor-pointer min-h-[46px] active:scale-95 ${
            activeTab === 'learn'
              ? 'text-emerald-600 dark:text-emerald-400 font-black bg-emerald-50/80 dark:bg-emerald-950/50 shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] leading-tight truncate">Kamp</span>
        </button>

        <button
          onClick={() => setActiveTab('kids')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl flex-1 text-center transition-all cursor-pointer min-h-[46px] active:scale-95 ${
            activeTab === 'kids'
              ? 'text-pink-600 dark:text-pink-400 font-black bg-pink-50/80 dark:bg-pink-950/50 shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Smile className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] leading-tight truncate">Kids</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl flex-1 text-center transition-all cursor-pointer min-h-[46px] active:scale-95 ${
            activeTab === 'games'
              ? 'text-amber-500 dark:text-amber-400 font-black bg-amber-50/80 dark:bg-amber-950/50 shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Gamepad2 className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] leading-tight truncate">Oyun</span>
        </button>

        <button
          onClick={() => setActiveTab('speak')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl flex-1 text-center transition-all cursor-pointer min-h-[46px] active:scale-95 ${
            activeTab === 'speak'
              ? 'text-purple-600 dark:text-purple-400 font-black bg-purple-50/80 dark:bg-purple-950/50 shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Mic className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] leading-tight truncate">Simülatör</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl flex-1 text-center transition-all cursor-pointer min-h-[46px] active:scale-95 ${
            activeTab === 'tasks'
              ? 'text-blue-600 dark:text-blue-400 font-black bg-blue-50/80 dark:bg-blue-950/50 shadow-2xs'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <CheckSquare className="w-4 h-4 mb-0.5 shrink-0" />
          <span className="text-[10px] leading-tight truncate">Hedefler</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
