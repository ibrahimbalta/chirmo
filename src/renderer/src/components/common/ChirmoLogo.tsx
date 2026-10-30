import React from 'react';

export interface CogkoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Official 3D Multi-Color Cogko Wordmark Logo
 * Exact visual replica of user's custom 3D ribbon Cogko logo
 */
export const CogkoLogo: React.FC<CogkoLogoProps> = ({
  size = 'md',
  className = ''
}) => {
  const heightClasses = {
    xs: 'h-6 sm:h-7',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-14 sm:h-16 md:h-18',
    xl: 'h-20 sm:h-24 md:h-28'
  }[size];

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      aria-label="Cogko"
    >
      <img
        src="./cogko-logo.png"
        alt="Cogko"
        className={`${heightClasses} w-auto object-contain select-none pointer-events-none drop-shadow-[0_6px_20px_rgba(99,102,241,0.18)] hover:scale-[1.02] transition-transform duration-300`}
        draggable={false}
      />
    </div>
  );
};

// Backward-compatible alias
export const ChirmoLogo = CogkoLogo;



