import React, { useState, useContext, useRef, useEffect, useMemo } from 'react'
import { Card, CardFooter, CardBody, Button, Wizard, WizardStep } from 'Components'
import { Form } from 'reactstrap'
import ClientBasic from './ClientBasicPanel'
import ClientAdvanced from './ClientAdvancedPanel'
import ClientScript from './ClientScriptPanel'
import ClientActiveTokens from './ClientActiveTokens'
import GluuCommitDialogLegacy from 'Routes/Apps/Gluu/GluuCommitDialogLegacy'
import { Formik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import ClientTokensPanel from './ClientTokensPanel'
import ClientLogoutPanel from './ClientLogoutPanel'
import ClientSoftwarePanel from './ClientSoftwarePanel'
import ClientCibaParUmaPanel from './ClientCibaParUmaPanel'
import ClientEncryptionSigningPanel from './ClientEncryptionSigningPanel'
import { toast } from 'react-toastify'
import { setClientSelectedScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const sequence = [
  'Basic',
  'Tokens',
  'Logout',
  'SoftwareInfo',
  'CIBA/PAR/UMA',
  'Encryption/Signing',
  'AdvancedClientProperties',
  'ClientScripts',
  'ClientActiveTokens',
]

const ATTRIBUTE = 'attributes'
let commitMessage = ''
function ClientWizardForm({
  client_data,
  viewOnly,
  scopes,
  scripts,

  customOnSubmit,
  oidcConfiguration,
  umaResources,
  isEdit = false,
  modifiedFields,
  setModifiedFields,
}) {
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const formRef = useRef()
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [modal, setModal] = useState(false)
  const [currentStep, setCurrentStep] = useState(sequence[0])
  const dispatch = useDispatch()
  const { permissions: cedarPermissions } = useSelector((state) => state.cedarPermissions)

  const clientResourceId = ADMIN_UI_RESOURCES.Clients
  const clientScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[clientResourceId] || [],
    [clientResourceId],
  )

  const canWriteClient = useMemo(
    () => hasCedarWritePermission(clientResourceId),
    [hasCedarWritePermission, clientResourceId],
  )

  useEffect(() => {
    authorizeHelper(clientScopes)
  }, [authorizeHelper, clientScopes])

  const initialValues = {
    inum: client_data.inum,
    dn: client_data.dn,
    clientSecret: client_data.clientSecret,
    displayName: client_data.displayName,
    clientName: client_data.clientName,
    description: client_data.description,
    applicationType: client_data.applicationType,
    subjectType: client_data.subjectType,
    registrationAccessToken: client_data.registrationAccessToken,
    clientIdIssuedAt: client_data.clientIdIssuedAt,
    initiateLoginUri: client_data.initiateLoginUri,
    logoUri: client_data.logoUri,
    clientUri: client_data.clientUri,
    tosUri: client_data.tosUri,
    jwksUri: client_data.jwksUri,
    jwks: client_data.jwks,
    expirable: !!client_data.expirationDate,
    expirationDate: client_data.expirationDate,
    softwareStatement: client_data.softwareStatement,
    softwareVersion: client_data.softwareVersion,
    softwareId: client_data.softwareId,
    idTokenSignedResponseAlg: client_data.idTokenSignedResponseAlg,
    idTokenEncryptedResponseAlg: client_data.idTokenEncryptedResponseAlg,
    tokenEndpointAuthMethod: client_data.tokenEndpointAuthMethod,
    accessTokenSigningAlg: client_data.accessTokenSigningAlg,
    idTokenEncryptedResponseEnc: client_data.idTokenEncryptedResponseEnc,
    requestObjectEncryptionAlg: client_data.requestObjectEncryptionAlg,
    requestObjectSigningAlg: client_data.requestObjectSigningAlg,
    requestObjectEncryptionEnc: client_data.requestObjectEncryptionEnc,
    userInfoEncryptedResponseAlg: client_data.userInfoEncryptedResponseAlg,
    userInfoSignedResponseAlg: client_data.userInfoSignedResponseAlg,
    userInfoEncryptedResponseEnc: client_data.userInfoEncryptedResponseEnc,
    idTokenTokenBindingCnf: client_data.idTokenTokenBindingCnf,
    backchannelUserCodeParameter: client_data.backchannelUserCodeParameter,
    refreshTokenLifetime: client_data.refreshTokenLifetime,
    defaultMaxAge: client_data.defaultMaxAge,
    accessTokenLifetime: client_data.accessTokenLifetime,
    backchannelTokenDeliveryMode: client_data.backchannelTokenDeliveryMode,
    backchannelClientNotificationEndpoint: client_data.backchannelClientNotificationEndpoint,
    frontChannelLogoutUri: client_data.frontChannelLogoutUri,
    policyUri: client_data.policyUri,
    logoURI: client_data.logoURI,
    sectorIdentifierUri: client_data.sectorIdentifierUri,
    redirectUris: client_data.redirectUris,
    claimRedirectUris: client_data.claimRedirectUris || [],
    authorizedOrigins: client_data.authorizedOrigins || [],
    requestUris: client_data.requestUris || [],
    postLogoutRedirectUris: client_data.postLogoutRedirectUris,
    responseTypes: client_data.responseTypes,
    grantTypes: client_data.grantTypes,
    contacts: client_data.contacts,
    defaultAcrValues: client_data.defaultAcrValues,
    scopes: client_data.scopes,
    oxAuthClaims: client_data.oxAuthClaims,
    attributes: client_data.attributes,
    frontChannelLogoutSessionRequired: client_data.frontChannelLogoutSessionRequired,
    customObjectClasses: client_data.customObjectClasses || [],
    trustedClient: client_data.trustedClient,
    persistClientAuthorizations: client_data.persistClientAuthorizations,
    includeClaimsInIdToken: client_data.includeClaimsInIdToken,
    rptAsJwt: client_data.rptAsJwt,
    accessTokenAsJwt: client_data.accessTokenAsJwt,
    disabled: client_data.disabled,
    deletable: client_data.deletable,
    tokenBindingSupported: client_data.tokenBindingSupported,
  }

  const [client] = useState(initialValues)

  function changeStep(stepId) {
    setCurrentStep(stepId)
  }
  function toggle() {
    setModal(!modal)
  }

  function validateFinish() {
    if (
      formRef.current.values.grantTypes.includes('authorization_code') ||
      formRef.current.values.grantTypes.includes('implicit') ||
      formRef.current.values.grantTypes.length == 0
    ) {
      if (formRef && formRef.current && formRef.current.values.redirectUris.length > 0) {
        toggle()
      } else {
        toast.info('Please add atleast 1 redirect URL')
      }
    } else {
      toggle()
    }
  }
  function setId(index) {
    return sequence[index]
  }
  function prevStep() {
    setCurrentStep(sequence[sequence.indexOf(currentStep) - 1])
  }
  function nextStep() {
    if (
      formRef.current.values.grantTypes.includes('authorization_code') ||
      formRef.current.values.grantTypes.includes('implicit')
    ) {
      if (formRef && formRef.current && formRef.current.values.redirectUris.length > 0) {
        setCurrentStep(sequence[sequence.indexOf(currentStep) + 1])
      } else {
        toast.info('Please add atleast 1 redirect URL')
      }
    } else {
      setCurrentStep(sequence[sequence.indexOf(currentStep) + 1])
    }
  }
  function isComplete(stepId) {
    return sequence.indexOf(stepId) < sequence.indexOf(currentStep)
  }
  function submitForm(message) {
    commitMessage = message
    toggle()
    document.getElementsByClassName('UserActionSubmitButton')[0].click()
  }

  useEffect(() => {
    return function cleanup() {
      dispatch(setClientSelectedScopes([]))
    }
  }, [])
  useEffect(() => {}, [cedarPermissions])

  const activeClientStep = (formik) => {
    switch (currentStep) {
      case sequence[0]:
        return (
          <div>
            <ClientBasic
              client={cloneDeep(client)}
              scopes={scopes}
              formik={formik}
              viewOnly={viewOnly}
              oidcConfiguration={oidcConfiguration}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case sequence[1]:
        return (
          <div>
            <ClientTokensPanel
              formik={formik}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case sequence[2]:
        return (
          <div>
            <ClientLogoutPanel
              client={cloneDeep(client)}
              scripts={scripts}
              formik={formik}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case sequence[3]:
        return (
          <div>
            <ClientSoftwarePanel
              client={cloneDeep(client)}
              scripts={scripts}
              formik={formik}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case sequence[4]:
        return (
          <div>
            <ClientCibaParUmaPanel
              client={cloneDeep(client)}
              umaResources={umaResources}
              scopes={scopes}
              scripts={scripts}
              setCurrentStep={setCurrentStep}
              sequence={sequence}
              formik={formik}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case sequence[5]:
        return (
          <div>
            <ClientEncryptionSigningPanel
              formik={formik}
              oidcConfiguration={oidcConfiguration}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case sequence[6]:
        return (
          <div>
            <ClientAdvanced
              client={cloneDeep(client)}
              scripts={scripts}
              formik={formik}
              scopes={scopes}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case sequence[7]:
        return (
          <div>
            <ClientScript
              formik={formik}
              scripts={scripts}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )

      case sequence[8]:
        return (
          <div>
            <ClientActiveTokens
              formik={formik}
              scripts={scripts}
              viewOnly={viewOnly}
              client={cloneDeep(client)}
            />
          </div>
        )
    }
  }

  function onKeyDown(keyEvent) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault()
    }
  }

  const downloadClientData = (values) => {
    const jsonData = JSON.stringify(values, null, 2)

    const blob = new Blob([jsonData], { type: 'application/json' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = values.displayName ? `${values.displayName}.json` : 'client-summary.json'

    document.body.appendChild(link)

    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  return (
    <React.Fragment>
      <Card style={applicationStyle.mainCard}>
        <Formik
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={(...args) => {
            const values = {
              ...args[0],
              accessTokenAsJwt: args[0]?.accessTokenAsJwt && JSON.parse(args[0]?.accessTokenAsJwt),
              rptAsJwt: args[0]?.rptAsJwt && JSON.parse(args[0]?.rptAsJwt),
              [ATTRIBUTE]: args[0][ATTRIBUTE] && { ...args[0][ATTRIBUTE] },
            }
            delete values.expirable
            values['action_message'] = commitMessage
            values['modifiedFields'] = modifiedFields
            customOnSubmit(JSON.parse(JSON.stringify(values)))
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onKeyDown={onKeyDown}>
              <Card>
                <div className="d-flex justify-content-end pt-3 pe-3">
                  <Button
                    color={`primary-${selectedTheme}`}
                    style={{
                      ...applicationStyle.buttonStyle,
                      ...applicationStyle.buttonFlexIconStyles,
                      margin: 0,
                    }}
                    type="button"
                    onClick={() => downloadClientData(formik.values)}
                    className="d-flex m-1"
                  >
                    <i className="fa fa-download"></i>
                    {t('fields.download_summary')}
                  </Button>
                </div>
                <CardBody className="d-flex justify-content-center pt-3 wizard-wrapper">
                  <Wizard
                    activeStep={currentStep}
                    onStepChanged={changeStep}
                    initialActiveStep={sequence[0]}
                  >
                    <WizardStep
                      data-testid={sequence[0]}
                      id={setId(0)}
                      icon={<i className="fa fa-shopping-basket fa-fw"></i>}
                      complete={isComplete(sequence[0])}
                    >
                      {t('titles.client_basic')}
                    </WizardStep>
                    <WizardStep
                      data-testid={sequence[1]}
                      id={setId(1)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[1])}
                    >
                      {t('titles.token')}
                    </WizardStep>
                    <WizardStep
                      data-testid={sequence[2]}
                      id={setId(2)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[2])}
                    >
                      {t('titles.log_out')}
                    </WizardStep>
                    <WizardStep
                      data-testid={sequence[3]}
                      id={setId(3)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[3])}
                    >
                      {t('titles.software_info')}
                    </WizardStep>
                    <WizardStep
                      data-testid={sequence[4]}
                      id={setId(4)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[4])}
                    >
                      {t('titles.CIBA_PAR_UMA')}
                    </WizardStep>
                    <WizardStep
                      data-testid={sequence[5]}
                      id={setId(5)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[5])}
                    >
                      {t('titles.encryption_signing')}
                    </WizardStep>
                    <WizardStep
                      data-testid={sequence[6]}
                      id={setId(6)}
                      icon={<i className="fa fa-cube fa-fw"></i>}
                      complete={isComplete(sequence[6])}
                    >
                      {t('titles.client_advanced')}
                    </WizardStep>
                    <WizardStep
                      data-testid={sequence[7]}
                      id={setId(7)}
                      icon={<i className="fa fa-credit-card fa-fw"></i>}
                      complete={isComplete(sequence[7])}
                    >
                      {t('titles.client_scripts')}
                    </WizardStep>

                    {isEdit ? (
                      <WizardStep
                        data-testid={sequence[8]}
                        id={setId(8)}
                        icon={<i className="fa fa-credit-card fa-fw"></i>}
                        complete={isComplete(sequence[8])}
                      >
                        {t('titles.activeTokens')}
                      </WizardStep>
                    ) : (
                      <></>
                    )}
                  </Wizard>
                </CardBody>
                <CardBody className="p-2">{activeClientStep(formik)}</CardBody>
                <CardFooter className="p-4 bt-0">
                  <div className="d-flex">
                    <div style={{ flex: 1 }}>
                      {!viewOnly && currentStep === sequence[0] && (
                        <Button
                          type="button"
                          color={`primary-${selectedTheme}`}
                          onClick={() => navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)}
                          style={{
                            ...applicationStyle.buttonStyle,
                            ...applicationStyle.buttonFlexIconStyles,
                          }}
                          className="me-3"
                        >
                          <i className="fa fa-arrow-circle-left me-2"></i>
                          {t('actions.cancel')}
                        </Button>
                      )}
                      {currentStep !== sequence[0] && (
                        <Button
                          type="button"
                          onClick={prevStep}
                          style={{
                            ...applicationStyle.buttonStyle,
                            ...applicationStyle.buttonFlexIconStyles,
                          }}
                          className="me-3"
                        >
                          <i className="fa fa-angle-left me-2"></i>
                          {t('actions.previous')}
                        </Button>
                      )}
                    </div>
                    <div
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        display: 'flex',
                        gap: '8px',
                      }}
                    >
                      {currentStep !== sequence[sequence.length - 1] && (
                        <Button
                          type="button"
                          color={`primary-${selectedTheme}`}
                          onClick={nextStep}
                          style={{
                            ...applicationStyle.buttonStyle,
                            ...applicationStyle.buttonFlexIconStyles,
                          }}
                          className="px-4"
                        >
                          {t('actions.next')}
                          <i className="fa fa-angle-right ms-2"></i>
                        </Button>
                      )}
                      {!viewOnly && canWriteClient && (
                        <Button
                          type="button"
                          color={`primary-${selectedTheme}`}
                          className="px-4 ms-2"
                          onClick={validateFinish}
                          style={{
                            ...applicationStyle.buttonStyle,
                            ...applicationStyle.buttonFlexIconStyles,
                          }}
                        >
                          {t('actions.finish')}
                        </Button>
                      )}
                    </div>
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
      <GluuCommitDialogLegacy
        feature={adminUiFeatures.oidc_clients_write}
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        operations={
          Object.keys(modifiedFields)?.length
            ? Object.keys(modifiedFields).map((item) => {
                return { path: item, value: modifiedFields[item] }
              })
            : []
        }
      />
    </React.Fragment>
  )
}

ClientWizardForm.propTypes = {
  client_data: PropTypes.any,
  viewOnly: PropTypes.bool,
  scopes: PropTypes.array,
  scripts: PropTypes.array,
  permissions: PropTypes.array,
  customOnSubmit: PropTypes.func,
  oidcConfiguration: PropTypes.object,
  umaResources: PropTypes.array,
  isEdit: PropTypes.bool,
  modifiedFields: PropTypes.any,
  setModifiedFields: PropTypes.func,
}

export default ClientWizardForm
