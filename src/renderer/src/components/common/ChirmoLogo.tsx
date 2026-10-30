import React from 'react';

export interface CogkoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Official COGKO Brand Logo:
 * - 3D Metallic Gold & Violet Emblem
 * - Bold Modern Typography ("COG" Obsidian Slate + "KO" Electric Violet Gradient)
 * - Ultra-sharp, scalable and responsive
 */
export const CogkoLogo: React.FC<CogkoLogoProps> = ({
  size = 'md',
  variant,
  showText = true,
  className = ''
}) => {
  const isHero = variant ? variant === 'hero' : size === 'lg' || size === 'xl';

  const emblemSizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8 sm:h-9 sm:w-9',
    md: 'h-10 w-10 sm:h-12 sm:w-12',
    lg: 'h-14 w-14 sm:h-16 sm:w-16',
    xl: 'h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24'
  }[size];

  const textSizes = {
    xs: 'text-lg',
    sm: 'text-xl sm:text-2xl',
    md: 'text-2xl sm:text-3xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-6xl md:text-7xl'
  }[size];

  return (
    <div
      className={`inline-flex items-center gap-3 sm:gap-4 select-none ${className}`}
      aria-label="COGKO"
    >
      {/* 3D Metallic Gold & Violet Emblem */}
      <img
        src="./cogko-icon.png"
        alt="COGKO Emblem"
        className={`${emblemSizes} object-contain select-none pointer-events-none shrink-0 drop-shadow-[0_8px_24px_rgba(101,52,248,0.24)]`}
        draggable={false}
        onError={(e) => {
          // Fallback to chirmo-icon if cogko-icon is loading
          const target = e.target as HTMLImageElement;
          if (target.src.indexOf('chirmo-icon.png') === -1) {
            target.src = './chirmo-icon.png';
          }
        }}
      />

      {showText && (
        <div className="flex flex-col items-start leading-none justify-center">
          <div className={`font-black tracking-tight flex items-center ${textSizes}`}>
            <span className="text-[#0F172A] tracking-tight">COG</span>
            <span className="bg-gradient-to-r from-[#6534F8] via-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent tracking-tight">
              KO
            </span>
          </div>
          {isHero && (
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#6534F8] mt-1 pl-0.5 opacity-90">
              AI BROWSER & WORKSPACE
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// Backward-compatible alias
export const ChirmoLogo = CogkoLogo;

