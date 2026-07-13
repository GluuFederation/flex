import { storage } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants'

type UserConfig = {
  lang?: Record<string, string>
  theme?: Record<string, string>
}

const safeParseUserConfig = (): UserConfig =>
  storage.getJSON<UserConfig>(STORAGE_KEYS.USER_CONFIG) ?? {}

export { safeParseUserConfig }
export type { UserConfig }
