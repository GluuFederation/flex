import React, { useContext, useEffect, useCallback, useMemo, memo } from 'react'
import { Container, Row, Col, Card, CardBody, Button, Badge, AvatarImage } from 'Components'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '../../../context/theme/themeContext'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import { Box, Divider, Skeleton } from '@mui/material'
import { getProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { randomAvatar } from '../../../utilities'
import getThemeColor from '../../../context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { AppDispatch, ProfileRootState, ThemeContextValue, CustomAttribute } from './types'

const JANS_ADMIN_UI_ROLE_ATTR = 'jansAdminUIRole'
const SKELETON_WIDTH = '45%'
const BADGE_PADDING = '4px 6px'
const SKELETON_HEIGHT = 40

const skeletonCenterStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
} as const

const ProfileDetails: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const theme = useContext(ThemeContext) as ThemeContextValue
  const selectedTheme = useMemo(() => theme?.state?.theme ?? DEFAULT_THEME, [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = styles()
  const { navigateToRoute } = useAppNavigation()

  SetTitle(t('titles.profile_detail'))

  const { loading, profileDetails } = useSelector(
    (state: ProfileRootState) => state.profileDetailsReducer,
  )
  const authState = useSelector((state: ProfileRootState) => state.authReducer)
  const { userinfo, token: authToken } = authState
  const stateUserInum = (authState as { userInum?: string | null; hasSession?: boolean }).userInum
  const hasSession = (authState as { hasSession?: boolean }).hasSession ?? false

  const userInum = useMemo(() => stateUserInum || userinfo?.inum, [stateUserInum, userinfo?.inum])
  const apiAccessToken = authToken?.access_token ?? null
  const canMakeApiCall = hasSession || !!apiAccessToken

  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const usersResourceId = useMemo(() => ADMIN_UI_RESOURCES.Users, [])
  const usersScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[usersResourceId], [usersResourceId])
  const canEditProfile = useMemo(
    () => hasCedarWritePermission(usersResourceId),
    [hasCedarWritePermission, usersResourceId],
  )

  const jansAdminUIRole = useMemo(
    () =>
      profileDetails?.customAttributes?.find(
        (att: CustomAttribute): boolean => att?.name === JANS_ADMIN_UI_ROLE_ATTR,
      ),
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
    if (usersScopes && usersScopes.length > 0) {
      authorizeHelper(usersScopes)
    }
  }, [authorizeHelper, usersScopes])

  const navigateToUserManagement = useCallback((): void => {
    if (!profileDetails?.inum) return
    navigateToRoute(ROUTES.USER_EDIT(profileDetails.inum), {
      state: { selectedUser: profileDetails },
    })
  }, [profileDetails, navigateToRoute])

  const roleBadges = useMemo(() => {
    if (!jansAdminUIRole?.values?.length) return null
    return jansAdminUIRole.values.map((role: string, index: number) => (
      <Badge
        key={`${role}-${index}`}
        style={{ padding: BADGE_PADDING, color: themeColors.fontColor }}
        color={`primary-${selectedTheme}`}
        className="me-1"
      >
        {role}
      </Badge>
    ))
  }, [jansAdminUIRole?.values, selectedTheme, themeColors.fontColor])

  const renderField = useCallback(
    (labelKey: string, value: string | undefined, isLoading: boolean) => {
      if (isLoading) {
        return <Skeleton animation="wave" />
      }
      return (
        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={1}>
          <Box fontWeight={700}>{t(labelKey)}</Box>
          <Box>{value || '-'}</Box>
        </Box>
      )
    },
    [t],
  )

  const renderDisplayName = useMemo(() => {
    if (loading) {
      return (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Skeleton width={SKELETON_WIDTH} sx={skeletonCenterStyle} animation="wave" />
        </Box>
      )
    }
    return (
      <Box fontWeight={700} fontSize={'16px'} className="text-center mb-4">
        {profileDetails?.displayName}
      </Box>
    )
  }, [loading, profileDetails?.displayName])

  const renderUserRolesField = useMemo(() => {
    if (loading) {
      return <Skeleton animation="wave" />
    }
    return (
      <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} mb={1} gap={3}>
        <Box fontWeight={700}>{t('titles.roles')}</Box>
        {roleBadges && (
          <Box
            display={'flex'}
            gap={'2px'}
            flexWrap={'wrap'}
            alignItems={'end'}
            justifyContent={'end'}
          >
            {roleBadges}
          </Box>
        )}
      </Box>
    )
  }, [loading, roleBadges, t])

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <Container>
        <Row className={classes.centerCard}>
          <Col xs={10} md={8} lg={5}>
            <Card className="" type="" color={null}>
              <CardBody className={classes.profileCard}>
                <React.Fragment>
                  <Box className={`${classes.avatar_wrapper} d-flex justify-content-center my-3`}>
                    <AvatarImage size="lg" src={avatarSrc} />
                  </Box>
                  <Box display={'flex'} flexDirection={'column'} gap={2}>
                    <Box display={'flex'} flexDirection={'column'} gap={1}>
                      {renderDisplayName}
                      {renderField('fields.givenName', profileDetails?.givenName, loading)}
                      <Divider />
                      {renderField(
                        'fields.sn',
                        profileDetails?.customAttributes?.find(
                          (att: CustomAttribute) => att?.name === 'sn',
                        )?.values?.[0],
                        loading,
                      )}
                      <Divider />
                      {renderField('fields.mail', profileDetails?.mail, loading)}
                      <Divider />
                      {renderUserRolesField}
                      <Divider />
                      {renderField('fields.status', profileDetails?.status, loading)}
                      <Divider />
                    </Box>
                    {canEditProfile && (
                      <>
                        {loading ? (
                          <Skeleton animation="wave" height={SKELETON_HEIGHT} />
                        ) : (
                          <Button
                            color={`primary-${selectedTheme}`}
                            onClick={navigateToUserManagement}
                          >
                            <i className="fa fa-pencil me-2" />
                            {t('actions.edit')}
                          </Button>
                        )}
                      </>
                    )}
                  </Box>
                </React.Fragment>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </ErrorBoundary>
  )
}

export default memo(ProfileDetails)
