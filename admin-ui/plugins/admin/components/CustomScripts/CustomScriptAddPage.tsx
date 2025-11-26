import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { CardBody, Card } from 'Components'
import CustomScriptForm from './CustomScriptForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { updateToast } from 'Redux/features/toastSlice'
import { useTranslation } from 'react-i18next'
import { useCreateCustomScript } from './hooks'
import { DEFAULT_SCRIPT_TYPE } from './constants'
import type { CustomScript } from 'JansConfigApi'
import type { SubmitData } from './types'

function CustomScriptAddPage() {
  const dispatch = useDispatch()
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()

  const createMutation = useCreateCustomScript()

  useEffect(() => {
    let mounted = true

    if (createMutation.isSuccess && mounted) {
      dispatch(updateToast(true, 'success', t('messages.script_added_successfully')))
      navigateBack(ROUTES.CUSTOM_SCRIPT_LIST)
    }

    return () => {
      mounted = false
    }
  }, [createMutation.isSuccess, navigateBack, dispatch, t])

  useEffect(() => {
    let mounted = true

    if (createMutation.isError && mounted) {
      const errorMessage =
        createMutation.error instanceof Error
          ? createMutation.error.message
          : t('messages.error_adding_script')
      dispatch(updateToast(true, 'error', errorMessage))
    }

    return () => {
      mounted = false
    }
  }, [createMutation.isError, createMutation.error, dispatch, t])

  const handleSubmit = async (data: SubmitData) => {
    if (!data?.customScript) {
      dispatch(updateToast(true, 'error', t('messages.invalid_script_data')))
      return
    }

    try {
      const scriptData = { ...data.customScript }
      const actionMessage = scriptData.action_message
      delete scriptData.action_message

      await createMutation.mutateAsync({
        data: scriptData as CustomScript,
        actionMessage,
      })
    } catch (error) {
      console.error('Failed to create script:', error)
    }
  }

  return (
    <GluuLoader blocking={createMutation.isPending}>
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          <CustomScriptForm
            item={{}}
            handleSubmit={handleSubmit}
            isSubmitting={createMutation.isPending}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptAddPage
