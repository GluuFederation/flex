import React, { useState, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { SETTINGS } from 'Utils/ApiResources'
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
  Button,
} from 'Components'
import SetTitle from 'Utils/SetTitle'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { ThemeContext } from 'Context/theme/themeContext'
import { putConfigWorker } from 'Redux/features/authSlice'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { useFormik } from 'formik'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { SIMPLE_PASSWORD_AUTH } from 'Plugins/auth-server/common/Constants'
import { getScripts } from 'Redux/features/initSlice'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import packageJson from '../../../../package.json'
import { CedarlingLogType } from '@/cedarling'
import { updateToast } from '@/redux/features/toastSlice'

const levels = [1, 5, 10, 20]

function SettingsPage() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const loadingScripts = useSelector((state) => state.initReducer.loadingScripts)
  const loadingConfig = useSelector((state) => state.authReducer?.loadingConfig)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const [paggingSize, setPaggingSize] = useState(localStorage.getItem('paggingSize') || 10)
  SetTitle(t('titles.application_settings'))

  useEffect(() => {
    dispatch(getScripts({ action: {} }))
  }, [])

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
                    defaultValue={
                      levels[
                        levels.findIndex((element) => {
                          return element == paggingSize
                        })
                      ]
                    }
                    onChange={(value) => {
                      const size = levels[value.target.options.selectedIndex]
                      setPaggingSize(size)
                      localStorage.setItem('paggingSize', size)
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
                    <Badge color={`primary-${selectedTheme}`}>{window.configApiBaseUrl}</Badge>
                  </h3>
                </Label>
              </Col>
            </FormGroup>

            {!loadingScripts && <SettingsForm />}
          </CardBody>
        </Card>
      </GluuLoader>
    </React.Fragment>
  )
}

function SettingsForm() {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const loadingConfig = useSelector((state) => state.authReducer?.loadingConfig)
  const additionalParameters =
    useSelector((state) => state.authReducer?.config?.additionalParameters) || []
  const acrValues = useSelector((state) => state.authReducer?.config?.acrValues)
  const sessionTimeout =
    useSelector((state) => state.authReducer?.config?.sessionTimeoutInMins) || 5
  const cedarlingLogType =
    useSelector((state) => state.authReducer?.config?.cedarlingLogType) || CedarlingLogType.OFF
  const scripts = useSelector((state) => state.initReducer.scripts)
  const dispatch = useDispatch()

  const authScripts = scripts
    .filter((item) => item.scriptType == 'person_authentication')
    .filter((item) => item.enabled)
    .map((item) => item.name)

  authScripts.push(SIMPLE_PASSWORD_AUTH)

  const formik = useFormik({
    initialValues: {
      sessionTimeoutInMins: sessionTimeout,
      acrValues: acrValues || '',
      cedarlingLogType,
    },
    onSubmit: (values) => {
      dispatch(putConfigWorker(values))
      !(values?.cedarlingLogType === cedarlingLogType) &&
        dispatch(updateToast(true, 'success', t('fields.reloginToViewCedarlingChanges')))
    },
    validationSchema: Yup.object().shape({
      sessionTimeoutInMins: Yup.number()
        .min(1, t('messages.session_timeout_error'))
        .required(t('messages.session_timeout_required_error')),
    }),
  })

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
        showError={!!(formik.errors.sessionTimeoutInMins && formik.touched.sessionTimeoutInMins)}
      />

      <FormGroup row>
        <GluuLabel
          size={4}
          doc_category="settings"
          doc_entry={'adminui_default_acr'}
          label={t('fields.adminui_default_acr')}
        />
        <Col sm={8}>
          <InputGroup>
            <CustomInput
              type="select"
              data-testid={'acrValues'}
              id={'acrValues'}
              name={'acrValues'}
              value={formik?.values?.acrValues}
              onChange={formik.handleChange}
            >
              <option value="">{t('actions.choose')}...</option>
              {authScripts.map((item) => (
                <option key={item.toString()}>{item}</option>
              ))}
            </CustomInput>
          </InputGroup>
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel
          size={4}
          doc_category={SETTINGS}
          doc_entry={'cedarSwitch'}
          label={t('fields.showCedarLogs?')}
        />

        <Col sm={8}>
          <GluuToogleRow
            isLabelVisible={false}
            name={t('fields.showCedarLogs?')}
            formik={formik}
            value={formik.values.cedarlingLogType === CedarlingLogType.STD_OUT}
            doc_category={SETTINGS}
            doc_entry={'cedarSwitch'}
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
          options={additionalParameters}
          tooltip="documentation.settings.custom_params"
        />
      </div>
      <Button
        type="submit"
        color={`primary-${selectedTheme}`}
        className="UserActionSubmitButton"
        disabled={loadingConfig || !formik.dirty}
      >
        {t('actions.submit')}
      </Button>
    </Form>
  )
}

export default SettingsPage
