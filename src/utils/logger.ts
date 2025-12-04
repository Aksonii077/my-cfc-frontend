/**
 * Production-ready logging system
 * Only logs in development, silent in production
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

class ProductionLogger implements Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private enableLogging = import.meta.env.VITE_ENABLE_LOGGING !== 'false';

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    if (!this.isDevelopment && !this.enableLogging) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;

    switch (level) {
      case 'info':
        console.info(logMessage, ...args);
        break;
      case 'warn':
        console.warn(logMessage, ...args);
        break;
      case 'error':
        console.error(logMessage, ...args);
        break;
      case 'debug':
        console.debug(logMessage, ...args);
        break;
    }
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args);
  }
}

// Create singleton logger instance
export const logger = new ProductionLogger();

// Auth-specific logger for backward compatibility
export const authLogger = {
  info: (message: string, ...args: unknown[]) => logger.info(`[AUTH] ${message}`, ...args),
  success: (message: string, ...args: unknown[]) => logger.info(`[AUTH] ✅ ${message}`, ...args),
  error: (message: string, ...args: unknown[]) => logger.error(`[AUTH] ❌ ${message}`, ...args),
  warn: (message: string, ...args: unknown[]) => logger.warn(`[AUTH] ⚠️ ${message}`, ...args),
  network: (message: string, ...args: unknown[]) => logger.debug(`[AUTH] 🌐 ${message}`, ...args),
};