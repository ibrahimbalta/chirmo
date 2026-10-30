import React from 'react';

interface ChirmoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Exact Chirmo Brand Logo matching the visual identity:
 * - Header variant: Purple gradient circle with white 4-point star + dark navy "Chirmo"
 * - Hero variant: Bold purple 4-point sparkle diamond icon with hollow star center + dark navy "Chirmo"
 */
export const ChirmoLogo: React.FC<ChirmoLogoProps> = ({
  size = 'md',
  variant,
  showText = true,
  className = ''
}) => {
  const isHero = variant ? variant === 'hero' : size === 'lg' || size === 'xl';

  const textSize = {
    xs: 'text-base',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-[56px]'
  }[size];

  if (!isHero) {
    const circleSize = size === 'xs' ? 'w-6 h-6' : size === 'sm' ? 'w-8 h-8' : 'w-9 h-9';
    const starSize = size === 'xs' ? 'w-3.5 h-3.5' : size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

    return (
      <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
        <div
          className={`${circleSize} rounded-full bg-gradient-to-br from-[#7C4DFF] to-[#5B21B6] flex items-center justify-center shadow-sm shrink-0`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={starSize}
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2.5C12.7 7.4 16.6 11.3 21.5 12C16.6 12.7 12.7 16.6 12 21.5C11.3 16.6 7.4 12.7 2.5 12C7.4 11.3 11.3 7.4 12 2.5Z"
              fill="#FFFFFF"
            />
          </svg>
        </div>
        {showText && (
          <span className={`font-bold tracking-tight text-[#111827] ${textSize}`}>
            Chirmo
          </span>
        )}
      </div>
    );
  }

  const iconSize = size === 'lg' ? 'w-11 h-11 sm:w-12 sm:h-12' : 'w-12 h-12 sm:w-14 sm:h-14';

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-3.5 select-none ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        className={`${iconSize} shrink-0 drop-shadow-[0_6px_16px_rgba(108,56,255,0.28)]`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="chirmoHeroStarGrad" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C4DFF" />
            <stop offset="50%" stopColor="#6534F8" />
            <stop offset="100%" stopColor="#4F1ED8" />
          </linearGradient>
        </defs>
        {/* Outer rounded 4-point star */}
        <path
          d="M32 3C34.8 18.5 45.5 29.2 61 32C45.5 34.8 34.8 45.5 32 61C29.2 45.5 18.5 34.8 3 32C18.5 29.2 29.2 18.5 32 3Z"
          fill="url(#chirmoHeroStarGrad)"
          stroke="url(#chirmoHeroStarGrad)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {/* Inner white 4-point star cutout */}
        <path
          d="M32 16.5C33.4 24.6 39.4 30.6 47.5 32C39.4 33.4 33.4 39.4 32 47.5C30.6 39.4 24.6 33.4 16.5 32C24.6 30.6 30.6 24.6 32 16.5Z"
          fill="#FFFFFF"
        />
      </svg>
      {showText && (
        <span className={`font-bold tracking-tight text-[#111827] leading-none ${textSize}`}>
          Chirmo
        </span>
      )}
    </div>
  );
};
