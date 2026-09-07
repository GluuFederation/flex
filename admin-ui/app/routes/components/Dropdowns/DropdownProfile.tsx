import { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppDispatch } from '@/redux/hooks'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { auditLogoutLogs } from 'Redux/features/sessionSlice'
import { MANUAL_LOGOUT } from '@/audit/messages'
import { GluuDropdown, type GluuDropdownOption } from 'Components'
import Box from '@mui/material/Box'
import Switch from '@mui/material/Switch'
import { useCedarlingLogToggle } from '@/utils/hooks/useCedarlingLogToggle'
import type { DropdownProfileProps } from './types'

const DropdownProfile = ({ trigger, renderTrigger, position = 'bottom' }: DropdownProfileProps) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { enabled: cedarLogsEnabled, toggle: toggleCedarLogs } = useCedarlingLogToggle()

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
        value: 'cedarLogs',
        label: (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flex: 1,
              gap: 2,
              whiteSpace: 'nowrap',
            }}
          >
            {t('fields.cedarlingLogs?')}
            <Switch
              size="small"
              checked={cedarLogsEnabled}
              slotProps={{ input: { 'aria-label': t('fields.cedarlingLogs?') } }}
            />
          </Box>
        ),
        searchValue: t('fields.cedarlingLogs?'),
        keepOpen: true,
        onClick: () => {
          toggleCedarLogs()
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
    [t, navigateToRoute, handleLogout, cedarLogsEnabled, toggleCedarLogs],
  )

  return (
    <GluuDropdown
      trigger={trigger}
      renderTrigger={renderTrigger}
      options={options}
      position={position}
      minWidth={182}
      optionPadding="12px"
      showArrow={true}
    />
  )
}

export { DropdownProfile }
