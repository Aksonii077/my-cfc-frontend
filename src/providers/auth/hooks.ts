import { useContext } from 'react';
import { SimpleAuthContext } from '../SimpleAuthProvider';
import type { SimpleAuthContextType } from './types';

/**
 * Custom hook to use the auth context
 * @throws {Error} When used outside of SimpleAuthProvider
 */
export function useSimpleAuth(): SimpleAuthContextType {
  const context = useContext(SimpleAuthContext);
  if (context === undefined) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider');
  }
  return context;
}