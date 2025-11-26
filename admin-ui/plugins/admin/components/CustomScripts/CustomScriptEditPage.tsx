import React from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import CustomScriptForm from './CustomScriptForm'
import { updateToast } from 'Redux/features/toastSlice'
import { useTranslation } from 'react-i18next'
import { Alert, Box } from '@mui/material'
import { useCustomScript, useUpdateCustomScript, useMutationEffects } from './hooks'
import type { CustomScript } from 'JansConfigApi'
import type { SubmitData } from './types'

function CustomScriptEditPage() {
  const { id: inum } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const viewOnly = searchParams.get('view') === 'true'

  const { data: script, isLoading: loadingScript, error: fetchError } = useCustomScript(inum || '')

  const updateMutation = useUpdateCustomScript()

  useMutationEffects({
    mutation: updateMutation,
    successMessage: 'messages.script_updated_successfully',
    errorMessage: 'messages.error_updating_script',
  })

  const handleSubmit = async (data: SubmitData) => {
    if (!data?.customScript) {
      dispatch(updateToast(true, 'error', t('messages.invalid_script_data')))
      return
    }

    try {
      const { action_message, script_path, location_type, ...scriptData } = data.customScript

      await updateMutation.mutateAsync({
        data: scriptData as CustomScript,
        actionMessage: action_message,
      })
    } catch (error) {
      console.error('Failed to update script:', error)
    }
  }

  if (loadingScript) {
    return (
      <GluuLoader blocking={true}>
        <Card className="mb-3" type="border" color={null}>
          <CardBody>
            <Box sx={{ p: 3, textAlign: 'center' }}>{t('messages.loading_script')}</Box>
          </CardBody>
        </Card>
      </GluuLoader>
    )
  }

  if (fetchError || !script) {
    return (
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          <Alert severity="error">
            <Box>
              <strong>{t('messages.error_loading_script')}</strong>
            </Box>
            <Box sx={{ mt: 1 }}>
              {fetchError && typeof fetchError === 'object' && 'message' in fetchError
                ? (fetchError as { message: string }).message
                : t('messages.script_not_found')}
            </Box>
          </Alert>
        </CardBody>
      </Card>
    )
  }

  return (
    <GluuLoader blocking={updateMutation.isPending}>
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          <CustomScriptForm item={script} viewOnly={viewOnly} handleSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptEditPage
