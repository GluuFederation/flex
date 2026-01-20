import React, { useMemo, useCallback, useState, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import {
  Card,
  CardBody,
  FormGroup,
  Col,
  Label,
  Badge,
  InputGroup,
  CustomInput,
  Form,
  Alert,
  Button,
  Input,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import { SETTINGS } from 'Utils/ApiResources'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'
import {
  CedarlingLogType,
  useCedarling,
  ADMIN_UI_RESOURCES,
  CEDAR_RESOURCE_SCOPES,
} from '@/cedarling'
import { getPagingSize, savePagingSize as savePagingSizeToStorage } from 'Utils/pagingUtils'
import packageJson from '../../../../package.json'
import { getSettingsValidationSchema } from 'Plugins/admin/helper/validations/settingsValidation'
import { buildSettingsInitialValues, type SettingsFormValues } from 'Plugins/admin/helper/settings'
import {
  useGetAdminuiConf,
  useEditAdminuiConf,
  useGetConfigScriptsByType,
  getGetAdminuiConfQueryKey,
  type AppConfigResponse,
} from 'JansConfigApi'
import { useQueryClient } from '@tanstack/react-query'
import { updateToast } from '@/redux/features/toastSlice'
import { getOAuth2ConfigResponse } from '@/redux/features/authSlice'
import { logAudit } from '@/utils/AuditLogger'
import { UPDATE } from '@/audit/UserActionType'
import { ADMIN_UI_SETTINGS } from 'Plugins/admin/redux/audit/Resources'
import { getErrorMessage } from 'Plugins/schema/utils/errorHandler'
import type { RootState } from '@/redux/sagas/types/audit'

const PAGING_SIZE_OPTIONS = [1, 5, 10, 20] as const
const DEFAULT_PAGING_SIZE = PAGING_SIZE_OPTIONS[2]
const SCRIPTS_FETCH_LIMIT = 200

const FORM_GROUP_ROW_STYLE = { justifyContent: 'space-between' }
const LABEL_CONTAINER_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  paddingRight: '15px',
}

const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const queryClient = useQueryClient()

  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()

  const authState = useSelector((state: RootState) => ({
    userinfo: state.authReducer?.userinfo,
    clientId: state.authReducer?.config?.clientId,
  }))

  const {
    data: config,
    isLoading: loadingConfig,
    isError: isConfigError,
    error: configError,
    refetch: refetchConfig,
  } = useGetAdminuiConf()

  const editConfigMutation = useEditAdminuiConf()

  const {
    data: scriptsData,
    isLoading: loadingScripts,
    isError: isScriptsError,
    error: scriptsError,
    refetch: refetchScripts,
  } = useGetConfigScriptsByType('person_authentication', { limit: SCRIPTS_FETCH_LIMIT })

  const settingsResourceId = useMemo(() => ADMIN_UI_RESOURCES.Settings, [])
  const settingsScopes = useMemo(
    () => CEDAR_RESOURCE_SCOPES[settingsResourceId] || [],
    [settingsResourceId],
  )
  const canReadSettings = useMemo(
    () => hasCedarReadPermission(settingsResourceId),
    [hasCedarReadPermission, settingsResourceId],
  )
  const canWriteSettings = useMemo(
    () => hasCedarWritePermission(settingsResourceId),
    [hasCedarWritePermission, settingsResourceId],
  )

  const pageTitle = t('titles.application_settings')
  SetTitle(pageTitle)

  useEffect(() => {
    if (settingsScopes.length > 0) {
      authorizeHelper(settingsScopes)
    }
  }, [authorizeHelper, settingsScopes])

  const validationSchema = useMemo(() => getSettingsValidationSchema(t), [t])
  const savedPagingSize = useMemo(() => {
    const stored = getPagingSize(DEFAULT_PAGING_SIZE)
    return PAGING_SIZE_OPTIONS.includes(stored as (typeof PAGING_SIZE_OPTIONS)[number])
      ? stored
      : DEFAULT_PAGING_SIZE
  }, [])
  const selectedTheme = useMemo(() => theme?.state?.theme || 'darkBlack', [theme?.state?.theme])
  const configApiUrl = useMemo(() => {
    if (typeof window === 'undefined') return 'N/A'
    const windowWithConfig = window as Window & { configApiBaseUrl?: string }
    return windowWithConfig.configApiBaseUrl || 'N/A'
  }, [])

  const transformToFormValues = useCallback(
    (configData?: AppConfigResponse | null) => buildSettingsInitialValues(configData),
    [],
  )

  const initialValues = useMemo(
    () => transformToFormValues(config),
    [config, transformToFormValues],
  )

  const authScripts = useMemo(() => {
    const entries = scriptsData?.entries || []
    const names = entries
      .filter((s) => s.enabled)
      .map((s) => s.name)
      .filter((name): name is string => Boolean(name))
    return Array.from(new Set([...names, SIMPLE_PASSWORD_AUTH]))
  }, [scriptsData])

  const [baselinePagingSize, setBaselinePagingSize] = useState(savedPagingSize)
  const [currentPagingSize, setCurrentPagingSize] = useState(savedPagingSize)

  const handlePagingSizeChange = useCallback((size: number) => {
    setCurrentPagingSize(size)
  }, [])

  const formik = useFormik<SettingsFormValues>({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values, formikHelpers) => {
      savePagingSizeToStorage(currentPagingSize)

      const cedarlingLogTypeChanged = values?.cedarlingLogType !== config?.cedarlingLogType

      try {
        const updatePayload: AppConfigResponse = {
          sessionTimeoutInMins: values.sessionTimeoutInMins,
          acrValues: values.acrValues,
          cedarlingLogType: values.cedarlingLogType,
          additionalParameters: values.additionalParameters.map((param) => ({
            key: param.key ?? undefined,
            value: param.value ?? undefined,
          })),
        }

        const updatedConfig = await editConfigMutation.mutateAsync({
          data: updatePayload,
        })

        queryClient.invalidateQueries({ queryKey: getGetAdminuiConfQueryKey() })
        dispatch(getOAuth2ConfigResponse({ config: updatedConfig }))

        await logAudit({
          userinfo: authState.userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_SETTINGS,
          message: 'Application settings updated',
          client_id: authState.clientId,
          payload: {
            sessionTimeoutInMins: values.sessionTimeoutInMins,
            acrValues: values.acrValues,
            cedarlingLogType: values.cedarlingLogType,
            additionalParameters: values.additionalParameters,
          },
        }).catch((auditError) => {
          console.error('Audit logging failed:', auditError)
        })

        if (cedarlingLogTypeChanged) {
          dispatch(updateToast(true, 'success', t('fields.reloginToViewCedarlingChanges')))
        } else {
          dispatch(updateToast(true, 'success'))
        }

        setBaselinePagingSize(currentPagingSize)
        formikHelpers.resetForm({ values })
      } catch (error) {
        const errorMessage = getErrorMessage(error as Error, 'messages.error_in_saving', t)
        dispatch(updateToast(true, 'error', errorMessage))
      }
    },
    validationSchema,
  })

  const { resetForm } = formik

  const isPagingSizeChanged = currentPagingSize !== baselinePagingSize
  const isAdditionalParamsChanged =
    JSON.stringify(formik.initialValues.additionalParameters ?? []) !==
    JSON.stringify(formik.values.additionalParameters ?? [])
  const isFormChanged = formik.dirty || isPagingSizeChanged || isAdditionalParamsChanged
  const hasErrors = !formik.isValid
  const isSubmitting = editConfigMutation.isPending
  const hasQueryError = isConfigError || isScriptsError

  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isFormChanged) return
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isFormChanged])

  const handleCancel = useCallback(() => {
    const resetValues = transformToFormValues(config)
    resetForm({ values: resetValues })
    setCurrentPagingSize(baselinePagingSize)
  }, [config, transformToFormValues, baselinePagingSize, resetForm])

  const handleRetry = useCallback(() => {
    if (isConfigError) refetchConfig()
    if (isScriptsError) refetchScripts()
  }, [isConfigError, isScriptsError, refetchConfig, refetchScripts])

  const additionalParametersError = formik.errors?.additionalParameters
  const showAdditionalParametersError = Boolean(
    additionalParametersError && (formik.submitCount > 0 || formik.touched?.additionalParameters),
  )

  const renderErrorAlert = () => {
    if (!hasQueryError) return null

    const errorMessages: string[] = []
    if (isConfigError && configError) {
      errorMessages.push(
        getErrorMessage(configError as unknown as Error, 'messages.error_loading_config', t),
      )
    }
    if (isScriptsError && scriptsError) {
      errorMessages.push(
        getErrorMessage(scriptsError as unknown as Error, 'messages.error_loading_scripts', t),
      )
    }

    return (
      <Alert color="danger" className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {errorMessages.map((msg, idx) => (
              <div key={`error-${idx}`}>{msg}</div>
            ))}
          </div>
          <Button color="danger" size="sm" onClick={handleRetry}>
            {t('actions.retry')}
          </Button>
        </div>
      </Alert>
    )
  }

  return (
    <GluuLoader blocking={loadingScripts || loadingConfig || isSubmitting}>
      <GluuViewWrapper canShow={canReadSettings}>
        <Card style={applicationStyle.mainCard}>
          <CardBody>
            {renderErrorAlert()}
            <Form onSubmit={formik.handleSubmit}>
              <GluuInputRow
                label="fields.gluuFlexVersion"
                name="gluuFlexVersion"
                type="text"
                lsize={4}
                rsize={8}
                value={packageJson.version}
                disabled={true}
                doc_category={SETTINGS}
                doc_entry="gluuCurrentVersion"
              />

              <FormGroup row style={FORM_GROUP_ROW_STYLE}>
                <GluuLabel
                  label={t('fields.config_api_url')}
                  doc_category={SETTINGS}
                  size={4}
                  doc_entry="configApiUrl"
                />
                <Col sm={8}>
                  <Label style={LABEL_CONTAINER_STYLE}>
                    <h3>
                      <Badge color={`primary-${selectedTheme}`}>{configApiUrl}</Badge>
                    </h3>
                  </Label>
                </Col>
              </FormGroup>

              <FormGroup row>
                <GluuLabel
                  label={t('fields.list_paging_size')}
                  size={4}
                  doc_category={SETTINGS}
                  doc_entry="pageSize"
                />
                <Col sm={8}>
                  <InputGroup>
                    <CustomInput
                      type="select"
                      id="pagingSize"
                      name="pagingSize"
                      value={String(currentPagingSize)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handlePagingSizeChange(Number.parseInt(e.target.value, 10))
                      }
                      disabled={!canWriteSettings}
                    >
                      {PAGING_SIZE_OPTIONS.map((option) => (
                        <option value={String(option)} key={option}>
                          {option}
                        </option>
                      ))}
                    </CustomInput>
                  </InputGroup>
                </Col>
              </FormGroup>

              <GluuInputRow
                label="fields.sessionTimeoutInMins"
                name="sessionTimeoutInMins"
                type="number"
                formik={formik}
                lsize={4}
                rsize={8}
                value={formik.values.sessionTimeoutInMins}
                doc_category={SETTINGS}
                doc_entry="sessionTimeoutInMins"
                errorMessage={formik.errors.sessionTimeoutInMins}
                showError={Boolean(
                  formik.errors.sessionTimeoutInMins && formik.touched.sessionTimeoutInMins,
                )}
                disabled={!canWriteSettings}
              />

              <FormGroup row>
                <GluuLabel
                  size={4}
                  doc_category={SETTINGS}
                  doc_entry="adminui_default_acr"
                  label={t('fields.adminui_default_acr')}
                />
                <Col sm={8}>
                  <InputGroup>
                    <CustomInput
                      type="select"
                      data-testid="acrValues"
                      id="acrValues"
                      name="acrValues"
                      value={formik.values.acrValues}
                      onChange={formik.handleChange}
                      disabled={!canWriteSettings}
                    >
                      <option value="">{t('actions.choose')}...</option>
                      {authScripts.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </CustomInput>
                  </InputGroup>
                </Col>
              </FormGroup>

              <FormGroup row>
                <GluuLabel
                  size={4}
                  doc_category={SETTINGS}
                  doc_entry="cedarSwitch"
                  label={t('fields.showCedarLogs?')}
                />
                <Col sm={8}>
                  <GluuToogleRow
                    isLabelVisible={false}
                    name={t('fields.showCedarLogs?')}
                    formik={formik}
                    value={formik.values.cedarlingLogType === CedarlingLogType.STD_OUT}
                    doc_category={SETTINGS}
                    doc_entry="cedarSwitch"
                    lsize={4}
                    rsize={8}
                    disabled={!canWriteSettings}
                    handler={(event: React.ChangeEvent<HTMLInputElement>) => {
                      formik.setFieldValue(
                        'cedarlingLogType',
                        event.target.checked ? CedarlingLogType.STD_OUT : CedarlingLogType.OFF,
                      )
                    }}
                  />
                </Col>
              </FormGroup>

              <Accordion className="mb-3 b-primary" initialOpen>
                <AccordionHeader>
                  <h5>{t('fields.custom_params_auth')}</h5>
                </AccordionHeader>
                <AccordionBody>
                  <Button
                    style={{ float: 'right' }}
                    type="button"
                    color={`primary-${selectedTheme}`}
                    disabled={!canWriteSettings}
                    onClick={() => {
                      const currentParams = formik.values.additionalParameters || []
                      formik.setFieldValue('additionalParameters', [
                        ...currentParams,
                        { key: '', value: '' },
                      ])
                    }}
                  >
                    <i className="fa fa-fw fa-plus me-2"></i>
                    {t('actions.add_property')}
                  </Button>
                  <FormGroup row>
                    <Col sm={12}>
                      {(formik.values.additionalParameters || []).map(
                        (param: { key?: string; value?: string }, index: number) => (
                          <FormGroup row key={index}>
                            <Col sm={4}>
                              <Input
                                name={`additionalParameters.${index}.key`}
                                value={param.key || ''}
                                onChange={formik.handleChange}
                                placeholder={t('placeholders.enter_property_key')}
                                disabled={!canWriteSettings}
                              />
                            </Col>
                            <Col sm={6}>
                              <Input
                                name={`additionalParameters.${index}.value`}
                                value={param.value || ''}
                                onChange={formik.handleChange}
                                placeholder={t('placeholders.enter_property_value')}
                                disabled={!canWriteSettings}
                              />
                            </Col>
                            <Col sm={2}>
                              <Button
                                type="button"
                                color="danger"
                                disabled={!canWriteSettings}
                                onClick={() => {
                                  const currentParams = [...formik.values.additionalParameters]
                                  currentParams.splice(index, 1)
                                  formik.setFieldValue('additionalParameters', currentParams)
                                }}
                              >
                                <i className="fa fa-fw fa-trash me-2"></i>
                                {t('actions.remove')}
                              </Button>
                            </Col>
                          </FormGroup>
                        ),
                      )}
                    </Col>
                  </FormGroup>
                  {showAdditionalParametersError && (
                    <div style={{ color: '#dc3545' }}>{additionalParametersError}</div>
                  )}
                </AccordionBody>
              </Accordion>

              <GluuFormFooter
                showBack
                showCancel={canWriteSettings}
                onCancel={handleCancel}
                disableCancel={!isFormChanged}
                showApply={canWriteSettings}
                onApply={formik.handleSubmit}
                disableApply={!isFormChanged || hasErrors || isSubmitting}
                applyButtonType="button"
              />
            </Form>
          </CardBody>
        </Card>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default SettingsPage
