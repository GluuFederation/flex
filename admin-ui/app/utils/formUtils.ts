type Primitive = string | number | boolean | null | undefined

export const isObjectEqual = <T extends Record<string, Primitive | object>>(
  obj1: T,
  obj2: T,
): boolean => {
  if (obj1 === obj2) return true
  if (obj1 == null || obj2 == null) return false
  if (typeof obj1 !== 'object' || typeof obj2 !== 'object') return obj1 === obj2

  const keys1 = Object.keys(obj1) as Array<keyof T>
  const keys2 = Object.keys(obj2) as Array<keyof T>

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key)) return false

    const val1 = obj1[key]
    const val2 = obj2[key]

    if (typeof val1 === 'object' && typeof val2 === 'object') {
      if (JSON.stringify(val1) !== JSON.stringify(val2)) return false
    } else if (val1 !== val2) {
      return false
    }
  }

  return true
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
      if (JSON.stringify(current) !== JSON.stringify(initial)) {
        return true
      }
    } else if (current !== initial) {
      return true
    }
  }

  return false
}
