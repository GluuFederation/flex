import React, { useContext, useEffect, useState } from 'react'
import { ThemeContext } from 'Context/theme/themeContext'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup } from 'Components'
import { Button } from 'Components'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { Box } from '@mui/material'
import BindPasswordModal from '../CacheRefresh/BindPasswordModal'
import GluuCheckBoxRow from 'Routes/Apps/Gluu/GluuCheckBoxRow'
import * as Yup from 'yup'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { isEmpty } from 'lodash'
import { putCacheRefreshConfiguration } from 'Plugins/cache-refresh/redux/features/CacheRefreshSlice'
import { useTranslation } from 'react-i18next'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { buildPayload } from 'Utils/PermChecker'
import {
  testLdap,
  resetTestLdap,
} from 'Plugins/services/redux/features/ldapSlice'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { updateToast } from 'Redux/features/toastSlice'

const isStringsArray = (arr) => arr.every((i) => typeof i === 'string')
const convertToStringArray = (arr) => {
  return arr.map((item) => item.value)
}

const SourceBackendServersTab = () => {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const dispatch = useDispatch()
  const cacheRefreshConfiguration = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  )
  const { sourceConfigs } = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  )
  const loading = useSelector((state) => state.ldapReducer.loading)
  const sourceConfig = sourceConfigs?.[0] || {}
  const { testStatus } = useSelector((state) => state.ldapReducer)
  const [testRunning, setTestRunning] = useState(false)

  const [addSourceLdapServer, setAddSourceLdapServer] = useState(
    sourceConfig?.enabled || false
  )
  const userAction = {}
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const [auditModal, setAuditModal] = useState(false)
  const toggleAudit = () => {
    setAuditModal(!modal)
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
        `${t('fields.max_connections')} ${t('messages.is_required')}`
      ),
      servers: Yup.array().min(
        1,
        `${t('fields.server_port')} ${t('messages.is_required')}`
      ),
      baseDNs: Yup.array().min(
        1,
        `${t('fields.base_dns')} ${t('messages.is_required')}`
      ),
    }),
  })

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: addSourceLdapServer && validationSchema,
    setFieldValue: (field) => {
      delete values[field]
    },
    onSubmit: (data) => {
      if (isEmpty(formik.errors)) {
        toggleAudit()
      }
    },
  })

  const submitForm = (userMessage) => {
    toggleAudit()

    buildPayload(userAction, userMessage, {
      cacheRefreshConfiguration: {
        ...cacheRefreshConfiguration,
        sourceConfigs: [
          {
            ...formik.values.sourceConfigs,
            baseDNs: isStringsArray(formik.values.sourceConfigs.baseDNs || [])
              ? formik.values.sourceConfigs.baseDNs
              : convertToStringArray(
                  formik.values?.sourceConfigs.baseDNs || []
                ),
            servers: isStringsArray(formik.values.sourceConfigs.servers || [])
              ? formik.values.sourceConfigs.servers
              : convertToStringArray(
                  formik.values?.sourceConfigs.servers || []
                ),
          },
        ],
      },
    })

    dispatch(putCacheRefreshConfiguration({ action: userAction }))
  }

  const handleRemoveServer = () => {
    setAddSourceLdapServer(false)
    formik.setFieldValue('sourceConfigs.enabled', false)
  }

  const handleAddServer = () => {
    formik.setFieldValue('sourceConfigs.enabled', true)
    setAddSourceLdapServer(true)
  }

  const handleChangePassword = (updatedPassword) => {
    buildPayload(userAction, 'CHANGE SOURCE BACKEND BIND PASSWORD', {
      cacheRefreshConfiguration: {
        ...cacheRefreshConfiguration,
        sourceConfigs: [
          {
            ...formik.values.sourceConfigs,
            bindPassword: updatedPassword,
          },
        ],
      },
    })

    dispatch(putCacheRefreshConfiguration({ action: userAction }))
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
      dispatch(updateToast(true, 'success', `${t('messages.ldap_connection_success')}`))
    } else {
      dispatch(updateToast(true, 'error', `${t('messages.ldap_connection_error')}`))
    }
  }, [testStatus])

  return (
    <>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
        className='mt-4'
      >
        <GluuLoader blocking={loading}>
          <FormGroup row>
            <Box
              className='mb-3'
              display='flex'
              justifyContent={'space-between'}
            >
              <Box>
                {!addSourceLdapServer && (
                  <Button onClick={handleAddServer}>
                    {t('actions.add_source_ldap_server')}
                  </Button>
                )}
                {addSourceLdapServer && (
                  <Button color='danger' onClick={handleRemoveServer}>
                    <i className='fa fa-remove me-2'></i>
                    {t('actions.remove_source_server')}
                  </Button>
                )}
              </Box>
              {addSourceLdapServer && (
                <Button
                  color={`primary-${selectedTheme}`}
                  onClick={checkLdapConnection}
                >
                  {t('fields.test')}
                </Button>
              )}
            </Box>
            {addSourceLdapServer && (
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
                        ? true
                        : false
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
                        ? true
                        : false
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
                        ? true
                        : false
                    }
                    errorMessage={formik.errors.sourceConfigs?.maxConnections}
                  />
                </Col>
                <Col sm={12}>
                  <Row>
                    <GluuLabel required label='fields.change_attribute_name_from_source_to_estination' size={3} />
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
                                })
                              )
                            : []
                        }
                        isKeys={false}
                        buttonText='actions.add_server'
                        showError={
                          formik.errors.sourceConfigs?.servers &&
                          formik.touched.sourceConfigs?.servers
                            ? true
                            : false
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
                                })
                              )
                            : []
                        }
                        isKeys={false}
                        buttonText='actions.add_base_dn'
                        showError={
                          formik.errors.sourceConfigs?.baseDNs &&
                          formik.touched.sourceConfigs?.baseDNs
                            ? true
                            : false
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
                  <GluuCheckBoxRow
                    label='fields.use_ssl'
                    name='sourceConfigs.useSSL'
                    required
                    handleOnChange={(e) => {
                      formik.setFieldValue(
                        'sourceConfigs.useSSL',
                        e.target.checked
                      )
                    }}
                    lsize={4}
                    rsize={8}
                    value={formik.values.sourceConfigs?.useSSL}
                  />
                </Col>
              </>
            )}
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
        </GluuLoader>
      </Form>
      <GluuCommitDialog
        handler={toggleAudit}
        modal={auditModal}
        onAccept={submitForm}
        formik={formik}
      />
    </>
  )
}

export default SourceBackendServersTab
