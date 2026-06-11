import { REGEX_BASE64URL_MINUS, REGEX_BASE64URL_UNDERSCORE } from '@/utils/regex'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }
type JsonObject = { [key: string]: JsonValue }

const BASE64_GROUP_SIZE = 4

const decodeJwt = <T = JsonObject>(token: string): T => {
  const segments = typeof token === 'string' ? token.split('.') : []
  const payloadSegment = segments[1]
  if (segments.length < 2 || !payloadSegment) {
    throw new Error('decodeJwt: value is not a valid JWT')
  }
  const base64 = payloadSegment
    .replace(REGEX_BASE64URL_MINUS, '+')
    .replace(REGEX_BASE64URL_UNDERSCORE, '/')
  const remainder = base64.length % BASE64_GROUP_SIZE
  const padded = remainder
    ? base64.padEnd(base64.length + (BASE64_GROUP_SIZE - remainder), '=')
    : base64
  let json: string
  try {
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    json = new TextDecoder().decode(bytes)
  } catch {
    throw new Error('decodeJwt: token payload is not valid base64url')
  }
  try {
    const payload: T = JSON.parse(json)
    return payload
  } catch {
    throw new Error('decodeJwt: token payload is not valid JSON')
  }
}
export default decodeJwt
