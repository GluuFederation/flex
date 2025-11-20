import React, { useState, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import { useGetConfigScriptsByInum, usePutConfigScripts } from 'JansConfigApi'
import type { CustomScript } from '../types/domain'
import { useCustomScriptActions } from '../hooks'
import { SCRIPT_ROUTES } from '../constants'
import ScriptForm from '../ScriptForm'

function ScriptEditPage(): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const inum = id?.replace(/^:/, '') || ''
  const { logScriptUpdate } = useCustomScriptActions()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Determine if this is view-only mode based on the path
  const viewOnly = useMemo(() => location.pathname.includes('/view/'), [location.pathname])
  const mode = viewOnly ? 'view' : 'edit'

  const { data: scriptData, isLoading: scriptLoading } = useGetConfigScriptsByInum(inum, {
    query: {
      enabled: !!inum,
    },
  })

  const updateScript = usePutConfigScripts()

  async function handleSubmit(data: { customScript: CustomScript & { action_message?: string } }) {
    if (!data) return

    setErrorMessage(null)

    try {
      const message = data.customScript.action_message || 'Custom script updated'
      delete data.customScript.action_message

      const updatedScript = await updateScript.mutateAsync({ data: data.customScript })

      try {
        await logScriptUpdate(updatedScript, message)
      } catch (auditError) {
        console.error('Error logging audit:', auditError)
      }

      navigate(SCRIPT_ROUTES.LIST)
    } catch (error) {
      console.error('Error updating custom script:', error)
      setErrorMessage(error instanceof Error ? error.message : t('messages.error_in_saving'))
    }
  }

  const item = scriptData || {}

  return (
    <GluuLoader blocking={scriptLoading || updateScript.isPending}>
      <GluuAlert
        severity={t('titles.error')}
        message={errorMessage || t('messages.error_in_saving')}
        show={!!errorMessage}
      />
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          <ScriptForm item={item} viewOnly={viewOnly} handleSubmit={handleSubmit} mode={mode} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default ScriptEditPage
