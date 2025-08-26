import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { buildPayload } from 'Utils/PermChecker'
import { Col, Form, FormGroup, Input } from 'Components'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'

function LdapForm({ ldapConfig, handleSubmit }) {
  const { t } = useTranslation()
  const validationSchema = Yup.object().shape({
    configId: Yup.string().required(t('fields.acr') + ' is required!'),
    bindDN: Yup.string().required(t('fields.bind_dn') + ' is required!'),
    bindPassword: Yup.string().required(t('fields.bind_password') + ' is required!'),
    servers: Yup.string().required(t('fields.remote_ldap_server') + ' is required!'),
    maxConnections: Yup.number()
      .typeError(t('fields.max_connections') + ' must be a number')
      .required(t('fields.max_connections') + ' is required!'),
    baseDNs: Yup.string().required(t('fields.base_dns') + ' is required!'),
    primaryKey: Yup.string().required(t('fields.remote_primary_key') + ' is required!'),
    localPrimaryKey: Yup.string().required(t('fields.local_primary_key') + ' is required!'),
    level: Yup.number()
      .typeError(t('fields.level') + ' must be a number')
      .required(t('fields.level') + ' is required!'),
    defaultAuthnMethod: Yup.string().required(t('fields.default_authn_method') + ' is required!'),
  })

  const formik = useFormik({
    initialValues: {
      configId: ldapConfig.configId ?? '',
      bindDN: ldapConfig.bindDN ?? '',
      bindPassword: ldapConfig.bindPassword ?? '',
      servers: Array.isArray(ldapConfig.servers)
        ? ldapConfig.servers.join(', ')
        : (ldapConfig.servers ?? ''),
      maxConnections: ldapConfig.maxConnections ?? '',
      useSSL: !!ldapConfig.useSSL,
      baseDNs: Array.isArray(ldapConfig.baseDNs)
        ? ldapConfig.baseDNs.join(', ')
        : (ldapConfig.baseDNs ?? ''),
      primaryKey: ldapConfig.primaryKey ?? '',
      localPrimaryKey: ldapConfig.localPrimaryKey ?? '',
      useAnonymousBind: !!ldapConfig.useAnonymousBind,
      enabled: !!ldapConfig.enabled,
      version: ldapConfig.version !== undefined ? ldapConfig.version : 0,
      level: ldapConfig.level !== undefined ? ldapConfig.level : '',
      defaultAuthnMethod: ldapConfig.defaultAuthnMethod ?? '',
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const serversArr = values.servers
        ? values.servers
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []
      const baseDNsArr = values.baseDNs
        ? values.baseDNs
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : []
      const userAction = {}
      const payload = {
        gluuLdapConfiguration: {
          configId: values.configId,
          bindDN: values.bindDN,
          bindPassword: values.bindPassword,
          servers: serversArr,
          maxConnections: Number(values.maxConnections),
          useSSL: !!values.useSSL,
          baseDNs: baseDNsArr,
          primaryKey: values.primaryKey || values.localPrimaryKey,
          localPrimaryKey: values.localPrimaryKey,
          useAnonymousBind: !!values.useAnonymousBind,
          enabled: !!values.enabled,
          version: values.version !== undefined ? Number(values.version) : 0,
          level: values.level !== undefined ? Number(values.level) : 0,
          defaultAuthnMethod: values.defaultAuthnMethod,
        },
      }

      console.log('payload in ldap', payload)

      if (window.buildPayload) {
        window.buildPayload(userAction, '', payload)
      } else if (typeof buildPayload === 'function') {
        buildPayload(userAction, '', payload)
      } else {
        Object.assign(userAction, payload)
      }
      handleSubmit({ data: userAction })
    },
  })

  return (
    <Form onSubmit={formik.handleSubmit} autoComplete="off">
      <FormGroup row>
        <GluuLabel label="fields.acr" size={4} required />
        <Col sm={8}>
          <Input
            name="configId"
            value={formik.values.configId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.acr')}
            invalid={formik.touched.configId && !!formik.errors.configId}
          />
          {formik.touched.configId && formik.errors.configId && (
            <div style={{ color: 'red' }}>{formik.errors.configId}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.level" size={4} required />
        <Col sm={8}>
          <Input
            type="number"
            name="level"
            id="level"
            value={formik.values.level}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            min={1}
            step={1}
            placeholder={t('placeholders.level')}
            invalid={formik.touched.level && !!formik.errors.level}
          />
          {formik.touched.level && formik.errors.level && (
            <div style={{ color: 'red' }}>{formik.errors.level}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.default_authn_method" size={4} required />
        <Col sm={8}>
          <Input
            type="select"
            name="defaultAuthnMethod"
            id="defaultAuthnMethod"
            value={formik.values.defaultAuthnMethod}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            invalid={formik.touched.defaultAuthnMethod && !!formik.errors.defaultAuthnMethod}
          >
            <option value="true">True</option>
            <option value="false">False</option>
          </Input>
          {formik.touched.defaultAuthnMethod && formik.errors.defaultAuthnMethod && (
            <div style={{ color: 'red' }}>{formik.errors.defaultAuthnMethod}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.bind_dn" size={4} required />
        <Col sm={8}>
          <Input
            name="bindDN"
            value={formik.values.bindDN}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.bind_dn')}
            invalid={formik.touched.bindDN && !!formik.errors.bindDN}
          />
          {formik.touched.bindDN && formik.errors.bindDN && (
            <div style={{ color: 'red' }}>{formik.errors.bindDN}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.max_connections" size={4} required />
        <Col sm={8}>
          <Input
            name="maxConnections"
            value={formik.values.maxConnections}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.max_connections')}
            invalid={formik.touched.maxConnections && !!formik.errors.maxConnections}
          />
          {formik.touched.maxConnections && formik.errors.maxConnections && (
            <div style={{ color: 'red' }}>{formik.errors.maxConnections}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.local_primary_key" size={4} required />
        <Col sm={8}>
          <Input
            name="localPrimaryKey"
            value={formik.values.localPrimaryKey}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.local_primary_key')}
            invalid={formik.touched.localPrimaryKey && !!formik.errors.localPrimaryKey}
          />
          {formik.touched.localPrimaryKey && formik.errors.localPrimaryKey && (
            <div style={{ color: 'red' }}>{formik.errors.localPrimaryKey}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.remote_primary_key" size={4} required />
        <Col sm={8}>
          <Input
            name="primaryKey"
            value={formik.values.primaryKey}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.remote_primary_key')}
            invalid={formik.touched.primaryKey && !!formik.errors.primaryKey}
          />
          {formik.touched.primaryKey && formik.errors.primaryKey && (
            <div style={{ color: 'red' }}>{formik.errors.primaryKey}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Remote LDAP Server" size={4} required />
        <Col sm={8}>
          <Input
            name="servers"
            value={formik.values.servers}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.remote_ldap_server')}
            invalid={formik.touched.servers && !!formik.errors.servers}
          />
          {formik.touched.servers && formik.errors.servers && (
            <div style={{ color: 'red' }}>{formik.errors.servers}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.base_dns" size={4} required />
        <Col sm={8}>
          <Input
            name="baseDNs"
            value={formik.values.baseDNs}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.base_dns')}
            invalid={formik.touched.baseDNs && !!formik.errors.baseDNs}
          />
          {formik.touched.baseDNs && formik.errors.baseDNs && (
            <div style={{ color: 'red' }}>{formik.errors.baseDNs}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Bind password" size={4} required />
        <Col sm={8}>
          <Input
            name="bindPassword"
            value={formik.values.bindPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.bind_password')}
            invalid={formik.touched.bindPassword && !!formik.errors.bindPassword}
          />
          {formik.touched.bindPassword && formik.errors.bindPassword && (
            <div style={{ color: 'red' }}>{formik.errors.bindPassword}</div>
          )}
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuToogleRow
          label="Use SSL"
          name="useSSL"
          formik={formik}
          value={formik.values.useSSL}
          handler={() => formik.setFieldValue('useSSL', !formik.values.useSSL)}
        />
      </FormGroup>
      <FormGroup row>
        <GluuToogleRow
          label="Enabled"
          name="enabled"
          formik={formik}
          value={formik.values.enabled}
          handler={() => formik.setFieldValue('enabled', !formik.values.enabled)}
        />
      </FormGroup>
      <GluuCommitFooter
        saveHandler={formik.handleSubmit}
        hideButtons={{ save: true }}
        type="submit"
      />
    </Form>
  )
}

export default LdapForm
