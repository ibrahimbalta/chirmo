import React from 'react';

export interface CogkoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Premium High-End Cogko Wordmark Logo
 * Designed with bold geometric neo-grotesque typography, rich prismatic gradient fills,
 * subtle tactile depth, ambient aura, and an iconic radiant AI spark.
 */
export const CogkoLogo: React.FC<CogkoLogoProps> = ({
  size = 'md',
  variant = 'header',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'text-[21px] sm:text-[23px]',
    sm: 'text-[26px] sm:text-[28px]',
    md: 'text-[34px] sm:text-[38px]',
    lg: 'text-[50px] sm:text-[56px]',
    xl: 'text-[72px] sm:text-[88px] md:text-[100px]'
  }[size];

  const sparkSizes = {
    xs: 'w-2.5 h-2.5 -top-0.5 -right-2',
    sm: 'w-3 h-3 -top-1 -right-2.5',
    md: 'w-4 h-4 -top-1.5 -right-3.5',
    lg: 'w-5 h-5 -top-2 -right-4.5',
    xl: 'w-7 h-7 sm:w-8 sm:h-8 -top-3 -right-6 sm:-top-4 sm:-right-8'
  }[size];

  const isHero = variant === 'hero' || size === 'xl';

  return (
    <div
      role="img"
      aria-label="Cogko"
      className={`relative inline-flex items-center justify-center font-['Outfit','Plus_Jakarta_Sans',system-ui,sans-serif] font-black tracking-[-0.04em] select-none leading-none ${className}`}
    >
      {/* Subtle atmospheric ambient glow for hero mode */}
      {isHero && (
        <div
          className="absolute -inset-6 sm:-inset-10 bg-gradient-to-r from-indigo-500/20 via-rose-500/18 to-cyan-500/20 blur-3xl rounded-full pointer-events-none -z-10"
          aria-hidden="true"
        />
      )}

      {/* Main typographic wordmark with rich multi-stop prismatic gradients */}
      <div className={`relative flex items-baseline drop-shadow-[0_4px_16px_rgba(99,102,241,0.22)] ${sizeClasses}`}>
        {/* C: Electric Cobalt to Deep Indigo */}
        <span className="bg-gradient-to-b from-[#38BDF8] via-[#6366F1] to-[#4338CA] bg-clip-text text-transparent inline-block transition-transform duration-300 hover:scale-105">
          C
        </span>

        {/* o: Vivid Coral to Crimson Rose */}
        <span className="bg-gradient-to-b from-[#FB7185] via-[#F43F5E] to-[#E11D48] bg-clip-text text-transparent inline-block transition-transform duration-300 hover:scale-105">
          o
        </span>

        {/* g: Solar Gold to Vibrant Amber */}
        <span className="bg-gradient-to-b from-[#FDE047] via-[#F59E0B] to-[#EA580C] bg-clip-text text-transparent inline-block transition-transform duration-300 hover:scale-105">
          g
        </span>

        {/* k: Royal Violet to Cyber Orchid */}
        <span className="bg-gradient-to-b from-[#C084FC] via-[#8B5CF6] to-[#6D28D9] bg-clip-text text-transparent inline-block transition-transform duration-300 hover:scale-105">
          k
        </span>

        {/* o: Emerald Mint to Pacific Cyan */}
        <span className="bg-gradient-to-b from-[#34D399] via-[#06B6D4] to-[#0284C7] bg-clip-text text-transparent inline-block transition-transform duration-300 hover:scale-105">
          o
        </span>

        {/* Radiant 4-Point AI Intelligence Spark Accent */}
        <svg
          className={`absolute ${sparkSizes} text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.85)] animate-pulse pointer-events-none`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 0C12 7 7 12 0 12C7 12 12 17 12 24C12 17 17 12 24 12C17 12 12 7 12 0Z"
            fill="url(#sparkle-gradient)"
          />
          <defs>
            <linearGradient id="sparkle-gradient" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FDE047" />
              <stop offset="50%" stopColor="#FB923C" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

// Backward-compatible alias
export const ChirmoLogo = CogkoLogo;
