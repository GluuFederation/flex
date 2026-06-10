import React, { useContext, useCallback, useMemo, memo } from 'react'
import { GluuBadge } from 'Components'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '../../../context/theme/themeContext'
import SetTitle from 'Utils/SetTitle'
import styles from './ProfilePage.style'
import { Box, Divider } from '@mui/material'
import { EditOutlined } from '@/components/icons'
import { randomAvatar } from '../../../utilities'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { usePermission } from '@/cedarling/hooks/usePermission'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { ThemeContextValue, InfoRowProps } from './types'
import { useAppSelector } from '@/redux/hooks'
import { useProfileDetails } from './hooks/useProfileDetails'
import GluuLoader from '../Gluu/GluuLoader'
import GluuViewWrapper from '../Gluu/GluuViewWrapper'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'

const USERS_RESOURCE_ID = ADMIN_UI_RESOURCES.Users

const InfoRow = memo(({ label, value, index, classes }: InfoRowProps) => (
  <Box
    className={`${classes.dataRow} ${index % 2 === 0 ? classes.dataRowEven : classes.dataRowOdd}`}
  >
    <GluuText className={classes.dataLabel} disableThemeColor>
      {label}
    </GluuText>
    <GluuText className={classes.dataValue} disableThemeColor>
      {value || '-'}
    </GluuText>
  </Box>
))
InfoRow.displayName = 'InfoRow'

const ProfileDetails: React.FC = () => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext) as ThemeContextValue
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = styles({ themeColors, isDark })
  const { navigateToRoute } = useAppNavigation()

  SetTitle(t('titles.profile_detail'))

  const {
    userinfo,
    userInum: stateUserInum,
    hasSession,
  } = useAppSelector((state) => state.authReducer)
  const userInum = useMemo(() => stateUserInum || userinfo?.inum, [stateUserInum, userinfo?.inum])

  const { profileDetails, loading, surname, roles } = useProfileDetails(userInum, hasSession)

  const { canRead: canReadProfile, canWrite: canEditProfile } = usePermission(USERS_RESOURCE_ID)

  const avatarSrc = useMemo(() => randomAvatar(), [])

  const navigateToUserManagement = useCallback((): void => {
    if (!profileDetails?.inum) return
    navigateToRoute(ROUTES.USER_EDIT(profileDetails.inum), {
      state: { selectedUser: profileDetails },
    })
  }, [profileDetails, navigateToRoute])

  const adminBadgeColors = useMemo(
    () => ({
      bg: themeColors.badges.filledBadgeBg,
      text: themeColors.badges.filledBadgeText,
    }),
    [themeColors],
  )

  const accountStatusPillColors = useMemo(() => {
    const status = profileDetails?.status
    if (status === 'active') {
      return {
        bg: themeColors.badges.statusActiveBg,
        text: themeColors.badges.statusActive,
      }
    }
    if (status == null) {
      return {
        bg: themeColors.inputBackground,
        text: themeColors.textMuted,
      }
    }
    return {
      bg: themeColors.settings?.removeButton?.bg,
      text: themeColors.settings?.removeButton?.text,
    }
  }, [profileDetails?.status, themeColors])

  const statusLabel = useMemo(
    () =>
      profileDetails?.status === 'active'
        ? t('fields.active')
        : profileDetails?.status == null
          ? t('dashboard.unknown')
          : (profileDetails?.status ?? '-'),
    [profileDetails?.status, t],
  )

  const displayName = profileDetails?.displayName ?? userinfo?.name ?? userinfo?.email ?? '-'
  const displayMail = profileDetails?.mail ?? userinfo?.email ?? '-'

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <GluuViewWrapper canShow={canReadProfile}>
        <GluuLoader blocking={loading}>
          <Box className={classes.mainContainer}>
            <Box className={classes.profileCard}>
              <Box className={classes.avatarContainer}>
                <img src={avatarSrc} alt="Avatar" className={classes.avatar} />
              </Box>

              <Box
                sx={{
                  textAlign: 'center',
                }}
              >
                <GluuText variant="h5" className={classes.nameText}>
                  {displayName}
                </GluuText>
                <GluuText variant="div" className={classes.emailText} disableThemeColor>
                  {displayMail}
                </GluuText>
                <Box
                  className={classes.profileHeaderStatusWrap}
                  sx={{
                    width: '100%',
                  }}
                >
                  <Box className={classes.statusRow}>
                    <div
                      className={`${classes.statusDot} ${
                        profileDetails?.status === 'active'
                          ? classes.statusDotActive
                          : classes.statusDotInactive
                      }`}
                    />
                    <Box component="span" className={classes.statusKeyValueWrap}>
                      <GluuText
                        variant="span"
                        className={
                          profileDetails?.status === 'active'
                            ? classes.statusLabelActive
                            : classes.statusLabelInactive
                        }
                        disableThemeColor
                      >
                        {t('fields.statusLabel')}:
                      </GluuText>
                      <GluuText
                        variant="span"
                        className={
                          profileDetails?.status === 'active'
                            ? classes.statusValueActive
                            : classes.statusValueInactive
                        }
                        disableThemeColor
                      >
                        {statusLabel}
                      </GluuText>
                    </Box>
                  </Box>
                  <Box className={classes.statusDividerWrapper}>
                    <Divider className={classes.statusDivider} />
                  </Box>
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                }}
              >
                <GluuText variant="h6" className={classes.sectionTitle} disableThemeColor>
                  {t('titles.personal_information', { defaultValue: 'Personal Information' })}
                </GluuText>
                <Box className={classes.dataContainer}>
                  <InfoRow
                    label={t('fields.givenName')}
                    value={profileDetails?.givenName}
                    index={0}
                    classes={classes}
                  />
                  <InfoRow
                    label={t('fields.sn', { defaultValue: 'Last Name' })}
                    value={surname}
                    index={1}
                    classes={classes}
                  />
                  <InfoRow
                    label={t('fields.mail')}
                    value={profileDetails?.mail}
                    index={2}
                    classes={classes}
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                }}
              >
                <GluuText variant="h6" className={classes.sectionTitle} disableThemeColor>
                  {t('titles.admin_roles', { defaultValue: 'Admin Roles' })}
                </GluuText>
                <Box className={classes.roleContainer}>
                  <GluuText className={classes.roleLabel} disableThemeColor>
                    {t('fields.admin')}:
                  </GluuText>
                  <GluuBadge
                    size="sm"
                    backgroundColor={adminBadgeColors.bg}
                    textColor={adminBadgeColors.text}
                    borderColor={adminBadgeColors.bg}
                  >
                    {roles}
                  </GluuBadge>
                </Box>
              </Box>

              <Box
                sx={{
                  width: '100%',
                }}
              >
                <GluuText variant="h6" className={classes.sectionTitle} disableThemeColor>
                  {t('titles.account_status', { defaultValue: 'Account Status' })}
                </GluuText>
                <Box className={classes.accountStatusContainer}>
                  <GluuText className={classes.roleLabel} disableThemeColor>
                    {t('fields.statusLabel')}:
                  </GluuText>
                  <GluuBadge
                    size="sm"
                    className={classes.accountStatusPill}
                    borderRadius={5}
                    backgroundColor={accountStatusPillColors.bg}
                    textColor={accountStatusPillColors.text}
                    borderColor={accountStatusPillColors.bg}
                  >
                    {statusLabel}
                  </GluuBadge>
                </Box>
              </Box>

              {canEditProfile && (
                <GluuButton
                  block
                  disableHoverStyles
                  className={classes.editButton}
                  onClick={navigateToUserManagement}
                  backgroundColor={themeColors.formFooter?.back?.backgroundColor}
                  textColor={themeColors.formFooter?.back?.textColor}
                >
                  <EditOutlined fontSize="small" className={classes.editButtonIcon} />
                  {t('actions.edit')}
                </GluuButton>
              )}
            </Box>
          </Box>
        </GluuLoader>
      </GluuViewWrapper>
    </ErrorBoundary>
  )
}

export default memo(ProfileDetails)
