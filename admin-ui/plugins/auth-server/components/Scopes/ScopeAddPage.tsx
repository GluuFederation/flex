import React, { useState, useCallback, useMemo } from 'react'
import ScopeForm from './ScopeForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import type { ModifiedFields } from './types'
import { useScopeAttributes, useScopeScripts, useCreateScope } from './hooks'
import { INITIAL_SCOPE } from './constants'
import { GluuPageContent } from '@/components'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/ScopeFormPage.style'
import { devLogger } from '@/utils/devLogger'
import SetTitle from 'Utils/SetTitle'

const ScopeAddPage: React.FC = () => {
  const { t } = useTranslation()

  SetTitle(t('messages.add_scope'))

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme || DEFAULT_THEME),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const { attributes, isLoading: attributesLoading, error: attributesError } = useScopeAttributes()
  const { scripts, isLoading: scriptsLoading, error: scriptsError } = useScopeScripts()

  const { createScope, isPending } = useCreateScope()

  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [errorMessage, setErrorMessage] = useState<string>()

  const handleSubmit = useCallback(
    async (data: string) => {
      setErrorMessage(undefined)
      try {
        await createScope(data, modifiedFields)
      } catch (error) {
        devLogger.error('Error creating scope:', error)
        setErrorMessage(error instanceof Error ? error.message : t('messages.error_in_saving'))
      }
    },
    [createScope, modifiedFields, t],
  )

  const loading = isPending || attributesLoading || scriptsLoading
  const hasLoadError = !!attributesError || !!scriptsError

  return (
    <GluuPageContent>
      <GluuLoader blocking={loading}>
        <GluuAlert
          severity="error"
          message={errorMessage || t('messages.error_in_saving')}
          show={!!errorMessage}
        />
        {hasLoadError ? (
          <GluuAlert severity="error" message={t('messages.error_loading_data')} show={true} />
        ) : (
          <div className={classes.formCard}>
            <div className={classes.content}>
              <ScopeForm
                scope={INITIAL_SCOPE}
                scripts={scripts}
                attributes={attributes}
                handleSubmit={handleSubmit}
                modifiedFields={modifiedFields}
                setModifiedFields={setModifiedFields}
              />
            </div>
          </div>
        )}
      </GluuLoader>
    </GluuPageContent>
  )
}

export default ScopeAddPage
