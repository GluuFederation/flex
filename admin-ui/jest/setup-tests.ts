import * as dotenv from 'dotenv'
import { TextEncoder, TextDecoder } from 'util'

dotenv.config({ path: '.env.development', quiet: true })

if (typeof globalThis.TextEncoder === 'undefined') {
  Object.assign(globalThis, { TextEncoder, TextDecoder })
}
