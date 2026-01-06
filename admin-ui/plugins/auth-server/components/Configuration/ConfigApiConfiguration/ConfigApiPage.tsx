import React, { useState, useCallback } from 'react'
import ApiConfigForm from './ApiConfigForm'
import { Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useGetConfigApiProperties, usePatchConfigApiProperties } from 'JansConfigApi'
import { useConfigApiActions } from './utils'
import { toast } from 'react-toastify'
import type { JsonPatch, PatchConfigApiPropertiesData, ModifiedFields } from './types'

const ConfigApiPage = (): JSX.Element => {
  const { t } = useTranslation()
  const { logConfigApiUpdate } = useConfigApiActions()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { data: configuration, isLoading, error, refetch } = useGetConfigApiProperties()
  const patchConfigMutation = usePatchConfigApiProperties()

  SetTitle(t('titles.config_api_configuration'))

  const loading = patchConfigMutation.isPending || isLoading

  const handleSubmit = useCallback(
    async (patches: JsonPatch[], message: string) => {
      try {
        setErrorMessage(null)
        await patchConfigMutation.mutateAsync({
          data: patches as PatchConfigApiPropertiesData,
        })

        await refetch()

        let auditSuccess = true
        try {
          const auditPayload: ModifiedFields = {
            requestBody: patches,
          } as { requestBody: JsonPatch[] } & ModifiedFields
          await logConfigApiUpdate(message, auditPayload)
        } catch (auditError) {
          console.error('Error logging audit:', auditError)
          auditSuccess = false
        }

        if (auditSuccess) {
          toast.success(t('messages.success_in_saving'))
        } else {
          toast.warning(t('messages.success_in_saving_audit_failed'))
        }
      } catch (err) {
        console.error('Error updating config:', err)
        const errorMsg = err instanceof Error ? err.message : t('messages.error_in_saving')
        setErrorMessage(errorMsg)
        toast.error(errorMsg)
      }
    },
    [patchConfigMutation, logConfigApiUpdate, t, refetch],
  )

  if (error !== null && error !== undefined) {
    const errorText =
      typeof error === 'object' && error !== null && 'message' in error
        ? String((error as { message: string | number | boolean | null }).message || error)
        : String(error)
    return (
      <Card style={applicationStyle.mainCard}>
        <div className="p-4 text-danger">
          {t('messages.error_in_loading')}: {errorText}
        </div>
      </Card>
    )
  }

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        {configuration && (
          <ApiConfigForm
            configuration={configuration as import('./types').ApiAppConfiguration}
            onSubmit={handleSubmit}
          />
        )}
        {errorMessage && (
          <div className="alert alert-danger mt-3" role="alert">
            {errorMessage}
          </div>
        )}
      </Card>
    </GluuLoader>
  )
}

export default ConfigApiPage
