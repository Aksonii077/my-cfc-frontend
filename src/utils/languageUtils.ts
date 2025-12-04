
import { LanguageCode } from '@/contexts/LanguageContext';

// A simple language detection function based on character sets
// In a real application, you would use a proper language detection library or API
export const detectLanguage = (text: string): LanguageCode => {
  if (!text || text.length < 10) return 'en';

  // Check for Devanagari script (Hindi)
  if (/[\u0900-\u097F]/.test(text)) return 'hi';
  
  // Check for Bengali script
  if (/[\u0980-\u09FF]/.test(text)) return 'bn';
  
  // Check for Tamil script
  if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';
  
  // Check for Telugu script
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
  
  // Check for Cyrillic (Russian)
  if (/[\u0400-\u04FF]/.test(text)) return 'ru';
  
  // Simple detection for Spanish (imperfect)
  if (/[áéíóúüñ¿¡]/i.test(text)) return 'es';
  
  // Simple detection for French (imperfect)
  if (/[àâçéèêëîïôùûüÿœæ]/i.test(text)) return 'fr';
  
  // Default to English
  return 'en';
};

// Function to format multilingual dates
export const formatDateInLanguage = (date: Date, lang: LanguageCode): string => {
  try {
    return new Intl.DateTimeFormat(lang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch (error) {
    // Fallback to English if formatting fails
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }
};

// Helper function to ensure language code is valid
export const validateLanguageCode = (code?: string): LanguageCode => {
  const validCodes: LanguageCode[] = ['en', 'hi', 'bn', 'ta', 'te', 'es', 'fr', 'ru'];
  if (code && validCodes.includes(code as LanguageCode)) {
    return code as LanguageCode;
  }
  return 'en';
};
