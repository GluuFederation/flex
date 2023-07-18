import React, { useContext, useEffect } from 'react'
import { Container, Row, Col, Card, CardBody, Avatar, Button } from 'Components'
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
import { setSelectedUserData } from 'Plugins/user-management/redux/features/userSlice'
import { USER_WRITE, hasPermission } from 'Utils/PermChecker'

const ProfileDetails = () => {
  const { t } = useTranslation()
  const { loading, profileDetails } = useSelector(
    (state) => state.profileDetailsReducer
  )
  const scopes = useSelector((state) =>
    state.token ? state.token.scopes : state.authReducer.permissions
  )
  const { userinfo } = useSelector((state) => state.authReducer)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const navigate = useNavigate()
  const { classes } = styles()
  SetTitle(t('titles.profile_detail'))
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getProfileDetails({ action: { pattern: userinfo.inum } }))
  }, [])

  const navigateToUserManagement = () => {
    dispatch(setSelectedUserData(profileDetails))
    navigate(`/user/usermanagement/edit/:` + profileDetails.inum)
  }

  return (
    <React.Fragment>
      <ErrorBoundary FallbackComponent={GluuErrorFallBack}>
        <Container>
          <Row className={classes.centerCard}>
            <Col xs={10} md={6} lg={4}>
              <Card>
                <CardBody className={classes.profileCard}>
                  <React.Fragment>
                    <Box
                      className={`${classes.avatar_wrapper} d-flex justify-content-center my-3`}
                    >
                      <Avatar.Image size='lg' src={randomAvatar()} />
                    </Box>
                    <Box display={'flex'} flexDirection={'column'}>
                      <Box>
                        <Box fontSize={'16px'} className='text-center mb-4'>
                          {userinfo.name}
                        </Box>
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box>First Name</Box>
                          <Box>{userinfo.given_name}</Box>
                        </Box>
                        <Divider />
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box>Last Name</Box>
                          <Box>{userinfo.family_name}</Box>
                        </Box>
                        <Divider />
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box>Email</Box>
                          <Box>{userinfo.email}</Box>
                        </Box>
                        <Divider />
                        <Box
                          display={'flex'}
                          justifyContent={'space-between'}
                          alignItems={'center'}
                          mb={1}
                        >
                          <Box>User Roles</Box>
                          <Box>{userinfo.jansAdminUIRole}</Box>
                        </Box>
                        <Divider />
                        {loading ? (
                          <Skeleton animation='wave' />
                        ) : (
                          <>
                            <Box
                              display={'flex'}
                              justifyContent={'space-between'}
                              alignItems={'center'}
                              mb={1}
                            >
                              <Box>Status</Box>
                              <Box>{profileDetails?.jansStatus || '-'}</Box>
                            </Box>
                          </>
                        )}
                        <Divider />
                      </Box>
                      {hasPermission(scopes, USER_WRITE) ? (
                        <>
                          {loading ? (
                            <Skeleton animation='wave' height={40} />
                          ) : (
                            <Button
                              color={`primary-${selectedTheme}`}
                              onClick={navigateToUserManagement}
                            >
                              <i className='fa fa-pencil me-2' />
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
    </React.Fragment>
  )
}

export default ProfileDetails
