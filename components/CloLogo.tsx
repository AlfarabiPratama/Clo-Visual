import React from 'react';

interface CloLogoProps {
  className?: string;
  size?: number;
}

const CloLogo: React.FC<CloLogoProps> = ({ className = '', size = 40 }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 64 64" 
      width={size} 
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="clo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#334155', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#475569', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="12" fill="url(#clo-grad)"/>
      <text 
        x="32" 
        y="40" 
        fontFamily="Arial, Helvetica, sans-serif" 
        fontSize="22" 
        fontWeight="900" 
        fill="white" 
        textAnchor="middle" 
        letterSpacing="-1"
      >
        CLO
      </text>
      <circle cx="50" cy="16" r="2" fill="#60a5fa" opacity="0.8"/>
      <circle cx="54" cy="14" r="1.2" fill="#93c5fd" opacity="0.7"/>
      <circle cx="52" cy="20" r="1" fill="#dbeafe" opacity="0.9"/>
    </svg>
  );
};

export default CloLogo;
