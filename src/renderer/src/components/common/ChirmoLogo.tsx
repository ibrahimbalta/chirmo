import React from 'react';

interface ChirmoLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

/**
 * Custom Bespoke 3D-Styled Vector Emblem for CHIRMO.
 * Designed with multi-stop photonic gradients, geometric neural prism rings,
 * and specular glass highlights.
 */
export const ChirmoLogo: React.FC<ChirmoLogoProps> = ({
  size = 'md',
  showText = false,
  animated = true,
  className = ''
}) => {
  const dimensions = {
    xs: 24,
    sm: 30,
    md: 40,
    lg: 56,
    xl: 84
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{ width: dimensions, height: dimensions }}
      >
        {/* Outer Ambient Glow */}
        {animated && (
          <div
            className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-[#6652C9] via-[#8B5CF6] to-[#06B6D4] opacity-40 blur-md animate-pulse pointer-events-none"
          />
        )}

        <svg
          width={dimensions}
          height={dimensions}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 drop-shadow-sm"
        >
          <defs>
            {/* Primary Luxury Squircle Background Gradient */}
            <linearGradient id="chirmoBgGrad" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="45%" stopColor="#4338CA" />
              <stop offset="80%" stopColor="#6652C9" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>

            {/* Inner Specular Rim Gradient */}
            <linearGradient id="chirmoRimGrad" x1="10" y1="5" x2="110" y2="115" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
              <stop offset="40%" stopColor="#A78BFA" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.45" />
            </linearGradient>

            {/* Primary C-Wing Photonic Gradient */}
            <linearGradient id="chirmoWingGrad" x1="25" y1="25" x2="95" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="55%" stopColor="#E0E7FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>

            {/* Secondary Neural Accent Gradient */}
            <linearGradient id="chirmoAccentGrad" x1="50" y1="30" x2="100" y2="90" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#F472B6" />
            </linearGradient>

            {/* Core Starburst Glow */}
            <radialGradient id="chirmoCoreGlow" cx="65" cy="60" r="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
              <stop offset="60%" stopColor="#8B5CF6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#6652C9" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* 1. Base Luxury Squircle */}
          <rect
            x="4"
            y="4"
            width="112"
            height="112"
            rx="30"
            fill="url(#chirmoBgGrad)"
          />

          {/* 2. Top-Left Glass Specular Highlight */}
          <path
            d="M34 6H86C101.464 6 114 18.536 114 34V48C95 36 68 30 6 44V34C6 18.536 18.536 6 34 6Z"
            fill="white"
            fillOpacity="0.07"
          />

          {/* 3. Precision Rim Border */}
          <rect
            x="5"
            y="5"
            width="110"
            height="110"
            rx="29"
            stroke="url(#chirmoRimGrad)"
            strokeWidth="2"
          />

          {/* 4. Ambient Core Halo */}
          <circle cx="64" cy="60" r="28" fill="url(#chirmoCoreGlow)" />

          {/* 5. Outer Geometric C-Portal (Symbolizing Browser + Orbit + Speed) */}
          <path
            d="M78 33C69.5 27.5 58.2 26.5 48.2 30.8C36.2 36 28.5 47.8 28.5 60.5C28.5 73.2 36.2 85 48.2 90.2C58.2 94.5 69.5 93.5 78 88"
            stroke="url(#chirmoWingGrad)"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* 6. Inner Dynamic Neural Arc */}
          <path
            d="M86 44C91.5 53.5 91.5 66.5 86 76"
            stroke="url(#chirmoAccentGrad)"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* 7. Central Intelligence Spark / Compass Needle */}
          <path
            d="M64 38L69.2 54.8L86 60L69.2 65.2L64 82L58.8 65.2L42 60L58.8 54.8L64 38Z"
            fill="url(#chirmoWingGrad)"
          />

          {/* 8. Center Precision Core Node */}
          <circle cx="64" cy="60" r="4.5" fill="#1E1B4B" />
          <circle cx="64" cy="60" r="2.2" fill="#38BDF8" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-tight text-chirmo-text leading-none text-base">
              CHIRMO
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-gradient-to-r from-chirmo-brand to-indigo-600 text-white leading-none shadow-2xs">
              PRO
            </span>
          </div>
          <span className="text-[10px] font-medium text-chirmo-text-secondary tracking-wide mt-0.5 leading-none">
            Neural Browser & OS
          </span>
        </div>
      )}
    </div>
  );
};
