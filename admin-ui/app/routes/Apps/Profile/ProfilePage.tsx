import React, { useContext, useEffect, useCallback, useMemo, memo } from 'react'
import { GluuBadge } from 'Components'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '../../../context/theme/themeContext'
import SetTitle from 'Utils/SetTitle'
import styles from './ProfilePage.style'
import { Box } from '@mui/material'
import { getProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { randomAvatar } from '../../../utilities'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { ThemeContextValue, CustomAttribute } from './types'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import GluuLoader from '../Gluu/GluuLoader'
import { useCedarling } from '@/cedarling'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { GluuButton } from '@/components/GluuButton'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { devWarn } from '@/utils/env'

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
    <GluuText className={classes.dataLabel}>{label}</GluuText>
    <GluuText className={classes.dataValue}>{value || '-'}</GluuText>
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

  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
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

  const rolesValue = useMemo(
    () =>
      jansAdminUIRole?.values
        ?.map((role) => role.charAt(0).toUpperCase() + role.slice(1))
        .join(', ') ?? '-',
    [jansAdminUIRole?.values],
  )

  const adminBadgeColors = useMemo(
    () => ({
      bg: themeColors.formFooter?.back?.backgroundColor,
      text: themeColors.formFooter?.back?.textColor,
    }),
    [themeColors],
  )

  const statusBadgeColors = useMemo(() => {
    const status = profileDetails?.status
    if (status === 'active') {
      return {
        bg: themeColors.formFooter?.back?.backgroundColor,
        text: themeColors.formFooter?.back?.textColor,
      }
    }
    if (status == null) {
      devWarn('[ProfilePage] profileDetails.status is null/undefined', {
        status: profileDetails?.status,
        hasProfileDetails: !!profileDetails,
      })
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

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <GluuLoader blocking={loading}>
        {!loading && (
          <Box className={classes.mainContainer}>
            <Box className={classes.profileCard}>
              <Box className={classes.avatarContainer}>
                <img src={avatarSrc} alt="Avatar" className={classes.avatar} />
              </Box>

              <Box textAlign="center">
                <GluuText variant="h5" className={classes.nameText}>
                  {profileDetails?.displayName || '-'}
                </GluuText>
                <GluuText variant="div" className={classes.emailText}>
                  {profileDetails?.mail || '-'}
                </GluuText>
                <Box mt={1}>
                  <GluuText variant="div" className={classes.activeStatusText}>
                    {t('fields.statusLabel')}: {statusLabel}
                  </GluuText>
                </Box>
              </Box>

              <Box width="100%">
                <GluuText variant="h6" className={classes.sectionTitle}>
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
                <GluuText variant="h6" className={classes.sectionTitle}>
                  {t('titles.admin_roles', { defaultValue: 'Admin Roles' })}
                </GluuText>
                <Box className={classes.roleContainer}>
                  <GluuText className={classes.roleLabel}>{t('fields.admin')}:</GluuText>
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
                <GluuText variant="h6" className={classes.sectionTitle}>
                  {t('titles.account_status', { defaultValue: 'Account Status' })}
                </GluuText>
                <Box className={classes.roleContainer}>
                  <GluuText className={classes.roleLabel}>{t('fields.statusLabel')}:</GluuText>
                  <GluuBadge
                    size="sm"
                    backgroundColor={statusBadgeColors.bg}
                    textColor={statusBadgeColors.text}
                    borderColor={statusBadgeColors.bg}
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
        )}
      </GluuLoader>
    </ErrorBoundary>
  )
}

export default memo(ProfileDetails)
