import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { FormGroup, InputGroup, CustomInput, Form, Alert, Input, GluuPageContent } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuViewWrapper from 'Routes/Apps/Gluu/GluuViewWrapper'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { SETTINGS } from 'Utils/ApiResources'
import SetTitle from 'Utils/SetTitle'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
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
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { GluuButton } from '@/components/GluuButton'
import { useStyles } from './SettingsPage.style'

const PAGING_SIZE_OPTIONS = [1, 5, 10, 20] as const
const DEFAULT_PAGING_SIZE = PAGING_SIZE_OPTIONS[2]
const SCRIPTS_FETCH_LIMIT = 200

const SettingsPage: React.FC = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { state: themeState } = useTheme()
  const isDark = (themeState?.theme ?? DEFAULT_THEME) === THEME_DARK
  const queryClient = useQueryClient()

  const { hasCedarReadPermission, hasCedarWritePermission, authorizeHelper } = useCedarling()

  const userinfo = useAppSelector((state) => state.authReducer?.userinfo)
  const clientId = useAppSelector((state) => state.authReducer?.config?.clientId)

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
  const selectedTheme = useMemo(() => themeState?.theme || DEFAULT_THEME, [themeState?.theme])
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const { classes } = useStyles({ isDark, themeColors })
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
          userinfo: userinfo ?? undefined,
          action: UPDATE,
          resource: ADMIN_UI_SETTINGS,
          message: 'Application settings updated',
          client_id: clientId,
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

  const additionalParametersErrorText = useMemo(() => {
    if (!additionalParametersError) return ''
    if (typeof additionalParametersError === 'string') return additionalParametersError
    if (Array.isArray(additionalParametersError)) {
      return additionalParametersError
        .filter((error) => error != null)
        .map((error) => (typeof error === 'string' ? error : JSON.stringify(error)))
        .join(', ')
    }
    if (typeof additionalParametersError === 'object') {
      const errorValues = Object.values(additionalParametersError)
        .filter((error) => error != null)
        .map((error) => (typeof error === 'string' ? error : JSON.stringify(error)))
      return errorValues.length > 0 ? errorValues.join(', ') : ''
    }
    return String(additionalParametersError)
  }, [additionalParametersError])

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
          <GluuButton
            size="sm"
            backgroundColor={themeColors.settings.errorColor}
            textColor={themeColors.settings.errorButtonText}
            onClick={handleRetry}
          >
            {t('actions.retry')}
          </GluuButton>
        </div>
      </Alert>
    )
  }

  return (
    <GluuLoader blocking={loadingScripts || loadingConfig || isSubmitting}>
      <GluuViewWrapper canShow={canReadSettings}>
        <GluuPageContent>
          <div className={classes.settingsCard}>
            <div className={`${classes.content} ${classes.settingsLabels}`}>
              {renderErrorAlert()}
              <Form onSubmit={formik.handleSubmit} className={classes.formSection}>
                <div className={`${classes.formWithInputs} ${classes.fieldsGrid}`}>
                  <div className={classes.fieldItem}>
                    <GluuInputRow
                      label="fields.gluuFlexVersion"
                      name="gluuFlexVersion"
                      type="text"
                      lsize={12}
                      rsize={12}
                      value={packageJson.version}
                      disabled={true}
                      doc_category={SETTINGS}
                      doc_entry="gluuCurrentVersion"
                      isDark={isDark}
                    />
                  </div>

                  <div className={classes.fieldItem}>
                    <GluuInputRow
                      label="fields.config_api_url"
                      name="configApiUrl"
                      type="text"
                      lsize={12}
                      rsize={12}
                      value={configApiUrl}
                      disabled={true}
                      doc_category={SETTINGS}
                      doc_entry="configApiUrl"
                      isDark={isDark}
                    />
                  </div>

                  <div className={classes.fieldItem}>
                    <FormGroup>
                      <GluuLabel
                        label="fields.list_paging_size"
                        size={12}
                        doc_category={SETTINGS}
                        doc_entry="pageSize"
                        isDark={isDark}
                      />
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
                    </FormGroup>
                  </div>

                  <div className={classes.fieldItem}>
                    <GluuInputRow<SettingsFormValues>
                      label="fields.sessionTimeoutInMins"
                      name="sessionTimeoutInMins"
                      type="number"
                      formik={formik}
                      lsize={12}
                      rsize={12}
                      value={formik.values.sessionTimeoutInMins}
                      doc_category={SETTINGS}
                      doc_entry="sessionTimeoutInMins"
                      errorMessage={formik.errors.sessionTimeoutInMins}
                      showError={Boolean(
                        formik.errors.sessionTimeoutInMins && formik.touched.sessionTimeoutInMins,
                      )}
                      disabled={!canWriteSettings}
                      isDark={isDark}
                    />
                  </div>

                  <div className={classes.fieldItem}>
                    <FormGroup>
                      <GluuLabel
                        size={12}
                        doc_category={SETTINGS}
                        doc_entry="adminui_default_acr"
                        label="fields.adminui_default_acr"
                        isDark={isDark}
                      />
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
                    </FormGroup>
                  </div>

                  <div className={classes.fieldItem}>
                    <FormGroup>
                      <GluuLabel
                        size={12}
                        doc_category={SETTINGS}
                        doc_entry="cedarSwitch"
                        label="fields.showCedarLogs?"
                        isDark={isDark}
                      />
                      <GluuToogleRow<SettingsFormValues>
                        isLabelVisible={false}
                        label="fields.showCedarLogs?"
                        name="cedarlingLogType"
                        formik={formik}
                        value={formik.values.cedarlingLogType === CedarlingLogType.STD_OUT}
                        doc_category={SETTINGS}
                        doc_entry="cedarSwitch"
                        lsize={12}
                        rsize={12}
                        disabled={!canWriteSettings}
                        isDark={isDark}
                        handler={(event: React.ChangeEvent<HTMLInputElement>) => {
                          formik.setFieldValue(
                            'cedarlingLogType',
                            event.target.checked ? CedarlingLogType.STD_OUT : CedarlingLogType.OFF,
                          )
                        }}
                      />
                    </FormGroup>
                  </div>
                </div>

                <div className={classes.customParamsBox}>
                  <div className={classes.customParamsHeader}>
                    <GluuText variant="h5" disableThemeColor>
                      <span className={classes.customParamsTitle}>
                        {t('fields.custom_params_auth')}
                      </span>
                    </GluuText>
                    <GluuButton
                      type="button"
                      disabled={!canWriteSettings}
                      backgroundColor={themeColors.settings.addPropertyButton.bg}
                      textColor={themeColors.settings.addPropertyButton.text}
                      disableHoverStyles
                      style={{ minWidth: 156, width: 156, gap: 8, flexShrink: 0 }}
                      onClick={() => {
                        const currentParams = formik.values.additionalParameters || []
                        formik.setFieldValue('additionalParameters', [
                          ...currentParams,
                          { id: crypto.randomUUID(), key: '', value: '' },
                        ])
                      }}
                    >
                      <i className="fa fa-fw fa-plus" />
                      {t('actions.add_property')}
                    </GluuButton>
                  </div>
                  <div className={classes.customParamsBody}>
                    {(formik.values.additionalParameters || []).map(
                      (param: { id: string; key?: string; value?: string }, index: number) => (
                        <div key={param.id} className={classes.customParamsRow}>
                          <Input
                            name={`additionalParameters.${index}.key`}
                            value={param.key || ''}
                            onChange={formik.handleChange}
                            placeholder={t('placeholders.enter_property_key')}
                            disabled={!canWriteSettings}
                            className={classes.customParamsInput}
                          />
                          <Input
                            name={`additionalParameters.${index}.value`}
                            value={param.value || ''}
                            onChange={formik.handleChange}
                            placeholder={t('placeholders.enter_property_value')}
                            disabled={!canWriteSettings}
                            className={classes.customParamsInput}
                          />
                          <GluuButton
                            type="button"
                            disabled={!canWriteSettings}
                            backgroundColor={themeColors.settings.removeButton.bg}
                            textColor={themeColors.settings.removeButton.text}
                            disableHoverStyles
                            style={{
                              minWidth: 156,
                              width: 156,
                              minHeight: 44,
                              gap: 8,
                              flexShrink: 0,
                              alignSelf: 'stretch',
                            }}
                            onClick={() => {
                              const currentParams = formik.values.additionalParameters || []
                              const newParams = currentParams.filter((p) => p.id !== param.id)
                              formik.setFieldValue('additionalParameters', newParams)
                            }}
                          >
                            <i className="fa fa-fw fa-trash" />
                            {t('actions.remove')}
                          </GluuButton>
                        </div>
                      ),
                    )}
                  </div>
                  {showAdditionalParametersError &&
                    additionalParametersErrorText &&
                    additionalParametersErrorText.trim() && (
                      <div className={classes.customParamsError}>
                        {additionalParametersErrorText}
                      </div>
                    )}
                </div>

                <GluuThemeFormFooter
                  showBack
                  showCancel={canWriteSettings}
                  onCancel={handleCancel}
                  disableCancel={!isFormChanged}
                  showApply={canWriteSettings}
                  onApply={formik.handleSubmit}
                  disableApply={!isFormChanged || hasErrors || isSubmitting}
                  applyButtonType="button"
                  hideDivider
                />
              </Form>
            </div>
          </div>
        </GluuPageContent>
      </GluuViewWrapper>
    </GluuLoader>
  )
}

export default SettingsPage
