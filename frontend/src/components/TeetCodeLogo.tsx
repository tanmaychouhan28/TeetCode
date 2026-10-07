import React from 'react';

interface TeetCodeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const TeetCodeLogo: React.FC<TeetCodeLogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-7 h-7 text-sm',
    lg: 'w-9 h-9 text-base'
  }[size];

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  }[size];

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Authentic LeetCode-styled stylized T / bracket icon */}
      <div className={`relative ${iconDimensions} rounded-md bg-gradient-to-br from-[#2c2c2c] to-[#1c1c1c] border border-[#444444] flex items-center justify-center shadow-inner overflow-hidden shrink-0 group-hover:border-[#FFA116] transition-colors`}>
        {/* Subtle orange accent glow */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#FFA116]/30 rounded-full blur-[2px]"></div>
        
        {/* SVG Logo mark: A sleek folded T with code bracket geometry */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4"
        >
          {/* Top T Bar */}
          <path
            d="M4 6.5C4 5.67 4.67 5 5.5 5H18.5C19.33 5 20 5.67 20 6.5V7C20 7.55 19.55 8 19 8H5C4.45 8 4 7.55 4 7V6.5Z"
            fill="#FFA116"
          />
          {/* Vertical Stem with subtle code chevron accent */}
          <path
            d="M10.25 8.5H13.75V17.5C13.75 18.33 13.08 19 12.25 19H11.75C10.92 19 10.25 18.33 10.25 17.5V8.5Z"
            fill="#FFA116"
          />
          {/* Left code angle bracket */}
          <path
            d="M7 11.5L4.5 13.5L7 15.5"
            stroke="#EFF1F6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right code angle bracket */}
          <path
            d="M17 11.5L19.5 13.5L17 15.5"
            stroke="#EFF1F6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {showText && (
        <div className="flex items-baseline tracking-tight">
          <span className={`font-bold text-white tracking-tight ${textSizes} font-sans`}>
            Teet
          </span>
          <span className={`font-bold text-[#FFA116] tracking-tight ${textSizes} font-sans`}>
            Code
          </span>
        </div>
      )}
    </div>
  );
};
