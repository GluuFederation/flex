type JsonPrimitive = string | number | boolean | null

export type JsonValue =
  | JsonPrimitive
  | { [key: string]: JsonPrimitive | object | undefined }
  | (JsonPrimitive | object)[]

export type JsonObject = { [key: string]: JsonValue }
