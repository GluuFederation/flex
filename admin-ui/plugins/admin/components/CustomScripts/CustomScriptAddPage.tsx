import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { CardBody, Card } from 'Components'
import CustomScriptForm from './CustomScriptForm'
import { addCustomScript } from 'Plugins/admin/redux/features/customScriptSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { CustomScriptItem, RootState, UserAction, SubmitData } from './types'

function CustomScriptAddPage() {
  const userAction: UserAction = {}
  const dispatch = useDispatch()
  const loading = useSelector((state: RootState) => state.customScriptReducer.loading)
  const saveOperationFlag = useSelector(
    (state: RootState) => state.customScriptReducer.saveOperationFlag,
  )
  const errorInSaveOperationFlag = useSelector(
    (state: RootState) => state.customScriptReducer.errorInSaveOperationFlag,
  )
  const { navigateBack } = useAppNavigation()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigateBack(ROUTES.CUSTOM_SCRIPT_LIST)
  }, [saveOperationFlag, errorInSaveOperationFlag, navigateBack])

  function handleSubmit(data: SubmitData) {
    if (data) {
      const message = data.customScript.action_message || ''
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(addCustomScript({ action: userAction } as any))
    }
  }

  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          <CustomScriptForm item={new Object() as CustomScriptItem} handleSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptAddPage
