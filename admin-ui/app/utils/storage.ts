import { logger } from '@/utils/logger'

type StorageArea = 'localStorage' | 'sessionStorage'

const createStorage = (area: StorageArea, label: string) => {
  const isAvailable = (): boolean => {
    if (typeof window === 'undefined') return false
    try {
      return !!window[area]
    } catch {
      return false
    }
  }

  const get = (key: string): string | null => {
    if (!isAvailable()) return null
    try {
      return window[area].getItem(key)
    } catch (e) {
      logger.error(`${label}.get failed for "${key}":`, e instanceof Error ? e : String(e))
      return null
    }
  }

  const set = (key: string, value: string): void => {
    if (!isAvailable()) return
    try {
      window[area].setItem(key, value)
    } catch (e) {
      logger.error(`${label}.set failed for "${key}":`, e instanceof Error ? e : String(e))
    }
  }

  const getJSON = <T>(key: string): T | null => {
    const raw = get(key)
    if (raw === null) return null
    try {
      return JSON.parse(raw) as T
    } catch (e) {
      logger.error(`${label}.getJSON failed for "${key}":`, e instanceof Error ? e : String(e))
      return null
    }
  }

  const setJSON = <T>(key: string, value: T): void => {
    try {
      set(key, JSON.stringify(value))
    } catch (e) {
      logger.error(`${label}.setJSON failed for "${key}":`, e instanceof Error ? e : String(e))
    }
  }

  const remove = (key: string): void => {
    if (!isAvailable()) return
    try {
      window[area].removeItem(key)
    } catch (e) {
      logger.error(`${label}.remove failed for "${key}":`, e instanceof Error ? e : String(e))
    }
  }

  const clear = (): void => {
    if (!isAvailable()) return
    try {
      window[area].clear()
    } catch (e) {
      logger.error(`${label}.clear failed:`, e instanceof Error ? e : String(e))
    }
  }

  return { get, set, getJSON, setJSON, remove, clear }
}

export const storage = createStorage('localStorage', 'storage')
export const sessionStore = createStorage('sessionStorage', 'sessionStore')
