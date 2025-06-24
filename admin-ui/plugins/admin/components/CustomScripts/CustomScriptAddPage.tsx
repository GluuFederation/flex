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
interface ModuleProperty {
  value1: string
  value2: string
  description?: string
  hide?: boolean
}

interface ConfigurationProperty {
  value1: string
  value2: string
  hide?: boolean
}

interface ScriptType {
  value: string
  name: string
}

interface CustomScript {
  inum?: string
  name: string
  description?: string
  scriptType: string
  programmingLanguage: string
  level: number
  script?: string
  aliases?: string[]
  moduleProperties?: ModuleProperty[]
  configurationProperties?: ConfigurationProperty[]
  enabled: boolean
  locationType?: string
  locationPath?: string
  scriptError?: {
    stackTrace: string
  }
  revision?: number
  internal?: boolean
  action_message?: string
}

interface CustomScriptState {
  items: CustomScript[]
  loading: boolean
  view: boolean
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  scriptTypes: ScriptType[]
  hasFetchedScriptTypes: boolean
  loadingScriptTypes: boolean
  item?: CustomScript
}

interface RootState {
  customScriptReducer: CustomScriptState
}

interface UserAction {
  [key: string]: any
}

interface FormData {
  customScript: CustomScript
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

  function handleSubmit(data: FormData) {
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
          <CustomScriptForm
            item={{} as CustomScript}
            handleSubmit={handleSubmit}
            viewOnly={false}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptAddPage
