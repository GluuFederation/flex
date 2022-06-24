import React from 'react'
import { Container } from 'Components'
import GluuNotification from 'Routes/Apps/Gluu/GluuNotification'
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
        {!isLicenseValid && islicenseCheckResultLoaded ? (
          <ApiKey />
        ) : (
          <div
            style={{
              backgroundColor: 'transparent',
              margin: 'auto',
              marginTop: '25%',
            }}
          >
            <img
              style={{
                display: 'block',
                marginLeft: 'auto',
                marginTop: 'auto',
                marginRight: 'auto',
                width: '260px',
                height: 'auto',
              }}
              src={require('Images/gif/loader.gif')}
              alt="loading..."
            />
            <div className="initial-loader__row">
              AdminUI is loading...
            </div>
          </div>
        )}

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
