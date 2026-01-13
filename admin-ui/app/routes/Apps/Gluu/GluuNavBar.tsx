import { useState, useEffect, memo, useRef, useMemo } from 'react'
import Box from '@mui/material/Box'
import { Nav, NavItem, Notifications, SidebarTrigger } from 'Components'
import { LanguageMenu } from './LanguageMenu'
import { ThemeDropdownComponent } from './ThemeDropdown'
import { useSelector } from 'react-redux'
import { DropdownProfile } from 'Routes/components/Dropdowns/DropdownProfile'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
import { useNewNavbarStyles } from './styles/GluuNavBar.style'
import { useNavbarTheme } from './hooks/useNavbarTheme'
import { usePageTitle } from './hooks/usePageTitle'
import { UserIcon } from './components/UserIcon'
import type { UserInfo } from 'Redux/features/types/authTypes'

const ChevronIcon = memo(() => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
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

const userInfoSelector = (state: { authReducer: { userinfo: UserInfo | null } }) =>
  state.authReducer.userinfo

const GluuNavBar = () => {
  const userInfo = useSelector(userInfoSelector)

  const { navbarColors } = useNavbarTheme()
  const { classes } = useNewNavbarStyles(navbarColors)()
  const pageTitle = usePageTitle()
  const navbarRef = useRef<HTMLDivElement>(null)

  const [showCollapse, setShowCollapse] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_BREAKPOINT).matches : false,
  )

  useEffect(() => {
    if (!navbarRef.current) return

    const element = navbarRef.current
    element.style.setProperty('background-color', navbarColors.background, 'important')
    element.style.setProperty('border-bottom', `1px solid ${navbarColors.border}`, 'important')
    element.style.setProperty('--theme-navbar-background', navbarColors.background, 'important')
    element.style.setProperty('--theme-navbar-text', navbarColors.text, 'important')
    element.style.setProperty('--theme-navbar-icon', navbarColors.icon, 'important')
    element.style.setProperty('--theme-navbar-border', navbarColors.border, 'important')

    const pageTitleElement = document.getElementById('page-title-navbar')
    if (pageTitleElement) {
      pageTitleElement.style.setProperty('color', navbarColors.text, 'important')
      pageTitleElement.style.setProperty('font-weight', '700', 'important')
    }
  }, [navbarColors])

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
  }, [
    userInfo?.given_name,
    userInfo?.family_name,
    userInfo?.sn,
    userInfo?.name,
    userInfo?.user_name,
    userInfo?.display_name,
    userInfo?.displayName,
    userInfo?.nickname,
  ])

  const avatarUrl = useMemo(() => {
    if (!userInfo) return null

    return userInfo.picture || userInfo.avatar || userInfo.photo || userInfo.image || null
  }, [userInfo?.picture, userInfo?.avatar, userInfo?.photo, userInfo?.image])

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <Box
        ref={navbarRef}
        className={`${classes.navbarWrapper} navbar-themed`}
        sx={{
          'backgroundColor': `${navbarColors.background} !important`,
          'borderBottom': `1px solid ${navbarColors.border} !important`,
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
              userinfo={userInfo || undefined}
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
