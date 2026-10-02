import { DEFAULT_THEME } from '@/context/theme/constants'
import { STORAGE_KEYS, DEFAULT_LANG } from '@/constants'
import { storage } from '@/utils/storage'

const clearAppStorage = (): void => {
  const userConfig = storage.get(STORAGE_KEYS.USER_CONFIG)
  const initTheme = storage.get(STORAGE_KEYS.INIT_THEME)
  const initLang = storage.get(STORAGE_KEYS.INIT_LANG)
  const pagingSize = storage.get(STORAGE_KEYS.PAGING_SIZE)
  const logLevel = storage.get(STORAGE_KEYS.LOG_LEVEL)
  storage.clear()
  storage.set(STORAGE_KEYS.INIT_THEME, initTheme || DEFAULT_THEME)
  storage.set(STORAGE_KEYS.INIT_LANG, initLang || DEFAULT_LANG)
  if (pagingSize) storage.set(STORAGE_KEYS.PAGING_SIZE, pagingSize)
  if (logLevel) storage.set(STORAGE_KEYS.LOG_LEVEL, logLevel)

  if (userConfig && userConfig !== 'null') {
    storage.set(STORAGE_KEYS.USER_CONFIG, userConfig)
  }
}

export default clearAppStorage
