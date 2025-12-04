import { logger } from './logger';

/**
 * Performance monitoring utilities for production
 */

interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private timers: Map<string, number> = new Map();

  /**
   * Start timing an operation
   */
  startTimer(name: string): void {
    this.timers.set(name, performance.now());
  }

  /**
   * End timing and log the duration
   */
  endTimer(name: string): number | null {
    const startTime = this.timers.get(name);
    if (!startTime) {
      logger.warn(`[PERF] Timer '${name}' was not started`);
      return null;
    }

    const duration = performance.now() - startTime;
    this.timers.delete(name);

    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);
    logger.debug(`[PERF] ${name}: ${duration.toFixed(2)}ms`);

    return duration;
  }

  /**
   * Log a custom metric
   */
  logMetric(name: string, duration: number): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
    };

    this.metrics.push(metric);
    logger.debug(`[PERF] ${name}: ${duration.toFixed(2)}ms`);
  }

  /**
   * Get all metrics (for debugging)
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.timers.clear();
  }

  /**
   * Monitor React component render time
   */
  measureRender<T extends Record<string, unknown>>(
    componentName: string,
    renderFn: () => T
  ): T {
    this.startTimer(`render-${componentName}`);
    const result = renderFn();
    this.endTimer(`render-${componentName}`);
    return result;
  }
}

// Export singleton instance
export const perf = new PerformanceMonitor();

/**
 * Decorator for timing async functions
 */
export function timed(name?: string) {
  return function <T extends (...args: any[]) => Promise<any>>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ) {
    const originalMethod = descriptor.value!;
    const timerName = name || `${target.constructor.name}.${propertyKey}`;

    descriptor.value = async function (...args: any[]) {
      perf.startTimer(timerName);
      try {
        const result = await originalMethod.apply(this, args);
        return result;
      } finally {
        perf.endTimer(timerName);
      }
    } as T;

    return descriptor;
  };
}