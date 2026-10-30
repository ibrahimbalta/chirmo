import React from 'react';

interface ChirmoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Official 3D Metallic Gold & Violet Chirmo Brand Logo
 */
export const ChirmoLogo: React.FC<ChirmoLogoProps> = ({
  size = 'md',
  className = ''
}) => {
  const heightClasses = {
    xs: 'h-6',
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-20 sm:h-24 md:h-28'
  }[size];

  return (
    <div className={`inline-flex items-center select-none ${className}`} aria-label="Chirmo">
      <img
        src="./chirmo-logo.png"
        alt="Chirmo"
        className={`${heightClasses} w-auto object-contain select-none pointer-events-none drop-shadow-[0_4px_12px_rgba(91,33,182,0.12)]`}
        draggable={false}
      />
    </div>
  );
};
