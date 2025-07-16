import React from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import AssetForm from './AssetForm'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useSelector } from 'react-redux'
import SetTitle from 'Utils/SetTitle'

// TypeScript interface for the assetReducer state
interface AssetReducerState {
  loading: boolean
  assets: any[]
  services: any[]
  fileTypes: any[]
  saveOperationFlag: boolean
  errorInSaveOperationFlag: boolean
  totalItems: number
  entriesCount: number
  selectedAsset: any
  loadingAssets: boolean
  assetModal: boolean
  showErrorModal: boolean
}

interface RootState {
  assetReducer: AssetReducerState
}

const JansAssetAddPage = () => {
  const { t } = useTranslation()
  SetTitle(t('titles.asset_add'))
  const loading = useSelector((state: RootState) => state.assetReducer.loading)

  return (
    <GluuLoader blocking={loading}>
      <Card style={applicationStyle.mainCard}>
        <AssetForm />
      </Card>
    </GluuLoader>
  )
}

export default JansAssetAddPage
