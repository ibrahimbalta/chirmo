import React from 'react';
import { 
  FolderKanban, 
  Bot, 
  Wrench, 
  Workflow, 
  History, 
  Home, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ActiveNavMenu } from '../../types';

interface PlaceholderViewProps {
  view: ActiveNavMenu;
  onOpenBrowser: () => void;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ view, onOpenBrowser }) => {
  const getDetails = () => {
    switch (view) {
      case 'home':
        return {
          title: 'Chirmo Çalışma Alanı',
          subtitle: 'Gezin. Düşün. İşlerini Tamamla.',
          icon: <Home className="w-8 h-8 text-chirmo-brand" />,
          description: 'Chirmo, web tarayıcısı ile yapay zekâ destekli görev yönetimini bir araya getirir. Web üzerinde gezinmek veya araştırma yapmak için Tarayıcı sekmesini kullanabilirsiniz.',
          phase: 'Aşama 1 — Aktif',
          showBrowserCta: true,
        };
      case 'projects':
        return {
          title: 'Projeler ve Görev Yönetimi',
          subtitle: 'Projelerinizi, notlarınızı ve hedeflerinizi organize edin',
          icon: <FolderKanban className="w-8 h-8 text-chirmo-brand" />,
          description: 'Proje oluşturma, görev sıralama, not alma ve sonuçları saklama modülü Aşama 2 kapsamında aktif hale gelecektir.',
          phase: 'Aşama 2 Yol Haritası',
          showBrowserCta: false,
        };
      case 'agents':
        return {
          title: 'Yapay Zekâ Ajanları',
          subtitle: 'Planlama, araştırma ve otomasyon ajanları',
          icon: <Bot className="w-8 h-8 text-chirmo-brand" />,
          description: 'Web sitelerini inceleyen, bilgi toplayan ve onaylı görevleri icra eden AI Ajanları Aşama 3 kapsamında entegre edilecektir.',
          phase: 'Aşama 3 Yol Haritası',
          showBrowserCta: false,
        };
      case 'tools':
        return {
          title: 'Araçlar ve Entegrasyonlar',
          subtitle: 'Web araçları ve yardımcı eklentiler',
          icon: <Wrench className="w-8 h-8 text-chirmo-brand" />,
          description: 'Sayfa analiz araçları, veri ayıklama ve dış servis entegrasyonları Aşama 4-5 kapsamında sunulacaktır.',
          phase: 'Aşama 5 Yol Haritası',
          showBrowserCta: false,
        };
      case 'workflows':
        return {
          title: 'Otomasyon ve İş Akışları',
          subtitle: 'Tekrarlanan görevleri otomatikleştirin',
          icon: <Workflow className="w-8 h-8 text-chirmo-brand" />,
          description: 'Görsel iş akışı oluşturucu ve periyodik görev otomasyonları Aşama 5 kapsamında geliştirilecektir.',
          phase: 'Aşama 5 Yol Haritası',
          showBrowserCta: false,
        };
      case 'history':
        return {
          title: 'Görev ve İşlem Geçmişi',
          subtitle: 'Tamamlanan araştırmalar ve operasyon günlükleri',
          icon: <History className="w-8 h-8 text-chirmo-brand" />,
          description: 'Ajan işlemlerinin geçmiş kayıtları ve denetim logları Aşama 2-3 ile birlikte aktif olacaktır.',
          phase: 'Aşama 2 Yol Haritası',
          showBrowserCta: false,
        };
      default:
        return {
          title: 'Modül Hazırlanıyor',
          subtitle: '',
          icon: <Sparkles className="w-8 h-8 text-chirmo-brand" />,
          description: 'Bu özellik sonraki geliştirme aşamasında eklenecektir.',
          phase: 'Geliştirme Aşamasında',
          showBrowserCta: false,
        };
    }
  };

  const details = getDetails();

  return (
    <div className="flex-1 bg-chirmo-secondary flex items-center justify-center p-8 select-none">
      <div className="max-w-md w-full bg-chirmo-bg rounded-2xl border border-chirmo-border p-8 shadow-sm text-center">
        <div className="w-16 h-16 rounded-2xl bg-chirmo-brand-light flex items-center justify-center mx-auto mb-4">
          {details.icon}
        </div>

        <span className="inline-block text-[10px] font-semibold uppercase tracking-wider text-chirmo-brand bg-chirmo-brand-light px-2.5 py-1 rounded-full mb-3">
          {details.phase}
        </span>

        <h2 className="text-lg font-bold text-chirmo-text mb-1">{details.title}</h2>
        <p className="text-xs text-chirmo-text-secondary font-medium mb-3">{details.subtitle}</p>

        <p className="text-xs text-chirmo-text-secondary leading-relaxed mb-6">
          {details.description}
        </p>

        {details.showBrowserCta ? (
          <button
            onClick={onOpenBrowser}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-chirmo-brand hover:bg-chirmo-brand-hover text-white text-xs font-medium rounded-xl shadow-sm transition-all"
          >
            <span>Tarayıcıyı Aç</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onOpenBrowser}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-chirmo-border hover:bg-chirmo-secondary text-chirmo-text text-xs font-medium rounded-xl transition-all"
          >
            <span>Tarayıcı Görünümüne Dön</span>
          </button>
        )}
      </div>
    </div>
  );
};
