import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  X, 
  Lock, 
  AlertTriangle, 
  Search, 
  Copy, 
  Check, 
  Home,
  Bookmark
} from 'lucide-react';
import { Tab } from '../../types';

interface AddressBarProps {
  activeTab: Tab | null;
  onNavigate: (url: string) => void;
  onGoBack: () => void;
  onGoForward: () => void;
  onReload: () => void;
  onStop: () => void;
  onGoHome: () => void;
}

export const AddressBar: React.FC<AddressBarProps> = ({
  activeTab,
  onNavigate,
  onGoBack,
  onGoForward,
  onReload,
  onStop,
  onGoHome,
}) => {
  const [inputValue, setInputValue] = useState(activeTab?.url || '');
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (activeTab?.url) {
      setInputValue(activeTab.url);
    } else {
      setInputValue('');
    }
  }, [activeTab?.url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onNavigate(inputValue.trim());
    }
  };

  const handleCopy = () => {
    if (activeTab?.url) {
      navigator.clipboard.writeText(activeTab.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-11 bg-chirmo-bg border-b border-chirmo-border flex items-center px-3 gap-2 select-none z-10">
      {/* Navigation Controls */}
      <div className="flex items-center gap-0.5 text-chirmo-text">
        <button
          onClick={onGoBack}
          disabled={!activeTab?.canGoBack}
          className={`p-1.5 rounded-md transition-colors ${
            activeTab?.canGoBack
              ? 'hover:bg-chirmo-secondary text-chirmo-text'
              : 'text-chirmo-text-muted/50 cursor-not-allowed'
          }`}
          title="Geri (Alt + Sol)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={onGoForward}
          disabled={!activeTab?.canGoForward}
          className={`p-1.5 rounded-md transition-colors ${
            activeTab?.canGoForward
              ? 'hover:bg-chirmo-secondary text-chirmo-text'
              : 'text-chirmo-text-muted/50 cursor-not-allowed'
          }`}
          title="İleri (Alt + Sağ)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={activeTab?.isLoading ? onStop : onReload}
          className="p-1.5 rounded-md hover:bg-chirmo-secondary text-chirmo-text transition-colors"
          title={activeTab?.isLoading ? 'Durdur' : 'Yenile (Ctrl + R)'}
        >
          {activeTab?.isLoading ? (
            <X className="w-4 h-4 text-chirmo-error" />
          ) : (
            <RotateCw className="w-4 h-4" />
          )}
        </button>

        <button
          onClick={onGoHome}
          className="p-1.5 rounded-md hover:bg-chirmo-secondary text-chirmo-text-secondary hover:text-chirmo-text transition-colors"
          title="Ana Sayfaya Git"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* URL / Search Input Form */}
      <form onSubmit={handleSubmit} className="flex-1 flex items-center">
        <div className="w-full flex items-center bg-chirmo-secondary border border-chirmo-border focus-within:border-chirmo-brand focus-within:ring-2 focus-within:ring-chirmo-brand/10 rounded-full px-3 py-1 transition-all">
          {/* Security / Search Indicator */}
          <div className="shrink-0 mr-2 flex items-center">
            {activeTab?.isSecure ? (
              <span title="Güvenli Bağlantı (HTTPS)">
                <Lock className="w-3.5 h-3.5 text-chirmo-success" />
              </span>
            ) : activeTab?.url && !activeTab.url.startsWith('about:') ? (
              <span title="Güvenli Olmayan Bağlantı (HTTP)">
                <AlertTriangle className="w-3.5 h-3.5 text-chirmo-warning" />
              </span>
            ) : (
              <Search className="w-3.5 h-3.5 text-chirmo-text-muted" />
            )}
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Google'da arayın veya bir web adresi yazın..."
            className="w-full bg-transparent text-xs text-chirmo-text focus:outline-none placeholder:text-chirmo-text-muted/70 font-sans"
          />

          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="p-0.5 text-chirmo-text-muted hover:text-chirmo-text ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </form>

      {/* Action Utilities */}
      <div className="flex items-center gap-1 text-chirmo-text-secondary">
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-1.5 rounded-md hover:bg-chirmo-secondary transition-colors ${
            isBookmarked ? 'text-chirmo-warning fill-chirmo-warning' : 'hover:text-chirmo-text'
          }`}
          title={isBookmarked ? 'Yer İmlerinden Çıkar' : 'Yer İmlerine Ekle'}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-chirmo-secondary hover:text-chirmo-text transition-colors"
          title="Bağlantıyı Kopyala"
        >
          {copied ? (
            <Check className="w-4 h-4 text-chirmo-success" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
