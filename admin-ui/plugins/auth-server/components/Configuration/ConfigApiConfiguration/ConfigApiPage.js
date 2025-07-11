import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ApiConfigForm from './ApiConfigForm'
import { Card } from 'Components'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import SetTitle from 'Utils/SetTitle'
import { useTranslation } from 'react-i18next'
import { getConfigApiConfiguration } from 'Plugins/auth-server/redux/features/configApiSlice'

function ConfigApiPage() {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const loading = useSelector((state) => state.configApiReducer.loading)
  SetTitle(t('titles.config_api_configuration'))

  useEffect(() => {
    dispatch(getConfigApiConfiguration())
  }, [])

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>{!loading && <ApiConfigForm />}</Card>
    </GluuLoader>
  )
}

export default ConfigApiPage
