import React, { useState } from 'react';
import { 
  Wrench, 
  Search, 
  ShieldCheck, 
  FileText, 
  Loader2, 
  CheckCircle2, 
  ExternalLink,
  Tag,
  BarChart2,
  Lock,
  Globe
} from 'lucide-react';
import { PageAnalysisResult, Tab } from '../../types';

interface ToolsViewProps {
  currentTab: Tab | null;
}

export const ToolsView: React.FC<ToolsViewProps> = ({ currentTab }) => {
  const [targetUrl, setTargetUrl] = useState(currentTab?.url || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<PageAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUrl.trim() || !window.chirmo) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const data = await window.chirmo.analyzePage(targetUrl.trim());
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Analiz sırasında bir hata oluştu.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUseCurrentTab = () => {
    if (currentTab?.url) {
      setTargetUrl(currentTab.url);
    }
  };

  return (
    <div className="flex-1 bg-chirmo-secondary overflow-y-auto p-8 select-none">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chirmo-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-chirmo-brand text-white shadow-sm shadow-chirmo-brand/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chirmo-text">Araçlar ve Web Analizörü</h1>
              <p className="text-xs text-chirmo-text-secondary">
                Web sayfalarının SEO etiketlerini, kelime frekansını, okunabilirliğini ve güvenlik durumunu inceleyin
              </p>
            </div>
          </div>
        </div>

        {/* Input Form Card */}
        <div className="bg-chirmo-bg rounded-2xl border border-chirmo-border p-6 shadow-xs space-y-4">
          <form onSubmit={handleAnalyze} className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-chirmo-text">
                İncelenecek Web Sayfası URL'si
              </label>
              {currentTab?.url && (
                <button
                  type="button"
                  onClick={handleUseCurrentTab}
                  className="text-[11px] text-chirmo-brand hover:underline font-medium flex items-center gap-1"
                >
                  <Globe className="w-3 h-3" />
                  <span>Aktif Sekmeyi Kullan ({currentTab.title?.slice(0, 25)}...)</span>
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1 relative flex items-center">
                <Search className="w-4 h-4 text-chirmo-text-muted absolute left-3" />
                <input
                  type="text"
                  required
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full pl-9 pr-3 py-2 bg-chirmo-secondary border border-chirmo-border rounded-xl text-xs text-chirmo-text focus:outline-none focus:border-chirmo-brand font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing || !targetUrl.trim()}
                className="flex items-center gap-2 px-5 py-2 bg-chirmo-brand hover:bg-chirmo-brand-hover disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-all shrink-0"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <BarChart2 className="w-4 h-4" />
                )}
                <span>{isAnalyzing ? 'Taranıyor...' : 'Sayfayı Analiz Et'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {error}
          </div>
        )}

        {/* Results Card */}
        {result && (
          <div className="space-y-4">
            {/* Metric Overview Grid */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-chirmo-bg border border-chirmo-border rounded-xl p-4 shadow-xs">
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                  Kelime Sayısı
                </span>
                <span className="text-xl font-bold text-chirmo-text font-mono mt-0.5 block">
                  ~{result.wordCount}
                </span>
                <span className="text-[10px] text-chirmo-text-secondary">Toplam metin hacmi</span>
              </div>

              <div className="bg-chirmo-bg border border-chirmo-border rounded-xl p-4 shadow-xs">
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                  Bağlantı Sayısı
                </span>
                <span className="text-xl font-bold text-chirmo-text font-mono mt-0.5 block">
                  {result.linksCount}
                </span>
                <span className="text-[10px] text-chirmo-text-secondary">Sayfa içi ve dışı linkler</span>
              </div>

              <div className="bg-chirmo-bg border border-chirmo-border rounded-xl p-4 shadow-xs">
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                  Güvenlik Durumu
                </span>
                <div className="flex items-center gap-1.5 mt-1 font-semibold text-xs">
                  {result.isHttps ? (
                    <span className="text-emerald-700 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-emerald-600" /> HTTPS Güvenli
                    </span>
                  ) : (
                    <span className="text-amber-700">HTTP (Şifrelenmemiş)</span>
                  )}
                </div>
                <span className="text-[10px] text-chirmo-text-secondary">SSL Sertifikası</span>
              </div>

              <div className="bg-chirmo-bg border border-chirmo-border rounded-xl p-4 shadow-xs">
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                  İçerik Yoğunluğu
                </span>
                <span className="text-xs font-semibold text-chirmo-text mt-1.5 block truncate">
                  {result.readabilityScore}
                </span>
                <span className="text-[10px] text-chirmo-text-secondary">Okunabilirlik seviyesi</span>
              </div>
            </div>

            {/* Deep Metadata & Keywords Panel */}
            <div className="bg-chirmo-bg rounded-2xl border border-chirmo-border p-6 shadow-xs space-y-5">
              <div>
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                  Sayfa Başlığı (Title)
                </span>
                <h3 className="text-sm font-bold text-chirmo-text mt-0.5">{result.title}</h3>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block">
                  Meta Açıklaması (Meta Description)
                </span>
                <p className="text-xs text-chirmo-text-secondary mt-0.5 bg-chirmo-secondary/50 p-3 rounded-lg border border-chirmo-border/60">
                  {result.metaDescription}
                </p>
              </div>

              {/* Keyword frequency cloud */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block mb-2 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-chirmo-brand" />
                  Öne Çıkan Anahtar Kelimeler (Frekans)
                </span>
                <div className="flex flex-wrap gap-2">
                  {result.topKeywords.map((k) => (
                    <div
                      key={k.word}
                      className="flex items-center gap-1.5 bg-chirmo-secondary border border-chirmo-border px-3 py-1 rounded-lg text-xs"
                    >
                      <span className="font-medium text-chirmo-text">{k.word}</span>
                      <span className="bg-chirmo-brand-light text-chirmo-brand text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                        {k.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Headings Structure */}
              {result.headings.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-semibold text-chirmo-text-muted block mb-2">
                    Sayfa Başlık Yapısı (H1 - H3)
                  </span>
                  <div className="space-y-1 bg-chirmo-secondary/30 p-3 rounded-xl border border-chirmo-border/60">
                    {result.headings.map((h, i) => (
                      <div key={i} className="text-xs text-chirmo-text flex items-center gap-2">
                        <span className="text-[10px] text-chirmo-text-muted font-mono">#{i + 1}</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
