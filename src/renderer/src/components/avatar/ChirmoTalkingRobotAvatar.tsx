import React from 'react';
import { Mic, Sparkles, Volume2, Bot, BrainCircuit } from 'lucide-react';

export type ChirmoAvatarState = 'idle' | 'listening' | 'thinking' | 'speaking';

export interface ChirmoTalkingRobotAvatarProps {
  state?: ChirmoAvatarState;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showStatusBadge?: boolean;
  statusText?: string;
  onClick?: () => void;
  className?: string;
}

export const ChirmoTalkingRobotAvatar: React.FC<ChirmoTalkingRobotAvatarProps> = ({
  state = 'idle',
  size = 'md',
  showStatusBadge = true,
  statusText,
  onClick,
  className = ''
}) => {
  // Boyut haritası
  const sizeMap = {
    sm: 'w-24 h-24 sm:w-28 sm:h-28',
    md: 'w-36 h-36 sm:w-44 sm:h-44',
    lg: 'w-48 h-48 sm:w-60 sm:h-60',
    xl: 'w-60 h-60 sm:w-72 sm:h-72'
  };

  // Duruma göre halka ve arka plan parıltıları
  const stateAuraMap = {
    idle: 'bg-indigo-500/10 border-indigo-300/30 shadow-indigo-500/10',
    listening: 'bg-blue-500/25 border-blue-400/60 shadow-blue-500/30 animate-pulse',
    thinking: 'bg-amber-500/20 border-amber-400/60 shadow-amber-500/25 animate-pulse',
    speaking: 'bg-purple-600/30 border-purple-400/80 shadow-purple-600/40'
  };

  const defaultStatusMap = {
    idle: 'Chirmo Hazır 👋',
    listening: 'Seni Dinliyorum... 🎙️',
    thinking: 'Cevap Hazırlıyorum... 🧠',
    speaking: 'Chirmo Konuşuyor 🔊'
  };

  const currentStatusText = statusText || defaultStatusMap[state];

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center select-none ${className} ${
        onClick ? 'cursor-pointer group' : ''
      }`}
    >
      {/* ==================== 1. DIŞ ATMOSFERİK HALKALAR & EFEKTLER ==================== */}
      <div className={`relative ${sizeMap[size]} flex items-center justify-center`}>
        {/* Durum Aurası (Pulsing Glow) */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
            stateAuraMap[state]
          } backdrop-blur-xs`}
        />

        {/* Listening (Dinliyor) Dalga Efekti */}
        {state === 'listening' && (
          <>
            <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-60 pointer-events-none" />
            <span className="absolute -inset-3 rounded-full border border-sky-300 animate-pulse opacity-40 pointer-events-none" />
          </>
        )}

        {/* Thinking (Düşünüyor) Yörünge Yıldızları */}
        {state === 'thinking' && (
          <div className="absolute inset-0 rounded-full animate-spin [animation-duration:6s] pointer-events-none">
            <Sparkles className="w-5 h-5 text-amber-300 absolute -top-2 left-1/2 -translate-x-1/2 drop-shadow" />
            <BrainCircuit className="w-4 h-4 text-amber-400 absolute -bottom-1 left-1/2 -translate-x-1/2 drop-shadow" />
          </div>
        )}

        {/* Speaking (Konuşuyor) Ses Dalgası Parıltısı */}
        {state === 'speaking' && (
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/20 to-indigo-500/20 animate-pulse pointer-events-none" />
        )}

        {/* ==================== 2. MERKEZİ ROBOT KARAKTER GÖRSELİ ==================== */}
        <div
          className={`relative w-4/5 h-4/5 flex items-center justify-center transition-all duration-300 ${
            state === 'speaking'
              ? 'scale-105 animate-wiggle'
              : state === 'listening'
              ? 'scale-102'
              : 'hover:scale-105'
          }`}
        >
          <img
            src="./chirmo-character.png"
            alt="Chirmo Talking Robot Avatar"
            className="w-full h-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (!img.src.endsWith('/chirmo-avatar.png')) {
                img.src = './chirmo-avatar.png';
              }
            }}
          />

          {/* Konuşma Sırasında Ağız/Ses Dalgaları (Equalizer Bars) */}
          {state === 'speaking' && (
            <div className="absolute -bottom-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-purple-300/40 flex items-center space-x-1 shadow-lg">
              <span className="w-1 h-3.5 bg-amber-300 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-5 bg-purple-300 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-3 bg-pink-300 rounded-full animate-bounce [animation-delay:300ms]" />
              <span className="w-1 h-4 bg-amber-300 rounded-full animate-bounce [animation-delay:450ms]" />
            </div>
          )}
        </div>

        {/* Durum Köşe İkonu */}
        <div className="absolute top-0 right-1 z-10 p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md">
          {state === 'listening' && <Mic className="w-3.5 h-3.5 text-blue-500 animate-pulse" />}
          {state === 'thinking' && <BrainCircuit className="w-3.5 h-3.5 text-amber-500 animate-spin [animation-duration:3s]" />}
          {state === 'speaking' && <Volume2 className="w-3.5 h-3.5 text-purple-600 animate-bounce" />}
          {state === 'idle' && <Bot className="w-3.5 h-3.5 text-indigo-500" />}
        </div>
      </div>

      {/* ==================== 3. DURUM BİLGİLENDİRME ROZETİ ==================== */}
      {showStatusBadge && (
        <div className="mt-2.5 inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 text-xs font-black shadow-sm text-slate-700 dark:text-slate-200 transition-all">
          <span
            className={`w-2 h-2 rounded-full ${
              state === 'listening'
                ? 'bg-blue-500 animate-ping'
                : state === 'thinking'
                ? 'bg-amber-400 animate-pulse'
                : state === 'speaking'
                ? 'bg-purple-500 animate-pulse'
                : 'bg-emerald-400'
            }`}
          />
          <span className="tracking-wide">{currentStatusText}</span>
        </div>
      )}
    </div>
  );
};

export default ChirmoTalkingRobotAvatar;
