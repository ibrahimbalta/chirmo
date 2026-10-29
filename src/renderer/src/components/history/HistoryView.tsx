import React, { useState, useEffect } from 'react';
import { 
  History, 
  RotateCw, 
  FolderKanban, 
  CheckSquare, 
  Activity, 
  Search,
  Calendar
} from 'lucide-react';
import { HistoryEntry } from '../../types';

export const HistoryView: React.FC = () => {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    setIsLoading(true);
    if (window.chirmo) {
      const entries = await window.chirmo.getHistory();
      setHistory(entries);
    }
    setIsLoading(false);
  };

  const filtered = history.filter((h) => {
    const matchesType = filterType === 'all' || h.type === filterType;
    const matchesSearch =
      h.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.details.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <FolderKanban className="w-3.5 h-3.5 text-chirmo-brand" />;
      case 'task':
        return <CheckSquare className="w-3.5 h-3.5 text-chirmo-success" />;
      default:
        return <Activity className="w-3.5 h-3.5 text-chirmo-text-muted" />;
    }
  };

  return (
    <div className="flex-1 bg-chirmo-secondary overflow-y-auto p-4 sm:p-8 pb-20 md:pb-8 select-none">
      <div className="max-w-4xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-chirmo-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-chirmo-brand text-white shadow-sm shadow-chirmo-brand/30">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-chirmo-text">Görev ve İşlem Geçmişi</h1>
              <p className="text-xs text-chirmo-text-secondary">
                Projelerde, görevlerde ve tarayıcıda gerçekleştirilen tüm denetim günlükleri
              </p>
            </div>
          </div>

          <button
            onClick={loadHistory}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-chirmo-border hover:bg-chirmo-bg text-chirmo-text text-xs font-medium rounded-lg shadow-xs transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
        </div>

        {/* Filters & Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center bg-chirmo-bg border border-chirmo-border rounded-lg px-3 py-1.5 w-72 focus-within:border-chirmo-brand">
            <Search className="w-3.5 h-3.5 text-chirmo-text-muted mr-2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="İşlem geçmişinde ara..."
              className="bg-transparent text-xs text-chirmo-text focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'task', label: 'Görevler' },
              { id: 'project', label: 'Projeler' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterType === f.id
                    ? 'bg-chirmo-brand text-white shadow-xs'
                    : 'bg-chirmo-bg text-chirmo-text-secondary border border-chirmo-border hover:text-chirmo-text'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Log List */}
        <div className="bg-chirmo-bg border border-chirmo-border rounded-2xl p-4 divide-y divide-chirmo-border/60 shadow-xs">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-chirmo-text-secondary">
              <Calendar className="w-8 h-8 text-chirmo-text-muted mx-auto mb-2" />
              <p className="text-xs font-medium">Kayıtlı işlem geçmişi bulunamadı.</p>
            </div>
          ) : (
            filtered.map((entry) => (
              <div key={entry.id} className="py-3 flex items-start gap-3 first:pt-1 last:pb-1">
                <div className="p-2 rounded-lg bg-chirmo-secondary shrink-0 mt-0.5">
                  {getTypeIcon(entry.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-chirmo-text">
                      {entry.action}
                    </span>
                    <span className="text-[10px] text-chirmo-text-muted font-mono">
                      {new Date(entry.timestamp).toLocaleString('tr-TR')}
                    </span>
                  </div>

                  <p className="text-xs text-chirmo-text-secondary mt-0.5 leading-relaxed">
                    {entry.details}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
