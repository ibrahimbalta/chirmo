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
  Film
} from 'lucide-react';
import { ChirmoLogo } from './components/common/ChirmoLogo';
import { BrowserContainer, PageSentenceItem } from './components/browser/BrowserContainer';
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
import { LearningStorageService } from './services/learningStorage';
import { UserProfileService, UserProfile } from './services/userProfileService';
import { PrivacyAuthService, SafeUserSession } from './services/privacyAuthService';
import { ChirmoAuthModal } from './components/auth/ChirmoAuthModal';
import { TargetLanguageService, SupportedLanguage } from './services/targetLanguageService';
import { Tab, CEFRLevel, DailyGoalProgress } from './types';
import { CampStorageService, StudentCampProgress } from './services/curriculumData';

export type AppNavTab = 'search' | 'learn' | 'kids' | 'games' | 'speak' | 'tasks' | 'video' | 'admin';

export const App: React.FC = () => {
  // 6 Temel Bölüm: 'search' (Stüdyo) | 'learn' (Kamp) | 'kids' (Chirmo Kids) | 'games' (Oyunlar) | 'speak' (Simülatör) | 'tasks' (Hedefler)
  const [activeTab, setActiveTab] = useState<AppNavTab>('search');

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
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
      if (typeof window !== 'undefined' && window.location.hash === '#admin') {
        setActiveTab('admin');
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

  const handleLeftSidebarSelect = (itemId: string) => {
    if (itemId === 'home') {
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
    setActiveTab('search');
  };

  const handleLevelChange = (lvl: CEFRLevel) => {
    const updated = LearningStorageService.setUserLevel(lvl);
    setLearningProgress({ ...updated });
  };

  const activeTabData = tabs.find((t) => t.id === activeTabId) || null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#FAF9FE] text-slate-800 select-none font-sans">
      {/* ==================== ÜST KUSURSUZ SİMETRİK & TAM SIĞAN MODERN ANA BAŞLIK ==================== */}
      <header className="h-14 px-2.5 sm:px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-1.5 sm:gap-3 z-30 shrink-0 select-none">
        {/* Sol: Temiz Logo + Mobilde Modül Açılır Menüsü */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          <div
            onClick={handleGoHome}
            className="cursor-pointer flex items-center hover:opacity-90 transition-opacity shrink-0"
            title="Chirmo Ana Sayfa - 30 Günde Konuşma Garantili Sanal Öğretmen"
            aria-label="30 Günde Konuşma Garantili Sanal Öğretmen"
          >
            <ChirmoLogo size="md" variant="header" />
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

                {/* 1. Film */}
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
                    <div className="font-extrabold truncate">Film</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">YouTube & Dizi ile Konuş</div>
                  </div>
                  {activeTab === 'video' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />}
                </button>

                {/* 2. Stüdyo */}
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
                  title="Chirmo Stüdyo & AI Öğretmen"
                >
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Stüdyo</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">Chirmo AI Öğretmen</div>
                  </div>
                  {activeTab === 'search' && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                </button>

                {/* 3. Kamp */}
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
                    <div className="font-extrabold truncate">Kamp</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">30 Günde Konuşma Kampı</div>
                  </div>
                  {activeTab === 'learn' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                </button>

                {/* 4. Kids */}
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

                {/* 5. Oyunlar */}
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

                {/* 6. Simülatör */}
                <button
                  onClick={() => {
                    setActiveTab('speak');
                    setIsMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'speak'
                      ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 shadow-2xs ring-1 ring-amber-200 dark:ring-amber-800'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  title="Gerçek Yaşam Simülatörü"
                >
                  <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center shrink-0">
                    <Mic className="w-4 h-4 text-amber-500 shrink-0" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="font-extrabold truncate">Simülatör</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">Gerçek Yaşam Konuşmaları</div>
                  </div>
                  {activeTab === 'speak' && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                </button>

                {/* 7. Hedeflerim */}
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

                {/* 8. Giriş Yap / Hesap (Mobilde Kolayca Erişilebilir) */}
                <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setIsMobileNavOpen(false);
                    }}
                    className="w-full flex items-center space-x-2.5 px-2.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0 text-sm">
                      🛡️
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <div className="font-extrabold truncate">
                        {currentUser ? `@${currentUser.username} (Hesabım)` : 'Giriş Yap / Kayıt Ol'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal truncate">
                        {currentUser ? 'Hesap & Abonelik Detayları' : 'Sıfır Kişisel Veri ile Giriş'}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orta: PREMİUM SİMETRİK NAVİGASYON KAPSÜLÜ (TEK FİLM BUTONU, MODERN & KARİZMATİK) */}
        <nav className="hidden md:flex items-center bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 gap-0.5 shrink-0 shadow-2xs">
          
          {/* 1. Film (TEK VE NET FİLM BUTONU) */}
          <button
            onClick={() => setActiveTab('video')}
            className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold'
            }`}
            title="YouTube, Film ve Dizi ile Konuşma Stüdyosu"
          >
            <Film className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'video' ? 'text-rose-500' : 'text-slate-400'}`} />
            <span>Film</span>
          </button>

          {/* 2. Stüdyo */}
          <button
            onClick={() => setActiveTab('search')}
            className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold'
            }`}
            title="Chirmo Stüdyo"
          >
            <Sparkles className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'search' ? 'text-indigo-500' : 'text-slate-400'}`} />
            <span>Stüdyo</span>
          </button>

          {/* 3. 30 Günlük Kamp */}
          <button
            onClick={() => setActiveTab('learn')}
            className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'learn'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold'
            }`}
            title="30 Günlük Kamp"
          >
            <BookOpen className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'learn' ? 'text-emerald-500' : 'text-slate-400'}`} />
            <span>Kamp</span>
          </button>

          {/* 4. Chirmo Kids */}
          <button
            onClick={() => setActiveTab('kids')}
            className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'kids'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold'
            }`}
            title="5-17 Yaş Çocuklar İçin Chirmo Kids"
          >
            <Smile className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'kids' ? 'text-pink-500' : 'text-slate-400'}`} />
            <span>Kids</span>
          </button>

          {/* 5. Oyunlar */}
          <button
            onClick={() => setActiveTab('games')}
            className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold'
            }`}
            title="Eğitici İngilizce Oyunları"
          >
            <Gamepad2 className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'games' ? 'text-amber-500' : 'text-slate-400'}`} />
            <span>Oyunlar</span>
          </button>

          {/* 6. Simülatör */}
          <button
            onClick={() => setActiveTab('speak')}
            className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'speak'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold'
            }`}
            title="Gerçek Yaşam Konuşma Simülatörü"
          >
            <Mic className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'speak' ? 'text-purple-500' : 'text-slate-400'}`} />
            <span>Simülatör</span>
          </button>

          {/* 7. Hedeflerim */}
          <button
            onClick={() => setActiveTab('tasks')}
            className={`h-8 px-3 rounded-xl text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black shadow-xs ring-1 ring-slate-200 dark:ring-slate-700'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50 font-semibold'
            }`}
            title="Günlük Hedeflerim & Rapor"
          >
            <CheckSquare className={`w-3.5 h-3.5 shrink-0 ${activeTab === 'tasks' ? 'text-blue-500' : 'text-slate-400'}`} />
            <span>Hedeflerim</span>
          </button>
        </nav>

        {/* Sağ: İlerleme & Modern Aksiyon Butonları (Mobilde Giriş Butonuna Tam Yer Açan Akıllı Düzen) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 md:space-x-2 shrink-0">
          {/* APK İndir - Sadece Tablet ve Masaüstünde Görünür, Mobilde Login Butonunu Sıkıştırmaz */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="hidden sm:inline-flex h-8 px-2 sm:px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xs cursor-pointer transition-all items-center space-x-1 sm:space-x-1.5 whitespace-nowrap hover:scale-[1.02] shrink-0"
            title="Chirmo Android APK ve PWA İndir"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden md:inline">APK İndir</span>
          </button>

          {/* Gün Serisi & XP Ortak Kapsülü - Mobilde Ekranı Sıkıştırmaz, Tablet ve Masaüstünde Net Görünür */}
          <div
            onClick={() => setActiveTab('learn')}
            className="hidden sm:flex h-8 px-2 sm:px-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 items-center space-x-1 sm:space-x-1.5 text-xs font-bold cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-all shrink-0"
            title="30 Günlük Kamp Kesintisiz Serisi ve Toplam XP"
          >
            <div className="flex items-center space-x-0.5 sm:space-x-1 text-amber-600 dark:text-amber-400 font-black">
              <span>🔥</span>
              <span>{campProgress.streakDays}</span>
              <span className="hidden xl:inline text-[10px] font-semibold text-slate-500 dark:text-slate-400">Gün</span>
            </div>
            <span className="text-slate-300 dark:text-slate-600 font-light">|</span>
            <div className="flex items-center space-x-0.5 sm:space-x-1 text-purple-600 dark:text-purple-400 font-black">
              <span>⭐</span>
              <span>{campProgress.totalXp}</span>
              <span className="hidden xl:inline text-[10px] font-semibold text-slate-500 dark:text-slate-400">XP</span>
            </div>
          </div>

          {/* Hedef Dil Seçici (🇬🇧 İngilizce / 🇩🇪 Almanca) */}
          <div
            className="h-8.5 p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 flex items-center shrink-0 shadow-2xs"
            title="Çalışmak istediğiniz dili seçin (İngilizce / Almanca)"
          >
            <button
              onClick={() => TargetLanguageService.setTargetLanguage('en')}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                targetLanguage === 'en'
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>🇬🇧</span>
              <span className="hidden sm:inline">İngilizce</span>
            </button>
            <button
              onClick={() => TargetLanguageService.setTargetLanguage('de')}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                targetLanguage === 'de'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-purple-950 font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <span>🇩🇪</span>
              <span className="hidden sm:inline">Almanca</span>
            </button>
          </div>

          {/* Kişiye Özel Profil Çipi */}
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="h-8 p-1 sm:pl-1.5 sm:pr-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all shrink-0 inline-flex items-center space-x-1 sm:space-x-1.5 group"
            title={`${userProfile.hasCustomName ? userProfile.name : 'Profilini Düzenle'} (${userProfile.level})`}
          >
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-[11px] shadow-2xs group-hover:scale-105 transition-transform">
              {userProfile.avatarEmoji || '🎓'}
            </div>
            <span className="hidden xl:inline text-xs font-bold text-slate-700 dark:text-slate-300">
              {userProfile.hasCustomName ? userProfile.name : 'Profilim'}
            </span>
          </div>

          {/* Sıfır Kişisel Veri SaaS Giriş / Kayıt Butonu & Oturum Rozeti (Mobilde %100 Görünür ve Asla Taşmaz) */}
          {!currentUser ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="h-8 px-2.5 sm:px-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-xs cursor-pointer transition-all inline-flex items-center space-x-1 shrink-0 whitespace-nowrap active:scale-95"
              title="Sıfır Kişisel Veri ile Giriş Yap veya Kayıt Ol"
            >
              <span>🛡️</span>
              <span>Giriş Yap</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
              <div
                onClick={() => setIsAuthModalOpen(true)}
                className="h-8 px-2 sm:px-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold cursor-pointer hover:bg-indigo-500/20 transition-colors inline-flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap"
                title={`Oturum Açık: @${currentUser.username} (${currentUser.plan.toUpperCase()})`}
              >
                <span>👤</span>
                <span className="font-extrabold max-w-[55px] xs:max-w-[75px] sm:max-w-none truncate">@{currentUser.username}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-500 font-mono hidden xs:inline">
                  {currentUser.plan === 'pro' ? '👑 PRO' : 'ÜCRETSİZ'}
                </span>
              </div>
              <button
                onClick={() => PrivacyAuthService.logout()}
                className="h-8 px-2 rounded-xl bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer shrink-0"
                title="Güvenli Çıkış Yap"
              >
                ✕
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

        {/* BÖLÜM 2: İNGİLİZCE ÖĞRENME MERKEZİ */}
        {activeTab === 'learn' && (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            <SimpleLearningHub
              userLevel={learningProgress.currentLevel}
              onLevelChange={handleLevelChange}
              onOpenInBrowser={(url) => handleNavigate(url)}
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
            <SimpleTaskWorkspace />
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
        onComplete={(lvl) => {
          handleLevelChange(lvl);
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

      {/* Sıfır Kişisel Veri SaaS Kimlik & Hesap Modalı */}
      <ChirmoAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(u) => setCurrentUser(u)}
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
