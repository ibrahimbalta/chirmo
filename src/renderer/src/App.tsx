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
import { LearningStorageService } from './services/learningStorage';
import { UserProfileService, UserProfile } from './services/userProfileService';
import { PrivacyAuthService, SafeUserSession } from './services/privacyAuthService';
import { ChirmoAuthModal } from './components/auth/ChirmoAuthModal';
import { Tab, CEFRLevel, DailyGoalProgress } from './types';
import { CampStorageService, StudentCampProgress } from './services/curriculumData';

export type AppNavTab = 'search' | 'learn' | 'kids' | 'games' | 'speak' | 'tasks' | 'video';

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

  // Sıfır Kişisel Veri SaaS Kimlik Durumu
  const [currentUser, setCurrentUser] = useState<SafeUserSession | null>(() =>
    PrivacyAuthService.getCurrentUser()
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const unsubAuth = PrivacyAuthService.onAuthStateChanged((u) => {
      setCurrentUser(u);
    });
    const unsubProfile = UserProfileService.subscribe((updated) => {
      setUserProfile(updated);
    });
    return () => {
      unsubAuth();
      unsubProfile();
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
      <header className="h-14 px-3 sm:px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 z-30 shrink-0 select-none">
        {/* Sol: Sadece Temiz Logo (Metin Kullanıcı Talebiyle Kaldırıldı) */}
        <div
          onClick={handleGoHome}
          className="cursor-pointer flex items-center hover:opacity-90 transition-opacity shrink-0"
          title="Chirmo Ana Sayfa - 30 Günde Konuşma Garantili Sanal Öğretmen"
          aria-label="30 Günde Konuşma Garantili Sanal Öğretmen"
        >
          <ChirmoLogo size="md" variant="header" />
        </div>

        {/* Orta: 6 Renkli Minimal Hap Buton (Hafif Kompakt, Ekrana Tam Sığan, Kusursuz Simetrik) */}
        <nav className="hidden md:flex items-center justify-center gap-1.5 shrink-0">
                    <button
            onClick={() => setActiveTab('video')}
            className={`h-9 px-3 rounded-full text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'video'
                ? 'bg-rose-600 text-white font-extrabold shadow-sm ring-2 ring-rose-200 dark:ring-rose-800'
                : 'bg-red-50/90 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200/80 dark:border-red-800/70 hover:bg-red-100 font-bold'
            }`}
            title="YouTube, Film ve Dizi ile Konuşma Stüdyosu"
          >
            <Film className="w-3.5 h-3.5 shrink-0" />
            <span><span className="hidden 2xl:inline">YouTube & </span>Film</span>
          </button>

<button
            onClick={() => setActiveTab('search')}
            className={`h-9 px-3 rounded-full text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'search'
                ? 'bg-indigo-600 text-white font-extrabold shadow-sm ring-2 ring-indigo-200 dark:ring-indigo-800'
                : 'bg-indigo-50/90 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800/70 hover:bg-indigo-100 font-bold'
            }`}
            title="Chirmo Stüdyo"
          >
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span><span className="hidden 2xl:inline">Chirmo </span>Stüdyo</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`h-9 px-3 rounded-full text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'learn'
                ? 'bg-emerald-600 text-white font-extrabold shadow-sm ring-2 ring-emerald-200 dark:ring-emerald-800'
                : 'bg-emerald-50/90 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/70 hover:bg-emerald-100 font-bold'
            }`}
            title="30 Günlük Kamp"
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span><span className="hidden 2xl:inline">30 Günlük </span>Kamp</span>
          </button>

          <button
            onClick={() => setActiveTab('kids')}
            className={`h-9 px-3 rounded-full text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'kids'
                ? 'bg-pink-600 text-white font-extrabold shadow-sm ring-2 ring-pink-200 dark:ring-pink-800'
                : 'bg-pink-50/90 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 border border-pink-200/80 dark:border-pink-800/70 hover:bg-pink-100 font-bold'
            }`}
            title="5-17 Yaş Çocuklar İçin Chirmo Kids Dünyası"
          >
            <Smile className="w-3.5 h-3.5 shrink-0" />
            <span><span className="hidden 2xl:inline">Chirmo </span>Kids</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`h-9 px-3 rounded-full text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-amber-500 text-white font-extrabold shadow-sm ring-2 ring-amber-200 dark:ring-amber-800'
                : 'bg-amber-50/90 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/70 hover:bg-amber-100 font-bold'
            }`}
            title="Oyunlar"
          >
            <Gamepad2 className="w-3.5 h-3.5 shrink-0" />
            <span>Oyunlar</span>
          </button>

          <button
            onClick={() => setActiveTab('speak')}
            className={`h-9 px-3 rounded-full text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'speak'
                ? 'bg-rose-600 text-white font-extrabold shadow-sm ring-2 ring-rose-200 dark:ring-rose-800'
                : 'bg-rose-50/90 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/70 hover:bg-rose-100 font-bold'
            }`}
            title="Simülatör"
          >
            <Mic className="w-3.5 h-3.5 shrink-0" />
            <span>Simülatör</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`h-9 px-3 rounded-full text-xs transition-all duration-200 cursor-pointer inline-flex items-center space-x-1.5 shrink-0 whitespace-nowrap ${
              activeTab === 'tasks'
                ? 'bg-purple-600 text-white font-extrabold shadow-sm ring-2 ring-purple-200 dark:ring-purple-800'
                : 'bg-purple-50/90 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/70 hover:bg-purple-100 font-bold'
            }`}
            title="Hedeflerim"
          >
            <CheckSquare className="w-3.5 h-3.5 shrink-0" />
            <span>Hedeflerim</span>
          </button>
        </nav>

        {/* Sağ: İlerleme & Aksiyon Butonları (Tek Düzlem, Tam Sığan & Simetrik) */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
          {/* APK İndir (Kullanıcı Talebiyle "Uygulamayı İndir" yerine "APK İndir" yapıldı) */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="h-9 px-2 sm:px-3 rounded-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold shadow-xs cursor-pointer transition-all inline-flex items-center space-x-1 sm:space-x-1.5 whitespace-nowrap hover:scale-[1.02] shrink-0"
            title="Chirmo Android APK ve PWA İndir"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">APK İndir</span>
          </button>

          {/* Gün Serisi */}
          <div
            onClick={() => setActiveTab('learn')}
            className="h-9 px-2 sm:px-2.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-xs font-bold cursor-pointer hover:bg-amber-500/20 transition-colors inline-flex items-center space-x-1 whitespace-nowrap shrink-0"
            title="30 Günlük Kamp Kesintisiz Serisi"
          >
            <span className="text-xs">🔥</span>
            <span>{campProgress.streakDays}</span>
            <span className="hidden sm:inline"> Gün</span>
          </div>

          {/* Toplam XP */}
          <div
            onClick={() => setActiveTab('learn')}
            className="h-9 px-2.5 rounded-full bg-purple-500/10 border border-purple-500/25 text-purple-700 dark:text-purple-300 text-xs font-bold cursor-pointer hover:bg-purple-500/20 transition-colors hidden sm:inline-flex items-center space-x-1 whitespace-nowrap"
            title="Kazanılan Toplam Konuşma Puanı"
          >
            <span className="text-xs">⭐</span>
            <span>{campProgress.totalXp} XP</span>
          </div>

          {/* Kişiye Özel Profil Çipi */}
          <div
            onClick={() => setIsProfileModalOpen(true)}
            className="h-9 p-1 sm:pl-1 sm:pr-2.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 cursor-pointer transition-all shrink-0 inline-flex items-center space-x-1.5 group"
            title={`${userProfile.hasCustomName ? userProfile.name : 'Profilini Düzenle'} (${userProfile.level})`}
          >
            <div className="w-6.5 h-6.5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center text-xs shadow-2xs group-hover:scale-105 transition-transform">
              {userProfile.avatarEmoji || '🎓'}
            </div>
            <span className="hidden lg:inline text-xs font-bold text-slate-700 dark:text-slate-300">
              {userProfile.hasCustomName ? userProfile.name : 'Profilim'}
            </span>
          </div>

          {/* Sıfır Kişisel Veri SaaS Giriş / Kayıt Butonu & Oturum Rozeti */}
          {!currentUser ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="h-9 px-2.5 sm:px-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-black shadow-xs cursor-pointer transition-all inline-flex items-center space-x-1 sm:space-x-1.5 shrink-0 whitespace-nowrap hover:scale-[1.02]"
              title="Sıfır Kişisel Veri ile Giriş Yap veya Kayıt Ol"
            >
              <span>🛡️</span>
              <span>Giriş<span className="hidden xs:inline sm:inline"> / Kayıt</span></span>
            </button>
          ) : (
            <div className="flex items-center space-x-1.5">
              <div
                onClick={() => setIsAuthModalOpen(true)}
                className="h-9 px-2.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold cursor-pointer hover:bg-cyan-500/20 transition-colors inline-flex items-center space-x-1.5 whitespace-nowrap"
                title={`Oturum Açık: @${currentUser.username} (${currentUser.plan.toUpperCase()})`}
              >
                <span>👤</span>
                <span className="font-extrabold max-w-[65px] sm:max-w-none truncate">@{currentUser.username}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-400 font-mono">
                  {currentUser.plan === 'pro' ? '👑 PRO' : 'ÜCRETSİZ'}
                </span>
              </div>
              <button
                onClick={() => PrivacyAuthService.logout()}
                className="h-9 px-2 rounded-full bg-slate-100 hover:bg-rose-100 dark:bg-slate-800 dark:hover:bg-rose-950/50 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer"
                title="Güvenli Çıkış Yap"
              >
                ✕ Çıkış
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ==================== ANA ÇALIŞMA ALANI ==================== */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
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

      {/* ==================== MOBİL ALT MENÜ (SMARTPHONE BOTTOM NAV - 6 TEMEL BÖLÜM) ==================== */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-xl px-1 py-1 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'search'
              ? 'text-indigo-600 dark:text-indigo-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Sparkles className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Stüdyo</span>
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'learn'
              ? 'text-emerald-600 dark:text-emerald-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <BookOpen className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Kamp</span>
        </button>

        <button
          onClick={() => setActiveTab('kids')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'kids'
              ? 'text-pink-600 dark:text-pink-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Smile className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Kids</span>
        </button>

        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'games'
              ? 'text-amber-500 dark:text-amber-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Gamepad2 className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Oyun</span>
        </button>

        <button
          onClick={() => setActiveTab('speak')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'speak'
              ? 'text-rose-600 dark:text-rose-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Mic className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Simülatör</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer min-h-[44px] ${
            activeTab === 'tasks'
              ? 'text-purple-600 dark:text-purple-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <CheckSquare className="w-4 h-4 mb-0.5" />
          <span className="text-[10px]">Hedefler</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
