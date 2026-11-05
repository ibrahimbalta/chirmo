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
  RefreshCw
} from 'lucide-react';
import { AdminService, AdminMetrics } from '../../services/adminService';
import { UserAccount } from '../../services/privacyAuthService';
import { VideoLesson, SubtitleLine } from '../learning/WatchingView';
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

  // Metrics State
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // User Management Modals
  const [passwordResetUser, setPasswordResetUser] = useState<string | null>(null);
  const [newPasswordInput, setNewPasswordInput] = useState<string>('');

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

  // Settings: Change PIN
  const [newPinInput, setNewPinInput] = useState<string>('');
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadData = async () => {
    const m = await AdminService.getMetrics();
    setMetrics(m);
    const u = await AdminService.getAllUsers();
    setUsers(u);
    const v = AdminService.getAllVideos();
    setVideos(v);
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

  const handlePlanChange = (username: string, newPlan: 'free' | 'pro' | 'lifetime') => {
    if (AdminService.updateUserPlan(username, newPlan)) {
      showToast(`@${username} kullanıcısının planı "${newPlan.toUpperCase()}" olarak güncellendi.`);
      loadData();
    }
  };

  const handleDeleteUser = (username: string) => {
    if (confirm(`@${username} kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) {
      AdminService.deleteUser(username);
      showToast(`@${username} kullanıcısı silindi.`);
      loadData();
    }
  };

  const handleExecutePasswordReset = async () => {
    if (!passwordResetUser || !newPasswordInput.trim()) return;
    try {
      await AdminService.resetUserPassword(passwordResetUser, newPasswordInput.trim());
      showToast(`@${passwordResetUser} için yeni şifre başarıyla tanımlandı.`);
      setPasswordResetUser(null);
      setNewPasswordInput('');
    } catch (err: any) {
      alert(err.message || 'Şifre sıfırlanamadı');
    }
  };

  const handleSaveVideo = () => {
    if (!videoForm.title || !videoForm.youtubeId) {
      alert('Lütfen başlık ve YouTube Video ID giriniz.');
      return;
    }

    const newVid: VideoLesson = {
      id: editingVideo ? editingVideo.id : 'vid_' + Date.now().toString(36),
      title: videoForm.title,
      channel: videoForm.channel || 'Chirmo Video',
      level: videoForm.level,
      duration: videoForm.duration || '3:00',
      youtubeId: videoForm.youtubeId,
      thumbnail: `https://i.ytimg.com/vi/${videoForm.youtubeId}/hqdefault.jpg`,
      category: videoForm.category,
      description: videoForm.turkishSummary || videoForm.title,
      englishSummary: videoForm.englishSummary,
      turkishSummary: videoForm.turkishSummary,
      subtitles: editingVideo ? editingVideo.subtitles : [
        {
          id: 1,
          timeSec: 10,
          timeStr: '0:10',
          en: 'Welcome to this interactive English lesson.',
          tr: 'Bu interaktif İngilizce dersine hoş geldiniz.',
          level: videoForm.level,
          highlightWords: ['welcome', 'lesson'],
          blankTargetWord: 'welcome',
          quizOptions: ['welcome', 'boring', 'silent']
        }
      ]
    };

    AdminService.saveVideo(newVid);
    showToast(`"${newVid.title}" videosu kaydedildi.`);
    setIsAddVideoOpen(false);
    setEditingVideo(null);
    loadData();
  };

  const handleDeleteVideo = (id: string, title: string) => {
    if (confirm(`"${title}" videosunu silmek istediğinize emin misiniz?`)) {
      AdminService.deleteVideo(id);
      showToast('Video silindi.');
      loadData();
    }
  };

  const handleExportBackup = () => {
    const jsonStr = AdminService.exportFullBackup();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chirmo_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Tüm sistem veritabanı başarıyla dışa aktarıldı. 💾');
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    if (AdminService.importBackup(importJsonText)) {
      showToast('Veritabanı yedeği başarıyla geri yüklendi! 🎉');
      setIsImportModalOpen(false);
      setImportJsonText('');
      loadData();
    } else {
      alert('Geçersiz JSON formatı. Lütfen kontrol ediniz.');
    }
  };

  // ==================== 1. GÜVENLİK KAPISI (ADMIN LOGIN) ====================
  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 bg-slate-950 text-slate-100 select-none">
        <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-700 text-white flex items-center justify-center text-2xl shadow-lg shadow-indigo-500/20">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black text-white">Chirmo Yönetici Girişi</h1>
            <p className="text-xs text-slate-400">
              SaaS kullanıcı yönetimi, video müfredat CMS ve gelir paneline erişim için PIN/Şifre giriniz.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Yönetici PIN / Şifre:
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN giriniz..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Varsayılan şifre: <code className="text-indigo-400 font-mono">admin123</code> veya <code className="text-indigo-400 font-mono">chirmo2026</code>
              </p>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs shadow-md shadow-indigo-600/30 transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Yönetici Paneline Giriş Yap</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onBackToApp}
              className="text-xs text-slate-400 hover:text-white inline-flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Chirmo Öğrenci Ekranına Dön</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==================== 2. TAM YÖNETİM PANELİ (AUTHENTICATED) ====================
  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.plan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 text-slate-100 select-none overflow-y-auto pb-20">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold shadow-2xl animate-fade-in flex items-center space-x-2">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <header className="h-16 px-4 sm:px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-3 shrink-0 sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black text-white">Chirmo Admin Paneli</h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                ● Çevrimiçi
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              SaaS Kullanıcıları, 200 TL Abonelikler, Video CMS & Gelir Metrikleri
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={onBackToApp}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Uygulamaya Dön</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800 text-rose-300 text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Çıkış</span>
          </button>
        </div>
      </header>

      {/* Admin Navigation Capsule Bar */}
      <div className="p-3 sm:p-4 bg-slate-900/60 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex items-center space-x-1 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white font-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Genel Bakış & Ciro</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white font-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Kullanıcılar ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'videos'
                ? 'bg-indigo-600 text-white font-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>Video & Film CMS ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('curriculum')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'curriculum'
                ? 'bg-indigo-600 text-white font-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>30 Günlük Kamp Müfredatı</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white font-black shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Sistem & Yedekleme</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        
        {/* ==================== TAB 1: GENEL BAKIŞ & CİRO METRİKLERİ ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 4 Ana Metrik Kartı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Toplam Kullanıcı</span>
                  <Users className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="text-2xl font-black text-white">{metrics?.totalUsers || 0}</div>
                <div className="text-[11px] text-slate-500">
                  {metrics?.freeUsers} Ücretsiz • {metrics?.proUsers} Pro Üye
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-amber-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Yıllık 200 TL Aboneler</span>
                  <span className="text-base">👑</span>
                </div>
                <div className="text-2xl font-black text-amber-300">{metrics?.proUsers || 0} Abone</div>
                <div className="text-[11px] text-slate-400">
                  Aylık sürpriz kesinti yok, tek çekim model
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-emerald-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Tahmini Yıllık Ciro (ARR)</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-300">{metrics?.estimatedArrTr || 0} TL</div>
                <div className="text-[11px] text-emerald-500">
                  Yıllık 200 TL tek seferlik ödeme bazlı
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-purple-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Tahmini Net Faaliyet Kârı</span>
                  <TrendingUp className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-2xl font-black text-purple-300">{metrics?.estimatedNetProfitTr || 0} TL</div>
                <div className="text-[11px] text-purple-400">
                  %62 Net Kâr Marjı (KDV & AI maliyetleri sonrası)
                </div>
              </div>

            </div>

            {/* Finansal & Maliyet Şeffaflığı Paneli */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">📊</span>
                  <div>
                    <h3 className="text-sm font-black text-white">
                      200 TL Yıllık Tek Seferlik Ücretin Birim Maliyet & Kârlılık Dağılımı
                    </h3>
                    <p className="text-xs text-slate-400">
                      Türkiye e-ticaret vergileri, ödeme geçidi komisyonları ve yapay zeka token maliyetleri
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Net Kâr: ~123.87 TL / Kullanıcı
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="font-bold text-slate-300">Yasal KDV (%20)</div>
                  <div className="text-base font-black text-white">33.33 TL</div>
                  <div className="text-[10px] text-slate-500">Türkiye dijital hizmet vergisi</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="font-bold text-slate-300">Ödeme Altyapısı (Iyzico / Banka)</div>
                  <div className="text-base font-black text-white">6.80 TL</div>
                  <div className="text-[10px] text-slate-500">Tek çekim kart işlem komisyonu</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <div className="font-bold text-slate-300">AI LLM, Ses & Bulut Sunucu</div>
                  <div className="text-base font-black text-white">36.00 TL</div>
                  <div className="text-[10px] text-slate-500">Doğal konuşma modeli ve ses sentezi</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: KULLANICI & ABONELİK YÖNETİMİ ==================== */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-black text-white">SaaS Kullanıcı Hesapları ({users.length})</h3>
                <p className="text-xs text-slate-400">
                  Kişisel veri barındırmayan sıfır veri mimarili kullanıcı hesapları ve plan kontrolleri
                </p>
              </div>

              {/* Arama Barı */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Kullanıcı adı veya plan ara..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Kullanıcılar Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3">Kullanıcı Adı</th>
                    <th className="py-3 px-3">Mevcut Plan</th>
                    <th className="py-3 px-3">Kayıt Tarihi</th>
                    <th className="py-3 px-3">Güvenlik Sorusu</th>
                    <th className="py-3 px-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3 font-bold text-white flex items-center space-x-2">
                        <span className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center font-mono text-xs border border-indigo-800">
                          👤
                        </span>
                        <span>@{user.username}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <select
                          value={user.plan}
                          onChange={(e) => handlePlanChange(user.username, e.target.value as any)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${
                            user.plan === 'pro'
                              ? 'bg-amber-950/60 text-amber-300 border-amber-700'
                              : user.plan === 'lifetime'
                              ? 'bg-purple-950/60 text-purple-300 border-purple-700'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="free">Ücretsiz (Free)</option>
                          <option value="pro">👑 Pro (200 TL / Yıl)</option>
                          <option value="lifetime">🌟 VIP (Ömür Boyu)</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-3 text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate" title={user.securityQuestion}>
                        {user.securityQuestion}
                      </td>

                      <td className="py-3.5 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPasswordResetUser(user.username);
                            setNewPasswordInput('');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-950/60 text-indigo-300 border border-indigo-800 hover:bg-indigo-900 text-[11px] font-bold cursor-pointer"
                          title="Yönetici Şifre Sıfırlama"
                        >
                          Şifre Sıfırla
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.username)}
                          className="px-2.5 py-1 rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800 hover:bg-rose-900 text-[11px] font-bold cursor-pointer"
                          title="Kullanıcıyı Sil"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: VİDEO & FİLM CMS ==================== */}
        {activeTab === 'videos' && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-sm font-black text-white">Film & YouTube Video Dersi CMS ({videos.length})</h3>
                <p className="text-xs text-slate-400">
                  Öğrencilerin film stüdyosunda çalıştığı YouTube videolarını, İngilizce özetlerini ve diyaloglarını yönetin.
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer shadow-sm flex items-center space-x-1.5 shrink-0"
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
                  className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-20 h-14 object-cover rounded-xl border border-slate-700 shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="flex items-center space-x-2">
                          <span className="px-1.5 py-0.2 rounded font-black text-[9px] bg-red-950 text-red-300 border border-red-800">
                            {vid.category}
                          </span>
                          <span className="px-1.5 py-0.2 rounded font-black text-[9px] bg-slate-700 text-slate-200">
                            {vid.level}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-white truncate mt-1">{vid.title}</h4>
                        <p className="text-[10px] text-slate-400">
                          {vid.channel} • {vid.duration} • ID: <code className="text-indigo-400">{vid.youtubeId}</code>
                        </p>
                      </div>
                    </div>

                    {vid.englishSummary && (
                      <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        🇬🇧 {vid.englishSummary}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                    <span className="text-[10px] text-slate-400 font-bold">
                      {vid.subtitles.length} Sahne Diyaloğu
                    </span>

                    <div className="flex items-center space-x-1.5">
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
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">30 Günlük Konuşma Kampı Müfredatı</h3>
              <p className="text-xs text-slate-400">
                Öğrencilerin gün gün ilerlediği akıcı konuşma görevleri ve gramer temaları
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { day: 1, title: 'Kendini Tanıtma & Buz Kırma', level: 'A1', focus: 'to be, my name is...' },
                { day: 2, title: 'Günlük Rutinler & Zaman', level: 'A1', focus: 'Present Simple, wake up, usually' },
                { day: 3, title: 'Kafe & Sipariş Verme', level: 'A2', focus: 'Could I have, Would you like' },
                { day: 4, title: 'Yol Tarifi & Şehir Rehberi', level: 'A2', focus: 'Turn left, go straight, near' },
                { day: 5, title: 'Havaalanı & Pasaport Kontrolü', level: 'B1', focus: 'Checking in, boarding pass' },
                { day: 6, title: 'İş Görüşmesi & Kariyer', level: 'B1', focus: 'Strengths, experience, achieved' },
                { day: 7, title: 'Haftalık Konuşma Mezuniyeti', level: 'B1', focus: 'Canlı Yapay Zekâ Sözlü Değerlendirmesi' }
              ].map((item) => (
                <div key={item.day} className="p-4 rounded-2xl bg-slate-850 border border-slate-700 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-400">Gün #{item.day}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-700 text-slate-300">{item.level}</span>
                  </div>
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400 font-mono">Odak: {item.focus}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: SİSTEM & YEDEKLEME ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* PIN Değiştirme */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Key className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-black text-white">Yönetici Giriş PIN'ini Değiştir</h3>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="password"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="Yeni PIN giriniz (en az 4 karakter)..."
                  className="w-full sm:w-80 px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer"
                >
                  PIN'i Güncelle
                </button>
              </div>
            </div>

            {/* Veritabanı Yedekleme & Geri Yükleme */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <Download className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white">Veritabanı Yedekleme & Kurtarma (JSON)</h3>
              </div>

              <p className="text-xs text-slate-400">
                Tüm kayıtlı kullanıcı hesaplarını, özel eklenen video derslerini, kelime defterlerini ve abonelik durumlarını tek tıkla dışa aktarabilir veya başka bir cihaza yükleyebilirsiniz.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer shadow-sm inline-flex items-center space-x-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Veritabanını Dışa Aktar (JSON İndir)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-black text-xs cursor-pointer inline-flex items-center space-x-1.5"
                >
                  <Upload className="w-4 h-4" />
                  <span>Yedekten Geri Yükle (JSON Yükle)</span>
                </button>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ==================== MODAL: ŞİFRE SIFIRLAMA ==================== */}
      {passwordResetUser && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500"
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
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer"
              >
                Şifreyi Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: VİDEO EKLE / DÜZENLE ==================== */}
      {isAddVideoOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl my-8">
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

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Ders Başlığı:</label>
                <input
                  type="text"
                  value={videoForm.title}
                  onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                  placeholder="örn: Dead Poets Society - Carpe Diem"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Kanal / Kaynak:</label>
                  <input
                    type="text"
                    value={videoForm.channel}
                    onChange={(e) => setVideoForm({ ...videoForm, channel: e.target.value })}
                    placeholder="örn: Touchstone Pictures"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Kategori:</label>
                  <select
                    value={videoForm.category}
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="Film">Film & Dizi</option>
                    <option value="TED">TED Konuşmaları</option>
                    <option value="Haber">Haber & Belgesel</option>
                    <option value="İş & Kariyer">İş & Kariyer</option>
                    <option value="Müzik">Müzik</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">CEFR Seviyesi:</label>
                  <select
                    value={videoForm.level}
                    onChange={(e) => setVideoForm({ ...videoForm, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white cursor-pointer"
                  >
                    <option value="A1">A1 - Başlangıç</option>
                    <option value="A2">A2 - Temel</option>
                    <option value="B1">B1 - Orta</option>
                    <option value="B2">B2 - İleri Orta</option>
                    <option value="C1">C1 - İleri</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">İngilizce Sahne Özeti (English Summary):</label>
                <textarea
                  rows={2}
                  value={videoForm.englishSummary}
                  onChange={(e) => setVideoForm({ ...videoForm, englishSummary: e.target.value })}
                  placeholder="İngilizce özet metnini buraya yazınız..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Türkçe Konu Açıklaması:</label>
                <textarea
                  rows={2}
                  value={videoForm.turkishSummary}
                  onChange={(e) => setVideoForm({ ...videoForm, turkishSummary: e.target.value })}
                  placeholder="Türkçe sahne açıklamasını yazınız..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAddVideoOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveVideo}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs cursor-pointer"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: JSON YEDEK YÜKLE ==================== */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white">JSON Veritabanı Yedeği Yükle</h3>
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Daha önce dışa aktarılan JSON yedek metnini buraya yapıştırınız..."
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white font-mono"
            />

            <div className="flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleImportBackup}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs cursor-pointer"
              >
                Veritabanına Geri Yükle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
export default AdminDashboard;
