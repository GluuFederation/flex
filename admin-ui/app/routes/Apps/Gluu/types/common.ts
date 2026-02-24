/** Canonical JSON value type for the app (API payloads, form values, etc.). */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[]

export type JsonObject = { [key: string]: JsonValue }
