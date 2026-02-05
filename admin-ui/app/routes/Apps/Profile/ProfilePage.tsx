import React, { useContext, useEffect, useCallback, useMemo, memo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '@/context/theme/themeContext'
import { THEME_DARK, DEFAULT_THEME } from '@/context/theme/constants'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import { Box } from '@mui/material'
import { getProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { randomAvatar } from '@/utilities'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { CustomAttribute } from './types'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import GluuLoader from '../Gluu/GluuLoader'
import { Edit } from '@mui/icons-material'

const JANS_ADMIN_UI_ROLE_ATTR = 'jansAdminUIRole'
const SN_ATTR = 'sn'
const USERS_RESOURCE_ID = ADMIN_UI_RESOURCES.Users
const USERS_SCOPES = CEDAR_RESOURCE_SCOPES[USERS_RESOURCE_ID]
const DEFAULT_FALLBACK = '-'

const getValueOrFallback = <T,>(value: T | null | undefined, fallback: T): T => value ?? fallback

const findCustomAttribute = (
  attributes: CustomAttribute[] | undefined,
  name: string,
): CustomAttribute | undefined => attributes?.find((att) => att?.name === name)

const getCustomAttributeValue = (
  attributes: CustomAttribute[] | undefined,
  name: string,
  fallback: string = DEFAULT_FALLBACK,
): string => findCustomAttribute(attributes, name)?.values?.[0] ?? fallback

const ProfileDetails: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const theme = useContext(ThemeContext)
  const currentTheme = theme?.state?.theme || DEFAULT_THEME
  const isDark = currentTheme === THEME_DARK
  const { classes } = styles({ isDark })
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

  const avatarSrc = useMemo(() => randomAvatar(), [])

  // Memoized profile values using module-scope utilities
  const { displayName, email, givenName, lastName, status, roleValue } = useMemo(() => {
    const customAttrs = profileDetails?.customAttributes
    return {
      displayName: getValueOrFallback(profileDetails?.displayName, DEFAULT_FALLBACK),
      email: getValueOrFallback(profileDetails?.mail, DEFAULT_FALLBACK),
      givenName: getValueOrFallback(profileDetails?.givenName, DEFAULT_FALLBACK),
      lastName: getCustomAttributeValue(customAttrs, SN_ATTR),
      status: getValueOrFallback(profileDetails?.status, DEFAULT_FALLBACK),
      roleValue: getCustomAttributeValue(customAttrs, JANS_ADMIN_UI_ROLE_ATTR),
    }
  }, [profileDetails])

  useEffect(() => {
    if (!canMakeApiCall || !userInum) return
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

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <GluuLoader blocking={loading}>
        {!loading && (
          <Box className={classes.pageWrapper}>
            <Box className={classes.profileCard}>
              {/* Avatar */}
              <Box className={classes.avatarWrapper}>
                <img src={avatarSrc} alt="User avatar" className={classes.avatar} />
              </Box>

              {/* Display Name */}
              <Box className={classes.displayName}>{displayName}</Box>

              {/* Email */}
              <Box className={classes.email}>{email}</Box>

              {/* Status Indicator */}
              <Box className={classes.statusRow}>
                <Box className={classes.statusDot} />
                <Box className={classes.statusText}>
                  {t('fields.status')}: {status}
                </Box>
              </Box>

              {/* Divider */}
              <Box className={classes.divider} />

              {/* Personal Information Section */}
              <Box className={classes.sectionTitle}>{t('titles.personal_information')}</Box>
              <Box className={classes.infoBox}>
                <Box className={classes.infoRow}>
                  <Box className={classes.infoLabel}>{t('fields.givenName')}</Box>
                  <Box className={classes.infoValue}>{givenName}</Box>
                </Box>
                <Box className={classes.infoRow}>
                  <Box className={classes.infoLabel}>{t('fields.sn')}</Box>
                  <Box className={classes.infoValue}>{lastName}</Box>
                </Box>
                <Box className={`${classes.infoRow} ${classes.infoRowLast}`}>
                  <Box className={classes.infoLabel}>{t('fields.mail')}</Box>
                  <Box className={classes.infoValue}>{email}</Box>
                </Box>
              </Box>

              {/* Admin Roles Section */}
              <Box className={classes.sectionTitle}>{t('titles.admin_roles')}</Box>
              <Box className={classes.roleBox}>
                <Box className={classes.roleLabel}>{roleValue}</Box>
                <Box className={classes.roleBadge}>{roleValue}</Box>
              </Box>

              {/* Account Status Section */}
              <Box className={classes.sectionTitle}>{t('titles.account_status')}</Box>
              <Box className={classes.statusBox}>
                <Box className={classes.statusLabel}>{t('fields.status')}:</Box>
                <Box className={classes.statusBadge}>{status}</Box>
              </Box>

              {/* Edit Button */}
              {canEditProfile && (
                <button
                  type="button"
                  className={classes.editButton}
                  onClick={navigateToUserManagement}
                >
                  <Edit className={classes.editIcon} />
                  {t('actions.edit')}
                </button>
              )}
            </Box>
          </Box>
        )}
      </GluuLoader>
    </ErrorBoundary>
  )
}

export default memo(ProfileDetails)
