import React from "react";

export interface LogoProps {
  className?: string;
  isArabic?: boolean;
  showText?: boolean;
  textClassName?: string;
  useImage?: boolean;
}

/**
 * OmanEcoSyncSymbol - The official emblem of OMANECOSYNC:
 * Combines the circular energy synchronization loop (Sync),
 * the Omani date palm & bio-leaf frond (Eco & Oman heritage),
 * the central solar photon / green hydrogen spark (Energy),
 * and the Sultanate national colors (Emerald, Solar Gold, Crimson accent, White).
 */
export const OmanEcoSyncSymbol: React.FC<{ className?: string }> = ({
  className = "w-10 h-10",
}) => {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 aspect-square select-none group-hover:scale-105 transition-transform duration-300 ${className}`}
    >
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_2px_12px_rgba(16,185,129,0.25)]"
      >
        <defs>
          <linearGradient id="omanGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="45%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="omanDarkGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064E3B" />
          </linearGradient>
          <linearGradient id="solarGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="syncCyanGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#34D399" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Eco Glow */}
        <circle cx="60" cy="60" r="50" fill="url(#coreGlow)" />

        {/* Outer Circular Sync Orbit Ring (Precision Tech Dashed Track) */}
        <circle
          cx="60"
          cy="60"
          r="52"
          stroke="url(#omanGreenGrad)"
          strokeWidth="1.5"
          strokeDasharray="3 4"
          opacity="0.45"
        />

        {/* Upper Energy Synchronization Arc (Cyan to Emerald) */}
        <path
          d="M 60 12 A 48 48 0 0 1 108 60 A 48 48 0 0 1 90 94"
          stroke="url(#syncCyanGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Lower Ecological Flow Arc (Emerald to Forest) */}
        <path
          d="M 60 108 A 48 48 0 0 1 12 60 A 48 48 0 0 1 30 26"
          stroke="url(#omanGreenGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Orbiting Sync Energy Nodes (Green Hydrogen & Biofuel) */}
        <circle cx="90" cy="94" r="4.5" fill="#06B6D4" />
        <circle cx="30" cy="26" r="4.5" fill="#34D399" />

        {/* Central Interlocking Dual-Leaf Heart (Omani Date Palm & Bio Loop) */}
        <path
          d="M 60 22 C 40 32 30 52 38 72 C 44 86 54 94 60 98 C 66 94 76 86 82 72 C 90 52 80 32 60 22 Z"
          fill="url(#omanDarkGreenGrad)"
          opacity="0.95"
        />
        <path
          d="M 60 22 C 45 35 38 52 44 68 C 48 78 54 85 60 90 C 60 55 60 36 60 22 Z"
          fill="url(#omanGreenGrad)"
        />

        {/* Palm Frond Veins (Sultanate Agriculture & Circular Biomass) */}
        <path
          d="M 60 26 L 60 88"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d="M 60 38 Q 48 34 40 40"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 60 38 Q 72 34 80 40"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 60 50 Q 46 47 38 54"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 60 50 Q 74 47 82 54"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 60 62 Q 48 60 42 68"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 60 62 Q 72 60 78 68"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 60 74 Q 52 73 48 80"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M 60 74 Q 68 73 72 80"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Central Radiant Solar & Green Hydrogen Spark */}
        <circle cx="60" cy="56" r="8" fill="url(#solarGoldGrad)" />
        <circle cx="60" cy="56" r="3.5" fill="#FFFFFF" />
        <path
          d="M 60 42 L 60 46 M 60 66 L 60 70 M 46 56 L 50 56 M 70 56 L 74 56"
          stroke="url(#solarGoldGrad)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Sultanate Crown Accent Node (Oman Flag Crimson Accent) */}
        <circle
          cx="60"
          cy="12"
          r="3.5"
          fill="#EF4444"
          stroke="#FFFFFF"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export const Logo: React.FC<LogoProps> = ({
  className = "h-10",
  isArabic = false,
  showText = true,
  textClassName = "text-xl",
  useImage = false,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const isLarge =
    className.includes("h-28") ||
    className.includes("h-40") ||
    className.includes("h-32") ||
    className.includes("h-24") ||
    className.includes("h-36");

  return (
    <div
      className={`flex cursor-pointer group ${
        isLarge
          ? "flex-col sm:flex-row items-center justify-center text-center sm:text-start gap-4 md:gap-6"
          : "items-center gap-3"
      }`}
    >
      {useImage && !imgError ? (
        <img
          src="/logo.png"
          alt="OMANECOSYNC Logo"
          className={`object-contain ${className}`}
          onError={() => setImgError(true)}
        />
      ) : (
        <OmanEcoSyncSymbol className={className} />
      )}

      {showText && (
        <div
          className={`flex flex-col select-none ${
            isLarge ? "items-center sm:items-start" : ""
          }`}
        >
          <span
            className={`font-black tracking-tight flex items-center gap-1.5 text-slate-900 dark:text-white leading-none ${textClassName}`}
          >
            {isArabic ? (
              <>
                <span>عُمَان</span>
                <span className="text-[var(--accent-emerald)]">إيكوسينك</span>
              </>
            ) : (
              <>
                <span>OMAN</span>
                <span className="text-[var(--accent-emerald)]">ECOSYNC</span>
              </>
            )}
          </span>
          <span
            className={`font-bold tracking-[0.22em] text-slate-500 uppercase mt-1.5 ${
              isLarge
                ? "text-xs md:text-sm tracking-[0.3em] text-[var(--accent-emerald)] font-semibold"
                : "text-[0.6rem] md:text-[0.65rem]"
            }`}
          >
            {isArabic
              ? "منظومة الوقود الحيوي والطاقة النظيفة"
              : "Biofuel & Clean Energy Intelligence"}
          </span>
        </div>
      )}
    </div>
  );
};

