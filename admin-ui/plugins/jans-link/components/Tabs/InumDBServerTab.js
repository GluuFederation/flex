import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import { Row, Col, Form, FormGroup, Button } from 'Components'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { useDispatch, useSelector } from 'react-redux'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { t } from 'i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import BindPasswordModal from '../CacheRefresh/BindPasswordModal'
import * as Yup from 'yup'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import { isEmpty } from 'lodash'
import { putCacheRefreshConfiguration } from 'Plugins/jans-link/redux/features/CacheRefreshSlice'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { buildPayload } from 'Utils/PermChecker'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'

const isStringsArray = (arr) => arr.every((i) => typeof i === 'string')
const convertToStringArray = (arr) => {
  return arr.map((item) => item.value)
}

const InumDBServerTab = () => {
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const dispatch = useDispatch()
  const cacheRefreshConfiguration = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  )
  const { defaultInumServer, targetConfig } = useSelector(
    (state) => state.cacheRefreshReducer.configuration
  )
  const userAction = {}
  const initialValues = {
    defaultInumServer: defaultInumServer || false,
    targetConfig: {
      ...targetConfig,
      servers: targetConfig?.servers || [],
      baseDNs: targetConfig?.baseDNs || [],
      bindPassword: targetConfig?.bindPassword || null,
      configId: targetConfig?.configId || null,
      bindDN: targetConfig?.bindDN || null
    },
  }

  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const [auditModal, setAuditModal] = useState(false)
  const toggleAudit = () => {
    setAuditModal(!auditModal)
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      defaultInumServer: Yup.boolean(),
      targetConfig: Yup.object()
        .shape()
        .when('defaultInumServer', {
          is: false,
          then: () =>
            Yup.object({
              configId: Yup.string().min(2, 'Mininum 2 characters').required(
                `${t('fields.name')} ${t('messages.is_required')}`
              ),
              bindDN: Yup.string().min(2, 'Mininum 2 characters').required(
                `${t('fields.bind_dn')} ${t('messages.is_required')}`
              ),
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
        }),
    }),
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
      appConfiguration2: {
        ...cacheRefreshConfiguration,
        targetConfig: {
          ...formik.values.targetConfig,
          baseDNs: isStringsArray(formik.values?.targetConfig?.baseDNs || [])
            ? formik.values.targetConfig.baseDNs
            : convertToStringArray(formik.values?.targetConfig.baseDNs || []),
          servers: isStringsArray(formik.values?.targetConfig?.servers || [])
            ? formik.values.targetConfig.servers
            : convertToStringArray(formik.values?.targetConfig?.servers || []),
        },
        defaultInumServer: formik.values.defaultInumServer,
      },
    })

    dispatch(
      putCacheRefreshConfiguration({ action: userAction })
    ) 
  }

  const handleChangePassword = (updatedPassword) => {
    buildPayload(userAction, 'CHANGE INUMDB BIND PASSWORD', {
      appConfiguration2: {
        ...cacheRefreshConfiguration,
        targetConfig: {
          ...formik.values.targetConfig,
          baseDNs: isStringsArray(formik.values?.targetConfig?.baseDNs || [])
          ? formik.values.targetConfig.baseDNs
          : convertToStringArray(formik.values?.targetConfig?.baseDNs || []),
          servers: isStringsArray(formik.values?.targetConfig?.servers || [])
            ? formik.values.targetConfig.servers
            : convertToStringArray(formik.values?.targetConfig?.servers || []),
          bindPassword: updatedPassword,
        },
      },
    })

    dispatch(
      putCacheRefreshConfiguration({ action: userAction })
    )
  }

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        formik.handleSubmit()
      }}
      className='mt-4'
    >
      <FormGroup row>
        <Col sm={12}>
          <GluuToogleRow
            label='fields.default_inum_server'
            name='defaultInumServer'
            handler={(e) => {
              formik.setFieldValue('defaultInumServer', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.defaultInumServer}
            doc_category={null}
          />
        </Col>
        {!formik.values.defaultInumServer && (
          <>
            <Col sm={12}>
              <GluuInputRow
                label='fields.name'
                name='targetConfig.configId'
                value={formik.values.targetConfig?.configId || ''}
                formik={formik}
                lsize={3}
                rsize={9}
                required
                showError={
                  formik.errors.targetConfig?.configId &&
                  formik.touched.targetConfig?.configId
                }
                errorMessage={formik.errors.targetConfig?.configId}
              />
            </Col>
            <Col sm={12}>
              <GluuInputRow
                label='fields.bind_dn'
                name='targetConfig.bindDN'
                value={formik.values.targetConfig?.bindDN || ''}
                formik={formik}
                lsize={3}
                rsize={9}
                required
                showError={
                  formik.errors.targetConfig?.bindDN &&
                  formik.touched.targetConfig?.bindDN
                }
                errorMessage={formik.errors.targetConfig?.bindDN}
              />
            </Col>
            <Col sm={12}>
              <GluuInputRow
                label='fields.max_connections'
                name='targetConfig.maxConnections'
                value={formik.values.targetConfig?.maxConnections || ''}
                formik={formik}
                type='number'
                lsize={3}
                rsize={9}
                required
                showError={
                  formik.errors.targetConfig?.maxConnections &&
                  formik.touched.targetConfig?.maxConnections
                }
                errorMessage={formik.errors.targetConfig?.maxConnections}
              />
            </Col>
            <Col sm={12}>
              <Row>
                <GluuLabel required label='fields.server_port' size={3} />
                <Col sm={9}>
                  <GluuProperties
                    compName='targetConfig.servers'
                    isInputLables={true}
                    formik={formik}
                    options={
                      formik.values.targetConfig?.servers
                        ? formik.values.targetConfig?.servers?.map((item) => ({
                            key: '',
                            value: item,
                          }))
                        : []
                    }
                    isKeys={false}
                    buttonText='actions.add_server'
                    showError={
                      formik.errors.targetConfig?.servers && formik.touched.targetConfig?.servers ? true : false
                    }
                    errorMessage={formik.errors.targetConfig?.servers}
                  />
                </Col>
              </Row>
            </Col>
            <Col sm={12}>
              <Row className='mt-4'>
                <GluuLabel required label='fields.base_dns' size={3} />
                <Col sm={9}>
                  <GluuProperties
                    compName='targetConfig.baseDNs'
                    isInputLables={true}
                    formik={formik}
                    options={
                      formik.values.targetConfig?.baseDNs
                        ? formik.values.targetConfig?.baseDNs?.map((item) => ({
                            key: '',
                            value: item,
                          }))
                        : []
                    }
                    isKeys={false}
                    buttonText='actions.add_base_dn'
                    showError={
                      formik.errors.targetConfig?.baseDNs && formik.touched.targetConfig?.baseDNs ? true : false
                    }
                    errorMessage={formik.errors.targetConfig?.baseDNs}
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
            <Col sm={12} className='mt-3'>
              <GluuToogleRow
                label='fields.use_ssl'
                name='useSSL'
                handler={(e) => {
                  formik.setFieldValue('targetConfig.useSSL', e.target.checked)
                }}
                lsize={3}
                rsize={9}
                value={formik.values.targetConfig?.useSSL}
                doc_category='jans_link'
              />
            </Col>
            <Col sm={12} className='mt-3'>
              <GluuToogleRow
                label='fields.enabled'
                name='enabled'
                handler={(e) => {
                  formik.setFieldValue('targetConfig.enabled', e.target.checked)
                }}
                lsize={3}
                rsize={9}
                value={formik.values.targetConfig?.enabled}
                doc_category='jans_link'
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
      <GluuCommitDialog
        handler={toggleAudit}
        modal={auditModal}
        onAccept={submitForm}
        formik={formik}
        feature={adminUiFeatures.jans_link_write}
      />
    </Form>
  )
}

export default InumDBServerTab
