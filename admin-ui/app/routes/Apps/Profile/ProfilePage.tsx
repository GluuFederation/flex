import React, { useContext, useEffect, useCallback, useMemo } from 'react'
import { Container, Row, Col, Card, CardBody, Button, Badge, AvatarImage } from 'Components'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '../../../context/theme/themeContext'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import { Box, Divider, Skeleton } from '@mui/material'
import { useNavigate } from 'react-router'
import { getProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { randomAvatar } from '../../../utilities'
import getThemeColor from '../../../context/theme/config'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import type { AppDispatch, ProfileRootState, ThemeContextValue, CustomAttribute } from './types'

const ProfileDetails: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const theme = useContext(ThemeContext) as ThemeContextValue
  const selectedTheme = useMemo(() => theme?.state?.theme ?? 'light', [theme?.state?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = styles()

  // Set page title
  SetTitle(t('titles.profile_detail'))

  const { loading, profileDetails } = useSelector(
    (state: ProfileRootState) => state.profileDetailsReducer,
  )
  const userinfo = useSelector((state: ProfileRootState) => state.authReducer.userinfo)
  const userInum = useMemo(() => userinfo?.inum, [userinfo?.inum])

  const { authorizeHelper, hasCedarWritePermission } = useCedarling()
  const usersResourceId = useMemo(() => ADMIN_UI_RESOURCES.Users, [])
  const usersScopes = useMemo(() => CEDAR_RESOURCE_SCOPES[usersResourceId], [usersResourceId])
  const canEditProfile = useMemo(
    () => hasCedarWritePermission(usersResourceId) === true,
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
    if (userInum) {
      dispatch(getProfileDetails({ action: { pattern: userInum } }))
    }
  }, [dispatch, userInum])

  useEffect(() => {
    authorizeHelper(usersScopes)
  }, [authorizeHelper, usersScopes])

  const navigateToUserManagement = useCallback((): void => {
    if (!profileDetails?.inum) return
    navigate(`/user/usermanagement/edit/${encodeURIComponent(profileDetails.inum)}`, {
      state: { selectedUser: profileDetails },
    })
  }, [profileDetails?.inum, navigate, profileDetails])

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
                      {loading ? (
                        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                          <Skeleton
                            width={'45%'}
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}
                            animation="wave"
                          />
                        </Box>
                      ) : (
                        <Box fontWeight={700} fontSize={'16px'} className="text-center mb-4">
                          {profileDetails?.displayName}
                        </Box>
                      )}
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box fontWeight={700}>First Name</Box>
                          <Box>{profileDetails?.givenName}</Box>
                        </Box>
                      )}
                      <Divider />
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box fontWeight={700}>Last Name</Box>
                          <Box>{userinfo?.family_name}</Box>
                        </Box>
                      )}
                      <Divider />
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box fontWeight={700}>Email</Box>
                          <Box>{profileDetails?.mail}</Box>
                        </Box>
                      )}
                      <Divider />
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
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
                      )}
                      <Divider />
                      {loading ? (
                        <Skeleton animation="wave" />
                      ) : (
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box fontWeight={700}>Status</Box>
                          <Box>{profileDetails?.status || '-'}</Box>
                        </Box>
                      )}
                      <Divider />
                    </Box>
                    {canEditProfile ? (
                      <>
                        {loading ? (
                          <Skeleton animation="wave" height={40} />
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
                    ) : null}
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

export default ProfileDetails
