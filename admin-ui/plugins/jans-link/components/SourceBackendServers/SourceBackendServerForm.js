import React, { useContext, useEffect, useState } from 'react'
import { buildPayload } from 'Utils/PermChecker'
import {
  testLdap,
  resetTestLdap,
} from 'Plugins/services/redux/features/ldapSlice'
import { updateToast } from 'Redux/features/toastSlice'
import { ThemeContext } from 'Context/theme/themeContext'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup, Button, Card, CardBody } from 'Components'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { Box } from '@mui/material'
import BindPasswordModal from '../CacheRefresh/BindPasswordModal'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import * as Yup from 'yup'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { isEmpty } from 'lodash'
import {
  putCacheRefreshConfiguration,
  toggleSavedFormFlag,
} from 'Plugins/jans-link/redux/features/CacheRefreshSlice'
import { useTranslation } from 'react-i18next'
import { useLocation, useNavigate } from 'react-router'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'

const isStringsArray = (arr) => arr.every((i) => typeof i === 'string')
const convertToStringArray = (arr) => {
  return arr.map((item) => item.value)
}

const SourceBackendServerForm = () => {
  const sourceConfig = useLocation().state?.sourceConfig
  const navigate = useNavigate()
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const cacheRefreshConfiguration = useSelector(
    (state) => state.cacheRefreshReducer.configuration,
  )
  const loading = useSelector((state) => state.cacheRefreshReducer.loading)
  const loadingTest = useSelector((state) => state.ldapReducer.loading)
  const savedForm = useSelector((state) => state.cacheRefreshReducer.savedForm)
  const [password, setPassword] = useState(sourceConfig?.bindPassword || null)
  const userAction = {}
  const { testStatus } = useSelector((state) => state.ldapReducer)
  const [testRunning, setTestRunning] = useState(false)
  const dispatch = useDispatch()
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const [auditModal, setAuditModal] = useState(false)
  const toggleAudit = () => {
    setAuditModal(!auditModal)
  }

  const initialValues = {
    sourceConfigs: {
      ...sourceConfig,
      servers: sourceConfig?.servers || [],
      baseDNs: sourceConfig?.baseDNs || [],
      bindPassword: sourceConfig?.bindPassword || null,
      configId: sourceConfig?.configId || '',
      bindDN: sourceConfig?.bindDN || '',
      maxConnections: sourceConfig?.maxConnections || null,
      enabled: sourceConfig?.enabled || false,
    },
  }

  const validationSchema = Yup.object({
    sourceConfigs: Yup.object().shape({
      configId: Yup.string()
        .min(2, 'Mininum 2 characters')
        .required(`${t('fields.name')} ${t('messages.is_required')}`),
      bindDN: Yup.string()
        .min(2, 'Mininum 2 characters')
        .required(`${t('fields.bind_dn')} ${t('messages.is_required')}`),
      maxConnections: Yup.string().required(
        `${t('fields.max_connections')} ${t('messages.is_required')}`,
      ),
      servers: Yup.array().min(
        1,
        `${t('fields.server_port')} ${t('messages.is_required')}`,
      ),
      baseDNs: Yup.array().min(
        1,
        `${t('fields.base_dns')} ${t('messages.is_required')}`,
      ),
    }),
  })

  const handleChangePassword = (updatedPassword) => {
    setPassword(updatedPassword)
  }

  function checkLdapConnection() {
    const testPromise = new Promise(function (resolve, reject) {
      dispatch(resetTestLdap())
      resolve()
    })

    testPromise.then(() => {
      setTestRunning(true)
      dispatch(testLdap({ data: formik.values.sourceConfigs }))
    })
  }

  useEffect(() => {
    if (testStatus === null || !testRunning) {
      return
    }
    if (testStatus) {
      dispatch(
        updateToast(
          true,
          'success',
          `${t('messages.ldap_connection_success')}`,
        ),
      )
    } else {
      dispatch(
        updateToast(true, 'error', `${t('messages.ldap_connection_error')}`),
      )
    }
  }, [testStatus])

  const submitForm = (userMessage) => {
    toggleAudit()
    const baseDNs = isStringsArray(formik.values.sourceConfigs.baseDNs || [])
      ? formik.values.sourceConfigs.baseDNs
      : convertToStringArray(formik.values?.sourceConfigs.baseDNs || [])
    const servers = isStringsArray(formik.values.sourceConfigs.servers || [])
      ? formik.values.sourceConfigs.servers
      : convertToStringArray(formik.values?.sourceConfigs.servers || [])

    let payload

    if (!sourceConfig?.configId) {
      const sourceConfigs = [...(cacheRefreshConfiguration.sourceConfigs || [])]
      payload = [
        ...sourceConfigs,
        {
          ...formik.values.sourceConfigs,
          baseDNs: baseDNs,
          servers: servers,
          bindPassword: password,
        },
      ]
    } else {
      payload = cacheRefreshConfiguration.sourceConfigs?.map((config) => {
        return config.configId === sourceConfig.configId
          ? {
              ...config,
              ...formik.values.sourceConfigs,
              baseDNs: baseDNs,
              servers: servers,
              bindPassword: password,
            }
          : config
      })
    }

    buildPayload(userAction, userMessage, {
      appConfiguration2: {
        ...cacheRefreshConfiguration,
        sourceConfigs: payload,
      },
    })

    dispatch(putCacheRefreshConfiguration({ action: userAction }))
    toggleAudit()
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (data) => {
      if (isEmpty(formik.errors)) {
        toggleAudit()
      }
    },
  })

  useEffect(() => {
    if (savedForm) {
      navigate('/jans-link/source-backend-ldap-servers')
    }

    return () => {
      dispatch(toggleSavedFormFlag(false))
    }
  }, [savedForm])

  return (
    <>
      <GluuLoader blocking={loading || loadingTest}>
        <Card style={applicationStyle.mainCard}>
          <CardBody>
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                formik.handleSubmit()
              }}
              className='mt-4'
            >
              <FormGroup row>
                <Box
                  className='mb-3'
                  display='flex'
                  justifyContent={'space-between'}
                >
                  {sourceConfig?.enabled && (
                    <Button
                      color={`primary-${selectedTheme}`}
                      onClick={checkLdapConnection}
                    >
                      {t('fields.test')}
                    </Button>
                  )}
                </Box>
                <>
                  <Col sm={12}>
                    <GluuInputRow
                      label='fields.name'
                      name='sourceConfigs.configId'
                      value={formik.values.sourceConfigs?.configId || ''}
                      formik={formik}
                      lsize={3}
                      rsize={9}
                      required
                      showError={
                        formik.errors.sourceConfigs?.configId &&
                        formik.touched.sourceConfigs?.configId
                      }
                      errorMessage={formik.errors.sourceConfigs?.configId}
                    />
                  </Col>
                  <Col sm={12}>
                    <GluuInputRow
                      label='fields.bind_dn'
                      name='sourceConfigs.bindDN'
                      value={formik.values.sourceConfigs?.bindDN || ''}
                      formik={formik}
                      lsize={3}
                      rsize={9}
                      required
                      showError={
                        formik.errors.sourceConfigs?.bindDN &&
                        formik.touched.sourceConfigs?.bindDN
                      }
                      errorMessage={formik.errors.sourceConfigs?.bindDN}
                    />
                  </Col>
                  <Col sm={12}>
                    <GluuInputRow
                      label='fields.max_connections'
                      name='sourceConfigs.maxConnections'
                      value={formik.values.sourceConfigs?.maxConnections || ''}
                      formik={formik}
                      type='number'
                      lsize={3}
                      rsize={9}
                      required
                      showError={
                        formik.errors.sourceConfigs?.maxConnections &&
                        formik.touched.sourceConfigs?.maxConnections
                      }
                      errorMessage={formik.errors.sourceConfigs?.maxConnections}
                    />
                  </Col>
                  <Col sm={12}>
                    <Row>
                      <GluuLabel required label='fields.server_port' size={3} />
                      <Col sm={9}>
                        <GluuProperties
                          compName='sourceConfigs.servers'
                          isInputLables={true}
                          formik={formik}
                          options={
                            formik.values.sourceConfigs?.servers
                              ? formik.values.sourceConfigs?.servers.map(
                                  (item) => ({
                                    key: '',
                                    value: item,
                                  }),
                                )
                              : []
                          }
                          isKeys={false}
                          buttonText='actions.add_server'
                          showError={
                            formik.errors.sourceConfigs?.servers &&
                            formik.touched.sourceConfigs?.servers
                          }
                          errorMessage={formik.errors.sourceConfigs?.servers}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={12}>
                    <Row className='mt-4'>
                      <GluuLabel required label='fields.base_dns' size={3} />
                      <Col sm={9}>
                        <GluuProperties
                          compName='sourceConfigs.baseDNs'
                          isInputLables={true}
                          formik={formik}
                          options={
                            formik.values.sourceConfigs?.baseDNs
                              ? formik.values.sourceConfigs?.baseDNs.map(
                                  (item) => ({
                                    key: '',
                                    value: item,
                                  }),
                                )
                              : []
                          }
                          isKeys={false}
                          buttonText='actions.add_base_dn'
                          showError={
                            formik.errors.sourceConfigs?.baseDNs &&
                            formik.touched.sourceConfigs?.baseDNs
                          }
                          errorMessage={formik.errors.sourceConfigs?.baseDNs}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Row>
                    <Col sm={2} className='mt-3'>
                      <Button
                        type='button'
                        color={`primary-${selectedTheme}`}
                        className='theme-config__trigger mt-3'
                        onClick={toggle}
                      >
                        {t('actions.change_bind_password')}
                      </Button>
                    </Col>
                  </Row>
                  <Col sm={8} className='mt-3'>
                    <GluuToogleRow
                      label='fields.use_ssl'
                      name='useSSL'
                      handler={(e) => {
                        formik.setFieldValue(
                          'sourceConfigs.useSSL',
                          e.target.checked,
                        )
                      }}
                      lsize={4}
                      rsize={8}
                      value={formik.values.sourceConfigs?.useSSL}
                      doc_category='jans_link'
                    />
                  </Col>
                  <Col sm={8} className='mt-3'>
                    <GluuToogleRow
                      label='fields.enable'
                      name='enabled'
                      handler={(e) => {
                        formik.setFieldValue(
                          'sourceConfigs.enabled',
                          e.target.checked,
                        )
                      }}
                      lsize={4}
                      rsize={8}
                      value={formik.values.sourceConfigs?.enabled}
                      doc_category='jans_link'
                    />
                  </Col>
                </>
              </FormGroup>
              <Row>
                <Col>
                  <GluuCommitFooter
                    hideButtons={{ save: true, back: false }}
                    type='submit'
                    saveHandler={toggleAudit}
                  />
                </Col>
              </Row>
              {modal && (
                <BindPasswordModal
                  handleChangePassword={handleChangePassword}
                  handler={toggle}
                  isOpen={modal}
                />
              )}
            </Form>
          </CardBody>
        </Card>
        <GluuCommitDialog
          handler={toggleAudit}
          modal={auditModal}
          onAccept={submitForm}
          formik={formik}
        />
      </GluuLoader>
    </>
  )
}

export default SourceBackendServerForm
