import React from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import AssetForm from './AssetForm'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useSelector } from 'react-redux'
import SetTitle from 'Utils/SetTitle'
import { RootStateForAssetForm } from './types/FormTypes'

const JansAssetEditPage: React.FC = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.asset_edit'))
  const { loading } = useSelector((state: RootStateForAssetForm) => state.assetReducer)

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <AssetForm />
      </Card>
    </GluuLoader>
  )
}

export default JansAssetEditPage
