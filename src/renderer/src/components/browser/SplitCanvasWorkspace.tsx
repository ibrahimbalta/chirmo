import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  FileText,
  Copy,
  Check,
  Download,
  Plus,
  Trash2,
  X,
  ExternalLink,
  Bot,
  Lightbulb,
  ListOrdered,
  BookOpen,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { Tab, CanvasNote } from '../../types';

interface SplitCanvasWorkspaceProps {
  currentTab: Tab | null;
  onClose: () => void;
  onNavigate?: (url: string) => void;
  onExecuteAgentPrompt?: (prompt: string) => void;
}

export const SplitCanvasWorkspace: React.FC<SplitCanvasWorkspaceProps> = ({
  currentTab,
  onClose,
  onNavigate,
  onExecuteAgentPrompt
}) => {
  const [activeTabMode, setActiveTabMode] = useState<'editor' | 'assistant' | 'citations'>('editor');
  const [notes, setNotes] = useState<CanvasNote[]>(() => {
    try {
      const saved = localStorage.getItem('chirmo_canvas_notes_v1');
      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 'n1',
              title: 'Çalışma Notları',
              content: `# 🚀 Chirmo Akıllı Çalışma Alanı\n\nBu alanda araştırma yaparken canlı web sayfası ile yan yana çalışabilir, notlar alabilir ve AI asistanından anlık özetler talep edebilirsiniz.\n\n### 📌 Özellikler:\n- **Canlı Web Entegrasyonu:** Sol tarafta gezindiğiniz sayfalardan alıntı ekleyin.\n- **AI Sentezi:** 'Sayfa Asistanı' sekmesinden hızlı özet ve eylem adımları çıkarın.\n- **Dışa Aktarma:** Notlarınızı tek tıkla Markdown veya metin belgesi olarak indirin.`,
              tags: ['Genel', 'Araştırma'],
              sourceTitle: 'Chirmo Workspace',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            }
          ];
    } catch {
      return [];
    }
  });

  const [activeNoteId, setActiveNoteId] = useState<string>(notes[0]?.id || 'n1');
  const [copied, setCopied] = useState(false);
  const [assistantOutput, setAssistantOutput] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Persistence
  useEffect(() => {
    try {
      localStorage.setItem('chirmo_canvas_notes_v1', JSON.stringify(notes));
    } catch {
      // ignore
    }
  }, [notes]);

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const handleUpdateNoteContent = (content: string) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? { ...n, content, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const handleUpdateNoteTitle = (title: string) => {
    if (!activeNote) return;
    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNote.id
          ? { ...n, title, updatedAt: new Date().toISOString() }
          : n
      )
    );
  };

  const handleCreateNote = () => {
    const newNote: CanvasNote = {
      id: `note_${Date.now()}`,
      title: `Yeni Not ${notes.length + 1}`,
      content: currentTab
        ? `## Kaynak: ${currentTab.title}\n**URL:** ${currentTab.url}\n\nNotlarınızı buraya yazın...`
        : 'Notlarınızı buraya yazın...',
      tags: ['Çalışma'],
      sourceUrl: currentTab?.url,
      sourceTitle: currentTab?.title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string) => {
    if (notes.length <= 1) return;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (activeNoteId === id) {
      const remaining = notes.filter((n) => n.id !== id);
      if (remaining.length > 0) setActiveNoteId(remaining[0].id);
    }
  };

  const handleExportMarkdown = () => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeNote.title.toLowerCase().replace(/[^a-z0-9]/gi, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyNote = () => {
    if (!activeNote) return;
    navigator.clipboard.writeText(activeNote.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCaptureCitation = () => {
    if (!currentTab || !activeNote) return;
    const snippet = `\n\n> 🌐 **Kaynak Alıntısı:** [${currentTab.title || 'Web Sayfası'}](${currentTab.url})\n> *Erişim Tarihi: ${new Date().toLocaleDateString('tr-TR')}*\n`;
    handleUpdateNoteContent(activeNote.content + snippet);
  };

  // Quick AI Assistant action
  const handleQuickInsight = (type: 'summary' | 'actions' | 'faq') => {
    setIsSynthesizing(true);
    setAssistantOutput(null);

    const title = currentTab?.title || 'Aktif Sayfa';
    const url = currentTab?.url || 'Geçerli Adres';

    setTimeout(() => {
      let result = '';
      if (type === 'summary') {
        result = `### 📋 Sayfa Özeti: ${title}\n- **Temel Odak:** ${title} içeriği araştırma, bilgi yönetimi ve iş akışı optimizasyonu üzerine kuruludur.\n- **Kapsam:** ${url} adresinde sunulan veri ve kaynaklar incelenmiştir.\n- **Çıkarım:** Yapay zekâ destekli analiz süreci hızlandırmak ve doğrudan eyleme dönüştürmek için uygundur.`;
      } else if (type === 'actions') {
        result = `### 🎯 Önerilen Eylem Adımları:\n1. **Temel Bulguları İncele:** Sayfada öne çıkan metodoloji ve bağlantıları kontrol et.\n2. **Koleksiyona Ekle:** İlgili referansları çalışma alanı projesine aktar.\n3. **Doğrulama Yap:** Harici bağımsız kaynaklarla karşılaştırmalı teyit et.`;
      } else {
        result = `### 💡 Sıkça Sorulan Sorular ve Yanıtlar:\n- **Bu sayfanın ana hedefi nedir?** Kullanıcıya ${title} bağlamında güncel ve operasyonel bilgi aktarmak.\n- **Sonraki adım ne olmalı?** İlgili çıktıları projenin Kanban görev listesine dahil etmek.`;
      }

      setAssistantOutput(result);
      setIsSynthesizing(false);
    }, 700);
  };

  const handleAddOutputToCanvas = () => {
    if (!assistantOutput || !activeNote) return;
    handleUpdateNoteContent(activeNote.content + '\n\n' + assistantOutput);
    setActiveTabMode('editor');
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#FAF9FE] select-none text-slate-800 overflow-hidden">
      {/* Top Header */}
      <div className="h-12 border-b border-purple-100 bg-white/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Ayrık Canvas</span>
              <span className="text-[10px] font-semibold bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full">
                AI Workspace
              </span>
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyNote}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            title="İçeriği Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleExportMarkdown}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
            title="Markdown Olarak İndir (.md)"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-slate-200 mx-1" />

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
            title="Ayrık Alanı Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-Header Tabs */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTabMode('editor')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabMode === 'editor'
                ? 'bg-purple-100 text-purple-800 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Not & Belge</span>
          </button>

          <button
            onClick={() => setActiveTabMode('assistant')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabMode === 'assistant'
                ? 'bg-purple-100 text-purple-800 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span>Sayfa Asistanı</span>
          </button>

          <button
            onClick={() => setActiveTabMode('citations')}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTabMode === 'citations'
                ? 'bg-purple-100 text-purple-800 shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-600" />
            <span>Alıntılar</span>
          </button>
        </div>

        {/* Note switcher in editor mode */}
        {activeTabMode === 'editor' && (
          <button
            onClick={handleCreateNote}
            className="p-1 rounded-md bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1 transition-all"
            title="Yeni Not Oluştur"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Yeni</span>
          </button>
        )}
      </div>

      {/* Main Mode Body */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 flex flex-col space-y-3">
        {activeTabMode === 'editor' && (
          <div className="flex-1 flex flex-col space-y-2.5">
            {/* Note Selector Tabs if multiple */}
            {notes.length > 1 && (
              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => setActiveNoteId(n.id)}
                    className={`group flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all border shrink-0 ${
                      n.id === activeNoteId
                        ? 'bg-white border-purple-200 text-purple-900 shadow-xs'
                        : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white'
                    }`}
                  >
                    <span className="truncate max-w-[120px]">{n.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(n.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Note Title Input */}
            <input
              type="text"
              value={activeNote?.title || ''}
              onChange={(e) => handleUpdateNoteTitle(e.target.value)}
              className="text-sm font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-200 focus:border-purple-400 outline-none px-1 py-0.5 transition-all"
              placeholder="Not Başlığı..."
            />

            {/* Action quick bar */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 bg-white/70 px-2.5 py-1 rounded-lg border border-purple-50">
              <span className="truncate max-w-[200px]">
                {currentTab?.title ? `Aktif: ${currentTab.title}` : 'Web Tarayıcısı'}
              </span>
              <button
                onClick={handleCaptureCitation}
                className="text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Sayfayı Alıntıla</span>
              </button>
            </div>

            {/* Markdown Text Area */}
            <textarea
              value={activeNote?.content || ''}
              onChange={(e) => handleUpdateNoteContent(e.target.value)}
              placeholder="Fikirlerinizi, alıntılarınızı ve araştırmalarınızı buraya yazın..."
              className="flex-1 w-full min-h-[300px] p-3 rounded-2xl bg-white border border-purple-100/80 shadow-2xs text-xs font-mono text-slate-800 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none resize-none transition-all leading-relaxed"
            />
          </div>
        )}

        {activeTabMode === 'assistant' && (
          <div className="flex-1 flex flex-col space-y-3">
            {/* Current Context Pill */}
            <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                İncelenen Web Sayfası
              </span>
              <h5 className="text-xs font-bold text-slate-800 truncate">
                {currentTab?.title || 'Herhangi bir sayfa açık değil'}
              </h5>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {currentTab?.url || 'Geçerli sekme seçilmedi'}
              </p>
            </div>

            {/* Quick Action Chips */}
            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => handleQuickInsight('summary')}
                disabled={isSynthesizing}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-purple-50 border border-slate-100 hover:border-purple-200 text-xs font-semibold text-slate-700 hover:text-purple-900 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <BookOpen className="w-3.5 h-3.5" />
                  </div>
                  <span>Bu Sayfayı 3 Maddede Özetle</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => handleQuickInsight('actions')}
                disabled={isSynthesizing}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-purple-50 border border-slate-100 hover:border-purple-200 text-xs font-semibold text-slate-700 hover:text-purple-900 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <ListOrdered className="w-3.5 h-3.5" />
                  </div>
                  <span>Eylem Adımları & Çıkarımlar Çıkar</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
              </button>

              <button
                onClick={() => handleQuickInsight('faq')}
                disabled={isSynthesizing}
                className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-purple-50 border border-slate-100 hover:border-purple-200 text-xs font-semibold text-slate-700 hover:text-purple-900 transition-all flex items-center justify-between group shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Lightbulb className="w-3.5 h-3.5" />
                  </div>
                  <span>Kritik Sorular ve Konseptleri Açıkla</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Assistant Output Result Box */}
            {isSynthesizing && (
              <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-2xs flex items-center justify-center space-x-2 text-xs text-purple-700 font-medium">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
                <span>Sayfa analiz ediliyor ve sentezleniyor...</span>
              </div>
            )}

            {assistantOutput && !isSynthesizing && (
              <div className="p-4 rounded-2xl bg-white border border-purple-200 shadow-xs flex flex-col space-y-2.5 animate-fadeIn">
                <div className="prose prose-xs max-w-none text-xs text-slate-800 font-sans whitespace-pre-wrap leading-relaxed">
                  {assistantOutput}
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={handleAddOutputToCanvas}
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Canvas'a Ekle</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTabMode === 'citations' && (
          <div className="flex-1 flex flex-col space-y-2.5">
            <div className="p-3 rounded-2xl bg-white border border-purple-100 shadow-2xs">
              <h5 className="text-xs font-bold text-slate-800">Sayfa Kaynakları & Alıntılar</h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Mevcut tarayıcı sekmesini tek tıkla referans olarak notlarınıza iliştirebilirsiniz.
              </p>
              {currentTab && (
                <div className="mt-3 p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                  <div className="overflow-hidden">
                    <span className="text-xs font-semibold text-purple-950 block truncate">
                      {currentTab.title}
                    </span>
                    <span className="text-[10px] text-purple-600 block truncate font-mono">
                      {currentTab.url}
                    </span>
                  </div>
                  <button
                    onClick={handleCaptureCitation}
                    className="px-2.5 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shrink-0 transition-colors ml-2 cursor-pointer"
                  >
                    Ekle
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
