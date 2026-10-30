import React from 'react';

export interface CogkoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Official COGKO Friendly Typographic Wordmark Logo
 * - Purely typographic (no bulky C emblem)
 * - Colorful, cheerful, friendly ("sempatik") rounded Fredoka font
 * - Interactive playful letter bounce & subtle sparkle
 */
export const CogkoLogo: React.FC<CogkoLogoProps> = ({
  size = 'md',
  variant,
  className = ''
}) => {
  const isHero = variant ? variant === 'hero' : size === 'lg' || size === 'xl';

  const textSizes = {
    xs: 'text-2xl',
    sm: 'text-3xl sm:text-4xl',
    md: 'text-4xl sm:text-5xl',
    lg: 'text-5xl sm:text-6xl',
    xl: 'text-6xl sm:text-7xl md:text-8xl'
  }[size];

  return (
    <div
      className={`inline-flex flex-col items-center select-none ${className}`}
      aria-label="cogko"
    >
      {/* Friendly, Colorful Typographic Wordmark */}
      <div
        className={`font-['Fredoka',sans-serif] font-bold tracking-tight inline-flex items-center drop-shadow-[0_4px_16px_rgba(101,52,248,0.15)] leading-none ${textSizes}`}
      >
        {/* Letter 'c' - Royal Violet & Purple */}
        <span
          className="inline-block bg-gradient-to-tr from-[#6534F8] via-[#7C3AED] to-[#8B5CF6] bg-clip-text text-transparent hover:-translate-y-1 hover:rotate-[-4deg] transition-transform duration-200 cursor-pointer"
          style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          c
        </span>

        {/* Letter 'o' - Coral Pink & Sunset Peach */}
        <span
          className="inline-block bg-gradient-to-tr from-[#FF3366] via-[#FF5376] to-[#FF7A45] bg-clip-text text-transparent hover:-translate-y-1.5 hover:scale-105 transition-transform duration-200 cursor-pointer ml-[1px]"
          style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          o
        </span>

        {/* Letter 'g' - Fresh Mint & Turquoise */}
        <span
          className="inline-block bg-gradient-to-tr from-[#06B6D4] via-[#0EA5E9] to-[#10B981] bg-clip-text text-transparent hover:-translate-y-1 hover:rotate-[3deg] transition-transform duration-200 cursor-pointer ml-[1px]"
          style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          g
        </span>

        {/* Letter 'k' - Electric Cobalt & Royal Blue */}
        <span
          className="inline-block bg-gradient-to-tr from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] bg-clip-text text-transparent hover:-translate-y-1.5 hover:scale-105 transition-transform duration-200 cursor-pointer ml-[1px]"
          style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          k
        </span>

        {/* Letter 'o' - Warm Honey & Sunny Gold with Playful Sparkle */}
        <span className="relative inline-block ml-[1px]">
          <span
            className="inline-block bg-gradient-to-tr from-[#F59E0B] via-[#FBBF24] to-[#FCD34D] bg-clip-text text-transparent hover:-translate-y-1 hover:rotate-[4deg] transition-transform duration-200 cursor-pointer"
            style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            o
          </span>
          {/* Friendly Golden Sparkle Accent */}
          <span
            className="absolute -top-1 sm:-top-2 -right-2 sm:-right-3 text-[#F59E0B] text-xs sm:text-base md:text-lg animate-pulse select-none pointer-events-none drop-shadow-[0_2px_6px_rgba(245,158,11,0.4)]"
            aria-hidden="true"
          >
            ✦
          </span>
        </span>
      </div>

      {/* Subtitle / Tagline for Hero Mode */}
      {isHero && (
        <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-slate-400 mt-2.5 opacity-80">
          ai browser & workspace
        </span>
      )}
    </div>
  );
};

// Backward-compatible alias
export const ChirmoLogo = CogkoLogo;


