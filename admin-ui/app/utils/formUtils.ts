import { isEqual } from 'lodash'

type Primitive = string | number | boolean | null | undefined

export const isObjectEqual = <T extends Record<string, Primitive | object>>(
  obj1: T,
  obj2: T,
): boolean => {
  if (obj1 === obj2) return true
  if (obj1 == null || obj2 == null) return false
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2

  return isEqual(obj1, obj2)
}

export const hasFormChanges = <
  T extends Record<string, Primitive | object | Array<Primitive | object>>,
>(
  currentValues: T,
  initialValues: T,
  excludeKeys: Array<keyof T> = [],
): boolean => {
  const keys = (Object.keys(currentValues) as Array<keyof T>).filter(
    (key) => !excludeKeys.includes(key),
  )

  for (const key of keys) {
    const current = currentValues[key]
    const initial = initialValues[key]

    if (typeof current === 'object' && typeof initial === 'object') {
      if (!isEqual(current, initial)) {
        return true
      }
    } else if (current !== initial) {
      return true
    }
  }

  return false
}
