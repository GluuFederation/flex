import { useEffect } from 'react'

// Performance monitoring for code splitting
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private metrics: Map<string, number> = new Map()
  private observers: PerformanceObserver[] = []

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // Track chunk loading performance
  trackChunkLoad = (chunkName: string, startTime: number) => {
    const loadTime = performance.now() - startTime
    this.metrics.set(`chunk_${chunkName}`, loadTime)
    console.log(`Chunk ${chunkName} loaded in ${loadTime.toFixed(2)}ms`)
  }

  // Track route navigation performance
  trackRouteNavigation = (routeName: string, startTime: number) => {
    const navigationTime = performance.now() - startTime
    this.metrics.set(`route_${routeName}`, navigationTime)
    console.log(`Route ${routeName} navigated in ${navigationTime.toFixed(2)}ms`)
  }

  // Track component render performance
  trackComponentRender = (componentName: string, startTime: number) => {
    const renderTime = performance.now() - startTime
    this.metrics.set(`component_${componentName}`, renderTime)
    console.log(`Component ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
  }

  // Get performance metrics
  getMetrics = () => {
    return Object.fromEntries(this.metrics)
  }

  // Get average load times by category
  getAverageLoadTimes = () => {
    const categories = {
      chunks: [] as number[],
      routes: [] as number[],
      components: [] as number[],
    }

    this.metrics.forEach((value, key) => {
      if (key.startsWith('chunk_')) {
        categories.chunks.push(value)
      } else if (key.startsWith('route_')) {
        categories.routes.push(value)
      } else if (key.startsWith('component_')) {
        categories.components.push(value)
      }
    })

    return {
      chunks:
        categories.chunks.length > 0
          ? categories.chunks.reduce((a, b) => a + b) / categories.chunks.length
          : 0,
      routes:
        categories.routes.length > 0
          ? categories.routes.reduce((a, b) => a + b) / categories.routes.length
          : 0,
      components:
        categories.components.length > 0
          ? categories.components.reduce((a, b) => a + b) / categories.components.length
          : 0,
    }
  }

  // Monitor web vitals
  monitorWebVitals = () => {
    if ('PerformanceObserver' in window) {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        this.metrics.set('lcp', lastEntry.startTime)
        console.log('LCP:', lastEntry.startTime)
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming
          this.metrics.set('fid', fidEntry.processingStart - fidEntry.startTime)
          console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)

      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0
        const entries: PerformanceEntry[] = list.getEntries()
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as any
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value
          }
        })
        this.metrics.set('cls', clsValue)
        console.log('CLS:', clsValue)
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)
    }
  }

  // Cleanup observers
  cleanup = () => {
    this.observers.forEach((observer) => observer.disconnect())
    this.observers = []
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance()

  useEffect(() => {
    monitor.monitorWebVitals()

    return () => {
      monitor.cleanup()
    }
  }, [monitor])

  return monitor
}

// Higher-order component for performance tracking
export const withPerformanceTracking = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string,
) => {
  return (props: P) => {
    const monitor = PerformanceMonitor.getInstance()
    const startTime = performance.now()

    useEffect(() => {
      monitor.trackComponentRender(componentName, startTime)
    }, [monitor, startTime])

    return <WrappedComponent {...props} />
  }
}

// Utility for tracking async operations
export const trackAsyncOperation = async function <T>(
  operation: () => Promise<T>,
  operationName: string,
): Promise<T> {
  const monitor = PerformanceMonitor.getInstance()
  const startTime = performance.now()

  try {
    const result = await operation()
    monitor.trackChunkLoad(operationName, startTime)
    return result
  } catch (error) {
    console.error(`Failed to load ${operationName}:`, error)
    throw error
  }
}
