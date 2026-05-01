import React, { memo, useCallback, useMemo } from 'react'
import omit from 'lodash/omit'
import { useAppDispatch } from '@/redux/hooks'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { GluuPageContent } from '@/components'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import SetTitle from 'Utils/SetTitle'
import { updateToast } from 'Redux/features/toastSlice'
import CustomScriptForm from './CustomScriptForm'
import { useCreateCustomScript, useMutationEffects } from './hooks'
import { useStyles } from './styles/CustomScriptFormPage.style'
import type { CustomScript } from 'JansConfigApi'
import type { SubmitData } from './types'

const scriptsResourceId = ADMIN_UI_RESOURCES.Scripts

const CustomScriptAddPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const { hasCedarWritePermission } = useCedarling()
  const canWrite = useMemo(
    () => hasCedarWritePermission(scriptsResourceId),
    [hasCedarWritePermission, scriptsResourceId],
  )

  const createMutation = useCreateCustomScript()

  useMutationEffects({
    mutation: createMutation,
    successMessage: 'messages.script_added_successfully',
    errorMessage: 'messages.error_adding_script',
  })

  const handleSubmit = useCallback(
    async (data: SubmitData) => {
      if (!data?.customScript) {
        dispatch(updateToast(true, 'error', t('messages.invalid_script_data')))
        return
      }

      const { action_message } = data.customScript
      const scriptData = omit(data.customScript, ['action_message'])

      await createMutation.mutateAsync({
        data: scriptData as CustomScript,
        actionMessage: action_message,
      })
    },
    [createMutation, dispatch, t],
  )

  SetTitle(t('messages.add_script', { defaultValue: 'Add Custom Script' }))

  return (
    <GluuPageContent>
      <GluuViewWrapper canShow={canWrite}>
        <GluuLoader blocking={createMutation.isPending}>
          <div className={classes.formCard}>
            <div className={classes.content}>
              <CustomScriptForm item={{}} handleSubmit={handleSubmit} />
            </div>
          </div>
        </GluuLoader>
      </GluuViewWrapper>
    </GluuPageContent>
  )
}

export default memo(CustomScriptAddPage)
