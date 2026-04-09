import React, { useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { GluuPageContent } from '@/components'
import SetTitle from 'Utils/SetTitle'
import { useGetProperties } from 'JansConfigApi'
import { useAppDispatch } from '@/redux/hooks'
import { updateToast } from 'Redux/features/toastSlice'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { devLogger } from '@/utils/devLogger'
import SsaForm from './SsaForm'
import { useStyles } from './styles/SsaFormPage.style'
import { useCreateSsa } from '../hooks'
import { logSsaCreation } from '../helper'
import type { SsaFormValues } from '../types/SsaApiTypes'

const SsaAddPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { navigateToRoute } = useAppNavigation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  SetTitle(t('titles.ssa_management'))

  const { data: configuration, isLoading } = useGetProperties()
  const customAttributes = useMemo(
    () => configuration?.ssaConfiguration?.ssaCustomAttributes || [],
    [configuration],
  )
  const softwareRolesOptions = useMemo(
    () => Object.keys(configuration?.ssaConfiguration?.ssaMapSoftwareRolesToScopes || {}),
    [configuration],
  )

  const createSsaMutation = useCreateSsa()
  const isSubmitting = createSsaMutation.isPending

  const handleSubmitData = useCallback(
    async (payload: SsaFormValues, userMessage: string) => {
      try {
        await createSsaMutation.mutateAsync(payload)

        await logSsaCreation(payload, userMessage)

        dispatch(updateToast(true, 'success'))
        navigateToRoute(ROUTES.AUTH_SERVER_SSA_LIST)
      } catch (error) {
        devLogger.error('Failed to submit SSA form:', error)
        dispatch(updateToast(true, 'error'))
      }
    },
    [createSsaMutation, dispatch, navigateToRoute],
  )

  return (
    <GluuPageContent>
      <div className={classes.page}>
        <div className={classes.formCard}>
          <GluuLoader blocking={isLoading || isSubmitting}>
            <SsaForm
              onSubmitData={handleSubmitData}
              isSubmitting={isSubmitting}
              customAttributes={customAttributes}
              softwareRolesOptions={softwareRolesOptions}
            />
          </GluuLoader>
        </div>
      </div>
    </GluuPageContent>
  )
}

SsaAddPage.displayName = 'SsaAddPage'

export default React.memo(SsaAddPage)
