import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Container, Col, InputGroup, CustomInput, Form, FormGroup, Input, Row } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuTypeAhead from 'Routes/Apps/Gluu/GluuTypeAhead'
import { useTranslation } from 'react-i18next'
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'

import { useSelector } from 'react-redux'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import customColors from '@/customColors'

function AuthNForm({ item, handleSubmit }) {
  const { t } = useTranslation()
  const [modal, setModal] = useState(false)
  const acrs = useSelector((state) => state.acrReducer.acrReponse)

  const initialValues = {
    acr: item?.acrName || '',
    level: parseInt(item.level),
    defaultAuthNMethod: acrs.defaultAcr === item.acrName ? true : false,
    samlACR: item?.samlACR || '',
    description: item?.description || '',
    primaryKey: item?.primaryKey || '',
    passwordAttribute: item?.passwordAttribute || '',
    hashAlgorithm: item?.hashAlgorithm || '',
    bindDN: item?.bindDN || '',
    maxConnections: item?.maxConnections || '',
    remotePrimaryKey: item?.localPrimaryKey || '',
    localPrimaryKey: item?.localPrimaryKey || '',
    servers: item?.servers || '',
    baseDNs: item?.baseDNs || '',
    bindPassword: item?.bindPassword || '',
    useSSL: item?.useSSL || false,
    enabled: item?.enabled || false,
    configId: item?.configId || '',
    baseDn: item?.baseDn,
    inum: item?.inum,
  }

  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: () => {
      toggle()
    },
    validationSchema: Yup.object({
      acr: Yup.string().required('ACR name is required.'),
      level: Yup.string().required('Level is required.'),
    }),
  })

  const toggle = () => {
    setModal(!modal)
  }

  const submitForm = () => {
    toggle()
    handleSubmit(formik.values)
  }

  const getPropertiesConfig = (entry) => {
    if (entry.configurationProperties && Array.isArray(entry.configurationProperties)) {
      return entry.configurationProperties.map((e) => ({
        key: e.value1,
        value: e.value2,
      }))
    } else {
      return []
    }
  }

  return (
    <Container>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
        <FormGroup row>
          <Col sm={12}>
            <GluuInputRow
              name="acr"
              label="fields.acr"
              value={formik.values.acr || ''}
              formik={formik}
              lsize={4}
              rsize={8}
              disabled={true}
              showError={!!(formik.errors.acr && formik.touched.acr)}
              errorMessage={formik.errors.acr}
              required={true}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Col sm={12}>
            <GluuInputRow
              name="level"
              label="fields.level"
              value={formik.values.level || ''}
              formik={formik}
              lsize={4}
              rsize={8}
              type="number"
              disabled={item.name === 'simple_password_auth' ? true : false}
              showError={!!(formik.errors.level && formik.touched.level)}
              errorMessage={formik.errors.level}
              required={true}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <GluuLabel label="fields.default_authn_method" size={4} />
          <Col sm={4}>
            <InputGroup>
              <CustomInput
                type="select"
                id="defaultAuthNMethod"
                name="defaultAuthNMethod"
                value={formik.values.defaultAuthNMethod}
                formik={formik}
                onChange={formik.handleChange}
                disabled={false}
              >
                <option value="">{t('actions.choose')}...</option>
                <option value="true">true</option>
                <option value="false">false</option>
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>

        {(item.name === 'simple_password_auth' || item.name === 'myAuthnScript') && (
          <FormGroup row>
            <GluuLabel label="fields.saml_acr" size={4} />
            <Col sm={8}>
              <Input
                id="samlACR"
                name="samlACR"
                defaultValue={formik.values.samlACR}
                formik={formik}
                onChange={formik.handleChange}
                disabled={item.name === 'simple_password_auth' ? true : false}
              />
            </Col>
          </FormGroup>
        )}

        {(item.name === 'simple_password_auth' || item.name === 'myAuthnScript') && (
          <FormGroup row>
            <GluuLabel label="fields.description" size={4} />
            <Col sm={8}>
              <Input
                id="description"
                name="description"
                defaultValue={formik.values.description}
                formik={formik}
                onChange={formik.handleChange}
                disabled={item.name === 'simple_password_auth' ? true : false}
              />
            </Col>
          </FormGroup>
        )}

        {item.name === 'simple_password_auth' && (
          <FormGroup row>
            <GluuLabel label="fields.primary_key" size={4} />
            <Col sm={8}>
              <Input
                id="primaryKey"
                name="primaryKey"
                value={item?.primaryKey || ''}
                formik={formik}
                onChange={formik.handleChange}
                disabled={item.name === 'simple_password_auth' ? true : false}
              />
            </Col>
          </FormGroup>
        )}
        {item.name === 'simple_password_auth' && (
          <FormGroup row>
            <GluuLabel label="fields.password_attribute" size={4} />
            <Col sm={8}>
              <Input
                id="passwordAttribute"
                name="passwordAttribute"
                value={formik.values.passwordAttribute}
                formik={formik}
                onChange={formik.handleChange}
                disabled={item.name === 'simple_password_auth' ? true : false}
              />
            </Col>
          </FormGroup>
        )}

        {item.name === 'myAuthnScript' && (
          <Row>
            <GluuLabel label="fields.script_properties" size={4} />
            <Col sm={8}>
              <GluuProperties
                compName="configurationProperties"
                label="fields.custom_properties"
                formik={formik}
                keyPlaceholder={t('placeholders.enter_property_key')}
                valuePlaceholder={t('placeholders.enter_property_value')}
                options={getPropertiesConfig(item)}
                defaultValue={item.passwordAttribute}

                //  disabled={viewOnly}
              ></GluuProperties>
            </Col>
          </Row>
        )}

        {item.name === 'simple_password_auth' && (
          <FormGroup row>
            <GluuLabel label="fields.hash_algorithm" size={4} />
            <Col sm={4}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="hashAlgorithm"
                  name="hashAlgorithm"
                  value={formik.values.hashAlgorithm}
                  formik={formik}
                  onChange={formik.handleChange}
                  disabled={item.name === 'simple_password_auth' ? true : false}
                >
                  <option value="">{t('actions.choose')}...</option>
                  <option value="bcrypt">bcrypt</option>
                </CustomInput>
              </InputGroup>
            </Col>
          </FormGroup>
        )}

        {item.name === 'default_ldap_password' && (
          <>
            <FormGroup row>
              <GluuLabel label="fields.bind_dn" size={4} />
              <Col sm={8}>
                <Input
                  id="bindDN"
                  name="bindDN"
                  value={item?.bindDN || ''}
                  formik={formik}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.max_connections" size={4} />
              <Col sm={8}>
                <Input
                  id="maxConnections"
                  name="maxConnections"
                  value={item?.maxConnections || ''}
                  formik={formik}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.remote_primary_key" size={4} />
              <Col sm={8}>
                <Input
                  id="remotePrimaryKey"
                  name="remotePrimaryKey"
                  value={item?.localPrimaryKey || ''}
                  formik={formik}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.local_primary_key" size={4} />
              <Col sm={8}>
                <Input
                  id="localPrimaryKey"
                  name="localPrimaryKey"
                  value={item?.localPrimaryKey || ''}
                  formik={formik}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <GluuTypeAhead
              name="servers"
              label="fields.remote_ldap_server_post"
              formik={formik}
              required={true}
              options={[]}
              value={item.servers}
              valid={!formik.errors.servers && !formik.touched.servers}
            ></GluuTypeAhead>

            {formik.errors.servers && formik.touched.servers ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.servers}</div>
            ) : null}

            <GluuTypeAhead
              name="baseDNs"
              label="fields.base_dns"
              formik={formik}
              options={[]}
              value={item.baseDNs}
            ></GluuTypeAhead>
            {formik.errors.baseDNs && formik.touched.baseDNs ? (
              <div style={{ color: customColors.accentRed }}>{formik.errors.baseDNs}</div>
            ) : null}

            <FormGroup row>
              <GluuLabel label="fields.bind_password" size={4} />
              <Col sm={8}>
                <Input
                  id="bindPassword"
                  name="bindPassword"
                  value={item?.bindPassword || ''}
                  formik={formik}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.use_ssl" doc_entry="use_ssl" />
              <Col sm={9}>
                <InputGroup>
                  <Input
                    placeholder={t('placeholders.use_ssl')}
                    id="useSSL"
                    type="checkbox"
                    defaultChecked={item.useSSL}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel label="fields.enabled" doc_entry="enabled" />
              <Col sm={9}>
                <InputGroup>
                  <Input
                    placeholder={t('placeholders.enabled')}
                    id="enabled"
                    type="checkbox"
                    defaultChecked={item.enabled}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
              </Col>
            </FormGroup>
          </>
        )}
        <GluuCommitFooter saveHandler={toggle} hideButtons={{ save: true }} type="submit" />
        <GluuCommitDialog handler={toggle} modal={modal} onAccept={submitForm} formik={formik} />
      </Form>
    </Container>
  )
}

export default AuthNForm
