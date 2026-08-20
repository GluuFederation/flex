// The metric plugin leaves `data` undescribed, so it is modelled as arbitrary JSON rather than
// `unknown`: concrete enough to recurse over safely, honest about being unvalidated.
type JsonPrimitive = string | number | boolean | null

type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue }

type JsonObject = { [key: string]: JsonValue }

// What either endpoint can put in `data`: a JSON string on aggregations, an object on entries.
type MetricRawData = JsonValue | undefined

export type { JsonObject, JsonPrimitive, JsonValue, MetricRawData }
