import React from 'react'
import { useDispatch } from 'react-redux'
import { CardBody, Card } from 'Components'
import CustomScriptForm from './CustomScriptForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { updateToast } from 'Redux/features/toastSlice'
import { useTranslation } from 'react-i18next'
import { useCreateCustomScript, useMutationEffects } from './hooks'
import type { CustomScript } from 'JansConfigApi'
import type { SubmitData } from './types'

function CustomScriptAddPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const createMutation = useCreateCustomScript()

  useMutationEffects({
    mutation: createMutation,
    successMessage: 'messages.script_added_successfully',
    errorMessage: 'messages.error_adding_script',
  })

  const handleSubmit = async (data: SubmitData) => {
    if (!data?.customScript) {
      dispatch(updateToast(true, 'error', t('messages.invalid_script_data')))
      return
    }

    try {
      const { action_message, script_path, location_type, ...scriptData } = data.customScript

      await createMutation.mutateAsync({
        data: scriptData as CustomScript,
        actionMessage: action_message,
      })
    } catch (error) {
      console.error('Failed to create script:', error)
    }
  }

  return (
    <GluuLoader blocking={createMutation.isPending}>
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          <CustomScriptForm item={{}} handleSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptAddPage
