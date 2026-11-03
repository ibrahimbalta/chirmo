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
  Globe
} from 'lucide-react';
import { ChirmoLogo } from './components/common/ChirmoLogo';
import { BrowserContainer } from './components/browser/BrowserContainer';
import { SimpleSearchHome } from './components/home/SimpleSearchHome';
import { SimpleLearningHub } from './components/learning/SimpleLearningHub';
import { SimpleTaskWorkspace } from './components/tasks/SimpleTaskWorkspace';
import { SimpleAiTutorDrawer } from './components/learning/SimpleAiTutorDrawer';
import { SmartReaderModal } from './components/learning/SmartReaderModal';
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
  const [isTutorOpen, setIsTutorOpen] = useState(false);
  const [isSmartReaderOpen, setIsSmartReaderOpen] = useState(false);
  const [activeLearningText, setActiveLearningText] = useState(
    'Artificial intelligence is helping businesses improve their services and reduce costs.'
  );

  // İş Takibi Görev Sayısı
  const [pendingTaskCount, setPendingTaskCount] = useState(2);

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

        {/* Orta: 3 Temel Ana Bölüm */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
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
            <span>İngilizce Konuş & MEB</span>
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
            <span>Ödev & İş Takibi</span>
          </button>
        </div>

        {/* Sağ: Sınıf & XP Rozetleri & Türkçe Yardımcı Butonu */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Sınıf Rozeti */}
          <button
            onClick={() => setActiveTab('learn')}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
            title="Sınıfını ve Ünitelerini Değiştir"
          >
            <span>{campProgress.selectedGrade}. Sınıf {campProgress.selectedGrade === '8' ? '(LGS)' : ''}</span>
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
        </div>
      </header>

      {/* ==================== ANA ÇALIŞMA ALANI ==================== */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {/* BÖLÜM 1: ARAMA & TARAYICI */}
        {activeTab === 'search' && (
          <div className="flex-1 relative flex flex-col h-full overflow-hidden">
            {/* Eğer bir siteye girilmemişse: Sade Google Tarzı Arama Ana Sayfası */}
            {!isBrowserNavigating ? (
              <SimpleSearchHome
                onSearch={handleNavigate}
                onNavigateToLearn={() => setActiveTab('learn')}
                onNavigateToTasks={() => setActiveTab('tasks')}
                userLevel={learningProgress.currentLevel}
                pendingTaskCount={pendingTaskCount}
              />
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
                  <BrowserContainer isVisible={isBrowserNavigating} />

                  {isTutorOpen && (
                    <SimpleAiTutorDrawer
                      isOpen={isTutorOpen}
                      onClose={() => setIsTutorOpen(false)}
                      selectedText={activeLearningText}
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
    </div>
  );
};

export default App;
