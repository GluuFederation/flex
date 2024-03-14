import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import * as Yup from 'yup'
import { buildPayload } from 'Utils/PermChecker'
import { isEmpty } from 'lodash'
import { putConfiguration } from 'Plugins/jans-kc-link/redux/features/JansKcLinkSlice'
import { useFormik } from 'formik'
import { Row, Col, Form, FormGroup } from 'Components'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import {
  convertToStringArray,
  isStringsArray,
} from 'Plugins/jans-link/components/SourceBackendServers/SourceBackendServerForm'

const TargetConfiguration = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const configuration = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )
  const userAction = {}
  const [modal, setModal] = useState(false)
  const toggle = () => {
    setModal(!modal)
  }

  const { targetConfig = {} } = useSelector(
    (state) => state.jansKcLinkReducer.configuration
  )

  const {
    bindDN = '',
    configId = '',
    bindPassword,
    maxConnections = 0,
    baseDNs = [],
    servers = [],
    useAnonymousBind = false,
    useSSL = false,
    enabled = false,
    localPrimaryKey = '',
    primaryKey = '',
  } = targetConfig

  const initialValues = {
    targetConfig: {
      bindDN,
      configId,
      bindPassword,
      maxConnections,
      baseDNs,
      servers,
      useAnonymousBind,
      useSSL,
      enabled,
      localPrimaryKey,
      primaryKey,
    },
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object({
      targetConfig: Yup.object().shape({
        configId: Yup.string()
          .min(2, 'Mininum 2 characters')
          .required(`${t('fields.name')} ${t('messages.is_required')}`),
        bindDN: Yup.string()
          .min(2, 'Mininum 2 characters')
          .required(`${t('fields.bind_dn')} ${t('messages.is_required')}`),
        maxConnections: Yup.string().required(
          `${t('fields.max_connections')} ${t('messages.is_required')}`
        ),
        bindPassword: Yup.string().required(
          `${t('fields.bind_password')} ${t('messages.is_required')}`
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
    onSubmit: () => {
      if (isEmpty(formik.errors)) {
        toggle()
      }
    },
  })

  const submitForm = (userMessage) => {
    toggle()
    const baseDNs = isStringsArray(formik.values.targetConfig.baseDNs || [])
      ? formik.values.targetConfig.baseDNs
      : convertToStringArray(formik.values?.targetConfig.baseDNs || [])
    const servers = isStringsArray(formik.values.targetConfig.servers || [])
      ? formik.values.targetConfig.servers
      : convertToStringArray(formik.values?.targetConfig.servers || [])

    buildPayload(userAction, userMessage, {
      appConfiguration4: {
        ...configuration,
        targetConfig: {
          ...formik.values.targetConfig,
          servers: servers,
          baseDNs: baseDNs,
        },
      },
    })

    dispatch(putConfiguration({ action: userAction }))
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
          <GluuInputRow
            label='fields.name'
            name='targetConfig.configId'
            value={formik.values.targetConfig?.configId}
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
            value={formik.values.targetConfig?.bindDN}
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
            label='fields.bind_password'
            name='targetConfig.bindPassword'
            value={formik.values.targetConfig?.bindPassword}
            formik={formik}
            lsize={3}
            rsize={9}
            type='password'
            required
            showError={
              formik.errors.targetConfig?.bindPassword &&
              formik.touched.targetConfig?.bindPassword
            }
            errorMessage={formik.errors.targetConfig?.bindPassword}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.max_connections'
            name='targetConfig.maxConnections'
            value={formik.values.targetConfig?.maxConnections}
            formik={formik}
            lsize={3}
            rsize={9}
            type='number'
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
                    ? formik.values.targetConfig?.servers.map((item) => ({
                        key: '',
                        value: item,
                      }))
                    : []
                }
                isKeys={false}
                buttonText='actions.add_server'
                showError={
                  formik.errors.targetConfig?.servers &&
                  formik.touched.targetConfig?.servers
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
                  formik.errors.targetConfig?.baseDNs &&
                  formik.touched.targetConfig?.baseDNs
                    ? true
                    : false
                }
                errorMessage={formik.errors.targetConfig?.baseDNs}
              />
            </Col>
          </Row>
        </Col>
        <Col sm={12} className='mt-4'>
          <GluuInputRow
            label='fields.primary_key'
            name='targetConfig.primaryKey'
            value={formik.values.targetConfig?.primaryKey}
            formik={formik}
            lsize={3}
            rsize={9}
          />
        </Col>
        <Col sm={12}>
          <GluuInputRow
            label='fields.local_primary_key'
            name='targetConfig.localPrimaryKey'
            value={formik.values.targetConfig?.localPrimaryKey}
            formik={formik}
            lsize={3}
            rsize={9}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label='fields.use_anonymous_bind'
            name='targetConfig.useAnonymousBind'
            handler={(e) => {
              formik.setFieldValue(
                'targetConfig.useAnonymousBind',
                e.target.checked
              )
            }}
            lsize={3}
            rsize={9}
            value={formik.values.targetConfig.useAnonymousBind}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label='fields.use_ssl'
            name='targetConfig.useSSL'
            handler={(e) => {
              formik.setFieldValue('targetConfig.useSSL', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.targetConfig.useSSL}
          />
        </Col>
        <Col sm={12}>
          <GluuToogleRow
            label='fields.enabled'
            name='targetConfig.enabled'
            handler={(e) => {
              formik.setFieldValue('targetConfig.enabled', e.target.checked)
            }}
            lsize={3}
            rsize={9}
            value={formik.values.targetConfig.enabled}
          />
        </Col>
      </FormGroup>

      <Row>
        <Col>
          <GluuCommitFooter
            hideButtons={{ save: true, back: false }}
            type='submit'
            saveHandler={toggle}
          />
        </Col>
      </Row>
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
        feature='jans_kc_link_write'
      />
    </Form>
  )
}

export default TargetConfiguration
