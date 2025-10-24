import React, { useEffect, useMemo, useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { Card, CardBody, FormGroup, Col, InputGroup, CustomInput, Form } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { SETTINGS } from 'Utils/ApiResources'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { putConfigWorker, setPaggingSize } from 'Redux/features/authSlice'
import { getScripts } from 'Redux/features/initSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'
import { CedarlingLogType } from '@/cedarling'
import packageJson from '../../../../package.json'

const levels = [1, 5, 10, 20]

function SettingsPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const loadingScripts = useSelector((state) => state.initReducer.loadingScripts)
  const loadingConfig = useSelector((state) => state.authReducer?.loadingConfig)
  const savedPaggingSize = useSelector((state) => state.authReducer?.paggingSize) || 10
  const [currentPaggingSize, setCurrentPaggingSize] = useState(savedPaggingSize)
  SetTitle(t('titles.application_settings'))

  useEffect(() => {
    dispatch(getScripts({ action: {} }))
  }, [dispatch])

  useEffect(() => {
    setCurrentPaggingSize(savedPaggingSize)
  }, [savedPaggingSize])

  const handlePaggingSizeChange = useCallback((size) => {
    setCurrentPaggingSize(size)
  }, [])

  const resetPaggingSize = useCallback(() => {
    setCurrentPaggingSize(savedPaggingSize)
  }, [savedPaggingSize])

  const savePaggingSize = useCallback(() => {
    dispatch(setPaggingSize(currentPaggingSize))
  }, [dispatch, currentPaggingSize])

  return (
    <React.Fragment>
      <GluuLoader blocking={loadingScripts || loadingConfig}>
        <Card style={applicationStyle.mainCard}>
          <CardBody>
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

            {window.configApiBaseUrl && (
              <GluuInputRow
                label="fields.config_api_url"
                name="configApiUrl"
                type="text"
                lsize={4}
                rsize={8}
                value={window.configApiBaseUrl}
                disabled={true}
                doc_category={SETTINGS}
                doc_entry="configApiUrl"
              />
            )}

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
                    value={currentPaggingSize}
                    onChange={(value) => {
                      const size = levels[value.target.options.selectedIndex]
                      handlePaggingSizeChange(size)
                    }}
                  >
                    {levels.map((item, key) => (
                      <option value={item} key={key}>
                        {item}
                      </option>
                    ))}
                  </CustomInput>
                </InputGroup>
              </Col>
            </FormGroup>

            {!loadingScripts && (
              <SettingsForm resetPaggingSize={resetPaggingSize} savePaggingSize={savePaggingSize} />
            )}
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  )
}

function SettingsForm({ resetPaggingSize, savePaggingSize }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const config = useSelector((state) => state.authReducer?.config) || {}
  const scripts = useSelector((state) => state.initReducer.scripts)

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
    const filtered = scripts
      .filter((item) => item.scriptType === 'person_authentication')
      .filter((item) => item.enabled)
      .map((item) => item.name)

    return [...filtered, SIMPLE_PASSWORD_AUTH]
  }, [scripts])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      savePaggingSize()
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

  const handleCancel = useCallback(() => {
    const resetValues = transformToFormValues(config)
    formik.resetForm({ values: resetValues })
    resetPaggingSize()
  }, [config, transformToFormValues, resetPaggingSize, formik])

  const additionalParametersOptions = useMemo(() => {
    return (formik.values.additionalParameters || []).map((param) => ({
      key: param.key || '',
      value: param.value || '',
    }))
  }, [formik.values.additionalParameters])

  return (
    <Form onSubmit={formik.handleSubmit}>
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
        showError={formik.errors.sessionTimeoutInMins && formik.touched.sessionTimeoutInMins}
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
        hideButtons={{ save: true }}
        type="submit"
        disableBackButton={true}
        cancelHandler={handleCancel}
      />
    </Form>
  )
}

SettingsForm.propTypes = {
  resetPaggingSize: PropTypes.func.isRequired,
  savePaggingSize: PropTypes.func.isRequired,
}

export default SettingsPage
