import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { usePostConfigScripts } from 'JansConfigApi'
import type { CustomScript } from '../types/domain'
import { useCustomScriptActions } from '../hooks'
import { getEmptyScript } from '../services'
import { SCRIPT_ROUTES } from '../constants'
import ScriptForm from '../ScriptForm'

function ScriptAddPage(): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { logScriptCreation } = useCustomScriptActions()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const createScript = usePostConfigScripts()

  async function handleSubmit(data: { customScript: CustomScript & { action_message?: string } }) {
    if (!data) return

    setErrorMessage(null)

    try {
      const message = data.customScript.action_message || 'Custom script created'
      delete data.customScript.action_message

      const createdScript = await createScript.mutateAsync({ data: data.customScript })

      try {
        await logScriptCreation(createdScript, message)
      } catch (auditError) {
        console.error('Error logging audit:', auditError)
      }

      navigate(SCRIPT_ROUTES.LIST)
    } catch (error) {
      console.error('Error creating custom script:', error)
      setErrorMessage(error instanceof Error ? error.message : t('messages.error_in_saving'))
    }
  }

  return (
    <GluuLoader blocking={createScript.isPending}>
      <GluuAlert
        severity={t('titles.error')}
        message={errorMessage || t('messages.error_in_saving')}
        show={!!errorMessage}
      />
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          <ScriptForm item={getEmptyScript()} handleSubmit={handleSubmit} mode="create" />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ScriptAddPage
