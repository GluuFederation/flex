type StorageValue = string | number | boolean | object | null

export const getStorageItem = <T extends StorageValue>(
  key: string,
  defaultValue: T,
  parser?: (value: string) => T,
): T => {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) return defaultValue

    if (parser) {
      return parser(stored)
    }

    // Auto-coerce based on defaultValue type
    if (stored === 'null') return null as T

    if (typeof defaultValue === 'boolean') {
      return (stored === 'true') as T
    }

    if (typeof defaultValue === 'number') {
      const parsed = Number(stored)
      return (isNaN(parsed) ? defaultValue : parsed) as T
    }

    if (typeof defaultValue === 'object' && defaultValue !== null) {
      try {
        return JSON.parse(stored) as T
      } catch {
        return defaultValue
      }
    }

    return stored as T
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return defaultValue
  }
}

export const setStorageItem = <T extends StorageValue>(
  key: string,
  value: T,
  serializer?: (value: T) => string,
): boolean => {
  try {
    if (value === null) {
      localStorage.removeItem(key)
      return true
    }
    let valueToStore: string
    if (serializer) {
      valueToStore = serializer(value)
    } else if (typeof value === 'object' && value !== null) {
      valueToStore = JSON.stringify(value)
    } else {
      valueToStore = String(value)
    }
    localStorage.setItem(key, valueToStore)
    return true
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
    return false
  }
}

export const removeStorageItem = (key: string): boolean => {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing localStorage key "${key}":`, error)
    return false
  }
}

export const getStorageNumber = (key: string, defaultValue: number): number => {
  return getStorageItem(key, defaultValue, (value) => {
    const parsed = Number(value)
    return isNaN(parsed) ? defaultValue : parsed
  })
}

export const getStorageBoolean = (key: string, defaultValue: boolean): boolean => {
  return getStorageItem(key, defaultValue, (value) => value === 'true')
}

export const getStorageJSON = <T extends object>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key)
    if (stored === null) return defaultValue
    return JSON.parse(stored) as T
  } catch (error) {
    console.error(`Error reading JSON from localStorage key "${key}":`, error)
    return defaultValue
  }
}

export const setStorageJSON = <T extends object>(key: string, value: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error writing JSON to localStorage key "${key}":`, error)
    return false
  }
}
