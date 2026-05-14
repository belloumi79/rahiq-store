import React from 'react';

export const RahiqLogo: React.FC<{
  className?: string;
  showText?: boolean;
  size?: number;
}> = ({ className = "w-32 h-32", showText = true, size = 128 }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <img
      src="/assets/favicon.png"
      alt="Rahiq Store"
      width={size}
      height={size}
      className="object-contain"
      style={{ imageRendering: 'auto' }}
    />
    {showText && (
      <div className="mt-1 text-center">
        <div className="text-amber-700 font-bold text-xl tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Rahiq
        </div>
        <div className="text-amber-600 text-xs tracking-[3px] uppercase" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Store
        </div>
      </div>
    )}
  </div>
);

export default RahiqLogo;
