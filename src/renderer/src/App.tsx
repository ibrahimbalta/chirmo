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
  Gamepad2
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
import { LearningStorageService } from './services/learningStorage';
import { Tab, CEFRLevel, DailyGoalProgress } from './types';
import { CampStorageService, StudentCampProgress } from './services/curriculumData';

export const App: React.FC = () => {
  // 3 Temel Bölüm: 'search' (Arama & Tarayıcı) | 'learn' (İngilizce Öğren) | 'tasks' (İş Takibi)
  const [activeTab, setActiveTab] = useState<'search' | 'learn' | 'tasks'>('search');

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
  const [isTutorOpen, setIsTutorOpen] = useState(true);
  const [isSmartReaderOpen, setIsSmartReaderOpen] = useState(false);
  const [activeLearningText, setActiveLearningText] = useState(
    'Artificial intelligence is helping businesses improve their services and reduce costs.'
  );
  const [selectedSentenceItem, setSelectedSentenceItem] = useState<PageSentenceItem | null>(null);

  // İş Takibi Görev Sayısı
  const [pendingTaskCount, setPendingTaskCount] = useState(2);

  // Mobil Uygulama & APK İndirme Modalı
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Sol Öğrenme Merkezi Paneli
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);

  const handleLeftSidebarSelect = (itemId: string) => {
    if (itemId === 'home') {
      setActiveTab('search');
      setIsBrowserNavigating(false);
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
      {/* ==================== ÜST SADE ANA BAŞLIK ==================== */}
      <header className="h-16 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 flex items-center justify-between z-30 shrink-0 shadow-xs">
        {/* Sol: Logo */}
        <div
          onClick={handleGoHome}
          className="cursor-pointer flex items-center space-x-2.5 hover:opacity-90 transition-opacity"
          title="Chirmo Ana Sayfa"
        >
          <ChirmoLogo size="sm" variant="header" />
          <span className="hidden sm:inline-block text-[11px] font-semibold text-slate-400 border-l border-slate-200 pl-2.5">
            Gezin • Öğren • Yönet
          </span>
        </div>

        {/* Orta: 3 Temel Ana Bölüm (Masaüstü/Tablet) */}
        <div className="hidden sm:flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          <button
            onClick={() => {
              setActiveTab('search');
            }}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Arama & İnternet</span>
          </button>

          <button
            onClick={() => setActiveTab('learn')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'learn'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>İngilizce Konuş (30 Gün)</span>
          </button>

          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex items-center space-x-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>İş & Hedef Takibi</span>
          </button>
        </div>

        {/* Sağ: İlerleme & XP Rozetleri & Türkçe Yardımcı Butonu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobil Uygulama & APK İndir Butonu */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-black shadow-xs cursor-pointer transition-transform hover:scale-105"
            title="Chirmo'yu telefon veya bilgisayarına indir (PWA / APK)"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline sm:inline">Uygulamayı İndir</span>
            <span className="inline xs:hidden sm:hidden">İndir</span>
          </button>

          {/* Konuşma Kampı Rozeti */}
          <button
            onClick={() => setActiveTab('learn')}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            title="30 Günlük Konuşma Kampına Git"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>30 Günlük Konuşma Kampı</span>
          </button>

          {/* Gün Serisi Sayacı */}
          <div
            onClick={() => setActiveTab('learn')}
            className="hidden sm:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer"
            title="30 Günlük Kamp Kesintisiz Serisi"
          >
            <span>🔥</span>
            <span>{campProgress.streakDays} Gün</span>
          </div>

          {/* Toplam XP */}
          <div
            onClick={() => setActiveTab('learn')}
            className="hidden lg:flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold cursor-pointer"
            title="Kazanılan Toplam Konuşma Puanı"
          >
            <span>⭐</span>
            <span>{campProgress.totalXp} XP</span>
          </div>

          {/* Türkçe Yardımcı Paneli */}
          <button
            onClick={() => setIsTutorOpen(!isTutorOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer ${
              isTutorOpen
                ? 'bg-blue-600 text-white shadow-blue-500/20'
                : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
            }`}
            title="Sayfadaki kelime ve cümleleri Türkçe açıklayan yardımcı"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Türkçe Yardımcı</span>
          </button>

          {/* Kullanıcı Profil Resmi */}
          <div
            className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all shrink-0"
            title="Profil: İbrahim (Seviye A2)"
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"
              alt="İbrahim"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </header>

      {/* ==================== ANA ÇALIŞMA ALANI ==================== */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* BÖLÜM 1: ARAMA & TARAYICI */}
        {activeTab === 'search' && (
          <div className="flex-1 relative flex flex-col h-full overflow-hidden">
            {/* Eğer bir siteye girilmemişse: 3 Panelli Masaüstü Arama & Öğrenme Paneli */}
            {!isBrowserNavigating ? (
              <div className="flex-1 flex flex-row h-full overflow-hidden">
                {/* SOL PANEL: ÖĞRENME MERKEZİ (Masaüstü/Tablet) */}
                <div className="hidden md:flex shrink-0 h-full">
                  <LearningCenterSidebar
                    isOpen={isLeftSidebarOpen}
                    onSelectItem={handleLeftSidebarSelect}
                    onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
                  />
                </div>

                {/* ORTA PANEL: ARAMA & GÖREVLER */}
                <div className="flex-1 h-full overflow-y-auto">
                  <SimpleSearchHome
                    onSearch={handleNavigate}
                    onNavigateToLearn={() => setActiveTab('learn')}
                    onNavigateToTasks={() => setActiveTab('tasks')}
                    onOpenInstallModal={() => setIsInstallModalOpen(true)}
                    userLevel={learningProgress.currentLevel}
                    pendingTaskCount={pendingTaskCount}
                  />
                </div>

                {/* SAĞ PANEL: CHIRMO AI ÖĞRETMENİ */}
                {isTutorOpen && (
                  <div className="hidden lg:flex shrink-0 h-full">
                    <ChirmoAiTeacherSidebar
                      isOpen={isTutorOpen}
                      onClose={() => setIsTutorOpen(false)}
                      userLevel={learningProgress.currentLevel}
                    />
                  </div>
                )}
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

        {/* BÖLÜM 3: İŞ & GÖREV TAKİBİ */}
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

      {/* Mobil Uygulama & APK İndirme Modalı */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />

      {/* ==================== MOBİL ALT MENÜ (SMARTPHONE BOTTOM NAV) ==================== */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-xl px-2 py-1.5 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer ${
            activeTab === 'search'
              ? 'text-blue-600 dark:text-blue-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Arama</span>
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer ${
            activeTab === 'learn'
              ? 'text-blue-600 dark:text-blue-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">İngilizce</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center transition-colors cursor-pointer ${
            activeTab === 'tasks'
              ? 'text-blue-600 dark:text-blue-400 font-black'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 font-bold'
          }`}
        >
          <CheckSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">İş Takibi</span>
        </button>

        <button
          onClick={() => setIsInstallModalOpen(true)}
          className="flex flex-col items-center justify-center p-1 rounded-xl flex-1 text-center text-amber-600 dark:text-amber-400 font-bold hover:text-amber-700 cursor-pointer"
        >
          <Smartphone className="w-5 h-5 mb-0.5 animate-bounce" />
          <span className="text-[10px]">APK / PWA</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
