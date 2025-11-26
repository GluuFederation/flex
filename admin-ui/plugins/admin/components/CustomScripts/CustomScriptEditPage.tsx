import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import CustomScriptForm from './CustomScriptForm'
import { updateToast } from 'Redux/features/toastSlice'
import { useTranslation } from 'react-i18next'
import { Alert, Box } from '@mui/material'
import { useCustomScript, useUpdateCustomScript } from './hooks'
import type { CustomScript } from 'JansConfigApi'
import type { SubmitData } from './types'

function CustomScriptEditPage() {
  const { id: inum } = useParams<{ id: string }>()
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()

  const searchParams = new URLSearchParams(window.location.search)
  const viewOnly = searchParams.get('view') === 'true'

  const { data: script, isLoading: loadingScript, error: fetchError } = useCustomScript(inum || '')

  const updateMutation = useUpdateCustomScript()

  useEffect(() => {
    let mounted = true

    if (updateMutation.isSuccess && mounted) {
      dispatch(updateToast(true, 'success', t('messages.script_updated_successfully')))
      navigateBack(ROUTES.CUSTOM_SCRIPT_LIST)
    }

    return () => {
      mounted = false
    }
  }, [updateMutation.isSuccess, navigateBack, dispatch, t])

  useEffect(() => {
    let mounted = true

    if (updateMutation.isError && mounted) {
      const errorMessage =
        updateMutation.error instanceof Error
          ? updateMutation.error.message
          : t('messages.error_updating_script')
      dispatch(updateToast(true, 'error', errorMessage))
    }

    return () => {
      mounted = false
    }
  }, [updateMutation.isError, updateMutation.error, dispatch, t])

  const handleSubmit = async (data: SubmitData) => {
    if (!data?.customScript) {
      dispatch(updateToast(true, 'error', t('messages.invalid_script_data')))
      return
    }

    try {
      const scriptData = { ...data.customScript }
      const actionMessage = scriptData.action_message
      delete scriptData.action_message

      await updateMutation.mutateAsync({
        data: scriptData as CustomScript,
        actionMessage,
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
          <CustomScriptForm
            item={script}
            viewOnly={viewOnly}
            handleSubmit={handleSubmit}
            isSubmitting={updateMutation.isPending}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptEditPage
