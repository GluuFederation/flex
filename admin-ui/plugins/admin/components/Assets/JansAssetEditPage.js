import React, { useEffect } from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import AssetForm from './AssetForm'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useDispatch, useSelector } from 'react-redux'
import { getAssets, getAssetResponse } from 'Plugins/admin/redux/features/AssetSlice'
import { useParams } from 'react-router'
import SetTitle from 'Utils/SetTitle'

const JansAssetEditPage = () => {
    const { id } = useParams()
    const { t } = useTranslation()
    const dispatch = useDispatch()
    SetTitle(t('titles.asset_edit'))
    const { loading } = useSelector((state) => state.assetReducer)

    useEffect(() => {

    }, [])

    return (
        <GluuLoader blocking={loading}>
            <Card style={applicationStyle.mainCard}>
                <AssetForm />
            </Card>
        </GluuLoader>
    )
}

export default JansAssetEditPage