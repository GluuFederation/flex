import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { Card, CardBody, Wizard, WizardStep } from 'Components'
import { Form } from 'reactstrap'
import ClientBasic from './ClientBasicPanel'
import ClientAdvanced from './ClientAdvancedPanel'
import ClientScript from './ClientScriptPanel'
import ClientActiveTokens from './ClientActiveTokens'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { Formik, type FormikProps } from 'formik'
import { useTranslation } from 'react-i18next'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling'
import { CEDAR_RESOURCE_SCOPES } from '@/cedarling/constants/resourceScopes'
import { ADMIN_UI_RESOURCES } from '@/cedarling/utility'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import ClientTokensPanel from './ClientTokensPanel'
import ClientLogoutPanel from './ClientLogoutPanel'
import ClientSoftwarePanel from './ClientSoftwarePanel'
import ClientCibaParUmaPanel from './ClientCibaParUmaPanel'
import ClientEncryptionSigningPanel from './ClientEncryptionSigningPanel'
import { toast } from 'react-toastify'
import { setClientSelectedScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { cloneDeep, omit } from 'lodash'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { GluuButton } from '@/components'
import { useStyles } from './styles/ClientWizardForm.style'
import type { ClientWizardFormProps, ClientWizardFormValues } from './types'

const CLIENT_WIZARD_STEPS = [
  { id: 'Basic', labelKey: 'titles.client_basic' },
  { id: 'Tokens', labelKey: 'titles.token' },
  { id: 'Logout', labelKey: 'titles.log_out' },
  { id: 'SoftwareInfo', labelKey: 'titles.software_info' },
  { id: 'CIBA/PAR/UMA', labelKey: 'titles.CIBA_PAR_UMA' },
  { id: 'Encryption/Signing', labelKey: 'titles.encryption_signing' },
  { id: 'AdvancedClientProperties', labelKey: 'titles.client_advanced' },
  { id: 'ClientScripts', labelKey: 'titles.client_scripts' },
  { id: 'ClientActiveTokens', labelKey: 'titles.activeTokens' },
]
const CLIENT_WIZARD_SEQUENCE = CLIENT_WIZARD_STEPS.map((step) => step.id)

const ATTRIBUTE = 'attributes'
let commitMessage = ''

function ClientWizardForm({
  client_data,
  viewOnly,
  scripts,
  customOnSubmit,
  oidcConfiguration,
  isEdit = false,
  modifiedFields,
  setModifiedFields,
}: ClientWizardFormProps) {
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const formRef = useRef<FormikProps<ClientWizardFormValues>>(null)
  const formTopRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors, isDark })
  const [modal, setModal] = useState(false)
  const availableSteps = useMemo(
    () =>
      isEdit
        ? CLIENT_WIZARD_SEQUENCE
        : CLIENT_WIZARD_SEQUENCE.filter((stepId) => stepId !== 'ClientActiveTokens'),
    [isEdit],
  )
  const visibleSteps = useMemo(
    () => CLIENT_WIZARD_STEPS.filter((step) => availableSteps.includes(step.id)),
    [availableSteps],
  )
  const [currentStep, setCurrentStep] = useState(CLIENT_WIZARD_SEQUENCE[0])
  const dispatch = useAppDispatch()
  const { permissions: cedarPermissions } = useAppSelector((state) => state.cedarPermissions)

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

  const initialValues: ClientWizardFormValues = {
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
  }

  const [client] = useState<ClientWizardFormValues>(initialValues)

  const scrollWizardToTop = useCallback(() => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  function changeStep(stepId: string) {
    setCurrentStep(stepId)
    scrollWizardToTop()
  }

  function toggle() {
    setModal(!modal)
  }

  function validateFinish() {
    const grantTypes = formRef.current?.values?.grantTypes ?? []
    const redirectUris = formRef.current?.values?.redirectUris ?? []
    if (
      grantTypes.includes('authorization_code') ||
      grantTypes.includes('implicit') ||
      grantTypes.length === 0
    ) {
      if (redirectUris.length > 0) {
        toggle()
      } else {
        toast.info('Please add atleast 1 redirect URL')
      }
    } else {
      toggle()
    }
  }

  function prevStep() {
    setCurrentStep(availableSteps[availableSteps.indexOf(currentStep) - 1])
    scrollWizardToTop()
  }

  function nextStep() {
    const grantTypes = formRef.current?.values?.grantTypes ?? []
    const redirectUris = formRef.current?.values?.redirectUris ?? []
    if (grantTypes.includes('authorization_code') || grantTypes.includes('implicit')) {
      if (redirectUris.length > 0) {
        setCurrentStep(availableSteps[availableSteps.indexOf(currentStep) + 1])
        scrollWizardToTop()
      } else {
        toast.info('Please add atleast 1 redirect URL')
      }
    } else {
      setCurrentStep(availableSteps[availableSteps.indexOf(currentStep) + 1])
      scrollWizardToTop()
    }
  }

  function isComplete(stepId: string) {
    return availableSteps.indexOf(stepId) < availableSteps.indexOf(currentStep)
  }

  function submitForm(message: string) {
    commitMessage = message
    toggle()
    const btn = document.getElementsByClassName('UserActionSubmitButton')[0]
    if (btn instanceof HTMLElement) btn.click()
  }

  useEffect(() => {
    return function cleanup() {
      dispatch(setClientSelectedScopes([]))
    }
  }, [])
  useEffect(() => {}, [cedarPermissions])

  const activeClientStep = (formik: FormikProps<ClientWizardFormValues>) => {
    switch (currentStep) {
      case availableSteps[0]:
        return (
          <div>
            <ClientBasic
              client={cloneDeep(client)}
              formik={formik}
              viewOnly={viewOnly}
              oidcConfiguration={oidcConfiguration}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case 'Tokens':
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
      case 'Logout':
        return (
          <div>
            <ClientLogoutPanel
              formik={formik}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case 'SoftwareInfo':
        return (
          <div>
            <ClientSoftwarePanel
              formik={formik}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case 'CIBA/PAR/UMA':
        return (
          <div>
            <ClientCibaParUmaPanel
              client={cloneDeep(client)}
              scripts={scripts}
              setCurrentStep={setCurrentStep}
              sequence={availableSteps}
              formik={formik}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case 'Encryption/Signing':
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
      case 'AdvancedClientProperties':
        return (
          <div>
            <ClientAdvanced
              client={cloneDeep(client)}
              scripts={scripts}
              formik={formik}
              viewOnly={viewOnly}
              modifiedFields={modifiedFields}
              setModifiedFields={setModifiedFields}
            />
          </div>
        )
      case 'ClientScripts':
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
      case 'ClientActiveTokens':
        return (
          <div>
            <ClientActiveTokens client={cloneDeep(client)} />
          </div>
        )
    }
  }

  function onKeyDown(keyEvent: React.KeyboardEvent<HTMLFormElement>) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault()
    }
  }

  const downloadClientData = (values: ClientWizardFormValues) => {
    const jsonData = JSON.stringify(values, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = values.displayName
      ? `${String(values.displayName)}.json`
      : 'client-summary.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  }

  return (
    <React.Fragment>
      <div ref={formTopRef}>
        <Formik<ClientWizardFormValues>
          innerRef={formRef}
          initialValues={initialValues}
          onSubmit={(values) => {
            const { attributes, accessTokenAsJwt, rptAsJwt, ...rest } = omit(values, 'expirable')
            const submitPayload = {
              ...rest,
              accessTokenAsJwt: accessTokenAsJwt
                ? JSON.parse(String(accessTokenAsJwt))
                : accessTokenAsJwt,
              rptAsJwt: rptAsJwt ? JSON.parse(String(rptAsJwt)) : rptAsJwt,
              [ATTRIBUTE]: attributes ? { ...attributes } : attributes,
              action_message: commitMessage,
              modifiedFields,
            }
            customOnSubmit(JSON.parse(JSON.stringify(submitPayload)))
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onKeyDown={onKeyDown}>
              <Card className={classes.pageCard}>
                <div className={classes.downloadRow}>
                  <GluuButton
                    type="button"
                    onClick={() => downloadClientData(formik.values)}
                    title={t('fields.download_summary')}
                    backgroundColor={themeColors.formFooter.apply.backgroundColor}
                    textColor={themeColors.formFooter.apply.textColor}
                    borderColor={themeColors.formFooter.apply.borderColor}
                    useOpacityOnHover
                    className={classes.downloadButton}
                  >
                    <i className="fa fa-download" aria-hidden />
                    {t('fields.download_summary')}
                  </GluuButton>
                </div>
                <CardBody className={classes.wizardSection}>
                  <div className={classes.wizardNav}>
                    <Wizard
                      activeStep={currentStep}
                      onStepChanged={changeStep}
                      initialActiveStep={availableSteps[0]}
                    >
                      {visibleSteps.map((step, index) => (
                        <WizardStep
                          key={step.id}
                          data-testid={step.id}
                          id={step.id}
                          icon={<span className={classes.stepNumber}>{index + 1}</span>}
                          successIcon={<span className={classes.stepNumber}>{index + 1}</span>}
                          complete={isComplete(step.id)}
                          onClick={() => changeStep(step.id)}
                        >
                          {t(step.labelKey)}
                        </WizardStep>
                      ))}
                    </Wizard>
                  </div>
                </CardBody>
                <CardBody className={classes.contentSection}>{activeClientStep(formik)}</CardBody>
                <div className={classes.footer}>
                  <GluuThemeFormFooter
                    showBack
                    backButtonLabel={
                      currentStep === availableSteps[0]
                        ? t('actions.cancel')
                        : t('actions.previous')
                    }
                    onBack={
                      currentStep === availableSteps[0]
                        ? () => navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)
                        : prevStep
                    }
                    showApply={
                      currentStep !== availableSteps[availableSteps.length - 1] ||
                      (!viewOnly && canWriteClient)
                    }
                    applyButtonType="button"
                    applyButtonLabel={
                      currentStep === availableSteps[availableSteps.length - 1]
                        ? t('actions.finish')
                        : t('actions.next')
                    }
                    onApply={
                      currentStep === availableSteps[availableSteps.length - 1]
                        ? validateFinish
                        : nextStep
                    }
                    hideDivider
                  />
                </div>
                <button
                  type="submit"
                  className="UserActionSubmitButton"
                  style={{ display: 'none' }}
                >
                  {t('actions.submit')}
                </button>
              </Card>
            </Form>
          )}
        </Formik>
      </div>
      <GluuCommitDialog
        feature={adminUiFeatures.oidc_clients_write}
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formRef.current ?? null}
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

export default ClientWizardForm
