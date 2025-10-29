import React, { useEffect, useMemo, useCallback, useState, useContext } from 'react'
import PropTypes from 'prop-types'
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
import { putConfigWorker, setPagingSize } from 'Redux/features/authSlice'
import { getScripts } from 'Redux/features/initSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'
import { CedarlingLogType } from '@/cedarling'
import packageJson from '../../../../package.json'

const levels = [1, 5, 10, 20]

function SettingsPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const loadingScripts = useSelector((state) => state.initReducer.loadingScripts)
  const loadingConfig = useSelector((state) => state.authReducer?.loadingConfig)
  const savedPagingSize = useSelector((state) => state.authReducer?.pagingSize) || 10
  const [currentPagingSize, setCurrentPagingSize] = useState(savedPagingSize)
  SetTitle(t('titles.application_settings'))

  const configApiUrl =
    typeof window !== 'undefined' && window.configApiBaseUrl ? window.configApiBaseUrl : 'N/A'

  useEffect(() => {
    dispatch(getScripts({ action: {} }))
  }, [dispatch])

  useEffect(() => {
    setCurrentPagingSize(savedPagingSize)
  }, [savedPagingSize])

  const handlePagingSizeChange = useCallback((size) => {
    setCurrentPagingSize(size)
  }, [])

  const resetPagingSize = useCallback(() => {
    setCurrentPagingSize(savedPagingSize)
  }, [savedPagingSize])

  const savePagingSize = useCallback(() => {
    dispatch(setPagingSize(currentPagingSize))
  }, [dispatch, currentPagingSize])

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

            <FormGroup row style={{ justifyContent: 'space-between' }}>
              <GluuLabel
                label={t('fields.config_api_url')}
                doc_category={SETTINGS}
                size={4}
                doc_entry="configApiUrl"
              />
              <Col sm={8}>
                <Label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    paddingRight: '15px',
                  }}
                >
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
              <SettingsForm resetPagingSize={resetPagingSize} savePagingSize={savePagingSize} />
            )}
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  )
}

function SettingsForm({ resetPagingSize, savePagingSize }) {
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
    const names = (scripts || [])
      .filter((s) => s.scriptType === 'person_authentication' && s.enabled)
      .map((s) => s.name)
    return Array.from(new Set([...names, SIMPLE_PASSWORD_AUTH]))
  }, [scripts])

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      savePagingSize()
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
    resetPagingSize()
  }, [config, transformToFormValues, resetPagingSize, formik])

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
  resetPagingSize: PropTypes.func.isRequired,
  savePagingSize: PropTypes.func.isRequired,
}

export default SettingsPage
