import React from 'react';
import { AnimatedContentProps } from '../../types/fef';

const AnimatedContent: React.FC<AnimatedContentProps> = ({ 
  children, 
  className = '', 
  style = {},
  id
}) => {
  return (
    <div 
      id={id}
      className={`opacity-0 animate-[fadeIn_0.7s_ease-in-out_forwards] ${className}`}
      style={{ 
        animation: 'fadeIn 0.7s ease-in-out forwards',
        ...style 
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedContent;