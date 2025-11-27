import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { DropdownMenu, DropdownItem } from 'Components'
import { useTranslation } from 'react-i18next'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'

const DropdownProfile = ({ position = '', end, userinfo }: any) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { logoutAuditSucceeded } = useSelector((state: any) => state.logoutAuditReducer)
  const { navigateToRoute } = useAppNavigation()

  const handleLogout = () => {
    dispatch(auditLogoutLogs({ message: 'User logged out mannually' }))
  }

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [logoutAuditSucceeded, navigateToRoute])

  return (
    <DropdownMenu end={end}>
      <DropdownItem header>
        {userinfo.user_name || userinfo.name || userinfo.given_name}
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem tag={Link} to={ROUTES.PROFILE}>
        {t('menus.my_profile')}
      </DropdownItem>
      <DropdownItem divider />
      <DropdownItem
        tag={Link}
        onClick={(e) => {
          e.preventDefault()
          handleLogout()
        }}
      >
        <i className="fa fa-fw fa-sign-out me-2"></i>
        {t('menus.signout')}
      </DropdownItem>
    </DropdownMenu>
  )
}
export { DropdownProfile }
