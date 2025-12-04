import React from 'react';
import { COLORS } from '../../constants/fef';

interface ResponsiveButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
}

const ResponsiveButton: React.FC<ResponsiveButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false
}) => {
  const baseClasses = 'font-bold rounded transition-all duration-200 hover:opacity-90 disabled:opacity-50 text-white';
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 md:px-8 py-2 md:py-3 text-sm md:text-base',
    lg: 'px-8 md:px-12 py-3 md:py-4 text-base md:text-lg'
  };

  const variantStyles = {
    primary: {
      backgroundColor: COLORS.primary,
      color: '#000000'
    },
    secondary: {
      backgroundColor: COLORS.gray,
      color: COLORS.primary
    },
    outline: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      border: `1px solid ${COLORS.primary}`
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses[size]} ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </button>
  );
};

export default ResponsiveButton;