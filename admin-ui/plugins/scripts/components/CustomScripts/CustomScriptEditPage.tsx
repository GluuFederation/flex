import React, { memo, useCallback, useMemo } from 'react'
import { useAppDispatch } from '@/redux/hooks'
import { useParams, useMatch } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { Alert } from '@mui/material'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { useCustomScript, useUpdateCustomScript, useMutationEffects } from './hooks'
import CustomScriptForm from './CustomScriptForm'
import { useStyles } from './styles/CustomScriptFormPage.style'
import { devLogger } from '@/utils/devLogger'
import { updateToast } from 'Redux/features/toastSlice'
import { useCedarling } from '@/cedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import { ROUTES } from '@/helpers/navigation'
import type { CustomScript } from 'JansConfigApi'
import type { SubmitData } from './types'

const scriptsResourceId = ADMIN_UI_RESOURCES.Scripts

const CustomScriptEditPage: React.FC = () => {
  const { id: inum } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  SetTitle(t('titles.edit_script'))

  const { hasCedarReadPermission } = useCedarling()
  const canRead = useMemo(
    () => hasCedarReadPermission(scriptsResourceId),
    [hasCedarReadPermission, scriptsResourceId],
  )

  const viewMatch = useMatch(ROUTES.CUSTOM_SCRIPT_VIEW_TEMPLATE)

  const { data: script, isLoading: loadingScript, error: fetchError } = useCustomScript(inum || '')

  const updateMutation = useUpdateCustomScript()

  useMutationEffects({
    mutation: updateMutation,
    successMessage: 'messages.script_updated_successfully',
    errorMessage: 'messages.error_updating_script',
  })

  const handleSubmit = useCallback(
    async (data: SubmitData) => {
      if (!data?.customScript) {
        dispatch(updateToast(true, 'error', t('messages.invalid_script_data')))
        return
      }

      try {
        const { action_message, script_path, location_type, ...scriptData } = data.customScript
        void script_path
        void location_type
        await updateMutation.mutateAsync({
          data: scriptData as CustomScript,
          actionMessage: action_message,
        })
      } catch (error) {
        devLogger.error('Failed to update script:', error)
      }
    },
    [updateMutation, dispatch, t],
  )

  if (fetchError && !loadingScript) {
    return (
      <GluuPageContent>
        <GluuViewWrapper canShow={canRead}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <Alert severity="error" className={classes.errorBox}>
                <GluuText variant="span" disableThemeColor>
                  <strong>{t('messages.error_loading_script')}</strong>
                </GluuText>
                <GluuText variant="p" disableThemeColor style={{ marginTop: 8 }}>
                  {fetchError && typeof fetchError === 'object' && 'message' in fetchError
                    ? (fetchError as { message: string }).message
                    : t('messages.script_not_found')}
                </GluuText>
              </Alert>
            </div>
          </div>
        </GluuViewWrapper>
      </GluuPageContent>
    )
  }

  const isBlocking = loadingScript || updateMutation.isPending

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canRead}>
        <GluuLoader blocking={isBlocking}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <CustomScriptForm
                item={script ?? {}}
                viewOnly={!!viewMatch || loadingScript}
                handleSubmit={handleSubmit}
              />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default memo(CustomScriptEditPage)
