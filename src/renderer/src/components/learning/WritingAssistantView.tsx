import React, { useState, useEffect } from 'react';
import {
  PenTool,
  Sparkles,
  Check,
  Copy,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Layers
} from 'lucide-react';
import { CEFRLevel, WritingAnalysisResult } from '../../types';
import { LearningStorageService } from '../../services/learningStorage';

interface WritingAssistantViewProps {
  userLevel: CEFRLevel;
}

export const WritingAssistantView: React.FC<WritingAssistantViewProps> = ({ userLevel }) => {
  const [inputText, setInputText] = useState(
    'I am agree with your proposal. Please explain me the details because I look forward to hear from you. We have a lot of work to do and need to start tomorrow.'
  );
  const [selectedTone, setSelectedTone] = useState<'formal' | 'casual' | 'academic' | 'friendly'>('formal');
  const [analysis, setAnalysis] = useState<WritingAnalysisResult>(() =>
    LearningStorageService.analyzeWriting(
      'I am agree with your proposal. Please explain me the details because I look forward to hear from you. We have a lot of work to do and need to start tomorrow.',
      'formal'
    )
  );
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (inputText.trim()) {
      setAnalysis(LearningStorageService.analyzeWriting(inputText, selectedTone));
    }
  }, [inputText, selectedTone]);

  const handleApplyAll = () => {
    setInputText(analysis.improvedText);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(analysis.improvedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tones: Array<{ id: 'formal' | 'casual' | 'academic' | 'friendly'; label: string; icon: string }> = [
    { id: 'formal', label: 'Kurumsal & İş (Formal)', icon: '💼' },
    { id: 'academic', label: 'Akademik (Academic)', icon: '🎓' },
    { id: 'casual', label: 'Günlük (Casual)', icon: '💬' },
    { id: 'friendly', label: 'Samimi (Friendly)', icon: '🤝' }
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-y-auto">
      {/* Top Banner */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
              <PenTool className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Yazma Asistanı</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              İngilizce Yazma, Düzeltme & Zenginleştirme
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              İngilizce e-posta, mesaj veya metinlerinizi gramer ve kelime seviyesine göre mükemmelleştirin.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-xs text-slate-400 font-medium">Hedef Seviye:</span>
            <span className="px-3 py-1 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-bold text-xs">
              {userLevel}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full p-6 space-y-6">
        {/* Tone Selector */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 mr-2 shrink-0">Yazım Tonu:</span>
          {tones.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTone(t.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center space-x-1.5 shrink-0 ${
                selectedTone === t.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Editor Grid: Original vs Improved */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Text Area */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Sizin Yazdığınız Metin
              </span>
              <span className="text-[11px] text-slate-400">
                {inputText.trim().split(/\s+/).filter(Boolean).length} Kelime
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="İngilizce metninizi buraya yazın veya yapıştırın..."
              className="w-full h-64 p-3 text-sm rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setInputText('')}
                className="text-xs text-slate-400 hover:text-slate-600 flex items-center space-x-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>

              <button
                onClick={handleApplyAll}
                disabled={analysis.suggestions.length === 0}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center space-x-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tüm Önerileri Uygula ({analysis.suggestions.length})</span>
              </button>
            </div>
          </div>

          {/* Improved Output & Metrics */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Chirmo İyileştirilmiş Metin
                </span>
                <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {analysis.detectedLevel} Seviyesi
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-500">
                  Akıcılık Puanı: %{analysis.readabilityScore}
                </span>
              </div>
            </div>

            <div className="w-full h-64 p-4 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-sm text-slate-900 dark:text-slate-100 overflow-y-auto leading-relaxed select-text font-medium">
              {analysis.improvedText}
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all shadow-sm flex items-center space-x-1.5 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Suggestions breakdown */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Tespit Edilen Düzeltmeler ve Zenginleştirmeler ({analysis.suggestions.length})</span>
            </h3>
          </div>

          {analysis.suggestions.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 space-y-1">
              <Check className="w-8 h-8 text-emerald-500 mx-auto" />
              <p className="font-bold text-slate-700 dark:text-slate-300">Harika yazım!</p>
              <p>Metninizde herhangi bir gramer veya ton hatası tespit edilmedi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {analysis.suggestions.map((sug) => (
                <div
                  key={sug.id}
                  className="p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                      {sug.type === 'grammar' ? 'Gramer Düzeltmesi' : sug.type === 'vocabulary' ? 'Kelime Zenginleştirme' : 'Ton Uyarlaması'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs">
                    <span className="line-through text-rose-500 font-semibold">{sug.original}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-emerald-600 font-bold">{sug.replacement}</span>
                  </div>

                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {sug.explanation}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
