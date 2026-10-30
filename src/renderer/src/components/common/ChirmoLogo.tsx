import React from 'react';

interface ChirmoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Pure Typographic Search Engine Logo for Chirmo.
 * Clean, friendly, high-legibility wordmark with distinct search-engine color accents.
 */
export const ChirmoLogo: React.FC<ChirmoLogoProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl sm:text-5xl',
    xl: 'text-5xl sm:text-6xl'
  }[size];

  const dotSize = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4'
  }[size];

  return (
    <div className={`inline-flex items-baseline select-none font-black tracking-tight ${sizeClasses} ${className}`}>
      <span className="text-[#6652C9]">c</span>
      <span className="text-[#0F172A]">h</span>
      <span className="text-[#6652C9]">i</span>
      <span className="text-[#0F172A]">r</span>
      <span className="text-[#0F172A]">m</span>
      <span className="text-[#0F172A]">o</span>
      <span className={`inline-block rounded-full bg-[#6652C9] ml-1 ${dotSize}`} />
    </div>
  );
};
