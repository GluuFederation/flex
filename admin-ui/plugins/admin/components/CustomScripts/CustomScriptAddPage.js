import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import CustomScriptForm from './CustomScriptForm'
import { addCustomScript } from 'Plugins/admin/redux/features/customScriptSlice'
import { buildPayload } from 'Utils/PermChecker'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'

function CustomScriptAddPage() {
  const userAction = {}
  const dispatch = useDispatch()
  const loading = useSelector((state) => state.customScriptReducer.loading)
  const scripts = useSelector((state) => state.customScriptReducer.items)
  const saveOperationFlag = useSelector((state) => state.customScriptReducer.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector(
    (state) => state.customScriptReducer.errorInSaveOperationFlag,
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/scripts')
  }, [saveOperationFlag])

  function handleSubmit(data) {
    if (data) {
      const message = data.customScript.action_message
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(addCustomScript({ action: userAction }))
    }
  }
  return (
    <GluuLoader blocking={loading}>
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <CustomScriptForm item={new Object()} scripts={scripts} handleSubmit={handleSubmit} />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptAddPage
