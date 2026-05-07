import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { Card, CardBody, Wizard, WizardStep } from 'Components'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import { Form } from 'Components'
import ClientBasic from './ClientBasicPanel'
import ClientAdvanced from './ClientAdvancedPanel'
import ClientScript from './ClientScriptPanel'
import ClientActiveTokens from './ClientActiveTokens'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { Formik, type FormikProps } from 'formik'
import { useTranslation } from 'react-i18next'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useCedarling } from '@/cedarling/hooks/useCedarling'
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
import { setClientSelectedScopes } from 'Plugins/auth-server/redux/features/scopeSlice'
import { cloneDeep, omit } from 'lodash'
import { useAppDispatch } from '@/redux/hooks'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { GluuButton } from '@/components'
import { GluuFilterPopover } from '@/components/GluuFilterPopover'
import { DownloadIcon, FilterListIcon, Visibility as VisibilityIcon } from '@/components/icons'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import {
  CLIENT_WIZARD_STEPS,
  CLIENT_WIZARD_SEQUENCE,
  CLIENT_ATTRIBUTES_KEY,
  WIZARD_STEP_IDS,
  TOKEN_FILTER_EXPIRATION_DATE,
  TOKEN_FILTER_CREATION_DATE,
} from '../constants'
import { getClientValidationSchema } from '../helper/validations'
import { buildClientInitialValues, getNextStep, getPrevStep } from '../helper/utils'
import { useStyles } from './styles/ClientWizardForm.style'
import type {
  ClientWizardFormProps,
  ClientWizardFormValues,
  TokenSearchPattern,
  TokenSearchFilterField,
} from '../types'
import type { FilterField } from '@/components/GluuFilterPopover'
const INITIAL_TOKEN_PATTERN: TokenSearchPattern = { dateAfter: null, dateBefore: null }

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
  const footerRef = useRef<HTMLDivElement>(null)
  const commitMessageRef = useRef('')
  const exportTokensFnRef = useRef<(() => void) | null>(null)

  const handleExportReady = useCallback((fn: () => void) => {
    exportTokensFnRef.current = fn
  }, [])

  const [tokenShowFilter, setTokenShowFilter] = useState(false)
  const [tokenSearchFilter, setTokenSearchFilter] = useState<TokenSearchFilterField>(
    TOKEN_FILTER_EXPIRATION_DATE,
  )
  const [tokenPattern, setTokenPattern] = useState<TokenSearchPattern>(INITIAL_TOKEN_PATTERN)
  const [tokenActivePattern, setTokenActivePattern] =
    useState<TokenSearchPattern>(INITIAL_TOKEN_PATTERN)
  const [tokenHasData, setTokenHasData] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleTokenHasDataChange = useCallback((hasData: boolean) => {
    setTokenHasData(hasData)
  }, [])

  const handleTokenFilterApply = useCallback(() => {
    setTokenActivePattern(tokenPattern)
    setTokenShowFilter(false)
  }, [tokenPattern])

  const handleTokenFilterCancel = useCallback(() => {
    setTokenPattern(INITIAL_TOKEN_PATTERN)
    setTokenActivePattern(INITIAL_TOKEN_PATTERN)
    setTokenShowFilter(false)
  }, [])

  const handleExportCSVClick = useCallback(() => {
    if (!exportTokensFnRef.current || !tokenHasData) return
    setIsExporting(true)
    setTimeout(() => {
      exportTokensFnRef.current?.()
      setIsExporting(false)
    }, 0)
  }, [tokenHasData])

  const { t } = useTranslation()
  const { navigateToRoute } = useAppNavigation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const isDark = selectedTheme === THEME_DARK
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ themeColors, isDark })

  const tokenFilterFields = useMemo<FilterField[]>(
    () => [
      {
        key: 'searchFilter',
        label: t('fields.search_filter'),
        value: tokenSearchFilter,
        type: 'select',
        fullWidth: true,
        options: [
          { value: TOKEN_FILTER_EXPIRATION_DATE, label: t('titles.expiration_date') },
          { value: TOKEN_FILTER_CREATION_DATE, label: t('titles.creation_date') },
        ],
        onChange: (val) => setTokenSearchFilter(val as TokenSearchFilterField),
      },
      {
        key: 'dateAfter',
        label: t('dashboard.start_date'),
        value: '',
        type: 'date',
        dateValue: tokenPattern.dateAfter,
        onDateChange: (val) => setTokenPattern((prev) => ({ ...prev, dateAfter: val })),
        onChange: () => {},
      },
      {
        key: 'dateBefore',
        label: t('dashboard.end_date'),
        value: '',
        type: 'date',
        dateValue: tokenPattern.dateBefore,
        onDateChange: (val) => setTokenPattern((prev) => ({ ...prev, dateBefore: val })),
        minDate: tokenPattern.dateAfter ?? undefined,
        onChange: () => {},
      },
    ],
    [t, tokenSearchFilter, tokenPattern.dateAfter, tokenPattern.dateBefore],
  )
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

  const initialValues = useMemo(() => buildClientInitialValues(client_data), [client_data])
  const clientSnapshot = useMemo(() => cloneDeep(initialValues), [initialValues])

  const validationSchema = useMemo(() => getClientValidationSchema(t), [t])

  const changeStep = useCallback((stepId: string) => {
    setCurrentStep(stepId)
  }, [])

  const toggle = useCallback(() => {
    setModal((v) => !v)
  }, [])

  const validateFinish = useCallback(async () => {
    const formikRef = formRef.current
    if (!formikRef) return
    const errors = await formikRef.validateForm()
    if (Object.keys(errors).length > 0) {
      const touched = Object.keys(errors).reduce<Record<string, boolean | Record<string, boolean>>>(
        (acc, key) => {
          const value = errors[key as keyof typeof errors]
          if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
            acc[key] = Object.keys(value).reduce<Record<string, boolean>>((nested, nestedKey) => {
              nested[nestedKey] = true
              return nested
            }, {})
          } else {
            acc[key] = true
          }
          return acc
        },
        {},
      )
      void formikRef.setTouched(touched)
      return
    }
    toggle()
  }, [toggle])

  const scrollFromFooter = useRef(false)

  useEffect(() => {
    if (!scrollFromFooter.current) return
    scrollFromFooter.current = false
    footerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [currentStep])

  const prevStep = useCallback(() => {
    scrollFromFooter.current = true
    setCurrentStep((s) => getPrevStep(availableSteps, s))
  }, [availableSteps])

  const nextStep = useCallback(() => {
    scrollFromFooter.current = true
    setCurrentStep((s) => getNextStep(availableSteps, s))
  }, [availableSteps])

  const isComplete = useCallback(
    (stepId: string) => availableSteps.indexOf(stepId) < availableSteps.indexOf(currentStep),
    [availableSteps, currentStep],
  )

  const submitForm = useCallback(
    (message: string) => {
      commitMessageRef.current = message
      toggle()
      void formRef.current?.submitForm()
    },
    [toggle],
  )

  useEffect(() => {
    return () => {
      dispatch(setClientSelectedScopes([]))
    }
  }, [dispatch])

  const renderActiveClientStep = useCallback(
    (formik: FormikProps<ClientWizardFormValues>) => {
      switch (currentStep) {
        case availableSteps[0]:
          return (
            <div>
              <ClientBasic
                client={clientSnapshot}
                formik={formik}
                viewOnly={viewOnly}
                isEdit={isEdit}
                oidcConfiguration={oidcConfiguration}
                modifiedFields={modifiedFields}
                setModifiedFields={setModifiedFields}
              />
            </div>
          )
        case WIZARD_STEP_IDS.TOKENS:
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
        case WIZARD_STEP_IDS.LOGOUT:
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
        case WIZARD_STEP_IDS.SOFTWARE_INFO:
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
        case WIZARD_STEP_IDS.CIBA_PAR_UMA:
          return (
            <div>
              <ClientCibaParUmaPanel
                client={clientSnapshot}
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
        case WIZARD_STEP_IDS.ENCRYPTION_SIGNING:
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
        case WIZARD_STEP_IDS.ADVANCED_CLIENT_PROPERTIES:
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
        case WIZARD_STEP_IDS.CLIENT_SCRIPTS:
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
        case WIZARD_STEP_IDS.CLIENT_ACTIVE_TOKENS:
          return (
            <div>
              <ClientActiveTokens
                client={clientSnapshot}
                onExportReady={handleExportReady}
                onHasDataChange={handleTokenHasDataChange}
                activePattern={tokenActivePattern}
                filterField={tokenSearchFilter}
              />
            </div>
          )
        default:
          return null
      }
    },
    [
      currentStep,
      availableSteps,
      clientSnapshot,
      viewOnly,
      oidcConfiguration,
      modifiedFields,
      setModifiedFields,
      scripts,
      handleExportReady,
      handleTokenHasDataChange,
      tokenActivePattern,
      tokenSearchFilter,
    ],
  )

  const onKeyDown = (keyEvent: React.KeyboardEvent<HTMLFormElement>) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
      keyEvent.preventDefault()
    }
  }

  const downloadClientData = useCallback((values: ClientWizardFormValues) => {
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
  }, [])

  return (
    <React.Fragment>
      <div>
        <Formik<ClientWizardFormValues>
          innerRef={formRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur
          validateOnChange={false}
          validateOnMount={isEdit}
          enableReinitialize
          onSubmit={(values) => {
            const { attributes, accessTokenAsJwt, rptAsJwt, redirectUris, ...rest } = omit(
              values,
              'expirable',
            )
            const submitPayload = {
              ...rest,
              redirectUris: (redirectUris ?? []).filter(Boolean),
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
                        <VisibilityIcon className={classes.downloadButtonIcon} />
                        {t('fields.view_spontaneous_scopes')}
                      </GluuButton>
                    )}
                  {currentStep === WIZARD_STEP_IDS.CLIENT_ACTIVE_TOKENS && (
                    <>
                      <div className={classes.filterButtonWrapper}>
                        <GluuButton
                          type="button"
                          onClick={() => setTokenShowFilter((prev) => !prev)}
                          onMouseDown={(e) => e.stopPropagation()}
                          title={t('titles.filters')}
                          backgroundColor={themeColors.formFooter.apply.backgroundColor}
                          textColor={themeColors.formFooter.apply.textColor}
                          borderColor={themeColors.formFooter.apply.borderColor}
                          useOpacityOnHover
                          className={classes.downloadButton}
                        >
                          <FilterListIcon className={classes.downloadButtonIcon} />
                          {t('titles.filters')}
                        </GluuButton>
                        <GluuFilterPopover
                          open={tokenShowFilter}
                          fields={tokenFilterFields}
                          onApply={handleTokenFilterApply}
                          onCancel={handleTokenFilterCancel}
                          applyDisabled={!tokenPattern.dateAfter || !tokenPattern.dateBefore}
                        />
                      </div>
                      <GluuButton
                        type="button"
                        onClick={handleExportCSVClick}
                        title={t('titles.export_csv')}
                        backgroundColor={themeColors.formFooter.apply.backgroundColor}
                        textColor={themeColors.formFooter.apply.textColor}
                        borderColor={themeColors.formFooter.apply.borderColor}
                        useOpacityOnHover
                        disabled={!tokenHasData || isExporting}
                        className={classes.downloadButton}
                      >
                        <DownloadIcon className={classes.downloadButtonIcon} />
                        {t('titles.export_csv')}
                      </GluuButton>
                    </>
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
                    <DownloadIcon className={classes.downloadButtonIcon} />
                    {t('fields.download_summary')}
                  </GluuButton>
                </div>
                <CardBody
                  className={[
                    classes.wizardSection,
                    currentStep === WIZARD_STEP_IDS.LOGOUT ? classes.wizardSectionTight : '',
                    currentStep === WIZARD_STEP_IDS.CLIENT_ACTIVE_TOKENS
                      ? classes.wizardSectionCompact
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
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
                          place={index === 0 ? 'bottom-start' : 'bottom'}
                          positionStrategy="fixed"
                        >
                          <WizardStep
                            data-testid={step.id}
                            id={step.id}
                            icon={
                              <GluuText
                                variant="span"
                                className={classes.stepNumber}
                                disableThemeColor
                              >
                                {index + 1}
                              </GluuText>
                            }
                            successIcon={
                              <GluuText
                                variant="span"
                                className={classes.stepNumber}
                                disableThemeColor
                              >
                                {index + 1}
                              </GluuText>
                            }
                            active={currentStep === step.id}
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
                <CardBody
                  className={[
                    classes.contentSection,
                    currentStep === WIZARD_STEP_IDS.LOGOUT ? classes.contentSectionTight : '',
                    currentStep === WIZARD_STEP_IDS.CLIENT_ACTIVE_TOKENS
                      ? classes.contentSectionCompact
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {renderActiveClientStep(formik)}
                </CardBody>
                <div ref={footerRef} className={classes.footer}>
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
                    onCancel={() => formik.resetForm()}
                    showApply={!viewOnly && canWriteClient}
                    applyButtonType="button"
                    applyButtonLabel={t('actions.apply')}
                    onApply={validateFinish}
                    disableApply={!formik.isValid || !formik.dirty}
                    stepNavigation={{
                      currentIndex: availableSteps.indexOf(currentStep),
                      total: availableSteps.length,
                      onPrev: prevStep,
                      onNextStep: nextStep,
                    }}
                  />
                </div>
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
