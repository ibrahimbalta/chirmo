import React from 'react';

export interface CogkoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'header' | 'hero';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Official Corporate Multi-Color Cogko Wordmark Logo
 * Clean, geometric, authoritative typography inspired by Google's corporate brand identity.
 *
 * Letters & Colors:
 * - C: Google Blue (#4285F4)
 * - o: Google Red (#EA4335)
 * - g: Google Amber/Yellow (#FBBC05)
 * - k: Google Blue (#4285F4)
 * - o: Google Green (#34A853)
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
      className={`inline-flex items-center justify-center font-['Outfit','Plus_Jakarta_Sans',system-ui,sans-serif] font-semibold tracking-[-0.03em] select-none leading-none ${sizeClasses} ${className}`}
    >
      <span className="text-[#4285F4] inline-block">C</span>
      <span className="text-[#EA4335] inline-block">o</span>
      <span className="text-[#FBBC05] inline-block">g</span>
      <span className="text-[#4285F4] inline-block">k</span>
      <span className="text-[#34A853] inline-block">o</span>
    </div>
  );
};

// Backward-compatible alias
export const ChirmoLogo = CogkoLogo;
