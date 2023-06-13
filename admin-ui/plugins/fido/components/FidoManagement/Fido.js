import React, { useEffect } from 'react'
import StaticConfiguration from './StaticConfiguration';
import DynamicConfiguration from './DynamicConfiguration';
import GluuTabs from '../../../../app/routes/Apps/Gluu/GluuTabs';
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { useTranslation } from 'react-i18next'
import { Card, CardBody } from '../../../../app/components'
import SetTitle from 'Utils/SetTitle'
import { useDispatch, useSelector } from 'react-redux';
import { getFidoConfiguration, putFidoConfiguration } from '../../redux/features/fidoSlice';
import applicationStyle from "Routes/Apps/Gluu/styles/applicationstyle"

const tabNames = [
  "Dynamic Configuration",
  "Static Configuration"
];

export default function Fido() {
  const { t } = useTranslation()
  SetTitle(t('titles.fido_management'))
  const dispatch = useDispatch();
  const fidoConfiguration = useSelector((state) => state.fidoReducer);

  useEffect(() => {
    dispatch(getFidoConfiguration());
  }, [])

  const tabToShow = (tabName) => {
    switch (tabName) {
      case "Static Configuration":
        return <StaticConfiguration handleSubmit={handleStaticConfigurationSubmit} fidoConfiguration={fidoConfiguration} />;
      case "Dynamic Configuration":
        return <DynamicConfiguration handleSubmit={handleDyamicConfigurationSubmit} fidoConfiguration={fidoConfiguration} />;
    }
  };

  const handleDyamicConfigurationSubmit = (data) => {
    const payload = fidoConfiguration.fido;
    payload.issuer = data.issuer;
    payload.baseEndpoint = data.baseEndpoint;
    payload.cleanServiceInterval = data.cleanServiceInterval;
    payload.cleanServiceBatchChunkSize = data.cleanServiceBatchChunkSize;
    payload.useLocalCache = data.useLocalCache;
    payload.disableJdkLogger = data.disableJdkLogger;
    payload.loggingLevel = data.loggingLevel;
    payload.loggingLayout = data.loggingLayout;
    payload.externalLoggerConfiguration = data.externalLoggerConfiguration;
    payload.metricReporterEnabled = data.metricReporterEnabled;
    payload.metricReporterInterval = data.metricReporterInterval;
    payload.metricReporterKeepDataDays = data.metricReporterKeepDataDays;
    payload.personCustomObjectClassList = data.personCustomObjectClassList;
    payload.superGluuEnabled = data.superGluuEnabled
    payload.personCustomObjectClassList = data.personCustomObjectClassList.map(item => item?.value ? item?.value : item)

    const opts = {}
    const fiodData = JSON.stringify(data)
    opts['appConfiguration1'] = JSON.parse(fiodData);
    dispatch(putFidoConfiguration(opts));
  }

  const handleStaticConfigurationSubmit = (data) => {
    const payload = fidoConfiguration.fido;
    payload.authenticatorCertsFolder = data.authenticatorCertsFolder;
    payload.mdsCertsFolder = data.mdsCertsFolder;
    payload.mdsTocsFolder = data.mdsTocsFolder;
    payload.checkU2fAttestations = data.checkU2fAttestations;
    payload.unfinishedRequestExpiration = data.unfinishedRequestExpiration;
    payload.authenticationHistoryExpiration = data.authenticationHistoryExpiration;
    payload.serverMetadataFolder = data.serverMetadataFolder;
    payload.userAutoEnrollment = data.userAutoEnrollment;
    payload.requestedCredentialTypes = data.requestedCredentialTypes.map(item => item?.value ? item?.value : item);
    payload.requestedParties = data.requestedParties.map(item => {
      return {
        name: item.key,
        domains: [item.key]
      }
    })
    const newPayload = {...fidoConfiguration.fido,fido2Configuration:payload}
    const opts = {}
    const fiodData = JSON.stringify(newPayload)
    opts['appConfiguration1'] = JSON.parse(fiodData);
    dispatch(putFidoConfiguration(opts));
  }
  return (
    <React.Fragment>
      <GluuLoader blocking={fidoConfiguration?.loading}>
        <Card className="mb-3" style={applicationStyle.mainCard}>
          <CardBody>
            {!fidoConfiguration?.loading && <GluuTabs tabNames={tabNames} tabToShow={tabToShow} />}
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  )
}
