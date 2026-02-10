import React, { useContext, useEffect, useCallback, useMemo, memo } from 'react'
import { Container, Row, Col, Card, CardBody, Button, AvatarImage } from 'Components'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '../../../context/theme/themeContext'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import { Box, Divider } from '@mui/material'
import { getProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { randomAvatar } from '../../../utilities'
import getThemeColor from '../../../context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import customColors from '@/customColors'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { ThemeContextValue, CustomAttribute } from './types'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import GluuLoader from '../Gluu/GluuLoader'

const JANS_ADMIN_UI_ROLE_ATTR = 'jansAdminUIRole'
const USERS_RESOURCE_ID = ADMIN_UI_RESOURCES.Users

const FLEX_COLUMN_GAP2 = {
  display: '',
  flexDirectionflex: 'column' as const,
  gap: 2,
}
const FLEX_COLUMN_GAP1 = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: 1,
}
const FIELD_ROW_STYLE = {
  display: 'flex',
  justifyContent: 'space-between' as const,
  alignItems: 'center',
  marginBottom: 1,
}
const COL_PROPS = { xs: 10, md: 8, lg: 5 }
const USERS_SCOPES = CEDAR_RESOURCE_SCOPES[USERS_RESOURCE_ID]

const ProfileDetails: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const theme = useContext(ThemeContext) as ThemeContextValue
  const selectedTheme = useMemo(() => theme?.state?.theme ?? DEFAULT_THEME, [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = styles()
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
    () => jansAdminUIRole?.values?.join(', ') ?? undefined,
    [jansAdminUIRole?.values],
  )

  const renderField = useCallback(
    (labelKey: string, value: string | undefined) => (
      <Box sx={FIELD_ROW_STYLE}>
        <Box fontWeight={700}>{t(labelKey)}</Box>
        <Box>{value || '-'}</Box>
      </Box>
    ),
    [t],
  )

  const renderDisplayName = useMemo(
    () => (
      <Box fontWeight={700} fontSize={'16px'} className="text-center mb-4">
        {profileDetails?.displayName}
      </Box>
    ),
    [profileDetails?.displayName],
  )

  const editButtonStyle = useMemo(
    () => ({
      backgroundColor: 'transparent' as const,
      color: customColors.primaryDark,
      border: `1px solid ${themeColors.background}`,
    }),
    [themeColors.background],
  )

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <GluuLoader blocking={loading}>
        {!loading && (
          <Container>
            <Row className={classes.centerCard}>
              <Col {...COL_PROPS}>
                <Card className="" type="" color={null}>
                  <CardBody className={classes.profileCard}>
                    <React.Fragment>
                      <Box
                        className={`${classes.avatar_wrapper} d-flex justify-content-center my-3`}
                      >
                        <AvatarImage size="lg" src={avatarSrc} />
                      </Box>
                      <Box sx={FLEX_COLUMN_GAP2}>
                        <Box sx={FLEX_COLUMN_GAP1}>
                          {renderDisplayName}
                          {renderField('fields.givenName', profileDetails?.givenName)}
                          <Divider />
                          {renderField('fields.sn', snValue)}
                          <Divider />
                          {renderField('fields.mail', profileDetails?.mail)}
                          <Divider />
                          {renderField('titles.roles', rolesValue)}
                          <Divider />
                          {renderField('fields.status', profileDetails?.status)}
                          <Divider />
                        </Box>
                        {canEditProfile && (
                          <Button style={editButtonStyle} onClick={navigateToUserManagement}>
                            <i className="fa fa-pencil me-2" />
                            {t('actions.edit')}
                          </Button>
                        )}
                      </Box>
                    </React.Fragment>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        )}
      </GluuLoader>
    </ErrorBoundary>
  )
}

export default memo(ProfileDetails)
