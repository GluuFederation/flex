type JsonPrimitive = string | number | boolean | null

type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

type JsonObject = { [key: string]: JsonValue }

type MetricRawData = JsonValue | undefined

export type { JsonObject, JsonPrimitive, JsonValue, MetricRawData }
