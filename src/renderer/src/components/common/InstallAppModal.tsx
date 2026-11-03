import React, { useState, useEffect } from 'react';
import {
  Download,
  Smartphone,
  Share2,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  QrCode,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ isOpen, onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'android' | 'ios' | 'desktop'>('android');

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Uygulama standalone modda mı açılmış (zaten yüklü mü)?
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallSuccess(true);
      }
      setDeferredPrompt(null);
    } else {
      // Eğer tarayıcı otomatik promptu engellediyse platform kılavuzunu aç
      setActivePlatform('android');
    }
  };

  const currentAppUrl = typeof window !== 'undefined' ? window.location.href : 'https://ibrahimbalta.github.io/chirmo/';
  // Quick QR code API via qrserver
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(currentAppUrl)}&color=2563eb`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        {/* Üst Başlık */}
        <div className="p-5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Resmi Mobil Uygulama & PWA</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            Chirmo'yu Telefonuna İndir 📲
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Google Play veya App Store beklemeden; tek tıkla tam ekran, reklamsız ve hızlıca yükle!
          </p>
        </div>

        {/* İçerik */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Hızlı Yükle Butonu (PWA Prompt Destekleniyorsa) */}
          {deferredPrompt && !installSuccess && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-center space-y-3">
              <div className="text-xs font-black text-amber-800 dark:text-amber-300">
                🚀 Tarayıcınız Doğrudan Yüklemeyi Destekliyor!
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm shadow-lg flex items-center justify-center space-x-2 cursor-pointer transition-transform hover:scale-102"
              >
                <Download className="w-4 h-4" />
                <span>Tek Tıkla Uygulamayı Yükle</span>
              </button>
            </div>
          )}

          {installSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 text-center text-emerald-800 dark:text-emerald-300 text-xs font-black flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Tebrikler! Chirmo ana ekranınıza eklendi.</span>
            </div>
          )}

          {/* Platform Seçimi Sekmeleri */}
          <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1">
            <button
              onClick={() => setActivePlatform('android')}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activePlatform === 'android'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🤖 Android (APK / WebAPK)
            </button>
            <button
              onClick={() => setActivePlatform('ios')}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activePlatform === 'ios'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              🍎 iPhone / iPad (iOS)
            </button>
            <button
              onClick={() => setActivePlatform('desktop')}
              className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                activePlatform === 'desktop'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              💻 Bilgisayar (PC / Mac)
            </button>
          </div>

          {/* Platform Detayları */}
          {activePlatform === 'android' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Chrome / Samsung Browser'da Açın</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-7">
                  Tarayıcınızın sağ üstündeki <strong>üç noktaya (⋮)</strong> dokunun.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>"Uygulamayı Yükle" veya "Ana Ekrana Ekle"</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-7">
                  Seçeneğine dokunun. Android sistemi Chirmo'yu otomatik olarak bir <strong>APK / WebAPK</strong> gibi paketleyip ana ekranınıza yerleştirir.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900 text-blue-800 dark:text-blue-300 flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 shrink-0 text-blue-600" />
                <span className="text-[11px] leading-relaxed">
                  <strong>PWA / WebAPK Avantajı:</strong> Bilinmeyen kaynak izinleriyle uğraşmazsınız, virüs riski taşımaz, hafızada yer kaplamaz ve tam ekran yerel bir uygulama gibi çalışır.
                </span>
              </div>
            </div>
          )}

          {activePlatform === 'ios' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>Safari'de Açın ve Paylaş'a Dokunun</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-7">
                  Safari ekranının altındaki <strong>Paylaş <Share2 className="w-3.5 h-3.5 inline mx-1" /></strong> (yukarı oklu kutucuk) simgesine basın.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="font-black text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>"Ana Ekrana Ekle" Seçeneğini Seçin</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 pl-7">
                  Açılan menüyü aşağı kaydırıp <strong>"Ana Ekrana Ekle (Add to Home Screen)"</strong> butonuna ve ardından <strong>"Ekle"</strong>ye basın.
                </p>
              </div>
            </div>
          )}

          {activePlatform === 'desktop' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Chrome, Edge veya Brave tarayıcınızın adres çubuğunun sağ tarafındaki <strong>"Uygulamayı Yükle" (küçük bilgisayar/artı simgesi)</strong> butonuna basarak masaüstü uygulaması olarak kurabilirsiniz.
              </p>
            </div>
          )}

          {/* QR Kod ile Telefona Açma */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">
              <img
                src={qrCodeUrl}
                alt="Chirmo Telefon QR Kodu"
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="space-y-1">
              <div className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center justify-center sm:justify-start space-x-1.5">
                <QrCode className="w-4 h-4 text-blue-600" />
                <span>Telefon Kamerasıyla Tarat</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Telefonunuzun kamerasını bu koda tutarak doğrudan mobil uygulamayı açabilir ve ana ekranınıza indirebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {/* Alt Kapat / Tamam Butonu */}
        <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-black text-xs cursor-pointer transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
