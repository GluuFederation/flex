/** Trailing period at end of string - used to strip trailing dots from status messages etc. */
export const REGEX_TRAILING_PERIOD = /\.$/

/** Matches any character that is not alphanumeric, underscore, or hyphen — i.e. not valid in a slug or HTML id. */
export const REGEX_NON_SLUG_CHARS = /[^a-zA-Z0-9_-]/g
/** Matches one or more consecutive hyphens; use with replace('-') to collapse runs into a single hyphen. */
export const REGEX_CONSECUTIVE_HYPHENS = /-+/g
/** Matches one or more leading or trailing hyphens; use with replace('') to trim. */
export const REGEX_LEADING_TRAILING_HYPHENS = /^-+|-+$/g

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

/** Strips a script file extension (.ts, .tsx, .js, .jsx) from a path; used to normalize module keys. */
export const REGEX_SCRIPT_EXTENSION = /\.(?:tsx?|jsx?)$/

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
