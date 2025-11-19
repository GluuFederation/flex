import React, { useState } from 'react'
import ApiConfigForm from './ApiConfigForm'
import { Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { useGetConfigApiProperties, usePatchConfigApiProperties } from 'JansConfigApi'
import { useConfigApiActions } from './hooks'
import { toast } from 'react-toastify'
import type { JsonPatch } from './types'

function ConfigApiPage(): JSX.Element {
  const { t } = useTranslation()
  const { logConfigApiUpdate } = useConfigApiActions()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  SetTitle(t('titles.config_api_configuration'))

  const { data: configuration, isLoading, error } = useGetConfigApiProperties()

  const patchConfigMutation = usePatchConfigApiProperties()

  const handleSubmit = async (patches: JsonPatch[], message: string) => {
    try {
      setErrorMessage(null)

      await patchConfigMutation.mutateAsync({ data: patches })

      try {
        await logConfigApiUpdate(message, { requestBody: patches })
      } catch (auditError) {
        console.error('Error logging audit:', auditError)
        toast.warning(t('messages.audit_log_failed'))
      }

      toast.success(t('messages.success_in_saving'))
    } catch (err) {
      console.error('Error updating config:', err)
      const errorMsg = err instanceof Error ? err.message : t('messages.error_in_saving')
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    }
  }

  const loading = patchConfigMutation.isPending || isLoading

  if (error) {
    return (
      <Card style={applicationStyle.mainCard}>
        <div className="p-4 text-danger">
          {t('messages.error_in_loading')}: {error instanceof Error ? error.message : String(error)}
        </div>
      </Card>
    )
  }

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        {configuration && <ApiConfigForm configuration={configuration} onSubmit={handleSubmit} />}
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
