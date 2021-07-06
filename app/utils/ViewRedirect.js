import React, { useState, useEffect } from 'react'
import { Container } from './../components'
import GluuNotification from './../routes/Apps/Gluu/GluuNotification'
import GluuCommitDialog from '../../app/routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'

function ViewRedirect({ backendIsUp, isLicensePresent, activateLicense, redirectUrl }) {
  const { t } = useTranslation()
  const [licensePresent, setLicensePresent] = useState(isLicensePresent)
  useEffect(() => {
    if(licensePresent) {
      window.location.href = redirectUrl;
    }
  }, [licensePresent])

  function submitForm(message) {
    setLicensePresent(activateLicense(message.trim()))
  }

  function toggle() {
    window.location.href = redirectUrl;
  }

  return (
    <React.Fragment>
      <Container>
        <div
          style={{
            backgroundColor: 'white',
            margin: 'auto',
            marginTop: '20%',
          }}
        >
          <img
            style={{
              display: 'block',
              marginLeft: 'auto',
              marginTop: 'auto',
              marginRight: 'auto',
              width: '100%',
              height: '100%',
            }}
            src={require('../images/gif/npe-redirecting.gif')}
            alt="loading..."
          />
          {!backendIsUp && (
            <GluuNotification
              type="error"
              message={t("The UI backend service is down")}
              description={t("Please contact the side administrator or make sure it is up and running.")}
              show={true}
            />
          )}
          <GluuCommitDialog handler={toggle} modal={!isLicensePresent} onAccept={submitForm} label={t("License key required to access Gluu Admin UI. Please enter license key.")} placeholderLabel={t("Enter license key")} inputType={"text"}/>
        </div>
      </Container>
    </React.Fragment>
  )
}
export default ViewRedirect
