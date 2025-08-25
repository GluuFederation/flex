import React, { useState } from 'react'
import { Col, Form, FormGroup, Input } from 'Components'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'

function LdapForm({ ldapConfig, handleSubmit, modifiedFields, setModifiedFields }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(ldapConfig)

  function onChange(e) {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setModifiedFields && setModifiedFields({ ...modifiedFields, [name]: true })
  }

  function onSubmit(e) {
    e.preventDefault()
    handleSubmit(form)
  }

  return (
    <Form onSubmit={onSubmit} autoComplete="off">
      <FormGroup row>
        <GluuLabel label="fields.acr" size={4} required />
        <Col sm={8}>
          <Input
            name="configId"
            value={form.configId}
            onChange={onChange}
            required
            style={{ width: '100%' }}
            placeholder={t('placeholders.acr')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.level" size={4} required />
        <Col sm={8}>
          <Input
            type="number"
            name="level"
            id="level"
            value={form.level}
            onChange={onChange}
            required
            style={{ width: '100%' }}
            min={1}
            step={1}
            placeholder={t('placeholders.level')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.default_authn_method" size={4} required />
        <Col sm={8}>
          <Input
            type="select"
            name="defaultAuthnMethod"
            id="defaultAuthnMethod"
            value={form.defaultAuthnMethod}
            onChange={onChange}
            required
            style={{ width: '100%' }}
          >
            <option value="">{t('placeholders.default_authn_method')}</option>
            <option value="simple">Simple</option>
            <option value="saml">SAML</option>
            <option value="oauth">OAuth</option>
            <option value="openid">OpenID</option>
          </Input>
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.bind_dn" size={4} />
        <Col sm={8}>
          <Input
            name="bindDN"
            value={form.bindDN}
            onChange={onChange}
            style={{ width: '100%' }}
            placeholder={t('placeholders.bind_dn')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.max_connections" size={4} />
        <Col sm={8}>
          <Input
            name="maxConnections"
            value={form.maxConnections}
            onChange={onChange}
            style={{ width: '100%' }}
            placeholder={t('placeholders.max_connections')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.local_primary_key" size={4} />
        <Col sm={8}>
          <Input
            name="localPrimaryKey"
            value={form.localPrimaryKey}
            onChange={onChange}
            style={{ width: '100%' }}
            placeholder={t('placeholders.local_primary_key')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.remote_primary_key" size={4} />
        <Col sm={8}>
          <Input
            name="remotePrimaryKey"
            value={form.remotePrimaryKey}
            onChange={onChange}
            style={{ width: '100%' }}
            placeholder={t('placeholders.remote_primary_key')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Remote LDAP Server" size={4} />
        <Col sm={8}>
          <Input
            name="remoteLdapServer"
            value={form.remoteLdapServer}
            onChange={onChange}
            style={{ width: '100%' }}
            placeholder={t('placeholders.remote_ldap_server')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="fields.base_dns" size={4} />
        <Col sm={8}>
          <Input
            name="baseDNs"
            value={form.baseDNs}
            onChange={onChange}
            style={{ width: '100%' }}
            placeholder={t('placeholders.base_dns')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuLabel label="Bind password" size={4} />
        <Col sm={8}>
          <Input
            name="bindPassword"
            value={form.bindPassword}
            onChange={onChange}
            style={{ width: '100%' }}
            placeholder={t('placeholders.bind_password')}
          />
        </Col>
      </FormGroup>
      <FormGroup row>
        <GluuToogleRow
          label="Enabled"
          name="enabled"
          formik={{
            values: { enabled: form.enabled },
            setFieldValue: (field, value) => setForm((prev) => ({ ...prev, [field]: value })),
          }}
          value={form.enabled}
          handler={(e) => setForm((prev) => ({ ...prev, enabled: e.target.checked }))}
        />
      </FormGroup>
      <GluuCommitFooter saveHandler={onSubmit} hideButtons={{ save: true }} type="submit" />
    </Form>
  )
}

export default LdapForm
