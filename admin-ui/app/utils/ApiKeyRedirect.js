import React from 'react'
import { Container } from './../components'
import GluuNotification from './../routes/Apps/Gluu/GluuNotification'
import GluuCommitDialog from '../../app/routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import ApiKey from './LicenseScreens/ApiKey'
function ApiKeyRedirect({
  backendIsUp,
  isLicenseValid,
  islicenseCheckResultLoaded,
  isLicenseActivationResultLoaded,
}) {
  const { t } = useTranslation()

  return (
    <React.Fragment>
      <Container>
        {!isLicenseValid && islicenseCheckResultLoaded && <ApiKey />}
        {!backendIsUp && (
          <GluuNotification
            type="error"
            message={t('The UI backend service is down')}
            description={t(
              'Please contact the side administrator or make sure it is up and running.',
            )}
            show={true}
          />
        )}
        {isLicenseActivationResultLoaded && !isLicenseValid && (
          <GluuNotification
            type="error"
            message={t('Invalid License')}
            description={t(
              'License has been not enabled for this application. Please contact support and confirm if license-key is correct.',
            )}
            show={true}
          />
        )}
      </Container>
    </React.Fragment>
  )
}
export default ApiKeyRedirect
