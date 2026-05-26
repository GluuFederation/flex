import * as dotenv from 'dotenv'
import { TextEncoder, TextDecoder } from 'node:util'

dotenv.config({ path: '.env.test', quiet: true })

if (typeof globalThis.TextEncoder === 'undefined') {
  globalThis.TextEncoder = TextEncoder
}
if (typeof globalThis.TextDecoder === 'undefined') {
  globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder
}
