//ToDo :: Delete This page once auth things works fine

import React from 'react'
import { Container } from 'Components'
import GluuNotification from 'Routes/Apps/Gluu/GluuNotification'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import GluuErrorModal from '../routes/Apps/Gluu/GluuErrorModal'

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
            <GluuErrorModal 
              message={'The UI backend service is down'}
              description={'It may due to any of the following reason <br/>1. Admin UI Backend is down. <br/>2. Unable to get license credentials from Gluu server.<br/>Please contact the site administrator or check server logs.'}
            />
          )}
          {isLicenseActivationResultLoaded && !isLicenseValid && (
            <GluuErrorModal 
              message={t('Invalid License')}
              description={'License has been not enabled for this application. Please contact support and confirm if license-key is correct.'}
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
