// @ts-nocheck
import React from 'react'
import { Container } from 'Components'
import { useTranslation } from 'react-i18next'
import ApiKey from './LicenseScreens/ApiKey'
import GluuErrorModal from '../routes/Apps/Gluu/GluuErrorModal'
import UploadSSA from './UploadSSA'
import { useSelector } from 'react-redux'
import GluuServiceDownModal from '../routes/Apps/Gluu/GluuServiceDownModal'

function ApiKeyRedirect({
  isLicenseValid,
  islicenseCheckResultLoaded,
  isLicenseActivationResultLoaded,
  roleNotFound,
  isConfigValid
}) {
  const { t } = useTranslation()
  const { isTimeout } = useSelector((state) => state.initReducer)
  const { isValidatingFlow, isNoValidLicenseKeyFound, isUnderThresholdLimit } = useSelector((state) => state.licenseReducer)
  const backendStatus = useSelector((state) => state.authReducer.backendStatus)

  return (
    <React.Fragment>
      <Container>
        {isConfigValid == false ? (
          <UploadSSA />
        ) : !isTimeout && isUnderThresholdLimit && (
          <>
            {!isLicenseValid && islicenseCheckResultLoaded && isConfigValid && !isValidatingFlow && isNoValidLicenseKeyFound ? (
              <ApiKey />
            ) : backendStatus.active && (
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

        {!backendStatus.active && (
          <GluuServiceDownModal
            statusCode={backendStatus.statusCode}
            message={
              backendStatus.errorMessage || 'Gluu Flex Admin UI is not getting any response from the backend (Jans Config Api).'
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
