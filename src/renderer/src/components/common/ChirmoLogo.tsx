import React from 'react';

export interface CogkoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Official Distinctive Cogko Wordmark Logo
 * Designed with Space Grotesk / Sora high-tech neo-grotesque typography
 * and a signature bespoke palette (Electric Indigo, Sunset Coral, Pacific Cyan, Royal Iris, Emerald Mint).
 *
 * Distinctive Palette (Zero Google overlap):
 * - C: #5B4DF5 (Electric Indigo)
 * - o: #FF6B4A (Sunset Coral)
 * - g: #00B4D8 (Pacific Cyan)
 * - k: #8435E8 (Royal Iris Purple)
 * - o: #05C189 (Emerald Mint)
 */
export const CogkoLogo: React.FC<CogkoLogoProps> = ({
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'text-[20px] sm:text-[22px]',
    sm: 'text-[24px] sm:text-[26px]',
    md: 'text-[30px] sm:text-[34px]',
    lg: 'text-[44px] sm:text-[50px]',
    xl: 'text-[68px] sm:text-[80px] md:text-[92px]'
  }[size];

  return (
    <div
      role="img"
      aria-label="Cogko"
      className={`inline-flex items-center justify-center font-['Space_Grotesk','Sora','Plus_Jakarta_Sans',sans-serif] font-bold tracking-[-0.035em] select-none leading-none ${sizeClasses} ${className}`}
    >
      <span className="text-[#5B4DF5] inline-block transition-transform duration-200 hover:-translate-y-0.5">C</span>
      <span className="text-[#FF6B4A] inline-block transition-transform duration-200 hover:-translate-y-0.5">o</span>
      <span className="text-[#00B4D8] inline-block transition-transform duration-200 hover:-translate-y-0.5">g</span>
      <span className="text-[#8435E8] inline-block transition-transform duration-200 hover:-translate-y-0.5">k</span>
      <span className="text-[#05C189] inline-block transition-transform duration-200 hover:-translate-y-0.5">o</span>
    </div>
  );
};

// Backward-compatible alias
export const ChirmoLogo = CogkoLogo;
