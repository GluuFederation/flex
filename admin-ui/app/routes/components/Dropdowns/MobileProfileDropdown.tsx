import {
  useEffect,
  useMemo,
  useCallback,
  useRef,
  useState,
  type TransitionEvent as ReactTransitionEvent,
} from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import { GluuDropdown, type GluuDropdownOption, ChevronIcon, ArrowRightIcon } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useTheme } from '@/context/theme/themeContext'
import { THEME_LIGHT, THEME_DARK } from '@/context/theme/constants'
import { useThemePersistence } from '@/hooks/useThemePersistence'
import { useLangPersistence } from '@/hooks/useLangPersistence'
import { LANG_CODES, DEFAULT_LANG } from '@/constants'
import { useStyles } from './styles/MobileProfileDropdown.style'
import type { MobileProfileDropdownProps } from './types'

const MobileProfileDropdown = ({ userInfo, renderTrigger }: MobileProfileDropdownProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { logoutAuditSucceeded } = useAppSelector((state) => state.logoutAuditReducer)

  const { state: themeState } = useTheme()
  const currentTheme = themeState.theme
  const { classes } = useStyles({ theme: currentTheme })

  const inum = userInfo?.inum

  const [isOpen, setIsOpen] = useState(false)
  const [rendered, setRendered] = useState(false)
  const [entered, setEntered] = useState(false)
  const { lang, changeLanguage } = useLangPersistence(inum)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setEntered(false)
      return undefined
    }
    setRendered(true)
    let inner = 0
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setEntered(true))
    })
    return () => {
      cancelAnimationFrame(outer)
      cancelAnimationFrame(inner)
    }
  }, [isOpen])

  const handleMenuTransitionEnd = useCallback(
    (e: ReactTransitionEvent<HTMLDivElement>): void => {
      if (e.target !== e.currentTarget || e.propertyName !== 'transform') return
      if (!isOpen) setRendered(false)
    },
    [isOpen],
  )

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

      {rendered && (
        <Box
          className={`${classes.menu} ${entered ? classes.menuOpen : ''}`}
          onTransitionEnd={handleMenuTransitionEnd}
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
              <ArrowRightIcon className={classes.arrowIcon} />
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
