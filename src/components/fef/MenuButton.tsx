import React from 'react';
import { MenuButtonProps } from '../../types/fef';
import { COLORS } from '../../constants/fef';

const MenuButton: React.FC<MenuButtonProps> = ({ 
  item, 
  isActive, 
  onClick, 
  className = '' 
}) => {
  return (
    <div className={`text-center ${className}`}>
      <button
        onClick={onClick}
        className="px-4 sm:px-6 md:px-8 py-3 md:py-4 font-bold text-sm md:text-lg transition-all duration-300 text-center hover:opacity-80 w-full"
        style={{
          color: isActive ? COLORS.primary : '#FFFFFF'
        }}
      >
        {item}
      </button>
      {isActive && (
        <div className="flex justify-center mt-2">
          <img 
            src="/fef/Vector 3.svg" 
            alt="Active Menu Indicator" 
            className="h-auto object-contain"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};

export default MenuButton;