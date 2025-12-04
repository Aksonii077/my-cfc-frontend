import { useState, useEffect } from 'react';

export const useTypewriterEffect = (text: string, speed: number = 100) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentIndex < text.length && isTyping) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && isTyping) {
      const pauseTimer = setTimeout(() => {
        setIsTyping(false);
        setCurrentIndex(0);
        setDisplayText('');
      }, 2000);
      return () => clearTimeout(pauseTimer);
    } else if (!isTyping && currentIndex === 0) {
      const restartTimer = setTimeout(() => {
        setIsTyping(true);
      }, 500);
      return () => clearTimeout(restartTimer);
    }
  }, [currentIndex, text, speed, isTyping]);

  return displayText;
};