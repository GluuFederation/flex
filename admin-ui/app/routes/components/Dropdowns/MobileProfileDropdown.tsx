import { useEffect, useMemo, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption, ChevronIcon } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import { ensureLocaleLoaded } from '@/i18n'
import { useThemePersistence } from '@/hooks/useThemePersistence'
import { logger } from '@/utils/logger'
import { storage } from '@/utils/storage'
import { STORAGE_KEYS, LANG_CODES, DEFAULT_LANG } from '@/constants'
import type { UserInfo } from 'Redux/features/types/authTypes'
import { useStyles } from './styles/MobileProfileDropdown.style'

type UserConfig = {
  lang?: Record<string, string>
  theme?: Record<string, string>
}

type MobileProfileDropdownProps = {
  userInfo: UserInfo | null
  renderTrigger: (isOpen: boolean) => React.ReactNode
}

const safeParseUserConfig = (): UserConfig =>
  storage.getJSON<UserConfig>(STORAGE_KEYS.USER_CONFIG) ?? {}

const getInitialLang = (inum?: string): string => {
  const initLang = storage.get(STORAGE_KEYS.INIT_LANG) || DEFAULT_LANG
  const config = safeParseUserConfig()
  return config?.lang?.[inum || ''] || initLang
}

const MobileProfileDropdown = ({ userInfo, renderTrigger }: MobileProfileDropdownProps) => {
  const { t, i18n } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { logoutAuditSucceeded } = useAppSelector((state) => state.logoutAuditReducer)

  const { state: themeState } = useTheme()
  const currentTheme = themeState.theme
  const isDark = currentTheme === THEME_DARK
  const { classes } = useStyles({ isDark })

  const inum = userInfo?.inum

  const [isOpen, setIsOpen] = useState(false)
  const [lang, setLang] = useState<string>(() => getInitialLang(inum))
  const containerRef = useRef<HTMLDivElement>(null)

  // Close the menu when a logout audit completes and we navigate away.
  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [logoutAuditSucceeded, navigateToRoute])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const onChangeTheme = useThemePersistence(userInfo)

  const changeLanguage = useCallback(
    (code: string) => {
      setLang(code)
      // i18n falls back to DEFAULT_LANG when a bundle is missing, so a failure
      // here is not worth reverting the stored preference for.
      void ensureLocaleLoaded(code)
        .then(() => i18n.changeLanguage(code))
        .catch((error) => {
          logger.error(
            `Failed to switch language to "${code}":`,
            error instanceof Error ? error : String(error),
          )
        })

      const config = safeParseUserConfig()
      const langConfig = { ...(config?.lang || {}) }
      if (inum) {
        langConfig[inum] = code
      }
      storage.setJSON(STORAGE_KEYS.USER_CONFIG, { ...config, lang: langConfig })
      storage.set(STORAGE_KEYS.INIT_LANG, code)
    },
    [i18n, inum],
  )

  const handleProfile = useCallback(() => {
    setIsOpen(false)
    navigateToRoute(ROUTES.PROFILE)
  }, [navigateToRoute])

  const handleLogout = useCallback(() => {
    setIsOpen(false)
    dispatch(auditLogoutLogs({ message: 'User logged out manually' }))
  }, [dispatch])

  const themeOptions: GluuDropdownOption<string>[] = useMemo(
    () => [
      { value: THEME_LIGHT, label: t('themes.light') },
      { value: THEME_DARK, label: t('themes.dark') },
    ],
    [t],
  )

  const languageOptions: GluuDropdownOption<string>[] = useMemo(
    () => [
      { value: LANG_CODES.EN, label: t('languages.english') },
      { value: LANG_CODES.FR, label: t('languages.french') },
      { value: LANG_CODES.PT, label: t('languages.portuguese') },
      { value: LANG_CODES.ES, label: t('languages.spanish') },
    ],
    [t],
  )

  const themeLabel = currentTheme === THEME_DARK ? t('themes.dark') : t('themes.light')
  // Match the desktop navbar language control: show the uppercased code (e.g. "FR").
  const langLabel = (lang || DEFAULT_LANG).split('-')[0].toUpperCase()

  return (
    <Box ref={containerRef} sx={{ position: 'relative' }}>
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen((prev) => !prev)
          }
        }}
        sx={{ cursor: 'pointer' }}
      >
        {renderTrigger(isOpen)}
      </Box>

      {isOpen && (
        <Box
          className={classes.menu}
          role="menu"
          sx={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 1200 }}
        >
          <div
            className={`${classes.row} ${classes.profileRow}`}
            role="menuitem"
            tabIndex={0}
            onClick={handleProfile}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleProfile()
              }
            }}
          >
            <GluuText variant="span" className={classes.rowLabel}>
              {t('menus.my_profile')}
            </GluuText>
            <span className={classes.arrowButton} aria-hidden="true">
              <svg
                className={classes.arrowIcon}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
              >
                <path
                  d="M1 5h8M5.5 1.5L9 5l-3.5 3.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>

          <hr className={classes.divider} />

          <div className={classes.row}>
            <GluuText variant="span" className={classes.rowLabel}>
              {t('themes.theme')}
            </GluuText>
            <GluuDropdown
              options={themeOptions}
              selectedValue={currentTheme}
              onSelect={(value) => onChangeTheme(value)}
              position="bottom"
              minWidth={96}
              maxWidth={140}
              showArrow={false}
              closeOnSelect
              dropdownClassName={classes.compactMenu}
              renderTrigger={() => (
                <span className={classes.control}>
                  <span className={classes.controlText}>{themeLabel}</span>
                  <span className={classes.controlIcon}>
                    <ChevronIcon />
                  </span>
                </span>
              )}
            />
          </div>

          <hr className={classes.divider} />

          <div className={classes.row}>
            <GluuText variant="span" className={classes.rowLabel}>
              {t('languages.language')}
            </GluuText>
            <GluuDropdown
              options={languageOptions}
              selectedValue={lang}
              onSelect={(value) => changeLanguage(value)}
              position="bottom"
              minWidth={96}
              maxWidth={140}
              showArrow={false}
              closeOnSelect
              dropdownClassName={classes.compactMenu}
              renderTrigger={() => (
                <span className={classes.control}>
                  <span className={classes.controlText}>{langLabel}</span>
                  <span className={classes.controlIcon}>
                    <ChevronIcon />
                  </span>
                </span>
              )}
            />
          </div>

          <button type="button" className={classes.signOut} onClick={handleLogout}>
            <GluuText variant="span" className={classes.signOutText}>
              {t('menus.signout')}
            </GluuText>
          </button>
        </Box>
      )}
    </Box>
  )
}

MobileProfileDropdown.displayName = 'MobileProfileDropdown'

export { MobileProfileDropdown }
