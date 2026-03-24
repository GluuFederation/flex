/** Trailing period at end of string - used to strip trailing dots from status messages etc. */
export const REGEX_TRAILING_PERIOD = /\.$/

/** Replace characters that are invalid in HTML id attributes (keep alphanumeric, underscore, hyphen). */
export const REGEX_ID_SANITIZE_CHARS = /[^a-zA-Z0-9_-]/g
/** Collapse consecutive hyphens into one. */
export const REGEX_ID_COLLAPSE_HYPHENS = /-+/g
/** Remove one or more leading/trailing hyphens. */
export const REGEX_ID_TRIM_HYPHENS = /^-+|-+$/g

/** Leading colon only (e.g. strip leading colon from IDs). */
export const REGEX_LEADING_COLON = /^:/

/** Leading or trailing double-quote only; used to strip surrounding quotes from strings (e.g. license fields). */
export const REGEX_SURROUNDING_QUOTES = /^"|"$/g

/** Audit log line: optional timestamp (DD-MM-YYYY HH:mm:ss.mmm) then content. Capture groups: [1] timestamp, [2] rest. */
export const REGEX_AUDIT_LIST_TIMESTAMP = /^(\d{2}-\d{2}-\d{4} \d{2}:\d{2}:\d{2}\.\d{3})\s+(.+)$/

/** Matches braced placeholders like {key} or {some.key}; use with .match() for finding all placeholders in a string. */
export const REGEX_BRACED_PLACEHOLDER = /\{([^{}]+?)\}/g

/** Matches URL/shortcode placeholders like ${inum} or ${name}; use with .replace() to normalize URLs before validation. */
export const REGEX_URL_PLACEHOLDER = /\$\{[^}]*\}/g

/** Boundary between lower/number and upper case characters; used for camelCase to snake_case transforms. */
export const REGEX_CAMEL_TO_SNAKE_BOUNDARY = /([a-z0-9])([A-Z])/g
/** One or more spaces or hyphens; used to normalize separators to underscores. */
export const REGEX_SPACE_OR_HYPHEN_SEQUENCE = /[\s-]+/g
/** One or more non-alphanumeric characters; used to compact labels into key-safe tokens. */
export const REGEX_NON_ALPHANUMERIC_SEQUENCE = /[^a-zA-Z0-9]+/g

/** Validates normalized webhook URL format: https://host[:port][/path][?query][#hash]. Host: domain, IPv4, or IPv6. Port: 1–5 digits (0–65535). */
export const REGEX_WEBHOOK_URL =
  /^https:\/\/(([\w-]+\.)+[\w-]+|\[[\da-fA-F:]+\])(:\d{1,5})?(\/[^\s?#]*)?(\?[^\s#]*)?(#[^\s]*)?$/i

/** Escapes regex-special characters in a string so it can be used literally in a RegExp. */
function escapeRegexSpecialChars(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Builds a RegExp that matches a single braced placeholder for the given key (e.g. key="name" -> /\{name\}/g). Key is escaped so metacharacters match literally. */
export function regexForBracedKey(key: string): RegExp {
  return new RegExp(`\\{${escapeRegexSpecialChars(key)}\\}`, 'g')
}

/** Builds translation key candidates from a raw property key (original, lower-first, snake_case variants). */
export function buildKeyCandidates(key: string): string[] {
  const lowerFirst = key ? `${key.charAt(0).toLowerCase()}${key.slice(1)}` : key
  const snakeCase = key
    .replace(REGEX_CAMEL_TO_SNAKE_BOUNDARY, '$1_$2')
    .replace(REGEX_SPACE_OR_HYPHEN_SEQUENCE, '_')
    .toLowerCase()
  const compactSnakeCase = key
    .replace(REGEX_NON_ALPHANUMERIC_SEQUENCE, '_')
    .replace(REGEX_CAMEL_TO_SNAKE_BOUNDARY, '$1_$2')
    .toLowerCase()

  return Array.from(new Set([key, lowerFirst, snakeCase, compactSnakeCase].filter(Boolean)))
}
