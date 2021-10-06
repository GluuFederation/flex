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
import GluuInputRow from '../../../../app/routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from '../../../../app/routes/Apps/Gluu/GluuToogleRow'
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
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="status">
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
          </GluuTooltip>
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="dataType">
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
          </GluuTooltip>
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="editType">
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
          </GluuTooltip>
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="viewType">
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
          </GluuTooltip>
          <GluuTooltip doc_category={ATTRIBUTE} doc_entry="usageType">
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
          </GluuTooltip>
          <GluuInputRow
            label="fields.oxauth_claim_name"
            name="claimName"
            formik={formik}
            value={item.claimName}
            doc_category={ATTRIBUTE}
          />
          <FormGroup row>
            <Col sm={4}>
              <GluuToogleRow
                name="oxMultiValuedAttribute"
                formik={formik}
                lsize={6}
                rsize={6}
                label="fields.multivalued"
                value={item.oxMultiValuedAttribute}
                doc_category={ATTRIBUTE}
              />
            </Col>
            <Col sm={4}>
              <GluuToogleRow
                name="jansHideOnDiscovery"
                formik={formik}
                lsize={6}
                rsize={6}
                label="fields.hide_on_discovery"
                value={item.jansHideOnDiscovery}
                doc_category={ATTRIBUTE}
              />
            </Col>
            <Col sm={4}>
              <GluuToogleRow
                name="scimCustomAttr"
                formik={formik}
                lsize={6}
                rsize={6}
                label="fields.include_in_scim_extension"
                value={item.scimCustomAttr}
                doc_category={ATTRIBUTE}
              />
            </Col>
          </FormGroup>
          <GluuToogleRow
            name="validation"
            formik={formik}
            label="fields.enable_custom_validation_for_this_attribute"
            value={validation}
            handler={handleValidation}
            doc_category={ATTRIBUTE}
          />
          {validation && (
            <GluuInputRow
              label="fields.regular_expression"
              name="regexp"
              formik={formik}
              value={item.attributeValidation.regexp}
              doc_category={ATTRIBUTE}
            />
          )}
          {validation && (
            <FormGroup row>
              <Col sm={6}>
                <GluuInputRow
                  label="fields.minimum_length"
                  name="minLength"
                  formik={formik}
                  type="number"
                  value={item.attributeValidation.minLength}
                  doc_category={ATTRIBUTE}
                />
              </Col>
              <Col sm={6}>
                <GluuInputRow
                  label="fields.maximum_length"
                  name="maxLength"
                  formik={formik}
                  type="number"
                  value={item.attributeValidation.maxLength}
                  doc_category={ATTRIBUTE}
                />
              </Col>
            </FormGroup>
          )}
          <GluuInputRow
            label="fields.saml1_uri"
            name="saml1Uri"
            formik={formik}
            value={item.saml1Uri}
            doc_category={ATTRIBUTE}
          />
          <GluuInputRow
            label="fields.saml2_uri"
            name="saml2Uri"
            formik={formik}
            value={item.saml2Uri}
            doc_category={ATTRIBUTE}
          />
          <GluuFooter hideButtons={hideButtons} />
        </Form>
      )}
    </Formik>
  )
}

export default AttributeForm
