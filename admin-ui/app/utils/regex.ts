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

/** Escapes regex-special characters in a string so it can be used literally in a RegExp. */
function escapeRegexSpecialChars(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Builds a RegExp that matches a single braced placeholder for the given key (e.g. key="name" -> /\{name\}/g). Key is escaped so metacharacters match literally. */
export function regexForBracedKey(key: string): RegExp {
  return new RegExp(`\\{${escapeRegexSpecialChars(key)}\\}`, 'g')
}
