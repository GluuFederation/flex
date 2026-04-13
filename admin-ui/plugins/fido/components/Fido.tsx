import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import StaticConfiguration from './StaticConfiguration'
import DynamicConfiguration from './DynamicConfiguration'
import SetTitle from 'Utils/SetTitle'
import { GluuPageContent } from '@/components'
import { fidoConstants } from '../helper'
import { useFidoConfig, useUpdateFidoConfig } from '../hooks'
import type { DynamicConfigFormValues, StaticConfigFormValues } from '../types/fido'
import type { UpdateFidoParams } from '../types'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import GluuViewWrapper from '@/routes/Apps/Gluu/GluuViewWrapper'
import { ROUTES } from '@/helpers/navigation'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/FidoFormPage.style'

const fidoResourceId = ADMIN_UI_RESOURCES.FIDO
const fidoScopes = CEDAR_RESOURCE_SCOPES[fidoResourceId]

const Fido: React.FC = () => {
  const { t } = useTranslation()

  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()
  const canReadFido = useMemo(
    () => hasCedarReadPermission(fidoResourceId),
    [hasCedarReadPermission],
  )
  const canWriteFido = useMemo(
    () => hasCedarWritePermission(fidoResourceId),
    [hasCedarWritePermission],
  )

  useEffect(() => {
    authorizeHelper(fidoScopes)
  }, [authorizeHelper])

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const { data: fidoConfiguration, isLoading } = useFidoConfig()
  const updateFidoMutation = useUpdateFidoConfig()

  SetTitle(t('titles.fido_management'))

  const handleConfigSubmit = useCallback(
    (params: UpdateFidoParams) => {
      if (!canWriteFido) {
        return
      }
      updateFidoMutation.mutate(params)
    },
    [canWriteFido, updateFidoMutation],
  )

  const tabNames = [
    { name: t('menus.static_configuration'), path: ROUTES.FIDO_STATIC_CONFIG },
    { name: t('menus.dynamic_configuration'), path: ROUTES.FIDO_DYNAMIC_CONFIG },
  ]

  const tabToShow = useCallback(
    (tabName: string) => {
      const isSubmitting = updateFidoMutation.isPending
      switch (tabName) {
        case t('menus.static_configuration'):
          return (
            <StaticConfiguration
              handleSubmit={(data: StaticConfigFormValues, userMessage?: string) =>
                handleConfigSubmit({ data, type: fidoConstants.STATIC, userMessage })
              }
              fidoConfiguration={fidoConfiguration}
              isSubmitting={isSubmitting}
              readOnly={!canWriteFido}
            />
          )
        case t('menus.dynamic_configuration'):
          return (
            <DynamicConfiguration
              handleSubmit={(data: DynamicConfigFormValues, userMessage?: string) =>
                handleConfigSubmit({ data, type: fidoConstants.DYNAMIC, userMessage })
              }
              fidoConfiguration={fidoConfiguration}
              isSubmitting={isSubmitting}
              readOnly={!canWriteFido}
            />
          )
        default:
          return null
      }
    },
    [t, handleConfigSubmit, fidoConfiguration, updateFidoMutation.isPending, canWriteFido],
  )

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canReadFido}>
        <GluuLoader blocking={isLoading || updateFidoMutation.isPending}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <GluuTabs tabNames={tabNames} tabToShow={tabToShow} withNavigation={true} />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default Fido
