import { cedarlingClient } from '../CedarlingClient'

/**
 * @typedef {Object} MemoryThresholds
 * @property {number} wasmMemoryMB - WASM memory threshold in MB
 * @property {number} jsHeapMB - JavaScript heap memory threshold in MB
 */

/**
 * Sets up memory monitoring for the Cedarling client
 * @param {MemoryThresholds} [thresholds={ wasmMemoryMB: 100, jsHeapMB: 200 }] - Memory thresholds
 * @returns {Function} Cleanup function to stop monitoring
 */
export const setupMemoryMonitoring = (thresholds = { wasmMemoryMB: 100, jsHeapMB: 200 }) => {
  const memoryCheckInterval = 2000 * 1 // Check every 2*1 seconds
  let previousMetrics = null

  const checkMemory = async () => {
    try {
      const metrics = await cedarlingClient.getMemoryMetrics()
      const timestamp = new Date(metrics.timestamp).toISOString()
      // Calculate memory usage
      const memoryUsage = {
        wasm: {
          current: metrics.wasmMemory.current / (1024 * 1024),
          peak: metrics.wasmMemory?.peak ? metrics.wasmMemory?.peak / (1024 * 1024) : null,
        },
        jsHeap: {
          used: metrics.jsHeap?.used ? metrics.jsHeap?.used / (1024 * 1024) : null,
          total: metrics.jsHeap?.total ? metrics.jsHeap?.total / (1024 * 1024) : null,
        },
        system: {
          deviceMemory: metrics.systemInfo.deviceMemory,
          cores: metrics.systemInfo.hardwareConcurrency,
        },
      }

      // Calculate memory trends if previous metrics exist
      if (previousMetrics) {
        const timeDiff = (metrics.timestamp - previousMetrics.timestamp) / 1000 // seconds
        const wasmGrowthRate =
          (memoryUsage.wasm.current - previousMetrics.wasmMemory.current / (1024 * 1024)) / timeDiff

        if (wasmGrowthRate > 5) {
          // Growing more than 5MB/s
          console.warn('High WASM memory growth rate detected:', wasmGrowthRate.toFixed(2), 'MB/s')
        }
      }
      // Log current memory state
      console.debug(`Memory Usage [${timestamp}]:`, {
        wasmMemoryMB: memoryUsage.wasm.current.toFixed(2) + 'MB',
        wasmPeakMB: memoryUsage.wasm.peak?.toFixed(2) + 'MB' || 'N/A',
        jsHeapUsedMB: memoryUsage.jsHeap.used?.toFixed(2) + 'MB' || 'N/A',
        jsHeapTotalMB: memoryUsage.jsHeap.total?.toFixed(2) + 'MB' || 'N/A',
        deviceMemory: memoryUsage.system.deviceMemory
          ? `${memoryUsage.system.deviceMemory}GB`
          : 'N/A',
        totalOperations: metrics.totalOperations,
      })
      // Check thresholds and initiate cleanup if needed
      const needsCleanup = [
        memoryUsage.wasm.current > thresholds.wasmMemoryMB,
        memoryUsage.jsHeap.used && memoryUsage.jsHeap.used > thresholds.jsHeapMB,
      ].some(Boolean)
      if (needsCleanup) {
        console.warn('High memory usage detected, initiating cleanup...')
        await cedarlingClient.cleanup()
      }
      // Store metrics for trend analysis
      previousMetrics = metrics
    } catch (error) {
      console.error('Error monitoring memory:', error)
    }
  }

  // Initial check
  checkMemory()
  // Set up periodic checks
  const intervalId = setInterval(checkMemory, memoryCheckInterval)
  // Return cleanup function
  return () => {
    clearInterval(intervalId)
    previousMetrics = null
  }
}
