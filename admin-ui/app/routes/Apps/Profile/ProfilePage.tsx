import React, { useContext, useEffect, useCallback, useMemo } from 'react'
import { Container, Row, Col, Card, CardBody, Button, Badge, AvatarImage } from 'Components'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import GluuLoader from '../Gluu/GluuLoader'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '../../../context/theme/themeContext'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import { Box, Divider } from '@mui/material'
import { getProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { randomAvatar } from '../../../utilities'
import getThemeColor from '../../../context/theme/config'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import type { AppDispatch, ProfileRootState, ThemeContextValue, CustomAttribute } from './types'

const ProfileDetails: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const theme = useContext(ThemeContext) as ThemeContextValue
  const selectedTheme = useMemo(() => theme?.state?.theme ?? 'light', [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = styles()
  const { navigateToRoute } = useAppNavigation()

  SetTitle(t('titles.profile_detail'))

  const { loading, profileDetails } = useSelector(
    (state: ProfileRootState) => state.profileDetailsReducer,
  )
  const { userinfo, token: authToken } = useSelector((state: ProfileRootState) => state.authReducer)
  const userInum = useMemo(() => userinfo?.inum, [userinfo?.inum])
  const apiAccessToken = authToken?.access_token ?? null

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
        (att: CustomAttribute): boolean => att?.name === 'jansAdminUIRole',
      ),
    [profileDetails?.customAttributes],
  )

  const avatarSrc = useMemo(() => randomAvatar(), [])

  useEffect(() => {
    if (!apiAccessToken || !userInum) {
      return
    }
    dispatch(getProfileDetails({ pattern: userInum }))
  }, [apiAccessToken, dispatch, userInum])

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
        style={{ padding: '4px 6px' }}
        color={`primary-${selectedTheme}`}
        className="me-1"
      >
        <span style={{ color: themeColors.fontColor }}>{role}</span>
      </Badge>
    ))
  }, [jansAdminUIRole?.values, selectedTheme, themeColors.fontColor])

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <GluuLoader blocking={loading}>
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
                        <Box fontWeight={700} fontSize={'16px'} className="text-center mb-4">
                          {profileDetails?.displayName}
                        </Box>
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box fontWeight={700}>First Name</Box>
                          <Box>{profileDetails?.givenName}</Box>
                        </Box>
                        <Divider />
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box fontWeight={700}>Last Name</Box>
                          <Box>{userinfo?.family_name}</Box>
                        </Box>
                        <Divider />
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box fontWeight={700}>Email</Box>
                          <Box>{profileDetails?.mail}</Box>
                        </Box>
                        <Divider />
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                          gap={3}
                        >
                          <Box fontWeight={700}>User Roles</Box>
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
                        <Divider />
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box fontWeight={700}>Status</Box>
                          <Box>{profileDetails?.status || '-'}</Box>
                        </Box>
                        <Divider />
                      </Box>
                      {canEditProfile ? (
                        <Button
                          color={`primary-${selectedTheme}`}
                          onClick={navigateToUserManagement}
                        >
                          <i className="fa fa-pencil me-2" />
                          {t('actions.edit')}
                        </Button>
                      ) : null}
                    </Box>
                  </React.Fragment>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </GluuLoader>
    </ErrorBoundary>
  )
}

export default React.memo(ProfileDetails)
