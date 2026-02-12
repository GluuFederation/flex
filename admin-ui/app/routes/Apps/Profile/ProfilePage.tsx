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
import { DEFAULT_THEME } from '@/context/theme/constants'

const JANS_ADMIN_UI_ROLE_ATTR = 'jansAdminUIRole'
const USERS_RESOURCE_ID = ADMIN_UI_RESOURCES.Users
const USERS_SCOPES = CEDAR_RESOURCE_SCOPES[USERS_RESOURCE_ID]

const ProfileDetails: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const theme = useContext(ThemeContext) as ThemeContextValue
  const currentTheme = theme?.state?.theme ?? DEFAULT_THEME
  const isDark = currentTheme === 'dark'
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
      bg: themeColors.formFooter.back.backgroundColor,
      text: themeColors.formFooter.back.textColor,
    }),
    [themeColors],
  )

  const statusBadgeColors = useMemo(() => {
    const isActive = profileDetails?.status === 'active' || !profileDetails?.status
    return isActive
      ? {
          bg: themeColors.formFooter.back.backgroundColor,
          text: themeColors.formFooter.back.textColor,
        }
      : {
          bg: themeColors.settings.removeButton.bg,
          text: themeColors.settings.removeButton.text,
        }
  }, [profileDetails?.status, themeColors])

  // Personal Info Rows
  const renderInfoRow = (label: string, value: string | undefined, index: number) => (
    <Box
      className={`${classes.dataRow} ${index % 2 === 0 ? classes.dataRowEven : classes.dataRowOdd}`}
    >
      <GluuText className={classes.dataLabel}>{label}</GluuText>
      <GluuText className={classes.dataValue}>{value || '-'}</GluuText>
    </Box>
  )

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <GluuLoader blocking={loading}>
        {!loading && (
          <Box className={classes.mainContainer}>
            <Box className={classes.profileCard}>
              {/* Header Section */}
              <Box className={classes.avatarContainer}>
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className={classes.avatar}
                  style={{ borderRadius: '50%' }}
                />
              </Box>

              <Box textAlign="center">
                <GluuText variant="h5" className={classes.nameText}>
                  {profileDetails?.displayName || '-'}
                </GluuText>
                <GluuText variant="div" className={classes.emailText}>
                  {profileDetails?.mail || '-'}
                </GluuText>
                <Box mt={1} className={classes.activeStatusText}>
                  {t('fields.statusLabel')} {profileDetails?.status || t('fields.active')}
                </Box>
              </Box>

              {/* Personal Information */}
              <Box width="100%">
                <GluuText variant="h6" className={classes.sectionTitle}>
                  {t('titles.personal_information') || 'Personal Information'}
                </GluuText>
                <Box className={classes.dataContainer}>
                  {renderInfoRow(t('fields.givenName'), profileDetails?.givenName, 0)}
                  {renderInfoRow(t('fields.sn') || 'Last Name', snValue, 1)}
                  {renderInfoRow(t('fields.mail'), profileDetails?.mail, 2)}
                </Box>
              </Box>

              {/* Admin Roles */}
              <Box width="100%">
                <GluuText variant="h6" className={classes.sectionTitle}>
                  {t('titles.admin_roles') || 'Admin Roles'}
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

              {/* Account Status */}
              <Box width="100%">
                <GluuText variant="h6" className={classes.sectionTitle}>
                  {t('titles.account_status') || 'Account Status'}
                </GluuText>
                <Box className={classes.roleContainer}>
                  <GluuText className={classes.roleLabel}>{t('fields.statusLabel')}</GluuText>
                  <GluuBadge
                    size="sm"
                    backgroundColor={statusBadgeColors.bg}
                    textColor={statusBadgeColors.text}
                    borderColor={statusBadgeColors.bg}
                  >
                    {profileDetails?.status || t('fields.active')}
                  </GluuBadge>
                </Box>
              </Box>

              {/* Edit Button */}
              {canEditProfile && (
                <GluuButton
                  block
                  disableHoverStyles
                  className={classes.editButton}
                  onClick={navigateToUserManagement}
                  backgroundColor={themeColors.formFooter.back.backgroundColor}
                  textColor={themeColors.formFooter.back.textColor}
                >
                  <i className="fa fa-pencil" style={{ marginRight: 8 }} />
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
