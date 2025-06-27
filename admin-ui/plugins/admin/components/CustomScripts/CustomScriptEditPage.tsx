import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { CardBody, Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import CustomScriptForm from './CustomScriptForm'
import { editCustomScript } from 'Plugins/admin/redux/features/customScriptSlice'
import { buildPayload } from 'Utils/PermChecker'
import GluuAlert from 'Routes/Apps/Gluu/GluuAlert'
import { useTranslation } from 'react-i18next'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'

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

function CustomScriptEditPage() {
  const dispatch = useDispatch()
  const item = useSelector((state: RootState) => state.customScriptReducer.item)
  const loading = useSelector((state: RootState) => state.customScriptReducer.loading)
  const saveOperationFlag = useSelector(
    (state: RootState) => state.customScriptReducer.saveOperationFlag,
  )
  const errorInSaveOperationFlag = useSelector(
    (state: RootState) => state.customScriptReducer.errorInSaveOperationFlag,
  )
  const viewOnly = useSelector((state: RootState) => state.customScriptReducer.view)

  const userAction = {}
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/scripts')
  }, [saveOperationFlag])

  function handleSubmit(data: any) {
    if (data) {
      const message = data.customScript.action_message
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(editCustomScript({ action: userAction } as any))
    }
  }

  const moduleProperties = item?.moduleProperties
    ? item.moduleProperties.map((item: any) => item)
    : []

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
      />
      <Card className="mb-3" style={applicationStyle.mainCard}>
        <CardBody>
          <CustomScriptForm
            item={{ ...item, moduleProperties } as CustomScript}
            viewOnly={viewOnly}
            handleSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptEditPage
