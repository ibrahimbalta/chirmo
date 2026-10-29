import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Search, 
  Home, 
  ShieldCheck, 
  Trash2, 
  Info, 
  Save, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { AppSettings } from '../../types';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    defaultSearchEngine: 'google',
    homePage: 'https://www.google.com',
    theme: 'light',
    clearCookiesOnExit: false,
    enableAdBlocker: false,
    telemetry: false,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    window.chirmo?.getSettings().then((loaded) => {
      if (loaded) setSettings(loaded);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (window.chirmo) {
      await window.chirmo.saveSettings(settings);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2500);
    }
  };

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      setIsClearing(false);
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 2500);
    }, 800);
  };

  return (
    <div className="flex-1 bg-chirmo-secondary overflow-y-auto p-8 select-none">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-chirmo-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-chirmo-brand text-white shadow-sm shadow-chirmo-brand/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chirmo-text">Ayarlar</h1>
              <p className="text-xs text-chirmo-text-secondary">
                Tarayıcı tercihleri, arama motoru ve güvenlik yapılandırması
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-medium rounded-lg shadow-sm transition-all"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Kaydedildi' : 'Kaydet'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Arama Motoru ve Ana Sayfa */}
          <div className="bg-chirmo-bg rounded-xl border border-chirmo-border p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-chirmo-text flex items-center gap-2">
              <Search className="w-4 h-4 text-chirmo-brand" />
              Arama ve Başlangıç
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Varsayılan Arama Motoru
                </label>
                <p className="text-[11px] text-chirmo-text-secondary mb-2">
                  Adres çubuğuna doğrudan yazılan arama sorgularının yönlendirileceği motor.
                </p>
                <select
                  value={settings.defaultSearchEngine}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultSearchEngine: e.target.value as any })
                  }
                  className="w-full max-w-xs px-3 py-1.5 bg-chirmo-secondary border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                >
                  <option value="google">Google (Önerilen)</option>
                  <option value="duckduckgo">DuckDuckGo</option>
                  <option value="bing">Microsoft Bing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Varsayılan Ana Sayfa URL'si
                </label>
                <p className="text-[11px] text-chirmo-text-secondary mb-2">
                  Yeni sekmeler veya Ana Sayfa butonu tıklandığında açılacak adres.
                </p>
                <input
                  type="text"
                  value={settings.homePage}
                  onChange={(e) => setSettings({ ...settings, homePage: e.target.value })}
                  placeholder="https://www.google.com"
                  className="w-full max-w-md px-3 py-1.5 bg-chirmo-secondary border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                />
              </div>
            </div>
          </div>

          {/* Güvenlik ve Gizlilik */}
          <div className="bg-chirmo-bg rounded-xl border border-chirmo-border p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-semibold text-chirmo-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-chirmo-brand" />
              Güvenlik ve İzolasyon
            </h2>

            <div className="space-y-3">
              <div className="flex items-start justify-between py-2 border-b border-chirmo-border/60">
                <div>
                  <span className="text-xs font-medium text-chirmo-text block">
                    Context Isolation ve Sandbox Koruması
                  </span>
                  <span className="text-[11px] text-chirmo-text-secondary">
                    Web içeriklerinin işletim sistemi komutlarına erişmesini kesin olarak engeller.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-chirmo-success/10 text-chirmo-success rounded-md text-[11px] font-semibold">
                  <Lock className="w-3 h-3" />
                  Aktif (Zorunlu)
                </div>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-chirmo-border/60">
                <div>
                  <span className="text-xs font-medium text-chirmo-text block">
                    Çıkışta Çerezleri ve Geçici Verileri Temizle
                  </span>
                  <span className="text-[11px] text-chirmo-text-secondary">
                    Uygulama kapatıldığında oturum çerezlerini siler.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.clearCookiesOnExit}
                  onChange={(e) =>
                    setSettings({ ...settings, clearCookiesOnExit: e.target.checked })
                  }
                  className="w-4 h-4 text-chirmo-brand rounded border-chirmo-border focus:ring-chirmo-brand"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  <span className="text-xs font-medium text-chirmo-text block">
                    Tarayıcı Önbelleğini Temizle
                  </span>
                  <span className="text-[11px] text-chirmo-text-secondary">
                    İndirilen web sayfası önbelleğini ve geçici dosyaları temizler.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearCache}
                  disabled={isClearing}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-chirmo-border hover:bg-chirmo-secondary text-chirmo-text rounded-lg text-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-chirmo-error" />
                  {isClearing ? 'Temizleniyor...' : clearedNotice ? 'Temizlendi ✓' : 'Önbelleği Temizle'}
                </button>
              </div>
            </div>
          </div>

          {/* Sistem ve Sürüm Bilgisi */}
          <div className="bg-chirmo-bg rounded-xl border border-chirmo-border p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-semibold text-chirmo-text flex items-center gap-2">
              <Info className="w-4 h-4 text-chirmo-brand" />
              Chirmo Hakkında
            </h2>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-chirmo-secondary rounded-lg">
                <span className="text-chirmo-text-secondary block text-[10px]">Uygulama Sürümü</span>
                <span className="font-semibold text-chirmo-text font-mono">Chirmo v0.1.0 (Windows x64)</span>
              </div>
              <div className="p-3 bg-chirmo-secondary rounded-lg">
                <span className="text-chirmo-text-secondary block text-[10px]">Görünüm Çekirdeği</span>
                <span className="font-semibold text-chirmo-text font-mono">Electron WebContentsView</span>
              </div>
            </div>

            <p className="text-[11px] text-chirmo-text-secondary leading-relaxed pt-1">
              Chirmo, gerçek web tarayıcısı özelliklerini yapay zekâ çalışma alanıyla birleştiren yeni nesil masaüstü platformudur.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
