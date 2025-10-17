import React, { useContext, useEffect, useCallback } from 'react'
import { Container, Row, Col, Card, CardBody, Button, Badge, AvatarImage } from 'Components'
import { ErrorBoundary } from 'react-error-boundary'
import GluuErrorFallBack from '../Gluu/GluuErrorFallBack'
import { useDispatch, useSelector } from 'react-redux'
import type { AnyAction } from '@reduxjs/toolkit'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from '../../../context/theme/themeContext'
import SetTitle from 'Utils/SetTitle'
import styles from './styles'
import { Box, Divider, Skeleton } from '@mui/material'
import { useNavigate } from 'react-router'
import { getProfileDetails } from 'Redux/features/ProfileDetailsSlice'
import { randomAvatar } from '../../../utilities'
import { USER_WRITE } from 'Utils/PermChecker'
import getThemeColor from '../../../context/theme/config'
import { useCedarling } from '@/cedarling'
import type { RootState as RootStateOfRedux } from '@/cedarling/types'

// --- TypeScript interfaces ---
interface CustomAttribute {
  name: string
  values: string[]
}

interface ProfileDetails {
  displayName?: string
  givenName?: string
  mail?: string
  status?: string
  inum?: string
  customAttributes?: CustomAttribute[]
}

interface UserInfo {
  inum?: string
  family_name?: string
  [key: string]: unknown
}

interface ProfileDetailsState {
  loading: boolean
  profileDetails: ProfileDetails | null
}

interface AuthState {
  userinfo: UserInfo
  token?: { scopes?: string[] } | null
  permissions?: string[]
}

interface RootState {
  profileDetailsReducer: ProfileDetailsState
  authReducer: AuthState
  token?: { scopes?: string[] }
}

interface ThemeContextType {
  state: { theme: string }
  dispatch: React.Dispatch<React.SetStateAction<unknown>>
}

// Theme colors interface
interface ThemeColors {
  fontColor: string
  background: string
  lightBackground: string
  menu: {
    background: string
    color: string
  }
  dashboard: {
    supportCard: string
  }
  [key: string]: unknown
}

// Redux dispatch type
type AppDispatch = (action: AnyAction) => void

// Component props type
interface ProfileDetailsProps {}
// --- End TypeScript interfaces ---

const ProfileDetails: React.FC<ProfileDetailsProps> = () => {
  const { t } = useTranslation()
  const { loading, profileDetails } = useSelector((state: RootState) => state.profileDetailsReducer)
  const { permissions: cedarPermissions } = useSelector(
    (state: RootStateOfRedux) => state.cedarPermissions,
  )
  const { userinfo } = useSelector((state: RootState) => state.authReducer)
  const theme = useContext(ThemeContext) as ThemeContextType
  const selectedTheme = theme.state.theme
  const themeColors: ThemeColors = getThemeColor(theme.state.theme)
  const navigate = useNavigate()
  const { classes } = styles()

  // Set page title
  SetTitle(t('titles.profile_detail'))

  const dispatch = useDispatch() as AppDispatch

  const { hasCedarPermission, authorize } = useCedarling()

  useEffect(() => {
    if (userinfo?.inum) {
      dispatch(getProfileDetails({ action: { pattern: userinfo.inum } }))
    }
  }, [dispatch, userinfo?.inum])

  useEffect(() => {
    authorize([USER_WRITE]).catch(console.error)
  }, [])

  useEffect(() => {}, [cedarPermissions])

  const navigateToUserManagement = useCallback((): void => {
    if (profileDetails) {
      navigate(`/user/usermanagement/edit/:${profileDetails.inum}`, {
        state: { selectedUser: profileDetails },
      })
    }
  }, [profileDetails, navigate])

  const jansAdminUIRole = profileDetails?.customAttributes?.find(
    (att: CustomAttribute): boolean => att?.name === 'jansAdminUIRole',
  )

  return (
    <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
      <Container>
        <Row className={classes.centerCard}>
          <Col xs={10} md={8} lg={5}>
            <Card className="" type="" color={null}>
              <CardBody className={classes.profileCard}>
                <React.Fragment>
                  <Box className={`${classes.avatar_wrapper} d-flex justify-content-center my-3`}>
                    <AvatarImage size="lg" src={randomAvatar()} />
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
                          <Box>{userinfo.family_name}</Box>
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
                          {jansAdminUIRole?.values && (
                            <Box
                              display={'flex'}
                              gap={'2px'}
                              flexWrap={'wrap'}
                              alignItems={'end'}
                              justifyContent={'end'}
                            >
                              {jansAdminUIRole?.values.map(
                                (role: string, index: number): JSX.Element => (
                                  <Badge
                                    style={{ padding: '4px 6px' }}
                                    color={`primary-${selectedTheme}`}
                                    className="me-1"
                                    key={index}
                                  >
                                    <span style={{ color: themeColors.fontColor }}>{role}</span>
                                  </Badge>
                                ),
                              )}
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
                    {hasCedarPermission(USER_WRITE) ? (
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
