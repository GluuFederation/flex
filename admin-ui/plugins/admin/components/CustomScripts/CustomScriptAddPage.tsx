import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import CustomScriptForm from './CustomScriptForm'
import { addCustomScript } from 'Plugins/admin/redux/features/customScriptSlice'
import { buildPayload } from 'Utils/PermChecker'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'

// Type definitions
interface CustomScriptItem {
  inum?: string
  name?: string
  description?: string
  scriptType?: string
  programmingLanguage?: string
  level?: number
  script?: string
  aliases?: string[]
  moduleProperties?: Array<{
    value1: string
    value2: string
    description?: string
    hide?: boolean
  }>
  configurationProperties?: Array<{
    key?: string
    value?: string
    value1?: string
    value2?: string
    hide?: boolean
  }>
  locationPath?: string
  locationType?: string
  enabled?: boolean
  action_message?: string
}

interface CustomScriptReducerState {
  items: CustomScriptItem[]
  loading: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  scriptTypes: Array<{
    value: string
    name: string
  }>
  hasFetchedScriptTypes: boolean
  loadingScriptTypes: boolean
}

interface RootState {
  customScriptReducer: CustomScriptReducerState
}

interface UserAction {
  action_message?: string
  action_data?: any
  [key: string]: unknown
}

interface SubmitData {
  customScript: CustomScriptItem
  [key: string]: unknown
}

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
  const navigate = useNavigate()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/scripts')
  }, [saveOperationFlag, errorInSaveOperationFlag, navigate])

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
