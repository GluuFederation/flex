import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { Card, CardBody, Wizard, WizardStep } from 'Components'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { Form } from 'reactstrap'
import ClientBasic from './ClientBasicPanel'
import ClientAdvanced from './ClientAdvancedPanel'
import ClientScript from './ClientScriptPanel'
import ClientActiveTokens from './ClientActiveTokens'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
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
import ClientShowSpontaneousScopes from './ClientShowSpontaneousScopes'
import { toast } from 'react-toastify'
import { setClientSelectedScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { cloneDeep, omit } from 'lodash'
import { useAppDispatch } from '@/redux/hooks'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { GluuButton } from '@/components'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import {
  CLIENT_WIZARD_STEPS,
  CLIENT_WIZARD_SEQUENCE,
  CLIENT_ATTRIBUTES_KEY,
  WIZARD_STEP_IDS,
} from './constants'
import { useStyles } from './components/styles/ClientWizardForm.style'
import type { ClientWizardFormProps, ClientWizardFormValues } from './types'

const ClientWizardForm = ({
  client_data,
  viewOnly,
  scripts,
  customOnSubmit,
  oidcConfiguration,
  isEdit = false,
  modifiedFields,
  setModifiedFields,
}: ClientWizardFormProps) => {
  const { hasCedarWritePermission, authorizeHelper } = useCedarling()
  const formRef = useRef<FormikProps<ClientWizardFormValues>>(null)
  const formTopRef = useRef<HTMLDivElement>(null)
  const commitMessageRef = useRef('')
  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors, isDark })
  const [modal, setModal] = useState(false)
  const [scopesModal, setScopesModal] = useState(false)
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

  const initialValues: ClientWizardFormValues = useMemo(
    () => ({
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
      backchannelUserCodeParameter: client_data.backchannelUserCodeParameter ?? false,
      refreshTokenLifetime: client_data.refreshTokenLifetime,
      defaultMaxAge: client_data.defaultMaxAge,
      accessTokenLifetime: client_data.accessTokenLifetime,
      backchannelTokenDeliveryMode: client_data.backchannelTokenDeliveryMode,
      backchannelClientNotificationEndpoint: client_data.backchannelClientNotificationEndpoint,
      frontChannelLogoutUri: client_data.frontChannelLogoutUri,
      policyUri: client_data.policyUri,
      sectorIdentifierUri: client_data.sectorIdentifierUri,
      redirectUris: client_data.redirectUris ?? [],
      claimRedirectUris: client_data.claimRedirectUris ?? [],
      authorizedOrigins: client_data.authorizedOrigins ?? [],
      requestUris: client_data.requestUris ?? [],
      postLogoutRedirectUris: client_data.postLogoutRedirectUris ?? [],
      responseTypes: client_data.responseTypes ?? [],
      grantTypes: client_data.grantTypes ?? [],
      contacts: client_data.contacts,
      defaultAcrValues: client_data.defaultAcrValues,
      scopes: client_data.scopes,
      attributes: client_data.attributes,
      frontChannelLogoutSessionRequired: client_data.frontChannelLogoutSessionRequired ?? false,
      customObjectClasses: client_data.customObjectClasses ?? [],
      trustedClient: client_data.trustedClient ?? false,
      persistClientAuthorizations: client_data.persistClientAuthorizations ?? false,
      includeClaimsInIdToken: client_data.includeClaimsInIdToken ?? false,
      rptAsJwt: client_data.rptAsJwt ?? false,
      accessTokenAsJwt: client_data.accessTokenAsJwt ?? false,
      disabled: client_data.disabled ?? false,
      deletable: client_data.deletable,
    }),
    [client_data],
  )

  const client = initialValues

  const scrollWizardToTop = useCallback(() => {
    formTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const changeStep = (stepId: string) => {
    setCurrentStep(stepId)
    scrollWizardToTop()
  }

  const toggle = () => {
    setModal(!modal)
  }

  const validateFinish = () => {
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

  const prevStep = () => {
    setCurrentStep(availableSteps[availableSteps.indexOf(currentStep) - 1])
    scrollWizardToTop()
  }

  const isComplete = (stepId: string) => {
    return availableSteps.indexOf(stepId) < availableSteps.indexOf(currentStep)
  }

  const submitForm = (message: string) => {
    commitMessageRef.current = message
    toggle()
    const btn = document.getElementsByClassName('UserActionSubmitButton')[0]
    if (btn instanceof HTMLElement) btn.click()
  }

  useEffect(() => {
    return function cleanup() {
      dispatch(setClientSelectedScopes([]))
    }
  }, [])

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
          enableReinitialize
          onSubmit={(values) => {
            const { attributes, accessTokenAsJwt, rptAsJwt, ...rest } = omit(values, 'expirable')
            const submitPayload = {
              ...rest,
              accessTokenAsJwt: accessTokenAsJwt
                ? JSON.parse(String(accessTokenAsJwt))
                : accessTokenAsJwt,
              rptAsJwt: rptAsJwt ? JSON.parse(String(rptAsJwt)) : rptAsJwt,
              [CLIENT_ATTRIBUTES_KEY]: attributes ? { ...attributes } : attributes,
              action_message: commitMessageRef.current,
              modifiedFields,
            }
            customOnSubmit(JSON.parse(JSON.stringify(submitPayload)))
          }}
        >
          {(formik) => (
            <Form onSubmit={formik.handleSubmit} onKeyDown={onKeyDown}>
              <ClientShowSpontaneousScopes
                handler={() => setScopesModal((v) => !v)}
                isOpen={scopesModal}
                clientInum={client_data.inum}
              />
              <Card className={classes.pageCard}>
                <div className={classes.downloadRow}>
                  {currentStep === WIZARD_STEP_IDS.ADVANCED_CLIENT_PROPERTIES &&
                    client_data.inum && (
                      <GluuButton
                        type="button"
                        onClick={() => setScopesModal(true)}
                        title={t('fields.view_spontaneous_scopes')}
                        backgroundColor={themeColors.formFooter.apply.backgroundColor}
                        textColor={themeColors.formFooter.apply.textColor}
                        borderColor={themeColors.formFooter.apply.borderColor}
                        useOpacityOnHover
                        className={classes.downloadButton}
                      >
                        <i className="fa fa-eye" aria-hidden />
                        {t('fields.view_spontaneous_scopes')}
                      </GluuButton>
                    )}
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
                        <GluuTooltip
                          key={step.id}
                          doc_entry={step.id}
                          content={t(step.tooltipKey)}
                          place="bottom"
                        >
                          <WizardStep
                            data-testid={step.id}
                            id={step.id}
                            icon={<span className={classes.stepNumber}>{index + 1}</span>}
                            successIcon={<span className={classes.stepNumber}>{index + 1}</span>}
                            complete={isComplete(step.id)}
                            onClick={() => changeStep(step.id)}
                          >
                            <GluuText>{t(step.labelKey)}</GluuText>
                          </WizardStep>
                        </GluuTooltip>
                      ))}
                    </Wizard>
                  </div>
                </CardBody>
                <CardBody className={classes.contentSection}>{activeClientStep(formik)}</CardBody>
                <div className={classes.footer}>
                  <GluuThemeFormFooter
                    showBack
                    backButtonLabel={t('actions.back')}
                    onBack={
                      currentStep === availableSteps[0]
                        ? () => navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)
                        : prevStep
                    }
                    showCancel
                    cancelButtonLabel={t('actions.cancel')}
                    onCancel={() => navigateToRoute(ROUTES.AUTH_SERVER_CLIENTS_LIST)}
                    showApply={
                      currentStep === availableSteps[availableSteps.length - 1] &&
                      !viewOnly &&
                      canWriteClient
                    }
                    applyButtonType="button"
                    applyButtonLabel={t('actions.finish')}
                    onApply={validateFinish}
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
