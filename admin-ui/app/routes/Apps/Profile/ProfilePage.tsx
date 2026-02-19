import React, { useContext, useEffect, useCallback, useMemo, memo } from 'react'
import { GluuBadge } from 'Components'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '../../../context/theme/themeContext'
import SetTitle from 'Utils/SetTitle'
import styles from './ProfilePage.style'
import { Box, Divider } from '@mui/material'
import { getProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { randomAvatar } from '../../../utilities'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { ThemeContextValue, CustomAttribute } from './types'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import GluuLoader from '../Gluu/GluuLoader'
import GluuViewWrapper from '../Gluu/GluuViewWrapper'
import { useCedarling } from '@/cedarling'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import customColors from '@/customColors'

const JANS_ADMIN_UI_ROLE_ATTR = 'jansAdminUIRole'
const USERS_RESOURCE_ID = ADMIN_UI_RESOURCES.Users
const USERS_SCOPES = CEDAR_RESOURCE_SCOPES[USERS_RESOURCE_ID]

interface InfoRowProps {
  label: string
  value?: string
  index: number
  classes: {
    dataRow: string
    dataRowEven: string
    dataRowOdd: string
    dataLabel: string
    dataValue: string
  }
}

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
  const dispatch = useAppDispatch()
  const theme = useContext(ThemeContext) as ThemeContextValue
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(currentTheme), [currentTheme])
  const { classes } = styles({ themeColors, isDark })
  const { navigateToRoute } = useAppNavigation()

  SetTitle(t('titles.profile_detail'))

  const { loading, profileDetails } = useAppSelector((state) => state.profileDetailsReducer)
  const authState = useAppSelector((state) => state.authReducer)
  const authStateWithToken = authState as typeof authState & {
    token?: { access_token?: string } | null
    userInum?: string | null
    hasSession?: boolean
  }
  const { userinfo, token: authToken } = authStateWithToken ?? {}
  const stateUserInum = authStateWithToken?.userInum
  const hasSession = authStateWithToken?.hasSession ?? false

  const userInum = useMemo(() => stateUserInum || userinfo?.inum, [stateUserInum, userinfo?.inum])
  const apiAccessToken = authToken?.access_token ?? null
  const canMakeApiCall = hasSession || !!apiAccessToken

  const { authorizeHelper, hasCedarReadPermission, hasCedarWritePermission } = useCedarling()
  const canReadProfile = useMemo(
    () => hasCedarReadPermission(USERS_RESOURCE_ID),
    [hasCedarReadPermission],
  )
  const canEditProfile = useMemo(
    () => hasCedarWritePermission(USERS_RESOURCE_ID),
    [hasCedarWritePermission],
  )

  const jansAdminUIRole = useMemo(
    () =>
      profileDetails?.customAttributes?.find(
        (att: CustomAttribute): boolean => att?.name === JANS_ADMIN_UI_ROLE_ATTR,
      ),
    [profileDetails?.customAttributes],
  )

  const snValue = useMemo(
    () =>
      profileDetails?.customAttributes?.find((att: CustomAttribute) => att?.name === 'sn')
        ?.values?.[0],
    [profileDetails?.customAttributes],
  )

  const avatarSrc = useMemo(() => randomAvatar(), [])

  useEffect(() => {
    if (!canMakeApiCall || !userInum) {
      return
    }
    dispatch(getProfileDetails({ pattern: userInum }))
  }, [canMakeApiCall, dispatch, userInum])

  useEffect(() => {
    if (USERS_SCOPES?.length) {
      authorizeHelper(USERS_SCOPES)
    }
  }, [authorizeHelper])

  const navigateToUserManagement = useCallback((): void => {
    if (!profileDetails?.inum) return
    navigateToRoute(ROUTES.USER_EDIT(profileDetails.inum), {
      state: { selectedUser: profileDetails },
    })
  }, [profileDetails, navigateToRoute])

  const rolesValue = useMemo(() => {
    const values = jansAdminUIRole?.values
    if (!Array.isArray(values) || values.length === 0) return '-'
    return values.map((role) => role.charAt(0).toUpperCase() + role.slice(1)).join(', ')
  }, [jansAdminUIRole?.values])

  const adminBadgeColors = useMemo(
    () => ({
      bg: themeColors.formFooter?.back?.backgroundColor,
      text: themeColors.formFooter?.back?.textColor,
    }),
    [themeColors],
  )

  const accountStatusPillColors = useMemo(() => {
    const status = profileDetails?.status
    if (status === 'active') {
      return {
        bg: customColors.statusActiveBg,
        text: customColors.statusActive,
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

              <Box textAlign="center">
                <GluuText variant="h5" className={classes.nameText}>
                  {displayName}
                </GluuText>
                <GluuText variant="div" className={classes.emailText} disableThemeColor>
                  {displayMail}
                </GluuText>
                <Box className={classes.profileHeaderStatusWrap} width="100%">
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

              <Box width="100%">
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
                    value={snValue}
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

              <Box width="100%">
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
                    {rolesValue}
                  </GluuBadge>
                </Box>
              </Box>

              <Box width="100%">
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
                  <i className={`fa fa-pencil ${classes.editButtonIcon}`} />
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
