import React, { useState, useContext } from 'react'
import { Wizard, Card, CardFooter, CardBody, Form, Button } from 'Components'
import ClientBasic from './ClientBasicPanel'
import ClientAdvanced from './ClientAdvancedPanel'
import ClientEncryption from './ClientEncryptionPanel'
import ClientAttributes from './ClientAttributesPanel'
import ClientScript from './ClientScriptPanel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { hasPermission, CLIENT_WRITE } from 'Utils/PermChecker'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import ClientTokensPanel from './ClientTokensPanel'
import ClientLogoutPanel from './ClientLogoutPanel'
import ClientSoftwarePanel from './ClientSoftwarePanel'
import ClientCibaParUmaPanel from './ClientCibaParUmaPanel'

const sequence = [
  'Basic',
  'Tokens',
  'Logout',
  'SoftwareInfo',
  'CIBA/PAR/UMA',
  'Encryption/Signing',
  'AdvancedClientProperties',
  'ClientScripts',
]
const ATTRIBUTE = 'attributes'
const DESCRIPTION = 'description'
let commitMessage = ''
function ClientWizardForm({
  client_data,
  view_only,
  scopes,
  scripts,
  permissions,
  customOnSubmit,
  oidcConfiguration,
}) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [modal, setModal] = useState(false)
  const [client, setClient] = useState(client_data)
  const [currentStep, setCurrentStep] = useState(sequence[0])
  const postScripts = scripts
    .filter((item) => item.scriptType == 'POST_AUTHN')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const spontaneousScripts = scripts
    .filter((item) => item.scriptType == 'SPONTANEOUS_SCOPE')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const consentScripts = scripts
    .filter((item) => item.scriptType == 'CONSENT_GATHERING')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const instrospectionScripts = scripts
    .filter((item) => item.scriptType == 'INTROSPECTION')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  const rptScripts = scripts
    .filter((item) => item.scriptType == 'UMA_RPT_CLAIMS')
    .filter((item) => item.enabled)
    .map((item) => ({ dn: item.dn, name: item.name }))

  function changeStep(stepId) {
    setCurrentStep(stepId)
  }
  function toggle() {
    setModal(!modal)
  }
  function setId(index) {
    return sequence[index]
  }
  function prevStep() {
    setCurrentStep(sequence[sequence.indexOf(currentStep) - 1])
  }
  function nextStep() {
    setCurrentStep(sequence[sequence.indexOf(currentStep) + 1])
  }
  function isComplete(stepId) {
    return sequence.indexOf(stepId) < sequence.indexOf(currentStep)
  }
  function submitForm(message) {
    commitMessage = message
    toggle()
    //document.querySelector('button[type="submit"]').click()
    document.getElementsByClassName('UserActionSubmitButton')[0].click()
  }

  const initialValues = {
    inum: client.inum,
    dn: client.dn,
    clientSecret: client.clientSecret,
    displayName: client.displayName,
    clientName: client.clientName,
    description: client.description,
    applicationType: client.applicationType,
    subjectType: client.subjectType,
    registrationAccessToken: client.registrationAccessToken,
    clientIdIssuedAt: client.clientIdIssuedAt,
    initiateLoginUri: client.initiateLoginUri,
    logoUri: client.logoUri,
    clientUri: client.clientUri,
    tosUri: client.tosUri,
    jwksUri: client.jwksUri,
    jwks: client.jwks,
    expirable: client.expirationDate ? ['on'] : [],
    expirationDate: client.expirationDate,
    softwareStatement: client.softwareStatement,
    softwareVersion: client.softwareVersion,
    softwareId: client.softwareId,
    softwareSection:
      client.softwareId || client.softwareVersion || client.softwareStatement
        ? true
        : false,
    cibaSection:
      client.backchannelTokenDeliveryMode ||
      client.backchannelClientNotificationEndpoint ||
      client.backchannelUserCodeParameter
        ? true
        : false,
    idTokenSignedResponseAlg: client.idTokenSignedResponseAlg,
    idTokenEncryptedResponseAlg: client.idTokenEncryptedResponseAlg,
    tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
    accessTokenSigningAlg: client.accessTokenSigningAlg,
    idTokenEncryptedResponseEnc: client.idTokenEncryptedResponseEnc,
    requestObjectEncryptionAlg: client.requestObjectEncryptionAlg,
    requestObjectSigningAlg: client.requestObjectSigningAlg,
    requestObjectEncryptionEnc: client.requestObjectEncryptionEnc,
    userInfoEncryptedResponseAlg: client.userInfoEncryptedResponseAlg,
    userInfoSignedResponseAlg: client.userInfoSignedResponseAlg,
    userInfoEncryptedResponseEnc: client.userInfoEncryptedResponseEnc,
    authenticationMethod: client.authenticationMethod,
    idTokenTokenBindingCnf: client.idTokenTokenBindingCnf,
    backchannelUserCodeParameter: client.backchannelUserCodeParameter,
    refreshTokenLifetime: client.refreshTokenLifetime,
    defaultMaxAge: client.defaultMaxAge,
    accessTokenLifetime: client.accessTokenLifetime,
    backchannelTokenDeliveryMode: client.backchannelTokenDeliveryMode,
    backchannelClientNotificationEndpoint:
      client.backchannelClientNotificationEndpoint,
    frontChannelLogoutUri: client.frontChannelLogoutUri,
    policyUri: client.policyUri,
    logoURI: client.logoURI,
    sectorIdentifierUri: client.sectorIdentifierUri,
    redirectUris: client.redirectUris,
    claimRedirectUris: client.claimRedirectUris || [],
    authorizedOrigins: client.authorizedOrigins || [],
    requestUris: client.requestUris || [],
    postLogoutRedirectUris: client.postLogoutRedirectUris,
    responseTypes: client.responseTypes,
    grantTypes: client.grantTypes,
    contacts: client.contacts,
    defaultAcrValues: client.defaultAcrValues,
    scopes: client.scopes,
    oxAuthClaims: client.oxAuthClaims,
    attributes: client.attributes,
    tlsClientAuthSubjectDn: client.attributes.tlsClientAuthSubjectDn,
    frontChannelLogoutSessionRequired: client.frontChannelLogoutSessionRequired,
    runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims:
      client.attributes
        .runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims,
    backchannelLogoutSessionRequired:
      client.attributes.backchannelLogoutSessionRequired,
    keepClientAuthorizationAfterExpiration:
      client.attributes.keepClientAuthorizationAfterExpiration,
    allowSpontaneousScopes: client.attributes.allowSpontaneousScopes,
    spontaneousScopes: client.attributes.spontaneousScopes || [],
    introspectionScripts: client.attributes.introspectionScripts || [],
    spontaneousScopeScriptDns:
      client.attributes.spontaneousScopeScriptDns || [],
    consentGatheringScripts: client.attributes.consentGatheringScripts || [],
    postAuthnScripts: client.attributes.postAuthnScripts || [],
    rptClaimsScripts: client.attributes.rptClaimsScripts || [],
    additionalAudience: client.attributes.additionalAudience,
    backchannelLogoutUri: client.attributes.backchannelLogoutUri,
    customObjectClasses: client.customObjectClasses || [],
    requireAuthTime: client.requireAuthTime,
    trustedClient: client.trustedClient,
    persistClientAuthorizations: client.persistClientAuthorizations,
    includeClaimsInIdToken: client.includeClaimsInIdToken,
    rptAsJwt: client.rptAsJwt,
    accessTokenAsJwt: client.accessTokenAsJwt,
    disabled: client.disabled,
    deletable: client.deletable,
    tokenBindingSupported: client.tokenBindingSupported,
  }
  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault()
    }
  }

  return (
    <React.Fragment>
      <Card style={applicationStyle.mainCard}>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            values['action_message'] = commitMessage
            values[ATTRIBUTE].tlsClientAuthSubjectDn =
              values.tlsClientAuthSubjectDn
            values[
              ATTRIBUTE
            ].runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims =
              values.runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims
            values[ATTRIBUTE].keepClientAuthorizationAfterExpiration =
              values.keepClientAuthorizationAfterExpiration
            values[ATTRIBUTE].allowSpontaneousScopes =
              values.allowSpontaneousScopes
            values[ATTRIBUTE].backchannelLogoutSessionRequired =
              values.backchannelLogoutSessionRequired
            values[ATTRIBUTE].spontaneousScopes = values.spontaneousScopes
            values[ATTRIBUTE].introspectionScripts = values.introspectionScripts
            values[ATTRIBUTE].spontaneousScopeScriptDns =
              values.spontaneousScopeScriptDns
            values[ATTRIBUTE].consentGatheringScripts =
              values.consentGatheringScripts
            values[ATTRIBUTE].rptClaimsScripts = values.rptClaimsScripts
            values[ATTRIBUTE].backchannelLogoutUri = values.backchannelLogoutUri
            values[ATTRIBUTE].postAuthnScripts = values.postAuthnScripts
            values[ATTRIBUTE].additionalAudience = values.additionalAudience
            customOnSubmit(JSON.parse(JSON.stringify(values)))
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onKeyDown={onKeyDown}>
              <Card>
                <CardBody className="d-flex justify-content-center pt-5">
                  <Wizard activeStep={currentStep} onStepChanged={changeStep}>
                    <Wizard.Step
                      id={setId(0)}
                      icon={<i className="fa fa-shopping-basket fa-fw"></i>}
                      complete={isComplete(sequence[0])}
                    >
                      {t('titles.client_basic')}
                    </Wizard.Step>
                    <Wizard.Step
                      id={setId(1)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[1])}
                    >
                      {t('titles.token')}
                    </Wizard.Step>
                    <Wizard.Step
                      id={setId(2)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[2])}
                    >
                      {t('titles.log_out')}
                    </Wizard.Step>
                    <Wizard.Step
                      id={setId(3)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[3])}
                    >
                      {t('titles.software_info')}
                    </Wizard.Step>
                    <Wizard.Step
                      id={setId(4)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[4])}
                    >
                      {t('titles.CIBA_PAR_UMA')}
                    </Wizard.Step>
                    <Wizard.Step
                      id={setId(5)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[5])}
                    >
                      {t('titles.encryption_signing')}
                    </Wizard.Step>
                    <Wizard.Step
                      id={setId(6)}
                      icon={<i className="fa fa-cube fa-fw"></i>}
                      complete={isComplete(sequence[6])}
                    >
                      {t('titles.client_advanced')}
                    </Wizard.Step>
                    {/* <Wizard.Step
                      id={setId(2)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[2])}
                    >
                      {t('titles.client_encryption_signing')}
                    </Wizard.Step>
                    <Wizard.Step
                      id={setId(3)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[3])}
                    >
                      {t('titles.client_attributes')}
                    </Wizard.Step> */}
                    <Wizard.Step
                      id={setId(7)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[7])}
                    >
                      {t('titles.client_scripts')}
                    </Wizard.Step>
                  </Wizard>
                </CardBody>
                <CardBody className="p-5">
                  {(() => {
                    setClient(formik.values)
                    switch (currentStep) {
                      case sequence[0]:
                        return (
                          <div
                            style={
                              view_only
                                ? { pointerEvents: 'none', opacity: '0.99' }
                                : {}
                            }
                          >
                            <ClientBasic
                              client={client}
                              scopes={scopes}
                              formik={formik}
                            />
                          </div>
                        )
                      case sequence[1]:
                        return (
                          <div
                            style={
                              view_only
                                ? { pointerEvents: 'none', opacity: '0.99' }
                                : {}
                            }
                          >
                            <ClientTokensPanel
                              client={client}
                              scripts={scripts}
                              formik={formik}
                            />
                            {/* <ClientAdvanced
                              client={client}
                              scripts={scripts}
                              formik={formik}
                            /> */}
                          </div>
                        )
                      case sequence[2]:
                        return (
                          <div
                            style={
                              view_only
                                ? { pointerEvents: 'none', opacity: '0.99' }
                                : {}
                            }
                          >
                            <ClientLogoutPanel
                              client={client}
                              scripts={scripts}
                              formik={formik}
                            />
                            {/* <ClientEncryption
                              client={client}
                              formik={formik}
                              oidcConfiguration={oidcConfiguration}
                            /> */}
                          </div>
                        )
                      case sequence[3]:
                        return (
                          <div
                            style={
                              view_only
                                ? { pointerEvents: 'none', opacity: '0.99' }
                                : {}
                            }
                          >
                            <ClientSoftwarePanel
                              client={client}
                              scripts={scripts}
                              formik={formik}
                            />
                            {/* <ClientAttributes client={client} formik={formik} /> */}
                          </div>
                        )
                      case sequence[4]:
                        return (
                          <div
                            style={
                              view_only
                                ? { pointerEvents: 'none', opacity: '0.99' }
                                : {}
                            }
                          >
                            <ClientCibaParUmaPanel
                              client={client}
                              scripts={scripts}
                              formik={formik}
                            />
                            {/* <ClientScript
                              client={client}
                              formik={formik}
                              scripts={scripts}
                              scopes={scopes}
                            /> */}
                          </div>
                        )
                    }
                  })()}
                </CardBody>
                <CardFooter className="p-4 bt-0">
                  <div className="d-flex">
                    {currentStep !== sequence[0] && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        style={applicationStyle.buttonStyle}
                        color="link"
                        className="mr-3"
                      >
                        <i className="fa fa-angle-left mr-2"></i>
                        {t('actions.previous')}
                      </Button>
                    )}
                    {currentStep !== sequence[sequence.length - 1] && (
                      <Button
                        type="button"
                        color={`primary-${selectedTheme}`}
                        onClick={nextStep}
                        style={applicationStyle.buttonStyle}
                        className="ml-auto px-4"
                      >
                        {t('actions.next')}
                        <i className="fa fa-angle-right ml-2"></i>
                      </Button>
                    )}
                    {currentStep === sequence[sequence.length - 1] &&
                      !view_only &&
                      hasPermission(permissions, CLIENT_WRITE) && (
                        <Button
                          type="button"
                          color={`primary-${selectedTheme}`}
                          className="ml-auto px-4"
                          onClick={toggle}
                          style={applicationStyle.buttonStyle}
                        >
                          {t('actions.apply')}
                        </Button>
                      )}
                  </div>
                </CardFooter>
                <Button
                  type="submit"
                  color={`primary-${selectedTheme}`}
                  className="UserActionSubmitButton"
                  style={{ visibility: 'hidden' }}
                >
                  {t('actions.submit')}
                </Button>
              </Card>
            </Form>
          )}
        </Formik>
      </Card>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </React.Fragment>
  )
}

export default ClientWizardForm
