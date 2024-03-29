import React, { useEffect } from 'react'
import { Card } from 'Components'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import WebhookForm from '../Webhook/WebhookForm'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useDispatch, useSelector } from 'react-redux'
import { getAssets, getAssetResponse } from 'Plugins/admin/redux/features/assetSlice'
import { useParams } from 'react-router'

const JansAssetEditPage = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.assetReducer)

    useEffect(() => {

    }, [])

    return (
        <GluuLoader blocking={loading}>
            <Card style={applicationStyle.mainCard}>
                <WebhookForm />
            </Card>
        </GluuLoader>
    )
}

export default JansAssetEditPage