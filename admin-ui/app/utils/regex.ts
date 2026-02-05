/** Trailing period at end of string - used to strip trailing dots from status messages etc. */
export const REGEX_TRAILING_PERIOD = /\.$/

/** Replace characters that are invalid in HTML id attributes (keep alphanumeric, underscore, hyphen). */
export const REGEX_ID_SANITIZE_CHARS = /[^a-zA-Z0-9_-]/g
/** Collapse consecutive hyphens into one. */
export const REGEX_ID_COLLAPSE_HYPHENS = /-+/g
/** Remove one or more leading/trailing hyphens. */
export const REGEX_ID_TRIM_HYPHENS = /^-+|-+$/g
