import React, { useState, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import ScopeForm from './ScopeForm'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useGetOauthScopesByInum } from 'JansConfigApi'
import type { ExtendedScope, ScopeClient, ModifiedFields } from '../types'
import { EMPTY_SCOPE } from '../types'
import { useScopeAttributes, useScopeScripts, useUpdateScope } from '../hooks'
import { DEFAULT_SCOPE_ATTRIBUTES } from '../constants'
import { GluuPageContent } from '@/components'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/ScopeFormPage.style'
import { devLogger } from '@/utils/devLogger'
import { REGEX_LEADING_COLON } from '@/utils/regex'
import SetTitle from 'Utils/SetTitle'

const ScopeEditPage: React.FC = () => {
  const { t } = useTranslation()

  SetTitle(t('messages.edit_scope'))

  const { id } = useParams<{ id: string }>()

  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme || DEFAULT_THEME),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })

  const { attributes, isLoading: attributesLoading } = useScopeAttributes()
  const { scripts, isLoading: scriptsLoading } = useScopeScripts()

  const { updateScope, isPending: updatePending, isError: updateIsError } = useUpdateScope()

  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [errorMessage, setErrorMessage] = useState<string>()

  const inum = useMemo(() => id?.replace(REGEX_LEADING_COLON, '') || '', [id])

  const scopeQueryOptions = useMemo(
    () => ({
      query: {
        enabled: !!inum,
        refetchOnMount: 'always' as const,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        staleTime: 0,
        gcTime: 0,
      },
    }),
    [inum],
  )

  const { data: scopeData, isLoading: scopeLoading } = useGetOauthScopesByInum(
    inum,
    undefined,
    scopeQueryOptions,
  )

  const extensibleScope = useMemo<ExtendedScope>(() => {
    if (scopeData) {
      return {
        ...scopeData,
        clients: scopeData.clients as ScopeClient[] | undefined,
        attributes: scopeData.attributes || DEFAULT_SCOPE_ATTRIBUTES,
      }
    }
    return {
      ...EMPTY_SCOPE,
      inum,
      clients: [],
      attributes: DEFAULT_SCOPE_ATTRIBUTES,
    }
  }, [scopeData, inum])

  const handleSubmit = useCallback(
    async (data: string) => {
      setErrorMessage(undefined)
      try {
        await updateScope(data, modifiedFields)
      } catch (error) {
        devLogger.error('Error updating scope:', error)
        setErrorMessage(error instanceof Error ? error.message : t('messages.error_in_saving'))
      }
    },
    [updateScope, modifiedFields, t],
  )

  const loading = updatePending || scopeLoading || attributesLoading || scriptsLoading
  const displayError = errorMessage || (updateIsError ? t('messages.error_in_saving') : undefined)

  return (
    <GluuPageContent>
      <GluuLoader blocking={loading}>
        <GluuAlert severity="error" message={displayError} show={!!displayError} />
        <div className={classes.formCard}>
          <div className={classes.content}>
            <ScopeForm
              scope={extensibleScope}
              attributes={attributes}
              scripts={scripts}
              handleSubmit={handleSubmit}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        </div>
      </GluuLoader>
    </GluuPageContent>
  )
}

export default ScopeEditPage
