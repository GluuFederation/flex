/** Trailing period at end of string - used to strip trailing dots from status messages etc. */
export const REGEX_TRAILING_PERIOD = /\.$/
/** Matches a single trailing forward slash; use to normalize URL/path strings. */
export const REGEX_TRAILING_SLASH = /\/$/
/** Matches one or more trailing forward slashes; use to strip all trailing slashes from a URL. */
export const REGEX_TRAILING_SLASHES = /\/+$/
/** Matches a leading forward slash; use to strip the leading slash from JSON Patch paths (e.g. "/key" → "key"). */
export const REGEX_LEADING_SLASH = /^\//
/** Matches all forward slashes; use with replace to convert paths to dot-notation or other delimiters. */
export const REGEX_FORWARD_SLASH = /\//g
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
/** Boundary between a lowercase letter and an uppercase letter; used for camelCase to kebab-case transforms. */
export const REGEX_CAMEL_CASE_WORD_BOUNDARY = /([a-z])([A-Z])/g
/** Matches a single uppercase letter; use with replace(' $1') to insert spaces before each capital. */
export const REGEX_UPPERCASE_LETTER = /([A-Z])/g
/** One or more spaces or hyphens; used to normalize separators to underscores. */
export const REGEX_SPACE_OR_HYPHEN_SEQUENCE = /[\s-]+/g
/** One or more non-alphanumeric characters; used to compact labels into key-safe tokens. */
export const REGEX_NON_ALPHANUMERIC_SEQUENCE = /[^a-zA-Z0-9]+/g
/** One or more consecutive whitespace characters; use with replace(' ') to collapse runs. */
export const REGEX_CONSECUTIVE_WHITESPACE = /\s+/g
/** One or more underscore or hyphen separator characters; use with split to tokenize service/variable names. */
export const REGEX_SEPARATOR_CHARS = /[_-]+/
/** No whitespace characters (allows empty); use in Yup .matches() alongside .required() for no-spaces validation. */
export const REGEX_NO_WHITESPACE = /^\S*$/
/** No whitespace characters, non-empty required; use in Yup .matches() when field must also be non-empty. */
export const REGEX_NO_WHITESPACE_STRICT = /^\S+$/
/** Alphanumeric characters and underscores only; use to validate identifier/name fields. */
export const REGEX_IDENTIFIER = /^[a-zA-Z0-9_]+$/
/** Password strength — at least one uppercase letter. */
export const REGEX_HAS_UPPERCASE = /[A-Z]/
/** Password strength — at least one lowercase letter. */
export const REGEX_HAS_LOWERCASE = /[a-z]/
/** Matches any character that is not a lowercase ASCII letter; use with replace('') after lowercasing to normalize keys for comparisons. */
export const REGEX_NON_LOWERCASE_ALPHA = /[^a-z]/g
/** Password strength — at least one digit. */
export const REGEX_HAS_DIGIT = /[0-9]/
/** Password strength — at least one special character. */
export const REGEX_HAS_SPECIAL_CHAR = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/
/** Validates a date string in YYYY-MM-DD format. */
export const REGEX_DATE_YYYY_MM_DD = /^\d{4}-\d{2}-\d{2}$/
/** Validates a hex color string (with or without leading #); capture groups [1][2][3] are R, G, B as hex pairs. */
export const REGEX_HEX_COLOR = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
/** UUID template placeholder characters (x and y); used in the uuidv4 fallback to substitute random hex digits. */
export const REGEX_UUID_PLACEHOLDER_CHARS = /[xy]/g
/** CSV formula injection: cell starts with =, +, -, or @ — prefix with a single quote to neutralize. */
export const REGEX_CSV_FORMULA_INJECTION = /^[=+\-@]/
/** CSV special characters (double-quote, comma, newline, carriage return) that require the cell to be quoted. */
export const REGEX_CSV_SPECIAL_CHARS = /[",\n\r]/
/** Matches a double-quote character; use with replace('""') to escape quotes inside CSV cells. */
export const REGEX_DOUBLE_QUOTE = /"/g
/** Matches date/time separator characters (slash, colon, comma); use to normalize datetime strings for filenames. */
export const REGEX_DATE_SEPARATOR_CHARS = /[/:,]/g
/** Matches a single whitespace character (global); use with replace('_') to convert spaces in filenames. */
export const REGEX_WHITESPACE_CHAR = /\s/g
/** Matches KeyOps enum values in the orval-generated JansConfigApi.ts that need the backslash escape fixed. Capture groups: [1] opening quote+prefix, [2] raw value, [3] closing quote. */
export const REGEX_ORVAL_KEYOPS_ENUM = /('KeyOps\{value=\\')([^'\\]+)(')/g
/** Strips a script file extension (.ts, .tsx, .js, .jsx) from a path; used to normalize module keys. */
export const REGEX_SCRIPT_EXTENSION = /\.(?:tsx?|jsx?)$/
/** Captures the plugin name from a metadata file path; e.g. './auth-server/plugin-metadata' → capture group [1] = 'auth-server'. */
export const REGEX_PLUGIN_NAME_FROM_PATH = /\.\/([^/]+)\/plugin-metadata/
/** Matches a hostname starting with 100.x. for carrier-grade NAT range detection (100.64.0.0/10, RFC 6598). Capture group [1] is the second octet. */
export const REGEX_CGNAT_IP_PREFIX = /^100\.(\d+)\./
/** Matches a hostname starting with 172.x. for private IP range detection (172.16.0.0/12). Capture group [1] is the second octet. */
export const REGEX_PRIVATE_172_IP_PREFIX = /^172\.(\d+)\./
/** Validates normalized webhook URL format: https://host[:port][/path][?query][#hash]. Host: domain, IPv4, or IPv6. Port: 1–5 digits (0–65535). */
export const REGEX_WEBHOOK_URL =
  /^https:\/\/(([\w-]+\.)+[\w-]+|\[[\da-fA-F:]+\])(:\d{1,5})?(\/[^\s?#]*)?(\?[^\s#]*)?(#[^\s]*)?$/i
/** Validates an email address (RFC 5321-compatible surface check). */
export const REGEX_EMAIL = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
/** Escapes regex-special characters in a string so it can be used literally in a RegExp. */
const escapeRegexSpecialChars = (s: string): string => {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
/** Builds a RegExp that matches a single braced placeholder for the given key (e.g. key="name" -> /\{name\}/g). Key is escaped so metacharacters match literally. */
export const regexForBracedKey = (key: string): RegExp => {
  return new RegExp(`\\{${escapeRegexSpecialChars(key)}\\}`, 'g')
}
