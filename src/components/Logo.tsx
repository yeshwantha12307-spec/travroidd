import React from 'react';

export const Logo: React.FC<{
  className?: string;
  variant?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}> = ({ className = '', variant = 'dark', size = 'md' }) => {
  const isLight = variant === 'light';

  const imgSizeClass = size === 'lg' ? 'h-16 w-16' : size === 'sm' ? 'h-8 w-8' : 'h-10 w-10';
  const textSizeClass = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-xl' : 'text-2xl';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
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
          className={`text-[9.5px] font-medium tracking-[0.12em] uppercase mt-0.5 ${
            isLight ? 'text-blue-200' : 'text-[#0B5ED7]'
          }`}
        >
          All India Travel Planner
        </span>
      </div>
    </div>
  );
};
