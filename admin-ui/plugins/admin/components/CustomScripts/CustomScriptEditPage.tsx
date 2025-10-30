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
import { RootState, UserAction, SubmitData, ModuleProperty } from './types'

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

  const userAction: UserAction = {}
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/scripts')
  }, [saveOperationFlag, errorInSaveOperationFlag, navigate])

  function handleSubmit(data: SubmitData) {
    if (data) {
      const message = data.customScript.action_message || ''
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(editCustomScript({ action: userAction } as any))
    }
  }

  const moduleProperties = item.moduleProperties
    ? item.moduleProperties.map((item: ModuleProperty) => item)
    : []

  return (
    <GluuLoader blocking={loading}>
      <GluuAlert
        severity={t('titles.error')}
        message={t('messages.error_in_saving')}
        show={errorInSaveOperationFlag}
      />
      <Card className="mb-3" type="border" color={null}>
        <CardBody>
          <CustomScriptForm
            item={{ ...item, moduleProperties }}
            viewOnly={viewOnly}
            handleSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptEditPage
