import React from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import AssetForm from './AssetForm'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useSelector } from 'react-redux'
import SetTitle from 'Utils/SetTitle'
import { RootState } from './types/assetTypes'

const JansAssetEditPage: React.FC = () => {
    const { t } = useTranslation()
    SetTitle(t('titles.asset_edit'))
    const { loading } = useSelector((state: RootState) => state.assetReducer)

    return (
        <GluuLoader blocking={loading}>
            <Card 
                type="border" 
                color={null} 
                className={applicationStyle.mainCard}
            >
                <AssetForm />
            </Card>
        </GluuLoader>
    )
}

export default JansAssetEditPage