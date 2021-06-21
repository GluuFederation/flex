import React, { useState } from 'react'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input,
} from '../../../../app/components'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'

function AttributeForm({ item, customOnSubmit, hideButtons }) {
  const { t } = useTranslation()
  const [init, setInit] = useState(false)
  function getInitialState(item) {
    return (
      item.attributeValidation &&
      item.attributeValidation.regexp != null &&
      item.attributeValidation.minLength != null &&
      item.attributeValidation.maxLength != null
    )
  }
  const [validation, setValidation] = useState(getInitialState(item))
  function handleValidation() {
    setValidation(!validation)
  }
  function toogle() {
    if (!init) {
      setInit(true)
    }
  }

  return (
    <Formik
      initialValues={{
        name: item.name,
        displayName: item.displayName,
        description: item.displayName,
        status: item.status,
        dataType: item.dataType,
        editType: item.editType,
        viewType: item.viewType,
        usageType: item.usageType,
        jansHideOnDiscovery: item.jansHideOnDiscovery,
        oxMultiValuedAttribute: item.oxMultiValuedAttribute,
        attributeValidation: item.attributeValidation,
        scimCustomAttr: item.scimCustomAttr,
      }}
      validationSchema={Yup.object({
        name: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
        displayName: Yup.string()
          .min(2, 'Mininum 2 characters')
          .required('Required!'),
        description: Yup.string().required('Required!'),
        status: Yup.string().required('Required!'),
        dataType: Yup.string().required('Required!'),
        editType: Yup.array().required('Required!'),
        usageType: Yup.array().required('Required!'),
      })}
      onSubmit={(values) => {
        const result = Object.assign(item, values)
        result['attributeValidation'].maxLength = result.maxLength
        result['attributeValidation'].minLength = result.minLength
        result['attributeValidation'].regexp = result.regexp
        customOnSubmit(JSON.stringify(result))
      }}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit}>
          {/* START Input */}
          {item.inum && (
            <FormGroup row>
              <Label for="name" sm={3}>
                {t('fields.inum')}
              </Label>
              <Col sm={9}>
                <Input
                  style={{ backgroundColor: '#F5F5F5' }}
                  placeholder={t('fields.enter_the_attribute_inum')}
                  id="inum"
                  name="inum"
                  disabled
                  value={item.inum}
                />
              </Col>
            </FormGroup>
          )}
          <FormGroup row>
            <GluuLabel label={t('fields.name')} required />
            <Col sm={9}>
              <Input
                placeholder={t('placeholders.enter_the_attribute_name')}
                id="name"
                valid={!formik.errors.name && !formik.touched.name && init}
                name="name"
                defaultValue={item.name}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
              <ErrorMessage name="name">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.displayname')} required />
            <Col sm={9}>
              <InputGroup>
                <Input
                  placeholder={t('placeholders.enter_the_attribute_display_name')}
                  valid={
                    !formik.errors.displayName &&
                    !formik.touched.displayName &&
                    init
                  }
                  id="displayName"
                  name="displayName"
                  defaultValue={item.displayName}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <ErrorMessage name="displayName">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.description')} required />
            <Col sm={9}>
              <InputGroup>
                <Input
                  type="textarea"
                  rows="3"
                  placeholder={t('placeholders.enter_the_attribute_description')}
                  id="description"
                  name="description"
                  defaultValue={item.description}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <ErrorMessage name="description">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.status')} required />
            <Col sm={9}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="status"
                  name="status"
                  defaultValue={item.status}
                  onChange={formik.handleChange}
                >
                  <option value="">{t('options.choose')}...</option>
                  <option value="ACTIVE">{t('options.active')}</option>
                  <option value="INACTIVE">{t('options.inactive')}</option>
                </CustomInput>
              </InputGroup>
              <ErrorMessage name="status">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.data_type')} required />
            <Col sm={9}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="dataType"
                  name="dataType"
                  defaultValue={item.dataType}
                  onChange={formik.handleChange}
                >
                  <option value="">{t('options.choose')}...</option>
                  <option value="STRING">{t('options.string')}</option>
                  <option value="JSON">{t('options.json')}</option>
                  <option value="NUMERIC">{t('options.numeric')}</option>
                  <option value="BINARY">{t('options.binary')}</option>
                  <option value="CERTIFICATE">{t('options.certificate')}</option>
                  <option value="DATE">{t('options.date')}</option>
                  <option value="BOOLEAN">{t('options.boolean')}</option>
                </CustomInput>
              </InputGroup>
              <ErrorMessage name="dataType">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('Edit Type')} required />
            <Col sm={9}>
              <Input
                type="select"
                name="editType"
                id="editType"
                defaultValue={item.editType}
                multiple
                onChange={formik.handleChange}
              >
                <option value="ADMIN">{t('options.admin')}</option>
                <option value="USER">{t('options.user')}</option>
              </Input>
              <ErrorMessage name="editType">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.view_type')} />
            <Col sm={9}>
              <Input
                type="select"
                name="viewType"
                id="viewType"
                defaultValue={item.viewType}
                multiple
                onChange={formik.handleChange}
              >
                <option value="ADMIN">{t('options.admin')}</option>
                <option value="USER">{t('options.user')}</option>
              </Input>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.usage_type')} required />
            <Col sm={9}>
              <Input
                type="select"
                name="usageType"
                id="usageType"
                defaultValue={item.usageType}
                multiple
                onChange={formik.handleChange}
              >
                <option value="OPENID">{t('options.openid')}</option>
              </Input>
              <ErrorMessage name="usageType">
                {(msg) => <div style={{ color: 'red' }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.oxauth_claim_name')} />
            <Col sm={9}>
              <Input
                name="claimName"
                id="claimName"
                defaultValue={item.claimName}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.multivalued')+'?'} size={3} />
            <Col sm={1}>
              <Input
                id="oxMultiValuedAttribute"
                name="oxMultiValuedAttribute"
                onChange={formik.handleChange}
                type="checkbox"
                defaultChecked={item.oxMultiValuedAttribute}
              />
            </Col>
            <GluuLabel label={t('fields.hide_on_discovery')+'?'} size={3} />
            <Col sm={1}>
              <Input
                id="jansHideOnDiscovery"
                name="jansHideOnDiscovery"
                onChange={formik.handleChange}
                type="checkbox"
                defaultChecked={item.jansHideOnDiscovery}
              />
            </Col>
            <GluuLabel label={t('fields.include_in_scim_extension')+'?'} size={3} />
            <Col sm={1}>
              <Input
                id="scimCustomAttr"
                name="scimCustomAttr"
                onChange={formik.handleChange}
                type="checkbox"
                defaultChecked={item.scimCustomAttr}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label={t('fields.enable_custom_validation_for_this_attribute')+'?'}
              size={6}
            />
            <Col sm={6}>
              <Input
                id="validation"
                name="validation"
                onChange={handleValidation}
                type="checkbox"
                defaultChecked={validation}
              />
            </Col>
          </FormGroup>

          {validation && (
            <FormGroup row>
              <GluuLabel label={t('fields.regular_expression')} />
              <Col sm={9}>
                <Input
                  name="regexp"
                  id="regexp"
                  defaultValue={item.attributeValidation.regexp}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          )}
          {validation && (
            <FormGroup row>
              <GluuLabel label={t('fields.minimum_length')} />
              <Col sm={3}>
                <Input
                  name="minLength"
                  id="minLength"
                  type="number"
                  defaultValue={item.attributeValidation.minLength}
                  onChange={formik.handleChange}
                />
              </Col>
              <GluuLabel label={t('fields.maximum_length')} />
              <Col sm={3}>
                <Input
                  name="maxLength"
                  id="maxLength"
                  type="number"
                  defaultValue={item.attributeValidation.maxLength}
                  onChange={formik.handleChange}
                />
              </Col>
            </FormGroup>
          )}
          <FormGroup row>
            <GluuLabel label={t('fields.saml1_uri')} />
            <Col sm={9}>
              <Input
                placeholder={t('placeholders.enter_the_saml1_uri')}
                id="saml1Uri"
                name="saml1Uri"
                defaultValue={item.saml1Uri}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
          <FormGroup row>
            <GluuLabel label={t('fields.saml1_uri')} />
            <Col sm={9}>
              <Input
                placeholder={t('placeholders.enter_the_saml2_uri')}
                id="saml2Uri"
                name="saml2Uri"
                defaultValue={item.saml2Uri}
                onKeyUp={toogle}
                onChange={formik.handleChange}
              />
            </Col>
          </FormGroup>
          <GluuFooter hideButtons={hideButtons} />
        </Form>
      )}
    </Formik>
  )
}

export default AttributeForm
