import React from 'react';

export const Logo: React.FC<{
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', variant = 'dark', size = 'md' }) => {
  const isLight = variant === 'light';

  const imgSizeClass =
    size === 'lg'
      ? 'h-14 w-14 sm:h-16 sm:w-16'
      : size === 'sm'
      ? 'h-7 w-7 sm:h-8 sm:w-8'
      : 'h-8 w-8 sm:h-10 sm:w-10';

  const textSizeClass =
    size === 'lg'
      ? 'text-2xl sm:text-3xl'
      : size === 'sm'
      ? 'text-lg sm:text-xl'
      : 'text-xl sm:text-2xl';

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 ${className}`}>
      {/* Globe + Airplane Logo Emblem */}
      <img
        src="/assets/travroidd-logo.png"
        alt="Travroidd Logo"
        className={`${imgSizeClass} object-contain shrink-0`}
      />

      {/* Brand Typography */}
      <div className="flex flex-col text-left leading-none">
        <span
          className={`font-brand ${textSizeClass} font-bold tracking-tight ${
            isLight ? 'text-white' : 'text-[#0A2A66]'
          }`}
        >
          Travroidd
        </span>
        <span
          className={`text-[8px] sm:text-[9.5px] font-medium tracking-[0.1em] sm:tracking-[0.12em] uppercase mt-0.5 truncate max-w-[130px] sm:max-w-none ${
            isLight ? 'text-blue-200' : 'text-[#0B5ED7]'
          }`}
        >
          All India Travel Planner
        </span>
      </div>
    </div>
  );
};
