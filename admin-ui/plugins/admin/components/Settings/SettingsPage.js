import React, { useEffect, useMemo, useCallback, useState, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
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
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { SETTINGS } from 'Utils/ApiResources'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { putConfigWorker } from 'Redux/features/authSlice'
import { getScripts } from 'Redux/features/initSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'
import { CedarlingLogType } from '@/cedarling'
import { getPagingSize, savePagingSize as savePagingSizeToStorage } from 'Utils/pagingUtils'
import { buildPayload } from 'Utils/PermChecker'
import packageJson from '../../../../package.json'

function SettingsPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const loadingScripts = useSelector((state) => state.initReducer.loadingScripts)
  const loadingConfig = useSelector((state) => state.authReducer?.loadingConfig)
  const config = useSelector((state) => state.authReducer?.config) || {}
  const scripts = useSelector((state) => state.initReducer.scripts)

  const savedPagingSize = useMemo(() => getPagingSize(10), [])
  const [currentPagingSize, setCurrentPagingSize] = useState(savedPagingSize)

  const pagingSizeOptions = useMemo(() => [1, 5, 10, 20], [])

  SetTitle(t('titles.application_settings'))

  const configApiUrl = useMemo(
    () =>
      typeof window !== 'undefined' && window.configApiBaseUrl ? window.configApiBaseUrl : 'N/A',
    [],
  )

  useEffect(() => {
    const userAction = {}
    const options = {}
    buildPayload(userAction, 'Fetch custom scripts', options)
    dispatch(getScripts({ action: userAction }))
  }, [dispatch])

  const handlePagingSizeChange = useCallback((size) => {
    setCurrentPagingSize(size)
  }, [])

  const transformToFormValues = useCallback((configData) => {
    return {
      sessionTimeoutInMins: configData?.sessionTimeoutInMins || 30,
      acrValues: configData?.acrValues || '',
      cedarlingLogType: configData?.cedarlingLogType || CedarlingLogType.OFF,
      additionalParameters: (configData?.additionalParameters || []).map((param) => ({ ...param })),
    }
  }, [])

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

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      // Save paging size to localStorage before dispatching saga
      savePagingSizeToStorage(currentPagingSize)

      // Dispatch saga after saving paging size
      dispatch(putConfigWorker(values))

      if (values?.cedarlingLogType !== config?.cedarlingLogType) {
        dispatch(updateToast(true, 'success', t('fields.reloginToViewCedarlingChanges')))
      }
    },
    validationSchema: Yup.object().shape({
      sessionTimeoutInMins: Yup.number()
        .min(1, t('messages.session_timeout_error'))
        .required(t('messages.session_timeout_required_error')),
    }),
  })

  const isPagingSizeChanged = currentPagingSize !== savedPagingSize
  const isFormChanged = formik.dirty || isPagingSizeChanged
  const hasErrors = !formik.isValid

  const handleCancel = useCallback(() => {
    const resetValues = transformToFormValues(config)
    formik.resetForm({ values: resetValues })
    setCurrentPagingSize(savedPagingSize)
  }, [config, transformToFormValues, savedPagingSize, formik])

  const additionalParametersOptions = useMemo(() => {
    return (formik.values.additionalParameters || []).map((param) => ({
      key: param.key || '',
      value: param.value || '',
    }))
  }, [formik.values.additionalParameters])

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
                      value={currentPagingSize}
                      onChange={(e) => handlePagingSizeChange(parseInt(e.target.value, 10))}
                    >
                      {pagingSizeOptions.map((option, index) => (
                        <option value={option} key={index}>
                          {option}
                        </option>
                      ))}
                    </CustomInput>
                  </InputGroup>
                </Col>
              </FormGroup>

              {!loadingScripts && (
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
                    />
                  </div>

                  <GluuCommitFooter
                    saveHandler={formik.handleSubmit}
                    disableBackButton={true}
                    cancelHandler={handleCancel}
                    disableButtons={{ save: !isFormChanged || hasErrors, back: !isFormChanged }}
                  />
                </>
              )}
            </Form>
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  )
}

export default SettingsPage
