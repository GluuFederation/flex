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

function CustomScriptEditPage() {
  const dispatch = useDispatch()
  const item = useSelector((state) => state.customScriptReducer.item)
  const scripts = useSelector((state) => state.customScriptReducer.items)
  const loading = useSelector((state) => state.customScriptReducer.loading)
  const saveOperationFlag = useSelector((state) => state.customScriptReducer.saveOperationFlag)
  const errorInSaveOperationFlag = useSelector(
    (state) => state.customScriptReducer.errorInSaveOperationFlag,
  )
  const viewOnly = useSelector((state) => state.customScriptReducer.view)

  const userAction = {}
  const navigate = useNavigate()
  const { t } = useTranslation()

  useEffect(() => {
    if (saveOperationFlag && !errorInSaveOperationFlag) navigate('/adm/scripts')
  }, [saveOperationFlag])

  function handleSubmit(data) {
    if (data) {
      const message = data.customScript.action_message
      delete data.customScript.action_message
      buildPayload(userAction, message, data)
      dispatch(editCustomScript({ action: userAction }))
    }
  }

  const moduleProperties = item.moduleProperties ? item.moduleProperties.map((item) => item) : []

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
            item={{ ...item, moduleProperties }}
            scripts={scripts}
            viewOnly={viewOnly}
            handleSubmit={handleSubmit}
          />
        </CardBody>
      </Card>
    </GluuLoader>
  )
}

export default CustomScriptEditPage
