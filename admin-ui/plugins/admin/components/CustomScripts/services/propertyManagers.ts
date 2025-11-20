import type { SimpleCustomProperty, SimpleExtendedCustomProperty } from '../types/domain'

/**
 * Update or add a property in an array
 * @param properties - Current properties array
 * @param key - Property key (value1)
 * @param value - Property value (value2)
 * @returns Updated properties array
 */
export function updatePropertyInArray(
  properties: SimpleCustomProperty[],
  key: string,
  value: string,
): SimpleCustomProperty[] {
  const existingIndex = properties.findIndex((p) => p.value1 === key)

  if (existingIndex >= 0) {
    const updated = [...properties]
    updated[existingIndex] = {
      ...updated[existingIndex],
      value1: key,
      value2: value,
    }
    return updated
  } else {
    return [...properties, { value1: key, value2: value }]
  }
}

/**
 * Remove a property from an array by key
 * @param properties - Current properties array
 * @param key - Property key to remove
 * @returns Updated properties array
 */
export function removePropertyFromArray(
  properties: SimpleCustomProperty[],
  key: string,
): SimpleCustomProperty[] {
  return properties.filter((p) => p.value1 !== key)
}

/**
 * Update or add an extended property in an array
 * @param properties - Current properties array
 * @param key - Property key (value1)
 * @param value - Property value (value2)
 * @param description - Optional description
 * @param hide - Optional hide flag
 * @returns Updated properties array
 */
export function updateExtendedPropertyInArray(
  properties: SimpleExtendedCustomProperty[],
  key: string,
  value: string,
  description?: string,
  hide?: boolean,
): SimpleExtendedCustomProperty[] {
  const existingIndex = properties.findIndex((p) => p.value1 === key)

  const newProperty: SimpleExtendedCustomProperty = {
    value1: key,
    value2: value,
  }

  if (description !== undefined) {
    newProperty.description = description
  }

  if (hide !== undefined) {
    newProperty.hide = hide
  }

  if (existingIndex >= 0) {
    const updated = [...properties]
    updated[existingIndex] = newProperty
    return updated
  } else {
    return [...properties, newProperty]
  }
}

/**
 * Remove an extended property from an array by key
 * @param properties - Current properties array
 * @param key - Property key to remove
 * @returns Updated properties array
 */
export function removeExtendedPropertyFromArray(
  properties: SimpleExtendedCustomProperty[],
  key: string,
): SimpleExtendedCustomProperty[] {
  return properties.filter((p) => p.value1 !== key)
}

/**
 * Check if a property exists in an array
 * @param properties - Properties array to check
 * @param key - Property key to find
 * @returns True if property exists
 */
export function propertyExists(
  properties: SimpleCustomProperty[] | SimpleExtendedCustomProperty[],
  key: string,
): boolean {
  return properties.some((p) => p.value1 === key)
}

/**
 * Get property value by key
 * @param properties - Properties array
 * @param key - Property key to find
 * @returns Property value if found, undefined otherwise
 */
export function getPropertyValue(
  properties: SimpleCustomProperty[] | SimpleExtendedCustomProperty[],
  key: string,
): string | undefined {
  return properties.find((p) => p.value1 === key)?.value2
}

/**
 * Validate property key (no empty keys allowed)
 * @param key - Property key to validate
 * @returns True if valid
 */
export function isValidPropertyKey(key: string): boolean {
  return key.trim().length > 0
}

/**
 * Validate property value
 * @param value - Property value to validate
 * @param required - Whether value is required
 * @returns True if valid
 */
export function isValidPropertyValue(value: string, required = false): boolean {
  if (required) {
    return value.trim().length > 0
  }
  return true
}

/**
 * Clean properties array (remove empty or invalid properties)
 * @param properties - Properties array to clean
 * @returns Cleaned properties array
 */
export function cleanProperties<T extends SimpleCustomProperty | SimpleExtendedCustomProperty>(
  properties: T[],
): T[] {
  return properties.filter(
    (p) => isValidPropertyKey(p.value1 ?? '') && isValidPropertyValue(p.value2 ?? ''),
  )
}

/**
 * Merge two property arrays (second array takes precedence)
 * @param base - Base properties array
 * @param override - Override properties array
 * @returns Merged properties array
 */
export function mergeProperties<T extends SimpleCustomProperty | SimpleExtendedCustomProperty>(
  base: T[],
  override: T[],
): T[] {
  const merged = [...base]

  override.forEach((overrideProp) => {
    const existingIndex = merged.findIndex((p) => p.value1 === overrideProp.value1)
    if (existingIndex >= 0) {
      merged[existingIndex] = overrideProp
    } else {
      merged.push(overrideProp)
    }
  })

  return merged
}

/**
 * Convert properties array to key-value map
 * @param properties - Properties array
 * @returns Key-value map
 */
export function propertiesToMap(
  properties: SimpleCustomProperty[] | SimpleExtendedCustomProperty[],
): Record<string, string> {
  const map: Record<string, string> = {}
  properties.forEach((p) => {
    if (p.value1) {
      map[p.value1] = p.value2 ?? ''
    }
  })
  return map
}

/**
 * Convert key-value map to properties array
 * @param map - Key-value map
 * @returns Properties array
 */
export function mapToProperties(map: Record<string, string>): SimpleCustomProperty[] {
  return Object.entries(map).map(([key, value]) => ({
    value1: key,
    value2: value,
  }))
}
