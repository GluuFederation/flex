import React, { useEffect, useMemo, useCallback, useState, useContext } from 'react'
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
} from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import { SETTINGS } from 'Utils/ApiResources'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { putConfigWorker } from 'Redux/features/authSlice'
import { getScripts } from 'Redux/features/initSlice'
import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'
import { CedarlingLogType } from '@/cedarling'
import { getPagingSize, savePagingSize as savePagingSizeToStorage } from 'Utils/pagingUtils'
import { buildPayload } from 'Utils/PermChecker'
import packageJson from '../../../../package.json'
import { getSettingsValidationSchema } from 'Plugins/admin/helper/validations/settingsValidation'
import { buildSettingsInitialValues } from 'Plugins/admin/helper/settings'

const SettingsPage = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)

  const loadingScripts = useSelector((state) => state.initReducer.loadingScripts)
  const loadingConfig = useSelector((state) => state.authReducer?.loadingConfig)
  const config = useSelector((state) => state.authReducer?.config) || {}
  const scripts = useSelector((state) => state.initReducer.scripts)

  SetTitle(t('titles.application_settings'))

  const validationSchema = useMemo(() => getSettingsValidationSchema(t), [t])
  const pagingSizeOptions = useMemo(() => [1, 5, 10, 20], [])
  const defaultPagingSize = useMemo(
    () => pagingSizeOptions[2] || pagingSizeOptions[0] || 10,
    [pagingSizeOptions],
  )
  const savedPagingSize = useMemo(() => getPagingSize(defaultPagingSize), [defaultPagingSize])
  const selectedTheme = useMemo(() => theme?.state?.theme || 'darkBlack', [theme?.state?.theme])
  const configApiUrl = useMemo(
    () =>
      typeof window !== 'undefined' && window.configApiBaseUrl ? window.configApiBaseUrl : 'N/A',
    [],
  )
  const transformToFormValues = useCallback(
    (configData) => buildSettingsInitialValues(configData),
    [],
  )
  const initialValues = useMemo(
    () => transformToFormValues(config),
    [config, transformToFormValues],
  )
  const authScripts = useMemo(() => {
    const names = (scripts || [])
      .filter((s) => s.scriptType === 'person_authentication' && s.enabled)
      .map((s) => s.name)
    return Array.from(new Set([...names, SIMPLE_PASSWORD_AUTH]))
  }, [scripts])

  const [baselinePagingSize, setBaselinePagingSize] = useState(savedPagingSize)
  const [currentPagingSize, setCurrentPagingSize] = useState(savedPagingSize)

  useEffect(() => {
    const userAction = {}
    const options = {}
    buildPayload(userAction, 'Fetch custom scripts', options)
    dispatch(getScripts({ action: userAction }))
  }, [dispatch])

  const handlePagingSizeChange = useCallback((size) => {
    setCurrentPagingSize(size)
  }, [])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values, formikHelpers) => {
      savePagingSizeToStorage(currentPagingSize)

      const cedarlingLogTypeChanged = values?.cedarlingLogType !== config?.cedarlingLogType

      dispatch(
        putConfigWorker({
          ...values,
          _meta: {
            cedarlingLogTypeChanged,
            toastMessage: cedarlingLogTypeChanged
              ? t('fields.reloginToViewCedarlingChanges')
              : undefined,
          },
        }),
      )

      setBaselinePagingSize(currentPagingSize)
      formikHelpers.resetForm({ values })
    },
    validationSchema,
  })

  const { resetForm } = formik

  const isPagingSizeChanged = currentPagingSize !== baselinePagingSize
  const isFormChanged = formik.dirty || isPagingSizeChanged
  const hasErrors = !formik.isValid

  const handleCancel = useCallback(() => {
    const resetValues = transformToFormValues(config)
    resetForm({ values: resetValues })
    setCurrentPagingSize(baselinePagingSize)
  }, [config, transformToFormValues, baselinePagingSize, resetForm])

  const additionalParametersOptions = useMemo(() => {
    return (formik.values.additionalParameters || []).map((param) => ({
      key: param.key || '',
      value: param.value || '',
    }))
  }, [formik.values.additionalParameters])
  const additionalParametersError = formik.errors?.additionalParameters
  const showAdditionalParametersError = Boolean(
    additionalParametersError && (formik.submitCount > 0 || formik.touched?.additionalParameters),
  )

  const formGroupRowStyle = useMemo(() => ({ justifyContent: 'space-between' }), [])

  const labelContainerStyle = useMemo(
    () => ({
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingRight: '15px',
    }),
    [],
  )

  return (
    <React.Fragment>
      <GluuLoader blocking={loadingScripts || loadingConfig}>
        <Card style={applicationStyle.mainCard}>
          <CardBody>
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

              <FormGroup row style={formGroupRowStyle}>
                <GluuLabel
                  label={t('fields.config_api_url')}
                  doc_category={SETTINGS}
                  size={4}
                  doc_entry="configApiUrl"
                />
                <Col sm={8}>
                  <Label style={labelContainerStyle}>
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
                      onChange={(e) => handlePagingSizeChange(parseInt(e.target.value, 10))}
                    >
                      {pagingSizeOptions.map((option) => (
                        <option value={String(option)} key={option}>
                          {option}
                        </option>
                      ))}
                    </CustomInput>
                  </InputGroup>
                </Col>
              </FormGroup>

              <>
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
                  showError={
                    formik.errors.sessionTimeoutInMins && formik.touched.sessionTimeoutInMins
                  }
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
                      handler={(event) => {
                        formik.setFieldValue(
                          'cedarlingLogType',
                          event.target.checked ? CedarlingLogType.STD_OUT : CedarlingLogType.OFF,
                        )
                      }}
                    />
                  </Col>
                </FormGroup>

                <div className="mb-3">
                  <GluuProperties
                    compName="additionalParameters"
                    label="fields.custom_params_auth"
                    formik={formik}
                    keyPlaceholder={t('placeholders.enter_property_key')}
                    valuePlaceholder={t('placeholders.enter_property_value')}
                    options={additionalParametersOptions}
                    tooltip="documentation.settings.custom_params"
                    showError={showAdditionalParametersError}
                    errorMessage={additionalParametersError}
                  />
                </div>

                <GluuFormFooter
                  showBack={true}
                  showCancel={true}
                  onCancel={handleCancel}
                  disableCancel={!isFormChanged}
                  showApply={true}
                  onApply={formik.handleSubmit}
                  disableApply={!isFormChanged || hasErrors}
                  applyButtonType="button"
                />
              </>
            </Form>
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  )
}

export default SettingsPage
