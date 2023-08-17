import React from 'react'
import { Container } from 'Components'
import { useTranslation } from 'react-i18next'
import ApiKey from './LicenseScreens/ApiKey'
import GluuErrorModal from '../routes/Apps/Gluu/GluuErrorModal'
import UploadSSA from './UploadSSA'
import { useSelector } from 'react-redux'

function ApiKeyRedirect({
  backendIsUp,
  isLicenseValid,
  islicenseCheckResultLoaded,
  isLicenseActivationResultLoaded,
  roleNotFound,
  isConfigValid
}) {
  const { t } = useTranslation()
  const { isTimeout } = useSelector((state) => state.initReducer)
  const { isValidatingFlow, isNoValidLicenseKeyFound, isUnderThresholdLimit } = useSelector((state) => state.licenseReducer)

  return (
    <React.Fragment>
      <Container>
        {isConfigValid == false ? (
          <UploadSSA />
        ) : !isTimeout && isUnderThresholdLimit && (
          <>
            {!isLicenseValid && islicenseCheckResultLoaded && isConfigValid && !isValidatingFlow && isNoValidLicenseKeyFound ? (
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
                  alt='loading...'
                />
                <div className='initial-loader__row'>Redirecting...</div>
              </div>
            )}
          </>
        )}

        {!backendIsUp && (
          <GluuErrorModal
            message={'The UI backend service is down'}
            description={
              'It may due to any of the following reason <br/>1. Admin UI Backend is down. <br/>2. Unable to get license credentials from Gluu server.<br/>Please contact the site administrator or check server logs.'
            }
          />
        )}

        {roleNotFound && (
          <GluuErrorModal
            message={t('Unauthorized User')}
            description={
              'The logged-in user do not have valid role. Logging out of Admin UI'
            }
          />
        )}

      </Container>
    </React.Fragment>
  )
}
export default ApiKeyRedirect
