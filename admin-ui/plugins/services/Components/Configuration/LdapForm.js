import React, { useContext, useState, useEffect } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Col, InputGroup, Form, FormGroup, Input } from 'Components'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuToogle from 'Routes/Apps/Gluu/GluuToogle'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { useTranslation } from 'react-i18next'
import GluuLoader from 'Routes/Apps/Gluu/GluuLoader'
import { LDAP } from 'Utils/ApiResources'
import { testLdap, resetTestLdap } from 'Plugins/services/redux/features/ldapSlice'
import { ThemeContext } from 'Context/theme/themeContext'
import { useDispatch, useSelector } from 'react-redux'
import { updateToast } from 'Redux/features/toastSlice'
import customColors from '@/customColors'

function LdapForm({ item, handleSubmit, createLdap }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  function toogle() {
    if (!init) {
      setInit(true)
    }
  }

  const loading = useSelector((state) => state.ldapReducer.loading)
  const testStatus = useSelector((state) => state.ldapReducer.testStatus)

  function toggle() {
    setModal(!modal)
  }
  function submitForm() {
    toggle()
    document.getElementsByClassName('UserActionSubmitButton')[0].click()
  }

  const handleCancel = () => {
    formik.resetForm()
    dispatch(resetTestLdap())
    setInit(false)
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
      level: item.level,
    },
    validationSchema: Yup.object({
      configId: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      bindDN: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      bindPassword: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      servers: Yup.array().required('Required!'),
      level: Yup.number().integer('Level should be integer.'),
      maxConnections: Yup.number().required().positive().integer().required('Required!'),
      baseDNs: Yup.array().required('Required!'),
      primaryKey: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      localPrimaryKey: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
    }),
    onSubmit: (values) => {
      values.servers = values.servers.map((ele) => (ele.servers ? ele.servers : ele))
      values.baseDNs = values.baseDNs.map((ele) => (ele.baseDNs ? ele.baseDNs : ele))

      const result = Object.assign(item, values)
      handleSubmit(createLdap ? { ldap: result } : result)
    },
  })

  function checkLdapConnection() {
    const testPromise = new Promise(function (resolve) {
      dispatch(resetTestLdap())
      resolve()
    })

    testPromise.then(() => {
      dispatch(testLdap({ data: formik.values }))
    })
  }

  useEffect(() => {
    dispatch(resetTestLdap())
  }, [])

  useEffect(() => {
    if (testStatus === null) {
      return
    }

    if (testStatus) {
      dispatch(updateToast(true, 'success', `${t('messages.ldap_connection_success')}`))
    } else {
      dispatch(updateToast(true, 'error', `${t('messages.ldap_connection_error')}`))
    }
  }, [testStatus])

  return (
    <Form onSubmit={formik.handleSubmit}>
      <GluuLoader blocking={loading}>
        <FormGroup row>
          <Col sm={12} className="text-end">
            <button
              onClick={checkLdapConnection}
              type="button"
              className={`btn btn-primary-${selectedTheme} text-center`}
            >
              {t('fields.test')}
            </button>
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.acr" required doc_category={LDAP} doc_entry="configId" />
          <Col sm={9}>
            {item.configId ? (
              <Input
                valid={!formik.errors.configId && !formik.touched.configId && init}
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
                valid={!formik.errors.configId && !formik.touched.configId && init}
                placeholder={t('placeholders.ldap_name')}
                id="configId"
                name="configId"
                defaultValue={item.configId}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            )}
            {formik.errors.configId && formik.touched.configId ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.configId}</div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.bind_dn" required doc_category={LDAP} doc_entry="bind_dn" />
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
              <div style={{ color: customColors.accentRed }}>{formik.errors.bindDN}</div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel
            label="fields.max_connections"
            required
            doc_category={LDAP}
            doc_entry="max_connections"
          />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.ldap_bind_max_connections')}
                valid={!formik.errors.maxConnections && !formik.touched.maxConnections && init}
                id="maxConnections"
                onKeyUp={toogle}
                defaultValue={item.maxConnections}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.maxConnections && formik.touched.maxConnections ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.maxConnections}</div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel
            label="fields.remote_primary_key"
            required
            doc_category={LDAP}
            doc_entry="primary_key"
          />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.ldap_primary_key')}
                valid={!formik.errors.primaryKey && !formik.touched.primaryKey && init}
                id="primaryKey"
                onKeyUp={toogle}
                defaultValue={item.primaryKey}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.primaryKey && formik.touched.primaryKey ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.primaryKey}</div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel
            label="fields.local_primary_key"
            required
            doc_category={LDAP}
            doc_entry="local_primary_key"
          />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.ldap_primary_key')}
                valid={!formik.errors.localPrimaryKey && !formik.touched.localPrimaryKey && init}
                id="localPrimaryKey"
                onKeyUp={toogle}
                defaultValue={item.localPrimaryKey}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.localPrimaryKey && formik.touched.localPrimaryKey ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.localPrimaryKey}</div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={9}>
            <GluuTypeAhead
              name="servers"
              label="fields.remote_ldap_server_post"
              formik={formik}
              required={true}
              options={['localhost:1636']}
              doc_category={LDAP}
              doc_entry="servers"
              value={item.servers}
              valid={!formik.errors.servers && !formik.touched.servers && init}
              onKeyUp={toogle}
            ></GluuTypeAhead>

            {formik.errors.servers && formik.touched.servers ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.servers}</div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <Col sm={9}>
            <GluuTypeAhead
              name="baseDNs"
              label="fields.base_dns"
              doc_category={LDAP}
              doc_entry="base_dns"
              formik={formik}
              options={[]}
              required={true}
              onKeyUp={toogle}
              value={item.baseDNs}
            ></GluuTypeAhead>
            {formik.errors.baseDNs && formik.touched.baseDNs ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.baseDNs}</div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel
            label="fields.bind_password"
            required
            doc_category={LDAP}
            doc_entry="bind_password"
          />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.ldap_bind_password')}
                valid={!formik.errors.bindPassword && !formik.touched.bindPassword && init}
                onKeyUp={toogle}
                id="bindPassword"
                type="password"
                defaultValue={item.bindPassword}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.bindPassword && formik.touched.bindPassword ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.bindPassword}</div>
            ) : null}
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.use_ssl" required doc_category={LDAP} doc_entry="use_ssl" />
          <Col sm={9}>
            <InputGroup>
              <GluuToogle value={item.useSSL} formik={formik} name="useSSL" />
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.enabled" doc_category={LDAP} doc_entry="activate" />
          <Col sm={9}>
            <InputGroup>
              <GluuToogle value={item.enabled} formik={formik} name="enabled" />
            </InputGroup>
          </Col>
        </FormGroup>
        <FormGroup row>
          <GluuLabel label="fields.level" required doc_category={LDAP} doc_entry="level" />
          <Col sm={9}>
            <InputGroup>
              <Input
                type="number"
                placeholder={t('placeholders.level')}
                valid={!formik.errors.level && !formik.touched.level && init}
                id="level"
                onKeyUp={toogle}
                defaultValue={item.level}
                onChange={formik.handleChange}
              />
            </InputGroup>
            {formik.errors.level && formik.touched.level ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.level}</div>
            ) : null}
          </Col>
        </FormGroup>

        <FormGroup row>
          {' '}
          <Input type="hidden" id="moduleProperties" defaultValue={item.moduleProperties} />
        </FormGroup>
        <FormGroup row></FormGroup>
        <GluuCommitFooter
          saveHandler={toggle}
          hideButtons={{ back: createLdap }}
          extraLabel={createLdap ? t('actions.cancel') : undefined}
          extraOnClick={createLdap ? handleCancel : undefined}
        />
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
      </GluuLoader>
    </Form>
  )
}

export default LdapForm
