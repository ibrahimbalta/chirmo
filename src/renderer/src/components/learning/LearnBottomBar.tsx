import React from 'react';
import {
  BookOpen,
  Tv,
  Mic,
  Dumbbell,
  Sparkles,
  Award,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { CEFRLevel, LearningMode, DailyGoalProgress } from '../../types';
import { LearningStorageService } from '../../services/learningStorage';

interface LearnBottomBarProps {
  progress: DailyGoalProgress;
  activeMode: LearningMode;
  onModeChange: (mode: LearningMode) => void;
  onLevelChange: (level: CEFRLevel) => void;
  isAiTutorOpen: boolean;
  onToggleAiTutor: () => void;
  onOpenVocabulary: () => void;
  onOpenPlacementTest?: () => void;
}

export const LearnBottomBar: React.FC<LearnBottomBarProps> = ({
  progress,
  activeMode,
  onModeChange,
  onLevelChange,
  isAiTutorOpen,
  onToggleAiTutor,
  onOpenVocabulary,
  onOpenPlacementTest
}) => {
  const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const percentComplete = Math.min(100, Math.round((progress.wordsLearnedToday / progress.targetWords) * 100));

  return (
    <footer className="h-12 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 flex items-center justify-between z-30 shrink-0 select-none text-xs">
      {/* Sol Alan: Seviye Rozetleri & Günlük Hedef Çubuğu */}
      <div className="flex items-center space-x-4">
        {/* CEFR Seviye Seçici */}
        <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 pl-2 pr-1">
            Seviye:
          </span>
          {levels.map((lvl) => {
            const isActive = progress.currentLevel === lvl;
            return (
              <button
                key={lvl}
                onClick={() => onLevelChange(lvl)}
                title={`Kişisel İngilizce Seviyesi: ${lvl}`}
                className={`px-2 py-0.5 rounded font-bold text-[11px] transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60'
                }`}
              >
                {lvl}
              </button>
            );
          })}
          {onOpenPlacementTest && (
            <button
              onClick={onOpenPlacementTest}
              className="px-2 py-0.5 rounded font-semibold text-[10px] text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors ml-1"
              title="2 Dakikalık Hızlı Seviye Tespit Sınavını Başlat"
            >
              🎯 Test Et
            </button>
          )}
        </div>

        {/* Günlük Hedef & Streak */}
        <div 
          onClick={onOpenVocabulary}
          className="cursor-pointer group flex items-center space-x-2.5 px-3 py-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200/60 dark:border-slate-700/60 transition-colors"
          title="Günlük kelime hedefini görüntüle"
        >
          <div className="flex items-center space-x-1 text-amber-600 dark:text-amber-400 font-medium">
            <span>🔥</span>
            <span className="font-bold">{progress.streakDays} Gün</span>
          </div>

          <div className="h-3 w-px bg-slate-300 dark:bg-slate-700" />

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 dark:text-slate-400">Hedef:</span>
            <div className="w-20 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500"
                style={{ width: `${percentComplete}%` }}
              />
            </div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {progress.wordsLearnedToday}/{progress.targetWords} Kelime
            </span>
          </div>
        </div>
      </div>

      {/* Orta Alan: Öğrenme Modları */}
      <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => onModeChange('reading')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium text-xs transition-all ${
            activeMode === 'reading'
              ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Reading</span>
        </button>

        <button
          onClick={() => onModeChange('watching')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium text-xs transition-all ${
            activeMode === 'watching'
              ? 'bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          <span>Watching</span>
        </button>

        <button
          onClick={() => onModeChange('speaking')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium text-xs transition-all ${
            activeMode === 'speaking'
              ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-400 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Speaking</span>
        </button>

        <button
          onClick={() => onModeChange('practice')}
          className={`flex items-center space-x-1.5 px-3 py-1 rounded-md font-medium text-xs transition-all ${
            activeMode === 'practice'
              ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-sm font-semibold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Dumbbell className="w-3.5 h-3.5" />
          <span>Practice</span>
        </button>
      </div>

      {/* Sağ Alan: AI İngilizce Öğretmeni Aç/Kapa Butonu */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleAiTutor}
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg font-semibold transition-all shadow-sm ${
            isAiTutorOpen
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ring-2 ring-blue-400/30'
              : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>AI Öğretmen</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-white/20 dark:bg-white/10 rounded">
            {isAiTutorOpen ? 'Gizle' : 'Aç'}
          </span>
        </button>
      </div>
    </footer>
  );
};
