import { devLogger } from '@/utils/devLogger'

const isAvailable = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    return !!window.localStorage
  } catch {
    return false
  }
}

const get = (key: string): string | null => {
  if (!isAvailable()) return null
  try {
    return window.localStorage.getItem(key)
  } catch (e) {
    devLogger.warn(`storage.get failed for "${key}":`, e instanceof Error ? e : String(e))
    return null
  }
}

const set = (key: string, value: string): void => {
  if (!isAvailable()) return
  try {
    window.localStorage.setItem(key, value)
  } catch (e) {
    devLogger.warn(`storage.set failed for "${key}":`, e instanceof Error ? e : String(e))
  }
}

const getJSON = <T>(key: string): T | null => {
  const raw = get(key)
  if (raw === null) return null
  try {
    return JSON.parse(raw) as T
  } catch (e) {
    devLogger.warn(`storage.getJSON failed for "${key}":`, e instanceof Error ? e : String(e))
    return null
  }
}

const setJSON = <T>(key: string, value: T): void => {
  try {
    set(key, JSON.stringify(value))
  } catch (e) {
    devLogger.warn(`storage.setJSON failed for "${key}":`, e instanceof Error ? e : String(e))
  }
}

const remove = (key: string): void => {
  if (!isAvailable()) return
  try {
    window.localStorage.removeItem(key)
  } catch (e) {
    devLogger.warn(`storage.remove failed for "${key}":`, e instanceof Error ? e : String(e))
  }
}

const clear = (): void => {
  if (!isAvailable()) return
  try {
    window.localStorage.clear()
  } catch (e) {
    devLogger.warn('storage.clear failed:', e instanceof Error ? e : String(e))
  }
}

export const storage = { get, set, getJSON, setJSON, remove, clear }
