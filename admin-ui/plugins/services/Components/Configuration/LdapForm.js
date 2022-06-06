import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Col,
  InputGroup,
  Form,
  FormGroup,
  Input,
} from 'Components'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'

import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import { LDAP } from 'Utils/ApiResources'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'

function LdapForm({ item, handleSubmit }) {
  const { t } = useTranslation()
  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)

  function toogle() {
    if (!init) {
      setInit(true)
    }
  }
  function toggle() {
    setModal(!modal)
  }
  function submitForm() {
    toggle()
    document.getElementsByClassName('UserActionSubmitButton')[0].click()
  }
  const formik = useFormik({
    initialValues: {
      configId: item.configId,
      bindDN: item.bindDN,
      bindPassword: item.bindPassword,
      servers: item.servers,
      maxConnections: item.maxConnections,
      useSSL: item.useSSL,
      baseDNs: item.baseDNs,
      primaryKey: item.primaryKey,
      localPrimaryKey: item.localPrimaryKey,
      enabled: item.enabled,
    },
    validationSchema: Yup.object({
      configId: Yup.string()
        .min(2, 'Mininum 2 characters')
        .required('Required!'),
      bindDN: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      bindPassword: Yup.string()
        .min(2, 'Mininum 2 characters')
        .required('Required!'),
      servers: Yup.array().required('Required!'),
      maxConnections: Yup.number()
        .required()
        .positive()
        .integer()
        .required('Required!'),
      baseDNs: Yup.array().required('Required!'),
      primaryKey: Yup.string()
        .min(2, 'Mininum 2 characters')
        .required('Required!'),
      localPrimaryKey: Yup.string()
        .min(2, 'Mininum 2 characters')
        .required('Required!'),
    }),
    onSubmit: (values) => {
      values.servers = values.servers.map((ele) =>
        !!ele.servers ? ele.servers : ele,
      )
      values.baseDNs = values.baseDNs.map((ele) =>
        !!ele.baseDNs ? ele.baseDNs : ele,
      )

      const result = Object.assign(item, values)
      const reqBody = { ldap: result }
      handleSubmit(reqBody)
    },
  })
  return (
    <Form onSubmit={formik.handleSubmit}>
      <GluuTooltip doc_category={LDAP} doc_entry="configId">
        <FormGroup row>
          <GluuLabel label="fields.name" required />
          <Col sm={9}>
            {!!item.configId ? (
              <Input
                valid={
                  !formik.errors.configId && !formik.touched.configId && init
                }
                placeholder={t('placeholders.ldap_name')}
                id="configId"
                name="configId"
                defaultValue={item.configId}
                disabled
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            ) : (
              <Input
                valid={
                  !formik.errors.configId && !formik.touched.configId && init
                }
                placeholder={t('placeholders.ldap_name')}
                id="configId"
                name="configId"
                defaultValue={item.configId}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            )}
            {formik.errors.configId && formik.touched.configId ? (
              <div style={{ color: 'red' }}>{formik.errors.configId}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="bind_dn">
        <FormGroup row>
          <GluuLabel label="fields.bind_dn" required />
          <Col sm={9}>
            <Input
              placeholder={t('placeholders.ldap_bind_dn')}
              id="bindDN"
              valid={!formik.errors.bindDN && !formik.touched.bindDN && init}
              name="bindDN"
              defaultValue={item.bindDN}
              onKeyUp={toogle}
              onChange={formik.handleChange}
            />
            {formik.errors.bindDN && formik.touched.bindDN ? (
              <div style={{ color: 'red' }}>{formik.errors.bindDN}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="bind_password">
        <FormGroup row>
          <GluuLabel label="fields.bind_password" required />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.ldap_bind_password')}
                valid={
                  !formik.errors.bindPassword &&
                  !formik.touched.bindPassword &&
                  init
                }
                onKeyUp={toogle}
                id="bindPassword"
                type="password"
                defaultValue={item.bindPassword}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.bindPassword && formik.touched.bindPassword ? (
              <div style={{ color: 'red' }}>{formik.errors.bindPassword}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="servers">
        <FormGroup row>
          <Col sm={9}>
            <GluuTypeAhead
              name="servers"
              label="fields.servers"
              formik={formik}
              required={true}
              options={['localhost:1636']}
              value={item.servers}
              valid={!formik.errors.servers && !formik.touched.servers && init}
              onKeyUp={toogle}
            ></GluuTypeAhead>

            {formik.errors.servers && formik.touched.servers ? (
              <div style={{ color: 'red' }}>{formik.errors.servers}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="max_connections">
        <FormGroup row>
          <GluuLabel label="fields.max_connections" required />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.ldap_bind_max_connections')}
                valid={
                  !formik.errors.maxConnections &&
                  !formik.touched.maxConnections &&
                  init
                }
                id="maxConnections"
                onKeyUp={toogle}
                defaultValue={item.maxConnections}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.maxConnections && formik.touched.maxConnections ? (
              <div style={{ color: 'red' }}>{formik.errors.maxConnections}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="use_ssl">
        <FormGroup row>
          <GluuLabel label="fields.use_ssl" required />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.enable_ssl_communication')}
                valid={!formik.errors.useSSL && !formik.touched.useSSL && init}
                id="useSSL"
                type="checkbox"
                onKeyUp={toogle}
                defaultChecked={item.useSSL}
                onChange={formik.handleChange}
              />
            </InputGroup>
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="base_dns">
        <FormGroup row>
          <Col sm={9}>
            <GluuTypeAhead
              name="baseDNs"
              label="fields.base_dns"
              formik={formik}
              options={[]}
              required={true}
              onKeyUp={toogle}
              value={item.baseDNs}
            ></GluuTypeAhead>
            {formik.errors.baseDNs && formik.touched.baseDNs ? (
              <div style={{ color: 'red' }}>{formik.errors.baseDNs}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="primary_key">
        <FormGroup row>
          <GluuLabel label="fields.primary_key" required />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.ldap_primary_key')}
                valid={
                  !formik.errors.primaryKey && !formik.touched.primaryKey && init
                }
                id="primaryKey"
                onKeyUp={toogle}
                defaultValue={item.primaryKey}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.primaryKey && formik.touched.primaryKey ? (
              <div style={{ color: 'red' }}>{formik.errors.primaryKey}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="local_primary_key">
        <FormGroup row>
          <GluuLabel label="fields.local_primary_key" required />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.ldap_primary_key')}
                valid={
                  !formik.errors.localPrimaryKey &&
                  !formik.touched.localPrimaryKey &&
                  init
                }
                id="localPrimaryKey"
                onKeyUp={toogle}
                defaultValue={item.localPrimaryKey}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.localPrimaryKey && formik.touched.localPrimaryKey ? (
              <div style={{ color: 'red' }}>{formik.errors.localPrimaryKey}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={LDAP} doc_entry="activate">
        <FormGroup row>
          <GluuLabel label="fields.activate" />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.activate_ldap_configuration')}
                valid={!formik.errors.enabled && !formik.touched.enabled && init}
                type="checkbox"
                id="enabled"
                onKeyUp={toogle}
                defaultChecked={item.enabled}
                onChange={formik.handleChange}
              />
            </InputGroup>
          </Col>
        </FormGroup>
      </GluuTooltip>
      <FormGroup row>
        {' '}
        <Input
          type="hidden"
          id="moduleProperties"
          defaultValue={item.moduleProperties}
        />
      </FormGroup>
      <FormGroup row></FormGroup>
      <GluuCommitFooter saveHandler={toggle} />
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
      />
    </Form>
  )
}

export default LdapForm
