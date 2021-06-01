import React, { useState } from 'react'
import {
  Container,
  Wizard,
  Card,
  CardFooter,
  CardBody,
  Form,
  Button,
} from '../../../../app/components'
import ClientBasic from './ClientBasicPanel'
import ClientAdvanced from './ClientAdvancedPanel'
import ClientEncryption from './ClientEncryptionPanel'
import ClientAttributes from './ClientAttributesPanel'
import ClientScript from './ClientScriptPanel'
import GluuCommitDialog from '../../../../app/routes/Apps/Gluu/GluuCommitDialog'
import { Formik } from 'formik'
const sequence = [
  'Basic',
  'Advanced',
  'EncryptionSigning',
  'ClientAttributes',
  'CustomScripts',
]
let commitMessage = ''
function ClientWizardForm({
  client,
  scopes,
  scripts,
  permissions,
  customOnSubmit,
}) {
  const [modal, setModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(sequence[0])
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
  function buildDescription(description) {
    return {
      name: 'description',
      multiValued: false,
      values: [description],
    }
  }
  function removeDecription(customAttributes) {
    return customAttributes.filter((item) => item.name !== 'description')
  }
  function submitForm(message) {
    commitMessage = message
    toggle()
    document.querySelector('button[type="submit"]').click()
  }

  const initialValues = {
    inum: client.inum,
    dn: client.dn,
    clientSecret: client.secret,
    displayName: client.displayName,
    clientName: client.clientName,
    description: client.description,
    applicationType: client.applicationType,
    subjectType: client.subjectType,
    registrationAccessToken: client.registrationAccessToken,
    clientIdIssuedAt: client.clientIdIssuedAt,
    idTokenSignedResponseAlg: client.idTokenSignedResponseAlg,
    tokenEndpointAuthMethod: client.tokenEndpointAuthMethod,
    accessTokenSigningAlg: client.accessTokenSigningAlg,
    authenticationMethod: client.authenticationMethod,
    backchannelUserCodeParameter: client.backchannelUserCodeParameter,
    policyUri: client.policyUri,
    logoURI: client.logoURI,

    redirectUris: client.redirectUris,
    claimRedirectUris: client.claimRedirectUris,
    responseTypes: client.responseTypes,
    grantTypes: client.grantTypes,
    contacts: client.contacts,
    defaultAcrValues: client.defaultAcrValues,
    postLogoutRedirectUris: client.postLogoutRedirectUris,
    scopes: client.scopes,
    oxAuthClaims: client.oxAuthClaims,
    customAttributes: client.customAttributes,

    tlsClientAuthSubjectDn: client.tlsClientAuthSubjectDn,
    spontaneousScopes: client.spontaneousScopes,
    introspectionScripts: client.introspectionScripts,
    spontaneousScopeScriptDns: client.spontaneousScopeScriptDns,
    consentGatheringScripts: client.consentGatheringScripts,
    rptClaimsScripts: client.rptClaimsScripts,
    backchannelLogoutUri: client.backchannelLogoutUri,
    postAuthnScripts: client.postAuthnScripts,
    additionalAudience: client.additionalAudience,

    attributes: client.attributes,
    customObjectClasses: client.customObjectClasses,
    deletable: client.deletable,
    frontChannelLogoutSessionRequired: client.frontChannelLogoutSessionRequired,
    requireAuthTime: client.requireAuthTime,
    trustedClient: client.trustedClient,
    persistClientAuthorizations: client.persistClientAuthorizations,
    includeClaimsInIdToken: client.includeClaimsInIdToken,
    rptAsJwt: client.rptAsJwt,
    accessTokenAsJwt: client.accessTokenAsJwt,
    disabled: client.disabled,
    tokenBindingSupported: client.tokenBindingSupported,
    runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims:
      client.runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims,
    keepClientAuthorizationAfterExpiration:
      client.keepClientAuthorizationAfterExpiration,
    allowSpontaneousScopes: client.allowSpontaneousScopes,
    backchannelLogoutSessionRequired: client.backchannelLogoutSessionRequired,
  }

  return (
    <Container>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => {
          values['action_message'] = commitMessage
          values[
            'attributes'
          ].runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims =
            values.runIntrospectionScriptBeforeAccessTokenAsJwtCreationAndIncludeClaims
          values['attributes'].keepClientAuthorizationAfterExpiration =
            values.keepClientAuthorizationAfterExpiration
          values['attributes'].allowSpontaneousScopes =
            values.allowSpontaneousScopes
          values['attributes'].backchannelLogoutSessionRequired =
            values.backchannelLogoutSessionRequired
          values['attributes'].tlsClientAuthSubjectDn =
            values.tlsClientAuthSubjectDn
          values['attributes'].spontaneousScopes = values.spontaneousScopes
          values['attributes'].introspectionScripts =
            values.introspectionScripts
          values['attributes'].spontaneousScopeScriptDns =
            values.spontaneousScopeScriptDns
          values['attributes'].consentGatheringScripts =
            values.consentGatheringScripts
          values['attributes'].rptClaimsScripts = values.rptClaimsScripts
          values['attributes'].backchannelLogoutUri =
            values.backchannelLogoutUri
          values['attributes'].postAuthnScripts = values.postAuthnScripts
          values['attributes'].additionalAudience = values.additionalAudience
          if (!values['customAttributes']) {
            values['customAttributes'] = []
          }
          if (values['description']) {
            values['customAttributes'] = removeDecription(
              values['customAttributes'],
            )
          }
          values['customAttributes'].push(
            buildDescription(values['description']),
          )
          values['displayName'] = values['clientName']
          customOnSubmit(JSON.parse(JSON.stringify(values)))
        }}
      >
        {(formik) => (
          <Form onSubmit={formik.handleSubmit}>
            <Card>
              <CardBody className="d-flex justify-content-center pt-5">
                <Wizard activeStep={currentStep} onStepChanged={changeStep}>
                  <Wizard.Step
                    id={setId(0)}
                    icon={<i className="fa fa-shopping-basket fa-fw"></i>}
                    complete={isComplete(sequence[0])}
                  >
                    Basic
                  </Wizard.Step>
                  <Wizard.Step
                    id={setId(1)}
                    icon={<i className="fa fa-cube fa-fw"></i>}
                    complete={isComplete(sequence[1])}
                  >
                    Advanced
                  </Wizard.Step>
                  <Wizard.Step
                    id={setId(2)}
                    icon={<i className="fa fa-credit-card fa-fw"></i>}
                    complete={isComplete(sequence[2])}
                  >
                    Encryption/Signing
                  </Wizard.Step>
                  <Wizard.Step
                    id={setId(3)}
                    icon={<i className="fa fa-credit-card fa-fw"></i>}
                    complete={isComplete(sequence[3])}
                  >
                    Attributes
                  </Wizard.Step>
                  <Wizard.Step
                    id={setId(4)}
                    icon={<i className="fa fa-credit-card fa-fw"></i>}
                    complete={isComplete(sequence[4])}
                  >
                    Custom Scripts
                  </Wizard.Step>
                </Wizard>
              </CardBody>
              <CardBody className="p-5">
                {(() => {
                  switch (currentStep) {
                    case sequence[0]:
                      return (
                        <ClientBasic
                          client={client}
                          scopes={scopes}
                          formik={formik}
                        />
                      )
                    case sequence[1]:
                      return (
                        <ClientAdvanced
                          client={client}
                          scripts={scripts}
                          formik={formik}
                        />
                      )
                    case sequence[2]:
                      return (
                        <ClientEncryption client={client} formik={formik} />
                      )
                    case sequence[3]:
                      return (
                        <ClientAttributes client={client} formik={formik} />
                      )
                    case sequence[4]:
                      return (
                        <ClientScript
                          client={client}
                          formik={formik}
                          scripts={scripts}
                          scopes={scopes}
                        />
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
                      color="link"
                      className="mr-3"
                    >
                      <i className="fa fa-angle-left mr-2"></i>
                      Previous
                    </Button>
                  )}
                  {currentStep !== sequence[sequence.length - 1] && (
                    <Button
                      type="button"
                      color="primary"
                      onClick={nextStep}
                      className="ml-auto px-4"
                    >
                      Next
                      <i className="fa fa-angle-right ml-2"></i>
                    </Button>
                  )}
                  {currentStep === sequence[sequence.length - 1] && (
                    <Button
                      type="button"
                      color="primary"
                      className="ml-auto px-4"
                      onClick={toggle}
                    >
                      Apply
                    </Button>
                  )}
                </div>
              </CardFooter>
              <Button
                type="submit"
                color="primary"
                style={{ visibility: 'hidden' }}
              >
                Submit
              </Button>
            </Card>
          </Form>
        )}
      </Formik>
      <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} />
    </Container>
  )
}

export default ClientWizardForm
