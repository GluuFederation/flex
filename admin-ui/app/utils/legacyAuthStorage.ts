import { storage } from '@/utils/storage'
import { REGEX_APPAUTH_STORAGE_KEY } from '@/utils/regex'

const LEGACY_PERSIST_KEY = 'persist:root'

export const clearLegacyAuthStorage = (): void => {
  storage.remove(LEGACY_PERSIST_KEY)
  storage
    .keys()
    .filter((key) => REGEX_APPAUTH_STORAGE_KEY.test(key))
    .forEach((key) => storage.remove(key))
}
