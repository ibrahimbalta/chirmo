import React, { useState, useEffect } from 'react'
import {
  Settings,
  Search,
  ShieldCheck,
  Trash2,
  Info,
  Save,
  CheckCircle2,
  Lock,
  Download,
  Database
} from 'lucide-react'
import { AppSettings } from '../../types'
import { SearchEngineService } from '../../services/searchEngine'
import { WorkspaceStorage } from '../../services/workspaceStorage'

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    defaultSearchEngine: 'google',
    homePage: 'https://ibrahimbalta.github.io/chirmo/',
    theme: 'light',
    clearCookiesOnExit: false,
    enableAdBlocker: false,
    telemetry: false
  })

  const [isSaved, setIsSaved] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [clearedNotice, setClearedNotice] = useState(false)
  const [resetNotice, setResetNotice] = useState(false)

  useEffect(() => {
    window.chirmo?.getSettings().then((loaded) => {
      if (loaded) setSettings(loaded)
    })
  }, [])

  const handleSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (window.chirmo) {
      await window.chirmo.saveSettings(settings)
      setIsSaved(true)
      setTimeout(() => setIsSaved(false), 2500)
    }
  }

  const handleClearCache = (): void => {
    setIsClearing(true)
    SearchEngineService.clearCache()
    WorkspaceStorage.clearCacheOnly()
    setTimeout(() => {
      setIsClearing(false)
      setClearedNotice(true)
      setTimeout(() => setClearedNotice(false), 2500)
    }, 300)
  }

  const handleExportWorkspace = (): void => {
    const json = WorkspaceStorage.exportWorkspaceJSON()
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `chirmo-yedek-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleResetAllUserData = (): void => {
    if (
      !confirm(
        'Kaydedilen tüm aramalarınızı, favori kaynaklarınızı, görsel koleksiyonlarınızı ve araştırma geçmişinizi silmek istediğinizden emin misiniz?'
      )
    )
      return
    WorkspaceStorage.clearAllUserData()
    SearchEngineService.clearCache()
    setResetNotice(true)
    setTimeout(() => setResetNotice(false), 3000)
  }

  return (
    <div className="flex-1 bg-white overflow-y-auto p-4 sm:p-8 pb-20 md:pb-8 select-none">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Title */}
        <div className="flex items-center justify-between border-b border-chirmo-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-chirmo-brand text-white shadow-sm shadow-chirmo-brand/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chirmo-text">Ayarlar ve Veri Kontrolü</h1>
              <p className="text-xs text-chirmo-text-secondary">
                Arama motoru tercihleri, önbellek yönetimi, veri gizliliği ve güvenlik mimarisi
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaved ? 'Kaydedildi' : 'Kaydet'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Arama Motoru ve Ana Sayfa */}
          <div className="bg-chirmo-secondary/40 rounded-2xl border border-chirmo-border p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-chirmo-text flex items-center gap-2">
              <Search className="w-4 h-4 text-chirmo-brand" />
              Arama ve Başlangıç Tercihleri
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Varsayılan Dış Arama Yönlendirmesi
                </label>
                <p className="text-[11px] text-chirmo-text-secondary mb-2">
                  Harici web araması bağlantılarında kullanılacak arama sağlayıcısı.
                </p>
                <select
                  value={settings.defaultSearchEngine}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultSearchEngine: e.target.value as any })
                  }
                  className="w-full max-w-xs px-3 py-2 bg-white border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                >
                  <option value="google">Google (Önerilen)</option>
                  <option value="duckduckgo">DuckDuckGo</option>
                  <option value="bing">Microsoft Bing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-chirmo-text mb-1">
                  Varsayılan Başlangıç URL'si
                </label>
                <input
                  type="text"
                  value={settings.homePage}
                  onChange={(e) => setSettings({ ...settings, homePage: e.target.value })}
                  placeholder="https://ibrahimbalta.github.io/chirmo/"
                  className="w-full max-w-md px-3 py-2 bg-white border border-chirmo-border rounded-lg text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand"
                />
              </div>
            </div>
          </div>

          {/* Kişisel Veri ve Önbellek Kontrolü */}
          <div className="bg-chirmo-secondary/40 rounded-2xl border border-chirmo-border p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-chirmo-text flex items-center gap-2">
              <Database className="w-4 h-4 text-chirmo-brand" />
              Kişisel Çalışma Alanı ve Önbellek Yönetimi
            </h2>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-chirmo-border/60">
                <div>
                  <span className="text-xs font-semibold text-chirmo-text block">
                    Arama Önbelleğini (TTL Cache) Temizle
                  </span>
                  <span className="text-[11px] text-chirmo-text-secondary">
                    Hızlı yanıt için bellekte tutulan arama sonuçlarını temizler ve canlı API'lerden
                    yeniden çekilmesini sağlar.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearCache}
                  disabled={isClearing}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-chirmo-border hover:border-chirmo-brand text-chirmo-text rounded-lg text-xs font-semibold transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-chirmo-brand" />
                  {isClearing
                    ? 'Temizleniyor...'
                    : clearedNotice
                      ? 'Önbellek Temizlendi ✓'
                      : 'Önbelleği Temizle'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-b border-chirmo-border/60">
                <div>
                  <span className="text-xs font-semibold text-chirmo-text block">
                    Çalışma Alanı Verilerini Yedekle (JSON)
                  </span>
                  <span className="text-[11px] text-chirmo-text-secondary">
                    Kaydedilen aramalarınızı, favori kaynaklarınızı, karşılaştırmalarınızı ve görsel
                    koleksiyonlarınızı bilgisayarınıza indirir.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleExportWorkspace}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-chirmo-border hover:border-chirmo-brand text-chirmo-text rounded-lg text-xs font-semibold transition-colors shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-chirmo-brand" />
                  Verileri İndir
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2">
                <div>
                  <span className="text-xs font-semibold text-rose-700 block">
                    Tüm Kayıtlı Çalışma Alanı Verilerini Sıfırla
                  </span>
                  <span className="text-[11px] text-chirmo-text-secondary">
                    Tarayıcıda saklanan tüm kişisel koleksiyonları, geçmişi ve kayıtlı araştırmaları
                    kalıcı olarak siler.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetAllUserData}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition-colors shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {resetNotice ? 'Tüm Veriler Silindi ✓' : 'Tüm Verileri Sil'}
                </button>
              </div>
            </div>
          </div>

          {/* Güvenlik ve API Anahtarı Mimarisi */}
          <div className="bg-chirmo-secondary/40 rounded-2xl border border-chirmo-border p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-chirmo-text flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-chirmo-brand" />
              API Güvenliği ve İzolasyon Mimarisi
            </h2>

            <div className="space-y-3">
              <div className="flex items-start justify-between py-2 border-b border-chirmo-border/60">
                <div>
                  <span className="text-xs font-semibold text-chirmo-text block">
                    Sıfır Gömülü Gizli Anahtar (Zero Frontend Secret Policy)
                  </span>
                  <span className="text-[11px] text-chirmo-text-secondary">
                    Statik web yayınında (GitHub Pages) hiçbir gizli API anahtarı frontend kodunda
                    tutulmaz. Açık kaynaklı CORS uyumlu API'ler (Wikipedia, OpenAlex, Wikimedia
                    Commons, GitHub, HackerNews) doğrudan güvenli HTTPS üzerinden sorgulanır.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-chirmo-success/10 text-chirmo-success rounded-md text-[11px] font-semibold shrink-0 ml-3">
                  <Lock className="w-3 h-3" />
                  Doğrulandı
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-medium text-chirmo-text block">
                    Çıkışta Geçici Oturum Verilerini Temizle
                  </span>
                  <span className="text-[11px] text-chirmo-text-secondary">
                    Uygulama kapatıldığında geçici oturum verilerini siler.
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
            </div>
          </div>

          {/* Sistem ve Sürüm Bilgisi */}
          <div className="bg-chirmo-secondary/40 rounded-2xl border border-chirmo-border p-5 shadow-xs space-y-3">
            <h2 className="text-sm font-bold text-chirmo-text flex items-center gap-2">
              <Info className="w-4 h-4 text-chirmo-brand" />
              Chirmo Platform Bilgisi
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white border border-chirmo-border rounded-xl">
                <span className="text-chirmo-text-secondary block text-[10px]">Platform</span>
                <span className="font-semibold text-chirmo-text font-mono">
                  Chirmo AI Discovery v2.0
                </span>
              </div>
              <div className="p-3 bg-white border border-chirmo-border rounded-xl">
                <span className="text-chirmo-text-secondary block text-[10px]">
                  Açık Veri Sağlayıcıları
                </span>
                <span className="font-semibold text-chirmo-text">
                  Wikipedia, OpenAlex, Commons, GH
                </span>
              </div>
              <div className="p-3 bg-white border border-chirmo-border rounded-xl">
                <span className="text-chirmo-text-secondary block text-[10px]">
                  Güvenlik Politikası
                </span>
                <span className="font-semibold text-emerald-700">Safe Parser + HTTPS</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
