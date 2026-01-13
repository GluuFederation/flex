import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import type { DropdownProfileProps, LogoutAuditState } from './types'

const DropdownProfile = ({ trigger, position = 'bottom' }: DropdownProfileProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { logoutAuditSucceeded } = useSelector(
    (state: LogoutAuditState) => state.logoutAuditReducer,
  )
  const { navigateToRoute } = useAppNavigation()

  const handleLogout = () => {
    dispatch(auditLogoutLogs({ message: 'User logged out mannually' }))
  }

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [logoutAuditSucceeded, navigateToRoute])

  const options: GluuDropdownOption<string>[] = [
    {
      value: 'profile',
      label: t('menus.my_profile'),
      onClick: () => {
        navigateToRoute(ROUTES.PROFILE)
      },
    },
    {
      value: 'logout',
      label: t('menus.signout'),
      onClick: () => {
        handleLogout()
      },
    },
  ]

  return (
    <GluuDropdown
      trigger={trigger}
      options={options}
      position={position}
      minWidth={182}
      showArrow={true}
    />
  )
}

export { DropdownProfile }
