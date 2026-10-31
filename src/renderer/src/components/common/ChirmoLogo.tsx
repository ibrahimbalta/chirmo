import React from 'react';

export interface ChirmoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero' | 'icon-only' | 'wordmark';
  showText?: boolean;
  showTagline?: boolean;
  animated?: boolean;
  className?: string;
}

export type CogkoLogoProps = ChirmoLogoProps;

/**
 * Chirmo Brand Identity Logo Component
 * Reference: High-end 3D iridescent violet-to-cyan 'C' emblem with golden orbit ring,
 * luminous star accent, bold deep indigo/cobalt 'Chirmo' wordmark with spherical gradient dot on 'i',
 * and the iconic 'AI Browser & Workspace' tagline flanked by gradient lines.
 */
export const ChirmoLogo: React.FC<ChirmoLogoProps> = ({
  size = 'md',
  variant = 'header',
  showText = true,
  showTagline,
  animated = true,
  className = ''
}) => {
  const isIconOnly = variant === 'icon-only' || !showText || size === 'xs';
  const isHero = variant === 'hero' || size === 'xl';
  const displayTagline = showTagline ?? isHero;

  // Sizes for image rendering
  const heightClasses = {
    xs: 'h-6 w-auto',
    sm: 'h-7 sm:h-8 w-auto',
    md: 'h-9 sm:h-10 w-auto',
    lg: 'h-12 sm:h-14 w-auto',
    xl: 'h-20 sm:h-24 md:h-28 w-auto max-w-full'
  }[size];

  // Icon only sizes
  const iconSizes = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-20 h-20'
  }[size];

  return (
    <div
      role="img"
      aria-label="Chirmo - AI Browser & Workspace"
      className={`relative inline-flex items-center justify-center select-none overflow-visible ${
        animated ? 'transition-transform duration-300 hover:scale-[1.01]' : ''
      } ${className}`}
    >
      {isIconOnly ? (
        <img
          src="./chirmo-icon.png"
          alt="Chirmo Icon"
          className={`${iconSizes} object-contain shrink-0`}
          draggable={false}
        />
      ) : displayTagline ? (
        <img
          src="./chirmo-logo.png"
          alt="Chirmo — AI Browser & Workspace"
          className={`${heightClasses} object-contain`}
          draggable={false}
        />
      ) : (
        <img
          src="./chirmo-wordmark.png"
          alt="Chirmo"
          className={`${heightClasses} object-contain`}
          draggable={false}
        />
      )}
    </div>
  );
};

// Backward-compatible alias
export const CogkoLogo = ChirmoLogo;
