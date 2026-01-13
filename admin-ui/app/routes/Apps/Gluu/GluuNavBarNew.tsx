import { useState, useEffect, useMemo, memo, useRef } from 'react'
import Box from '@mui/material/Box'
import {
  AvatarAddOn,
  DropdownToggle,
  Nav,
  NavItem,
  Notifications,
  SidebarTrigger,
  ThemeSetting,
  UncontrolledDropdown,
  AvatarImage,
} from 'Components'
import { LanguageMenu } from './LanguageMenu'
import { useSelector } from 'react-redux'
import { DropdownProfile } from 'Routes/components/Dropdowns/DropdownProfile'
import { randomAvatar } from '../../../utilities'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from './GluuErrorFallBack'
import { useNewNavbarStyles } from './styles/GluuNavBarNew.style'
import { useNavbarTheme } from './hooks/useNavbarTheme'
import { usePageTitle } from './hooks/usePageTitle'
import customColors from '@/customColors'
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

const GluuNavBarNew = () => {
  const userInfo = useSelector(
    (state: { authReducer: { userinfo: UserInfo | null } }) => state.authReducer.userinfo,
  )

  const { navbarColors } = useNavbarTheme()
  const { classes } = useNewNavbarStyles(navbarColors)()
  const pageTitle = usePageTitle()
  const navbarRef = useRef<HTMLDivElement>(null)

  const [showCollapse, setShowCollapse] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(MOBILE_BREAKPOINT).matches : false,
  )

  useEffect(() => {
    if (navbarRef.current) {
      const element = navbarRef.current
      element.style.setProperty('background-color', navbarColors.background, 'important')
      element.style.setProperty('border-bottom', `1px solid ${navbarColors.border}`, 'important')
      element.style.setProperty('--theme-navbar-background', navbarColors.background, 'important')
      element.style.setProperty('--theme-navbar-text', navbarColors.text, 'important')
      element.style.setProperty('--theme-navbar-icon', navbarColors.icon, 'important')
      element.style.setProperty('--theme-navbar-border', navbarColors.border, 'important')
    }

    const pageTitleElement = document.getElementById('page-title-navbar')
    if (pageTitleElement) {
      pageTitleElement.style.setProperty('color', navbarColors.text, 'important')
    }
  }, [navbarColors.background, navbarColors.border, navbarColors.text, navbarColors.icon])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT)
    const handleChange = (e: MediaQueryListEvent) => setShowCollapse(e.matches)

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const avatarAddOns = useMemo(
    () => [
      <AvatarAddOn.Icon className="fa fa-circle" color={customColors.white} key="avatar-icon-bg" />,
      <AvatarAddOn.Icon className="fa fa-circle" color="success" key="avatar-icon-fg" />,
    ],
    [],
  )

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
            <Box className={classes.iconButton}>
              <Notifications />
            </Box>
            {userInfo && (
              <>
                <Box className={classes.iconButton}>
                  <ThemeSetting userInfo={userInfo} />
                </Box>
                <Box className={classes.languageMenuWrapper}>
                  <LanguageMenu userInfo={userInfo} />
                </Box>
              </>
            )}
            <UncontrolledDropdown nav direction="down">
              <DropdownToggle nav caret={false}>
                <Box className={classes.userProfileContainer}>
                  <AvatarImage size="md" src={randomAvatar()} addOns={avatarAddOns} />
                  <span className={classes.userName}>Hello User</span>
                  <Box className={classes.userChevron}>
                    <ChevronIcon />
                  </Box>
                </Box>
              </DropdownToggle>
              <DropdownProfile end userinfo={userInfo} />
            </UncontrolledDropdown>
          </Box>
        </Box>
      </Box>
    </ErrorBoundary>
  )
}

GluuNavBarNew.displayName = 'GluuNavBarNew'

export default GluuNavBarNew
