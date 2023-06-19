import React, { useEffect } from 'react'
import StaticConfiguration from '../components/StaticConfiguration'
import DynamicConfiguration from '../components/DynamicConfiguration'
import GluuTabs from 'Routes/Apps/Gluu/GluuTabs'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTranslation } from 'react-i18next'
import { Card, CardBody } from 'Components'
import SetTitle from 'Utils/SetTitle'
import { useDispatch, useSelector } from 'react-redux'
import {
  getFidoConfiguration,
  putFidoConfiguration,
} from '../../infrastructure/redux/features/fidoSlice'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  fidoApiPayload,
  fidoApiPayloadDynamicConfig,
} from '../../domain/use-cases/fidoUseCases'
import { RootState } from 'Redux/store'

const tabNames = ['Dynamic Configuration', 'Static Configuration']

export default function Fido() {
  const { t } = useTranslation()
  SetTitle(t('titles.fido_management'))
  const dispatch = useDispatch()
  const fidoConfiguration = useSelector((state: RootState) => state.fidoReducer)

  useEffect(() => {
    dispatch(getFidoConfiguration())
  }, [])

  const tabToShow = (tabName) => {
    switch (tabName) {
      case 'Static Configuration':
        return (
          <StaticConfiguration
            handleSubmit={handleStaticConfigurationSubmit}
            fidoConfiguration={fidoConfiguration}
          />
        )
      case 'Dynamic Configuration':
        return (
          <DynamicConfiguration
            handleSubmit={handleDyamicConfigurationSubmit}
            fidoConfiguration={fidoConfiguration}
          />
        )
    }
  }

  const handleDyamicConfigurationSubmit = (data) => {
    const apiPayload = fidoApiPayloadDynamicConfig({ data, fidoConfiguration })
    dispatch(putFidoConfiguration(apiPayload))
  }

  const handleStaticConfigurationSubmit = (data) => {
    const apiPayload = fidoApiPayload({ data, fidoConfiguration })
    dispatch(putFidoConfiguration(apiPayload))
  }
  
  return (
    <React.Fragment>
      <GluuLoader blocking={fidoConfiguration?.loading}>
        <Card className='mb-3' style={applicationStyle.mainCard}>
          <CardBody>
            {!fidoConfiguration?.loading && (
              <GluuTabs tabNames={tabNames} tabToShow={tabToShow} />
            )}
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  )
}
