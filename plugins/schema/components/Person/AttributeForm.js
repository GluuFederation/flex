import React, { useState } from 'react'
import { Formik, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Input,
} from '../../../../app/components'
import GluuFooter from '../../../../app/routes/Apps/Gluu/GluuFooter'
import GluuLabel from '../../../../app/routes/Apps/Gluu/GluuLabel'
import GluuInumInput from '../../../../app/routes/Apps/Gluu/GluuInumInput'
import GluuToogle from '../../../../app/routes/Apps/Gluu/GluuToogle'
import GluuTooltip from '../../../../app/routes/Apps/Gluu/GluuTooltip'
import { ATTRIBUTE } from '../../../../app/utils/ApiResources'
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
          {item.inum && (
            <GluuInumInput
              label="fields.inum"
              name="inum"
              lsize={3}
              rsize={9}
              value={item.inum}
              doc_category={ATTRIBUTE}
            />
          )}
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="name">
            <FormGroup row>
              <GluuLabel label="fields.name" required />
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
          </GluuTooltip>
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="displayName">
            <FormGroup row>
              <GluuLabel label="fields.displayname" required />
              <Col sm={9}>
                <InputGroup>
                  <Input
                    placeholder={t(
                      'placeholders.enter_the_attribute_display_name',
                    )}
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
          </GluuTooltip>
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="description">
            <FormGroup row>
              <GluuLabel label="fields.description" required />
              <Col sm={9}>
                <InputGroup>
                  <Input
                    type="textarea"
                    rows="3"
                    placeholder={t(
                      'placeholders.enter_the_attribute_description',
                    )}
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
          </GluuTooltip>
          <FormGroup row>
            <GluuLabel label="fields.status" required />
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
            <GluuLabel label="fields.data_type" required />
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
                  <option value="CERTIFICATE">
                    {t('options.certificate')}
                  </option>
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
            <GluuLabel label="fields.edit_type" required />
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
            <GluuLabel label="fields.view_type" />
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
            <GluuLabel label="fields.usage_type" required />
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
            <GluuLabel label="fields.oxauth_claim_name" />
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
            <GluuLabel label="fields.multivalued" size={3} />
            <Col sm={1}>
              <GluuToogle
                id="oxMultiValuedAttribute"
                name="oxMultiValuedAttribute"
                formik={formik}
                value={item.oxMultiValuedAttribute}
              />
            </Col>
            <GluuLabel label="fields.hide_on_discovery" size={3} />
            <Col sm={1}>
              <GluuToogle
                id="jansHideOnDiscovery"
                name="jansHideOnDiscovery"
                formik={formik}
                value={item.jansHideOnDiscovery}
              />
            </Col>
            <GluuLabel label="fields.include_in_scim_extension" size={3} />
            <Col sm={1}>
              <GluuToogle
                id="scimCustomAttr"
                name="scimCustomAttr"
                formik={formik}
                value={item.scimCustomAttr}
              />
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label="fields.enable_custom_validation_for_this_attribute"
              size={6}
            />
            <Col sm={6}>
              <GluuToogle
                id="validation"
                name="validation"
                handler={handleValidation}
                formik={formik}
                value={validation}
              />
            </Col>
          </FormGroup>

          {validation && (
            <GluuTooltip doc_category={ATTRIBUTE} doc_entry="regexp">
              <FormGroup row>
                <GluuLabel label="fields.regular_expression" />
                <Col sm={9}>
                  <Input
                    name="regexp"
                    id="regexp"
                    defaultValue={item.attributeValidation.regexp}
                    onChange={formik.handleChange}
                  />
                </Col>
              </FormGroup>
            </GluuTooltip>
          )}
          {validation && (
            <FormGroup row>
              <GluuLabel label="fields.minimum_length" />
              <Col sm={3}>
                <Input
                  name="minLength"
                  id="minLength"
                  type="number"
                  defaultValue={item.attributeValidation.minLength}
                  onChange={formik.handleChange}
                />
              </Col>
              <GluuLabel label="fields.maximum_length" />
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
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="saml1Uri">
            <FormGroup row>
              <GluuLabel label="fields.saml1_uri" />
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
          </GluuTooltip>
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="saml2Uri">
            <FormGroup row>
              <GluuLabel label="fields.saml2_uri" />
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
          </GluuTooltip>
          <GluuFooter hideButtons={hideButtons} />
        </Form>
      )}
    </Formik>
  )
}

export default AttributeForm
