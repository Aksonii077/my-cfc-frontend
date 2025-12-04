/**
 * Utility functions for localStorage management
 */

/**
 * Removes cognitoidentityserviceprovider from localStorage
 * This is typically a browser-generated key from AWS Cognito
 */
export const removeCognitoIdentityServiceProvider = (): void => {
  try {
    localStorage.removeItem('cognitoidentityserviceprovider');
    console.log('cognitoidentityserviceprovider removed from localStorage');
  } catch (error) {
    console.error('Error removing cognitoidentityserviceprovider:', error);
  }
};

/**
 * Cleans up all Cognito-related items from localStorage
 */
export const cleanupCognitoStorage = (): void => {
  try {
    // Remove common Cognito-related keys
    const cognitoKeys = [
      'cognitoidentityserviceprovider',
      'CognitoIdentityServiceProvider',
      'aws.cognito.identity-id',
      'aws.cognito.identity-pool-id',
      'aws.cognito.user-pool-id',
      'aws.cognito.client-id'
    ];
    
    cognitoKeys.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('Cognito-related items cleaned from localStorage');
  } catch (error) {
    console.error('Error cleaning Cognito storage:', error);
  }
};

/**
 * Lists all localStorage keys for debugging
 */
export const listLocalStorageKeys = (): string[] => {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      keys.push(key);
    }
  }
  return keys;
}; 