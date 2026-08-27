import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { MANUAL_LOGOUT } from '@/audit/messages'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import type { DropdownProfileProps } from './types'

const DropdownProfile = ({ trigger, renderTrigger, position = 'bottom' }: DropdownProfileProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()

  const handleLogout = useCallback(() => {
    dispatch(auditLogoutLogs({ message: MANUAL_LOGOUT }))
  }, [dispatch])

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
      renderTrigger={renderTrigger}
      options={options}
      position={position}
      minWidth={182}
      showArrow={true}
    />
  )
}

export { DropdownProfile }
