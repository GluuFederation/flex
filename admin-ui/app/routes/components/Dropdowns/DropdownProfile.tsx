import { useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import type { DropdownProfileProps, LogoutAuditState } from './types'

const DropdownProfile = ({ trigger, position = 'bottom' }: DropdownProfileProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { logoutAuditSucceeded } = useSelector(
    (state: LogoutAuditState) => state.logoutAuditReducer,
  )
  const { navigateToRoute } = useAppNavigation()

  const handleLogout = useCallback(() => {
    dispatch(auditLogoutLogs({ message: 'User logged out manually' }))
  }, [dispatch])

  useEffect(() => {
    if (logoutAuditSucceeded === true) {
      navigateToRoute(ROUTES.LOGOUT)
    }
  }, [logoutAuditSucceeded, navigateToRoute])

  const options: GluuDropdownOption<string>[] = useMemo(
    () => [
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
    ],
    [t, navigateToRoute, handleLogout],
  )

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
