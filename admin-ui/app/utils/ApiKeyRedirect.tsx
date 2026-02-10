import React from 'react'
import { Container } from 'Components'
import { useTranslation } from 'react-i18next'
import ApiKey from './LicenseScreens/ApiKey'
import GluuErrorModal from '../routes/Apps/Gluu/GluuErrorModal'
import UploadSSA from './UploadSSA'
import { useAppSelector } from '@/redux/hooks'
import GluuServiceDownModal from '../routes/Apps/Gluu/GluuServiceDownModal'
import loaderGif from 'Images/gif/loader.gif'

type ApiKeyRedirectProps = {
  isLicenseValid: boolean
  islicenseCheckResultLoaded: boolean
  isLicenseActivationResultLoaded?: boolean
  roleNotFound: boolean
  isConfigValid: boolean | null
}

function ApiKeyRedirect({
  isLicenseValid,
  islicenseCheckResultLoaded,
  isLicenseActivationResultLoaded: _isLicenseActivationResultLoaded,
  roleNotFound,
  isConfigValid,
}: ApiKeyRedirectProps) {
  const { t } = useTranslation()
  const { isTimeout } = useAppSelector((state) => state.initReducer)
  const { isValidatingFlow, isNoValidLicenseKeyFound, isUnderThresholdLimit } = useAppSelector(
    (state) => state.licenseReducer,
  )
  const backendStatus = useAppSelector((state) => state.authReducer.backendStatus)

  return (
    <React.Fragment>
      <Container>
        {isConfigValid == false ? (
          <UploadSSA />
        ) : (
          !isTimeout &&
          isUnderThresholdLimit && (
            <>
              {!isLicenseValid &&
              islicenseCheckResultLoaded &&
              isConfigValid &&
              !isValidatingFlow &&
              isNoValidLicenseKeyFound ? (
                <ApiKey />
              ) : (
                backendStatus.active && (
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
                      src={loaderGif}
                      alt="loading..."
                    />
                    <div className="initial-loader__row">Redirecting...</div>
                  </div>
                )
              )}
            </>
          )
        )}

        {!backendStatus.active && (
          <GluuServiceDownModal
            statusCode={backendStatus.statusCode ?? undefined}
            message={
              backendStatus.errorMessage ||
              'Gluu Flex Admin UI is not getting any response from the backend (Jans Config Api).'
            }
          />
        )}

        {roleNotFound && (
          <GluuErrorModal
            message={t('Unauthorized User')}
            description={'The logged-in user do not have valid role. Logging out of Admin UI'}
          />
        )}
      </Container>
    </React.Fragment>
  )
}
export default ApiKeyRedirect
