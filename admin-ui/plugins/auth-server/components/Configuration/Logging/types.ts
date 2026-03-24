export type ChangedFields<T extends object> = {
  [K in keyof T]?: { oldValue: T[K]; newValue: T[K] }
}
