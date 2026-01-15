import { useState, useEffect, memo, useRef, useMemo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { ErrorBoundary } from 'react-error-boundary'
import Box from '@mui/material/Box'
import { Nav, NavItem, Notifications, SidebarTrigger } from 'Components'
import { DropdownProfile } from 'Routes/components/Dropdowns/DropdownProfile'
import type { UserInfo } from 'Redux/features/types/authTypes'
import { LanguageMenu } from './LanguageMenu'
import { ThemeDropdownComponent } from './ThemeDropdown'
import GluuErrorFallBack from './GluuErrorFallBack'
import { UserIcon } from './components/UserIcon'
import { useStyles } from './styles/GluuNavBar.style'
import { useNavbarTheme } from './hooks/useNavbarTheme'
import { usePageTitle } from './hooks/usePageTitle'

const ChevronIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M4.5 6.75L9 11.25L13.5 6.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
))
ChevronIcon.displayName = 'ChevronIcon'

const MOBILE_BREAKPOINT = '(max-width: 768px)'

const selectUserInfo = (state: { authReducer: { userinfo: UserInfo | null } }) =>
  state.authReducer.userinfo

const GluuNavBar = () => {
  const userInfo = useSelector(selectUserInfo)

  const { navbarColors } = useNavbarTheme()
  const { classes } = useStyles({ navbarColors })
  const pageTitle = usePageTitle()
  const navbarRef = useRef<HTMLDivElement>(null)

  const [showCollapse, setShowCollapse] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_BREAKPOINT).matches : false,
  )

  const applyNavbarColors = useCallback((element: HTMLElement, colors: typeof navbarColors) => {
    element.style.setProperty('background-color', colors.background, 'important')
    element.style.setProperty('--theme-navbar-background', colors.background, 'important')
    element.style.setProperty('--theme-navbar-text', colors.text, 'important')
    element.style.setProperty('--theme-navbar-icon', colors.icon, 'important')
    element.style.setProperty('--theme-navbar-border', colors.border, 'important')
  }, [])

  useEffect(() => {
    if (!navbarRef.current) return
    applyNavbarColors(navbarRef.current, navbarColors)
  }, [navbarColors, applyNavbarColors])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT)
    const handleChange = (e: MediaQueryListEvent) => setShowCollapse(e.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const displayName = useMemo(() => {
    if (!userInfo) return 'User'

    const givenName = userInfo.given_name as string | undefined
    const familyName =
      (userInfo.family_name as string | undefined) || (userInfo.sn as string | undefined)

    if (givenName && familyName) {
      return `${givenName} ${familyName}`.trim()
    }

    if (givenName) return givenName
    if (familyName) return familyName

    return (
      (userInfo.name as string | undefined) ||
      (userInfo.user_name as string | undefined) ||
      (userInfo.display_name as string | undefined) ||
      (userInfo.displayName as string | undefined) ||
      (userInfo.nickname as string | undefined) ||
      'User'
    )
  }, [userInfo])

  const avatarUrl = useMemo(() => {
    if (!userInfo) return null

    const url = userInfo.picture || userInfo.avatar || userInfo.photo || userInfo.image
    return typeof url === 'string' ? url : null
  }, [userInfo])

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <Box
        ref={navbarRef}
        className={`${classes.navbarWrapper} navbar-themed`}
        sx={{
          '--theme-navbar-background': navbarColors.background,
          '--theme-navbar-text': navbarColors.text,
          '--theme-navbar-icon': navbarColors.icon,
        }}
      >
        <Box className={classes.navbarContainer}>
          <Box className={classes.leftSection}>
            {showCollapse && (
              <Nav className={classes.navLeft}>
                <NavItem>
                  <SidebarTrigger id="navToggleBtn" />
                </NavItem>
              </Nav>
            )}
            <h3 className={classes.pageTitle} id="page-title-navbar">
              {pageTitle}
            </h3>
          </Box>
          <Box className={classes.rightSection}>
            <Box className={`${classes.navbarItem} ${classes.iconButton}`}>
              <Notifications />
            </Box>
            {userInfo && (
              <>
                <Box className={`${classes.navbarItem} ${classes.languageMenuWrapper}`}>
                  <ThemeDropdownComponent userInfo={userInfo} />
                </Box>
                <Box className={`${classes.navbarItem} ${classes.languageMenuWrapper}`}>
                  <LanguageMenu userInfo={userInfo} />
                </Box>
              </>
            )}
            <DropdownProfile
              trigger={
                <Box className={`${classes.navbarItem} ${classes.userProfileContainer}`}>
                  <UserIcon size={40} className={classes.userIcon} avatarUrl={avatarUrl} />
                  <span className={classes.userName}>{displayName}</span>
                  <Box className={classes.userChevron}>
                    <ChevronIcon />
                  </Box>
                </Box>
              }
              position="bottom"
            />
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  )
}

GluuNavBar.displayName = 'GluuNavBar'

export default memo(GluuNavBar)
