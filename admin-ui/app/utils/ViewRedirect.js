//ToDo :: Delete This page once auth things works fine

import React from 'react'
import { Container } from 'Components'
import GluuNotification from 'Routes/Apps/Gluu/GluuNotification'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'

function ViewRedirect({
  backendIsUp,
  isLicenseValid,
  activateLicense,
  redirectUrl,
  islicenseCheckResultLoaded,
  isLicenseActivationResultLoaded,
}) {
  const { t } = useTranslation()
  function submitForm(message) {
    activateLicense(message.trim())
  }

  function toggle() {
    window.location.href = redirectUrl
  }

  return (
    <React.Fragment>
      <Container>
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
            Redirecting...
          </div>
          {!backendIsUp && (
            <GluuNotification
              type="error"
              message={t('The UI backend service is down')}
              description={t(
                'It may due to any of the following reason-\r\n1. Admin UI Backend is down. \n2. Unable to get license credentials from Gluu server.\nPlease contact the site administrator or check server logs.',
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
          <GluuCommitDialog
            handler={toggle}
            modal={!isLicenseValid && islicenseCheckResultLoaded}
            onAccept={submitForm}
            isLoading={false}
            label={t(
              'License key required to access Gluu Admin UI. Please enter license key.',
            )}
            placeholderLabel={t('Enter license key')}
            inputType={'text'}
          />
        </div>
      </Container>
    </React.Fragment>
  )
}
export default ViewRedirect
