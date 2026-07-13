import { useEffect, useRef, useMemo, useCallback, memo } from 'react'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Link } from 'react-router-dom'
import { Notifications, ChevronIcon } from 'Components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { LogoThemed } from 'Routes/components/LogoThemed/LogoThemed'
import { DropdownProfile } from 'Routes/components/Dropdowns/DropdownProfile'
import { MobileProfileDropdown } from 'Routes/components/Dropdowns/MobileProfileDropdown'
import { ROUTES } from '@/helpers/navigation'
import type { UserInfo } from 'Redux/features/types/authTypes'
import { LanguageMenu } from './LanguageMenu'
import { ThemeDropdownComponent } from './ThemeDropdown'
import { UserIcon } from './components/UserIcon'
import { useStyles, MOBILE_MEDIA_QUERY } from './styles/GluuNavBar.style'
import { useNavbarTheme } from './hooks/useNavbarTheme'
import { usePageTitle } from './hooks/usePageTitle'
import { useAppSelector } from '@/redux/hooks'

const selectUserInfo = (state: { authReducer: { userinfo: UserInfo | null } }) =>
  state.authReducer.userinfo

const GluuNavBar = () => {
  const userInfo = useAppSelector(selectUserInfo)
  const { t } = useTranslation()

  const { navbarColors } = useNavbarTheme()
  const { classes } = useStyles({ navbarColors })
  const pageTitle = usePageTitle()
  const isMobile = useMediaQuery(MOBILE_MEDIA_QUERY)
  const navbarRef = useRef<HTMLDivElement>(null)

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
    <Box ref={navbarRef} className={`${classes.navbarWrapper} navbar-themed`}>
      <Box className={classes.navbarContainer}>
        <Box className={classes.leftSection}>
          <Link to={ROUTES.ROOT} className={classes.mobileLogo} aria-label={t('menus.home')}>
            <LogoThemed width={103} height={40} variant="green" />
          </Link>
          <GluuText
            variant="h3"
            className={classes.pageTitle}
            id="page-title-navbar"
            disableThemeColor
          >
            {pageTitle}
          </GluuText>
        </Box>
        <Box className={classes.rightSection}>
          {!isMobile && (
            <>
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
            </>
          )}
          {isMobile ? (
            <MobileProfileDropdown
              userInfo={userInfo}
              renderTrigger={(isOpen: boolean) => (
                <Box className={classes.mobileProfileTrigger}>
                  <UserIcon size={32} className={classes.userIcon} avatarUrl={avatarUrl} />
                  <GluuText variant="span" className={classes.mobileGreeting} disableThemeColor>
                    {t('menus.hello', { name: displayName })}
                  </GluuText>
                  <Box
                    className={`${classes.userChevron} ${isOpen ? classes.userChevronOpen : ''}`}
                  >
                    <ChevronIcon />
                  </Box>
                </Box>
              )}
            />
          ) : (
            <DropdownProfile
              renderTrigger={(isOpen: boolean) => (
                <Box className={`${classes.navbarItem} ${classes.userProfileContainer}`}>
                  <UserIcon size={40} className={classes.userIcon} avatarUrl={avatarUrl} />
                  <GluuText variant="span" className={classes.userName} disableThemeColor>
                    {displayName}
                  </GluuText>
                  <Box
                    className={`${classes.userChevron} ${isOpen ? classes.userChevronOpen : ''}`}
                  >
                    <ChevronIcon />
                  </Box>
                </Box>
              )}
              position="bottom"
            />
          )}
        </Box>
      </Box>
    </Box>
  )
}

GluuNavBar.displayName = 'GluuNavBar'

export default memo(GluuNavBar)
