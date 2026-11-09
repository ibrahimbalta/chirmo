import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  Film,
  TrendingUp,
  Settings,
  DollarSign,
  Lock,
  Unlock,
  Key,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Download,
  Upload,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowLeft,
  X,
  Eye,
  RefreshCw,
  UserPlus,
  Server,
  Database,
  Activity,
  Filter,
  CreditCard,
  Zap,
  Clock
} from 'lucide-react';
import { AdminService, AdminMetrics } from '../../services/adminService';
import { UserAccount, PRESET_SECURITY_QUESTIONS } from '../../services/privacyAuthService';
import { VideoLesson } from '../learning/WatchingView';
import { THIRTY_DAY_MISSIONS } from '../../services/curriculumData';
import { CEFRLevel } from '../../types';

interface AdminDashboardProps {
  onBackToApp: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(AdminService.isAuthenticated());
  const [pinInput, setPinInput] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'videos' | 'curriculum' | 'settings'>('overview');

  // State
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [planFilter, setPlanFilter] = useState<'all' | 'free' | 'pro' | 'lifetime'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Management Modals
  const [passwordResetUser, setPasswordResetUser] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');

  // Create User Modal
  const [isCreateUserOpen, setIsCreateUserOpen] = useState<boolean>(false);
  const [createUserForm, setCreateUserForm] = useState<{
    username: string;
    password: string;
    plan: 'free' | 'pro' | 'lifetime';
    securityQuestion: string;
    securityAnswer: string;
  }>({
    username: '',
    password: '',
    plan: 'free',
    securityQuestion: PRESET_SECURITY_QUESTIONS[0],
    securityAnswer: 'istanbul'
  });

  // Video Management Modal
  const [editingVideo, setEditingVideo] = useState<VideoLesson | null>(null);
  const [isAddVideoOpen, setIsAddVideoOpen] = useState<boolean>(false);
  const [videoForm, setVideoForm] = useState<{
    title: string;
    channel: string;
    youtubeId: string;
    category: 'Film' | 'TED' | 'Haber' | 'İş & Kariyer' | 'Müzik';
    level: CEFRLevel;
    duration: string;
    englishSummary: string;
    turkishSummary: string;
  }>({
    title: '',
    channel: '',
    youtubeId: '',
    category: 'Film',
    level: 'A2',
    duration: '3:30',
    englishSummary: '',
    turkishSummary: ''
  });

  // Settings
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [m, u] = await Promise.all([
        AdminService.getMetrics(),
        AdminService.getAllUsers()
      ]);
      setMetrics(m);
      setUsers(u);
      setVideos(AdminService.getAllVideos());
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Veriler yüklenirken hata:', err);
      showToast('Bulut verileri güncellenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (AdminService.login(pinInput)) {
      setIsAuthenticated(true);
      setLoginError(null);
      setPinInput('');
    } else {
      setLoginError('Hatalı Yönetici PIN/Şifresi. Lütfen tekrar deneyin.');
    }
  };

  const handleLogout = () => {
    AdminService.logout();
    setIsAuthenticated(false);
  };

  const handlePlanChange = async (username: string, newPlan: 'free' | 'pro' | 'lifetime') => {
    if (AdminService.updateUserPlan(username, newPlan)) {
      showToast(`@${username} kullanıcısının planı "${newPlan.toUpperCase()}" olarak bulutta güncellendi.`);
      await loadData();
    }
  };

  const handleDeleteUser = async (username: string) => {
    if (confirm(`@${username} kullanıcısını hem buluttan hem sistemden kalıcı olarak silmek istediğinize emin misiniz?`)) {
      AdminService.deleteUser(username);
      showToast(`@${username} kullanıcısı silindi.`);
      await loadData();
    }
  };

  const handleExecutePasswordReset = async () => {
    if (!passwordResetUser || !newPasswordInput.trim()) return;
    try {
      await AdminService.resetUserPassword(passwordResetUser, newPasswordInput.trim());
      showToast(`@${passwordResetUser} için yeni şifre bulutta güncellendi.`);
      setPasswordResetUser(null);
      setNewPasswordInput('');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Şifre sıfırlanamadı');
    }
  };

  const handleCreateNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AdminService.createUser(
        createUserForm.username,
        createUserForm.password,
        createUserForm.plan
      );
      showToast(`@${createUserForm.username} kullanıcısı Firestore bulutuna başarıyla kaydedildi! 🎉`);
      setIsCreateUserOpen(false);
      setCreateUserForm({
        username: '',
        password: '',
        plan: 'free',
        securityQuestion: PRESET_SECURITY_QUESTIONS[0],
        securityAnswer: 'istanbul'
      });
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Kullanıcı oluşturulamadı.');
    }
  };

  const handleSaveVideo = () => {
    if (!videoForm.title || !videoForm.youtubeId) {
      alert('Lütfen en az başlık ve YouTube ID alanlarını doldurun.');
      return;
    }

    const newVideo: VideoLesson = {
      id: editingVideo ? editingVideo.id : 'vid_' + Date.now(),
      title: videoForm.title,
      channel: videoForm.channel || 'Chirmo Stüdyo',
      youtubeId: videoForm.youtubeId.trim(),
      thumbnail: `https://img.youtube.com/vi/${videoForm.youtubeId.trim()}/hqdefault.jpg`,
      duration: videoForm.duration || '3:00',
      level: videoForm.level,
      category: videoForm.category,
      englishSummary: videoForm.englishSummary,
      turkishSummary: videoForm.turkishSummary,
      subtitles: editingVideo ? editingVideo.subtitles : []
    };

    AdminService.saveVideo(newVideo);
    showToast(`"${videoForm.title}" videosu kaydedildi.`);
    setIsAddVideoOpen(false);
    setVideos(AdminService.getAllVideos());
  };

  const handleDeleteVideo = (id: string, title: string) => {
    if (confirm(`"${title}" videosunu silmek istediğinize emin misiniz?`)) {
      AdminService.deleteVideo(id);
      showToast('Video silindi.');
      setVideos(AdminService.getAllVideos());
    }
  };

  const handleExportBackup = () => {
    const jsonStr = AdminService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chirmo_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Tüm veritabanı yedeği JSON dosyası olarak indirildi.');
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    if (AdminService.importBackup(importJsonText.trim())) {
      showToast('Yedek başarıyla geri yüklendi!');
      setIsImportModalOpen(false);
      setImportJsonText('');
      loadData();
    } else {
      alert('Geçersiz JSON yedek dosyası formatı.');
    }
  };

  // ==================== 1. GİRİŞ (LOGIN) EKRANI ====================
  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#07090E] p-4 text-slate-100 select-none">
        <div className="w-full max-w-md rounded-3xl bg-slate-900/90 border border-slate-800 p-8 space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          <div className="text-center space-y-3 relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">Chirmo SaaS Admin Paneli</h2>
              <p className="text-xs text-slate-400 mt-1">
                Bulut Veritabanı, Gelir & SaaS Kullanıcı Yönetimi
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 relative">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Yönetici Güvenlik PIN'i:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN giriniz..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono transition-all"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-500 absolute right-4 top-3.5" />
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs tracking-wider uppercase transition-all shadow-lg shadow-indigo-600/30 cursor-pointer active:scale-[0.98]"
            >
              Yönetici Paneline Giriş Yap
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800/80 text-center relative">
            <button
              type="button"
              onClick={onBackToApp}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Chirmo Uygulamasına Geri Dön</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered users calculation
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlan = planFilter === 'all' || u.plan === planFilter;
    return matchesSearch && matchesPlan;
  });

  // Calculate Real ARR & Profit based on active users
  const realProUsers = users.filter((u) => u.plan === 'pro').length;
  const realLifetimeUsers = users.filter((u) => u.plan === 'lifetime').length;
  const realFreeUsers = users.filter((u) => u.plan === 'free').length;
  const realArr = realProUsers * 200 + realLifetimeUsers * 500;
  const realNetProfit = Math.round(realProUsers * 123.87 + realLifetimeUsers * 320);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080B11] text-slate-100 select-none overflow-y-auto pb-24">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-6 z-50 px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-2xl animate-fade-in flex items-center space-x-2 border border-indigo-400/30">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="h-20 px-4 sm:px-8 bg-slate-900/80 border-b border-slate-800/80 backdrop-blur-xl flex items-center justify-between gap-4 shrink-0 sticky top-0 z-30">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <h1 className="text-base font-black tracking-tight text-white">Chirmo Admin Konsolu</h1>
              <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950/80 text-emerald-400 border border-emerald-800/80">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Firestore Canlı (eur3)</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>Cloud Firestore Database</span>
              <span className="text-slate-600">•</span>
              <span>200 TL/Yıl Abonelikler</span>
              {lastUpdated && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500">Son güncelleme: {lastUpdated.toLocaleTimeString('tr-TR')}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5 border border-slate-700/60"
            title="Bulut Verilerini Yenile"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden md:inline">Yenile</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCreateUserOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-black shadow-md shadow-indigo-600/20 transition-all cursor-pointer inline-flex items-center space-x-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Kullanıcı Ekle</span>
          </button>

          <button
            type="button"
            onClick={onBackToApp}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5 border border-slate-700/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Öğrenci Ekranı</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/80 text-rose-300 text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      {/* Admin Navigation Capsule Bar */}
      <div className="px-4 sm:px-8 py-3 bg-slate-900/40 border-b border-slate-800/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Genel Bakış & Ciro</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kullanıcılar</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-indigo-300 border border-indigo-800/50">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Video & Film CMS</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-purple-300 border border-purple-800/50">
              {videos.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>30 Günlük Kamp Müfredatı</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-800 text-emerald-300 border border-emerald-800/50">
              30 Gün
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-2 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Sistem & Yedekleme</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-8 space-y-8">
        
        {/* ==================== TAB 1: GENEL BAKIŞ & CİRO METRİKLERİ ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* 4 Ana KPI Kartı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Kart 1: Toplam Kullanıcı */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-indigo-500/50 transition-all">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Kayıtlı Kullanıcı</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-indigo-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-black text-white">{users.length}</div>
                  <span className="text-[11px] text-emerald-400 font-bold">● Firestore</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>{realFreeUsers} Ücretsiz</span>
                  <span className="font-bold text-amber-300">{realProUsers + realLifetimeUsers} Ücretli Üye</span>
                </div>
              </div>

              {/* Kart 2: Pro & VIP Üyeler */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-all">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Pro & VIP Aboneler</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/80 flex items-center justify-center text-amber-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-black text-amber-300">{realProUsers + realLifetimeUsers}</div>
                  <span className="text-[11px] text-slate-400 font-bold">
                    (%{users.length > 0 ? Math.round(((realProUsers + realLifetimeUsers) / users.length) * 100) : 0} Dönüşüm)
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>{realProUsers} Pro (200 TL)</span>
                  <span className="font-bold text-purple-300">{realLifetimeUsers} VIP Ömür Boyu</span>
                </div>
              </div>

              {/* Kart 3: Yıllık Tahmini Ciro */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-emerald-500/50 transition-all">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Yıllık Toplam Ciro</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-black text-emerald-400">
                    {realArr.toLocaleString('tr-TR')} TL
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>Kullanıcı Başı: 200 TL/Yıl</span>
                  <span className="text-emerald-400 font-bold">Yıllık ARR</span>
                </div>
              </div>

              {/* Kart 4: Tahmini Net Kâr */}
              <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-3 relative overflow-hidden group hover:border-purple-500/50 transition-all">
                <div className="flex items-center justify-between text-purple-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Tahmini Net Kâr</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-950/80 border border-purple-800/80 flex items-center justify-center text-purple-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <div className="text-3xl font-black text-purple-300">
                    {realNetProfit.toLocaleString('tr-TR')} TL
                  </div>
                  <span className="text-[11px] text-emerald-400 font-bold">%62 Kâr Marjı</span>
                </div>
                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span>KDV & Altyapı Düşülmüş</span>
                  <span className="text-purple-300 font-bold">Net Kazanç</span>
                </div>
              </div>

            </div>

            {/* Bulut Altyapısı & Canlı Servis Durumu */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2.5">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-black text-white">Canlı Bulut & Altyapı Entegrasyonu</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-950/90 text-emerald-400 border border-emerald-800/80">
                  ● Tüm Sistemler Çalışıyor
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Firebase Cloud Firestore</span>
                    <span className="text-emerald-400 text-[10px] font-bold">Bağlı</span>
                  </div>
                  <div className="text-[11px] font-mono text-indigo-300">chirmo-f95a0 (eur3)</div>
                  <p className="text-[10px] text-slate-400">REST API ile doğrudan buluta anlık kayıt ve yedekleme.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Google Gemini AI Engine</span>
                    <span className="text-emerald-400 text-[10px] font-bold">Aktif</span>
                  </div>
                  <div className="text-[11px] font-mono text-purple-300">Gemini 1.5 Flash API</div>
                  <p className="text-[10px] text-slate-400">Gerçek zamanlı diyalog simülasyonu ve telaffuz koçluğu.</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Firebase Global CDN Hosting</span>
                    <span className="text-emerald-400 text-[10px] font-bold">Canlıda</span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-300">chirmo-f95a0.web.app</div>
                  <p className="text-[10px] text-slate-400">Dünya genelinde 300+ CDN noktasından ultra hızlı dağıtım.</p>
                </div>
              </div>
            </div>

            {/* Birim Maliyet & SaaS Gelir Modeli */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="border-b border-slate-800/80 pb-3">
                <h3 className="text-sm font-black text-white">200 TL Yıllık Abonelik Birim Gelir Dağılımı</h3>
                <p className="text-xs text-slate-400">
                  Her 1 Pro üyeden (200 TL/Yıl) elde edilen net kâr ve gider kalemleri analizi
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-300">Yasal KDV (%20)</div>
                  <div className="text-lg font-black text-rose-400">-33.33 TL</div>
                  <div className="text-[10px] text-slate-500">Türkiye dijital hizmet vergisi</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-300">Ödeme Altyapısı (Iyzico / Banka)</div>
                  <div className="text-lg font-black text-amber-400">-6.80 TL</div>
                  <div className="text-[10px] text-slate-500">Tek çekim kart işlem komisyonu</div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-850/60 border border-slate-800 space-y-1">
                  <div className="font-bold text-slate-300">AI LLM, Ses & Bulut Sunucu</div>
                  <div className="text-lg font-black text-indigo-400">-36.00 TL</div>
                  <div className="text-[10px] text-slate-500">Kullanıcı başı yıllık Gemini + Hosting kotası</div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-800/80 space-y-1">
                  <div className="font-bold text-emerald-300">Kullanıcı Başı Net Kâr</div>
                  <div className="text-lg font-black text-emerald-400">+123.87 TL</div>
                  <div className="text-[10px] text-emerald-500/80">%62.0 Net Nakit Marjı</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== TAB 2: KULLANICI & ABONELİK YÖNETİMİ ==================== */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-5">
            
            {/* Üst Bar: Başlık, Filtreler & Aksiyonlar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
              <div>
                <div className="flex items-center space-x-2.5">
                  <h3 className="text-base font-black text-white">SaaS Kullanıcı Hesapları ({users.length})</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                    Bulut Veritabanı
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Firestore üzerinde kayıtlı tüm gerçek kullanıcılar, plan durumları ve yönetim kontrolleri
                </p>
              </div>

              {/* Filtreler, Arama & Yeni Ekle */}
              <div className="flex flex-wrap items-center gap-2.5">
                
                {/* Plan Filtresi */}
                <div className="flex items-center bg-slate-850 p-1 rounded-xl border border-slate-700/60 text-xs">
                  <button
                    type="button"
                    onClick={() => setPlanFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      planFilter === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Tümü ({users.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanFilter('pro')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      planFilter === 'pro' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    👑 Pro ({realProUsers})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanFilter('lifetime')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      planFilter === 'lifetime' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🌟 VIP ({realLifetimeUsers})
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlanFilter('free')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                      planFilter === 'free' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Free ({realFreeUsers})
                  </button>
                </div>

                {/* Arama Barı */}
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Kullanıcı ara..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                </div>

                {/* Yeni Kullanıcı Butonu */}
                <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs transition-all shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Kullanıcı Ekle</span>
                </button>
              </div>
            </div>

            {/* Kullanıcılar Tablosu */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-850/80 border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3.5 px-4 font-bold">Kullanıcı</th>
                    <th className="py-3.5 px-4 font-bold">Abonelik Planı</th>
                    <th className="py-3.5 px-4 font-bold">Kayıt Tarihi</th>
                    <th className="py-3.5 px-4 font-bold">Güvenlik Sorusu</th>
                    <th className="py-3.5 px-4 font-bold text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                  {filteredUsers.map((user) => (
                    <tr key={user.id || user.username} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-sm uppercase">
                            {user.username.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span>@{user.username}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {user.id ? user.id.slice(0, 10) : 'cloud'}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={user.plan}
                          onChange={(e) => handlePlanChange(user.username, e.target.value as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black border cursor-pointer transition-all ${
                            user.plan === 'pro'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-700/80 shadow-sm'
                              : user.plan === 'lifetime'
                              ? 'bg-purple-950/80 text-purple-300 border-purple-700/80 shadow-sm'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="free">Ücretsiz (Free Plan)</option>
                          <option value="pro">👑 Pro (200 TL / Yıl)</option>
                          <option value="lifetime">🌟 VIP (Ömür Boyu)</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate" title={user.securityQuestion}>
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/60 text-[11px]">
                          {user.securityQuestion || 'Standart Soru'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPasswordResetUser(user.username);
                            setNewPasswordInput('');
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-950/80 text-indigo-300 border border-indigo-800/80 hover:bg-indigo-900 text-[11px] font-bold cursor-pointer transition-all"
                          title="Şifre Sıfırla"
                        >
                          Şifre Sıfırla
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.username)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-950/70 text-rose-300 border border-rose-800/80 hover:bg-rose-900 text-[11px] font-bold cursor-pointer transition-all"
                          title="Kullanıcıyı Sil"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-500">
                            <Users className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-300">Kayıtlı Kullanıcı Bulunmuyor</p>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Web sitesinden yeni bir hesap açıldığında veya "+ Kullanıcı Ekle" ile manuel oluşturduğunuzda burada listelenecektir.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setIsCreateUserOpen(true)}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-sm"
                          >
                            Hemen Yeni Bir Kullanıcı Oluştur
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: VİDEO & FİLM CMS ==================== */}
        {activeTab === 'videos' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-base font-black text-white">Film & YouTube Video Dersi CMS ({videos.length})</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Öğrencilerin film stüdyosunda interaktif repliklerle çalıştığı YouTube video kütüphanesi
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingVideo(null);
                  setVideoForm({
                    title: '',
                    channel: '',
                    youtubeId: '',
                    category: 'Film',
                    level: 'A2',
                    duration: '3:30',
                    englishSummary: '',
                    turkishSummary: ''
                  });
                  setIsAddVideoOpen(true);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs cursor-pointer shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Video Dersi Ekle</span>
              </button>
            </div>

            {/* Video Listesi Kartları */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600/80 space-y-3.5 flex flex-col justify-between transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3.5">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-24 h-16 object-cover rounded-xl border border-slate-700/80 shrink-0 shadow-md"
                      />
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md font-black text-[9px] bg-red-950/80 text-red-300 border border-red-800/80">
                            {vid.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-md font-black text-[9px] bg-slate-700 text-slate-200">
                            {vid.level}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{vid.duration}</span>
                        </div>
                        <h4 className="text-xs font-black text-white truncate mt-1.5">{vid.title}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {vid.channel} • ID: <code className="text-indigo-400">{vid.youtubeId}</code>
                        </p>
                      </div>
                    </div>

                    {vid.englishSummary && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        🇬🇧 {vid.englishSummary}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-700/50">
                    <span className="text-[10px] text-indigo-300 font-bold">
                      {vid.subtitles.length} Sahne Diyaloğu
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingVideo(vid);
                          setVideoForm({
                            title: vid.title,
                            channel: vid.channel,
                            youtubeId: vid.youtubeId,
                            category: vid.category as any,
                            level: vid.level,
                            duration: vid.duration,
                            englishSummary: vid.englishSummary || '',
                            turkishSummary: vid.turkishSummary || ''
                          });
                          setIsAddVideoOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-indigo-950 text-indigo-300 hover:bg-indigo-900 border border-indigo-800 cursor-pointer"
                        title="Düzenle"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(vid.id, vid.title)}
                        className="p-1.5 rounded-lg bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-800 cursor-pointer"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: 30 GÜNLÜK KAMP MÜFREDATI ==================== */}
        {activeTab === 'curriculum' && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-5">
            <div className="border-b border-slate-800/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-white">30 Günlük Sıfırdan Akıcı Konuşma Kampı</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Gramer ezberletmeyen, refleks ve konuşma odaklı 30 günlük tam müfredat görevleri
                </p>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-bold">
                ✓ 30 Gün Eksiksiz Hazır
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {THIRTY_DAY_MISSIONS.slice(0, 30).map((mission) => (
                <div
                  key={mission.day}
                  className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 hover:border-slate-600/80 space-y-2 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                      <span>Gün #{mission.day}</span>
                      <span className="text-[10px] text-slate-500 font-normal">Hafta {mission.week}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-black bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      +{mission.xpReward} XP
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white line-clamp-1">{mission.title}</div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{mission.theme}</p>
                  <div className="p-2 rounded-xl bg-slate-900/80 text-[10px] text-slate-300 font-mono border border-slate-800">
                    🎯 {mission.speakingGoal}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: SİSTEM & YEDEKLEME ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* PIN Değiştirme */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
                <Key className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-black text-white">Yönetici Giriş PIN'ini Değiştir</h3>
              </div>

              <p className="text-xs text-slate-400">
                Admin paneline giriş yaparken kullandığınız varsayılan PIN şifresini güvenli bir kodla güncelleyin.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Yeni PIN giriniz (en az 4 karakter)..."
                  className="w-full sm:w-80 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (AdminService.setAdminPin(newPinInput)) {
                      showToast('Yönetici PIN şifresi başarıyla güncellendi! 🔑');
                      setNewPinInput('');
                    } else {
                      alert('PIN en az 4 karakter olmalıdır.');
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  PIN'i Güncelle
                </button>
              </div>
            </div>

            {/* Veritabanı Yedekleme & Geri Yükleme */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800/80 pb-3">
                <Download className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white">Veritabanı Yedekleme & Kurtarma (JSON)</h3>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Tüm kayıtlı kullanıcı hesaplarını, özel eklenen video derslerini, kelime defterlerini ve abonelik durumlarını tek tıkla JSON formatında bilgisayarınıza yedekleyebilir veya başka bir cihaza aktarabilirsiniz.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-md shadow-emerald-600/30 inline-flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Veritabanı Yedeğini İndir (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-black text-xs cursor-pointer inline-flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Yedekten Geri Yükle</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ==================== MODAL: YENİ KULLANICI OLUŞTUR ==================== */}
      {isCreateUserOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl animate-fade-in relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-black text-white">Yeni Kullanıcı Hesabı Tanımla</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateUserOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Kullanıcı Adı:</label>
                <input
                  type="text"
                  value={createUserForm.username}
                  onChange={(e) => setCreateUserForm({ ...createUserForm, username: e.target.value })}
                  placeholder="örn: mehmet_kaya"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Şifre:</label>
                <input
                  type="password"
                  value={createUserForm.password}
                  onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
                  placeholder="Şifre belirleyin..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Abonelik Planı:</label>
                <select
                  value={createUserForm.plan}
                  onChange={(e) => setCreateUserForm({ ...createUserForm, plan: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                >
                  <option value="free">Ücretsiz (Free)</option>
                  <option value="pro">👑 Pro (200 TL / Yıl)</option>
                  <option value="lifetime">🌟 VIP (Ömür Boyu)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  Buluta Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ŞİFRE SIFIRLAMA ==================== */}
      {passwordResetUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl animate-fade-in">
            <h3 className="text-sm font-black text-white">
              @{passwordResetUser} İçin Yeni Şifre Tanımla
            </h3>
            <p className="text-xs text-slate-400">
              Kullanıcının güvenlik sorusuna gerek olmadan yeni şifresini yönetici olarak tanımlayın:
            </p>
            <input
              type="text"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
              placeholder="Yeni şifre (örn: yeni1234)..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 font-mono"
              autoFocus
            />
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setPasswordResetUser(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleExecutePasswordReset}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-md shadow-indigo-600/30"
              >
                Şifreyi Bulutta Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: VİDEO EKLE / DÜZENLE ==================== */}
      {isAddVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl my-8 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">
                {editingVideo ? 'Video Dersi Düzenle' : 'Yeni YouTube Video Dersi Ekle'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddVideoOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Ders Başlığı:</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="örn: Dead Poets Society - Carpe Diem"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">YouTube Video ID:</label>
                  <input
                    type="text"
                    value={videoForm.youtubeId}
                    onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                    placeholder="örn: qQtmGceG9NA"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Kanal / Kaynak:</label>
                  <input
                    type="text"
                    value={videoForm.channel}
                    onChange={(e) => setVideoForm({ ...videoForm, channel: e.target.value })}
                    placeholder="örn: Touchstone Pictures"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Kategori:</label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="Film">Film & Dizi</option>
                    <option value="TED">TED Konuşmaları</option>
                    <option value="Haber">Haber & Belgesel</option>
                    <option value="İş & Kariyer">İş & Kariyer</option>
                    <option value="Müzik">Müzik</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Seviye (CEFR):</label>
                  <select
                    value={videoForm.level}
                    onChange={(e) => setVideoForm({ ...videoForm, level: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="A1">A1 - Başlangıç</option>
                    <option value="A2">A2 - Temel</option>
                    <option value="B1">B1 - Orta Seviye</option>
                    <option value="B2">B2 - İyi Seviye</option>
                    <option value="C1">C1 - İleri Seviye</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">İngilizce Özet & Anahtar Replik:</label>
                <textarea
                  rows={2}
                  value={videoForm.englishSummary}
                  onChange={(e) => setVideoForm({ ...videoForm, englishSummary: e.target.value })}
                  placeholder="Örn: Make your lives extraordinary. Seize the day boys!"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVideoOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleSaveVideo}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-md shadow-indigo-600/30"
                >
                  Videoyu Kaydet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: JSON YEDEK GERİ YÜKLE ==================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">Yedekten Geri Yükle (JSON Yapıştır)</h3>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Daha önce indirdiğiniz JSON yedek dosyasının içeriğini aşağıdaki alana yapıştırın:
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{"exportDate": "...", "accounts": "...", "videos": "..."}'
              className="w-full p-3 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleImportBackup}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-md shadow-emerald-600/30"
              >
                Geri Yükle ve Uygula
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
