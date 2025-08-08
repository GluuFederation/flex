import React, { useState } from 'react'
import { Formik, ErrorMessage, FormikProps } from 'formik'
import { Col, InputGroup, CustomInput, Form, FormGroup, Input } from 'Components'
import GluuFooter from 'Routes/Apps/Gluu/GluuFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { ATTRIBUTE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import * as Yup from 'yup'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import {
  AttributeFormProps,
  AttributeFormValues,
  AttributeItem,
  HandleAttributeSubmitParams,
} from '../types/AttributeListPage.types'

function AttributeForm(props: AttributeFormProps) {
  const { item, customOnSubmit, hideButtons } = props
  const { t } = useTranslation()
  const [init, setInit] = useState<boolean>(false)
  const [values, setValues] = useState<AttributeFormValues>({} as AttributeFormValues)
  const [modal, setModal] = useState<boolean>(false)
  const toggleModal = () => {
    setModal(!modal)
  }

  const getInitialState = (item: AttributeItem): boolean => {
    return (
      item.attributeValidation?.regexp != null ||
      item.attributeValidation?.minLength != null ||
      item.attributeValidation?.maxLength != null
    )
  }

  const [validation, setValidation] = useState<boolean>(getInitialState(item))

  function handleValidation(): void {
    setValidation(!validation)
  }

  function toogle(): void {
    if (!init) {
      setInit(true)
    }
  }

  const submitForm = (userMessage?: string): void => {
    handleAttributeSubmit({ values, item, customOnSubmit, userMessage })
  }

  const handleAttributeSubmit = ({
    item,
    values,
    customOnSubmit,
    userMessage,
  }: HandleAttributeSubmitParams): void => {
    const result = Object.assign(item, values)
    if (result.maxLength !== null) {
      result['attributeValidation'].maxLength = result.maxLength
    }
    if (result.minLength !== null) {
      result['attributeValidation'].minLength = result.minLength
    }
    if (result.regexp !== null) {
      result['attributeValidation'].regexp = result.regexp
    }

    if (!validation) {
      delete result['attributeValidation']['regexp']
      delete result['regexp']

      delete result['attributeValidation']['maxLength']
      delete result['maxLength']

      delete result['attributeValidation']['minLength']
      delete result['minLength']
    }

    customOnSubmit({ data: result as AttributeItem, userMessage })
  }

  const attributeValidationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[^\s]+$/, 'Name must not contain spaces')
      .required('Required!'),
    displayName: Yup.string().required('Required!'),
    description: Yup.string().required('Required!'),
    status: Yup.string().required('Required!'),
    dataType: Yup.string().required('Required!'),
    editType: Yup.array().required('Required!'),
    usageType: Yup.array().required('Required!'),
    viewType: Yup.array().required('Required!'),
  })

  const getInitialAttributeValues = (item: AttributeItem): AttributeFormValues => {
    return {
      ...item,
      name: item.name,
      displayName: item.displayName,
      description: item.description,
      status: item.status,
      dataType: item.dataType,
      editType: item.editType,
      viewType: item.viewType,
      usageType: item.usageType || [],
      jansHideOnDiscovery: item.jansHideOnDiscovery,
      oxMultiValuedAttribute: item.oxMultiValuedAttribute,
      attributeValidation: item.attributeValidation,
      scimCustomAttr: item.scimCustomAttr,
      maxLength: item.attributeValidation.maxLength,
      minLength: item.attributeValidation.minLength,
      regexp: item.attributeValidation.regexp,
    }
  }

  return (
    <Formik
      initialValues={getInitialAttributeValues(item)}
      validationSchema={attributeValidationSchema}
      onSubmit={(values: AttributeFormValues) => {
        setValues(values)
        toggleModal()
      }}
    >
      {(formik: FormikProps<AttributeFormValues>) => (
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
          <FormGroup row>
            <GluuLabel label="fields.name" required doc_category={ATTRIBUTE} doc_entry="name" />
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
                {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label="fields.displayname"
              required
              doc_category={ATTRIBUTE}
              doc_entry="displayName"
            />
            <Col sm={9}>
              <InputGroup>
                <Input
                  placeholder={t('placeholders.enter_the_attribute_display_name')}
                  valid={!formik.errors.displayName && !formik.touched.displayName && init}
                  id="displayName"
                  name="displayName"
                  defaultValue={item.displayName}
                  onChange={formik.handleChange}
                />
              </InputGroup>
              <ErrorMessage name="displayName">
                {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label="fields.description"
              required
              doc_category={ATTRIBUTE}
              doc_entry="description"
            />
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
                {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel label="fields.status" required doc_category={ATTRIBUTE} doc_entry="status" />
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
                  <option value="active">{t('options.active')}</option>
                  <option value="inactive">{t('options.inactive')}</option>
                </CustomInput>
              </InputGroup>
              <ErrorMessage name="status">
                {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label="fields.data_type"
              required
              doc_category={ATTRIBUTE}
              doc_entry="dataType"
            />
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
                  <option value="string">{t('options.string')}</option>
                  <option value="json">{t('options.json')}</option>
                  <option value="numeric">{t('options.numeric')}</option>
                  <option value="binary">{t('options.binary')}</option>
                  <option value="certificate">{t('options.certificate')}</option>
                  <option value="date">{t('options.date')}</option>
                  <option value="boolean">{t('options.boolean')}</option>
                </CustomInput>
              </InputGroup>
              <ErrorMessage name="dataType">
                {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label="fields.edit_type"
              required
              doc_category={ATTRIBUTE}
              doc_entry="editType"
            />
            <Col sm={9}>
              <Input
                type="select"
                name="editType"
                id="editType"
                defaultValue={item.editType}
                multiple
                onChange={formik.handleChange}
              >
                <option value="admin">{t('options.admin')}</option>
                <option value="user">{t('options.user')}</option>
              </Input>
              <ErrorMessage name="editType">
                {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label="fields.view_type"
              doc_category={ATTRIBUTE}
              doc_entry="viewType"
              required
            />
            <Col sm={9}>
              <Input
                type="select"
                name="viewType"
                id="viewType"
                defaultValue={item.viewType}
                multiple
                onChange={formik.handleChange}
              >
                <option value="admin">{t('options.admin')}</option>
                <option value="user">{t('options.user')}</option>
              </Input>
              <ErrorMessage name="viewType">
                {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>

          <FormGroup row>
            <GluuLabel
              label="fields.usage_type"
              required
              doc_category={ATTRIBUTE}
              doc_entry="usageType"
            />
            <Col sm={9}>
              <Input
                type="select"
                name="usageType"
                id="usageType"
                defaultValue={item.usageType}
                multiple
                onChange={formik.handleChange}
              >
                <option value="openid">{t('options.openid')}</option>
              </Input>
              <ErrorMessage name="usageType">
                {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
              </ErrorMessage>
            </Col>
          </FormGroup>
          <GluuInputRow
            label="fields.oxauth_claim_name"
            name="claimName"
            formik={formik}
            value={formik.values?.claimName}
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
                value={formik.values?.oxMultiValuedAttribute}
                handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                  formik.setFieldValue('oxMultiValuedAttribute', e.target.checked)
                }}
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
                value={formik.values?.jansHideOnDiscovery}
                doc_category={ATTRIBUTE}
                handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                  formik.setFieldValue('jansHideOnDiscovery', e.target.checked)
                }}
              />
            </Col>
            <Col sm={4}>
              <GluuToogleRow
                name="scimCustomAttr"
                formik={formik}
                lsize={6}
                rsize={6}
                label="fields.include_in_scim_extension"
                value={formik.values?.scimCustomAttr}
                doc_category={ATTRIBUTE}
                handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                  formik.setFieldValue('scimCustomAttr', e.target.checked)
                }}
              />
            </Col>
          </FormGroup>
          <GluuToogleRow
            name="validation"
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
              value={formik.values?.regexp}
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
                  lsize={6}
                  rsize={6}
                  value={formik.values?.minLength}
                  doc_category={ATTRIBUTE}
                />
              </Col>
              <Col sm={6}>
                <GluuInputRow
                  label="fields.maximum_length"
                  name="maxLength"
                  formik={formik}
                  type="number"
                  lsize={4}
                  rsize={6}
                  value={formik.values?.maxLength}
                  doc_category={ATTRIBUTE}
                />
              </Col>
            </FormGroup>
          )}
          <GluuInputRow
            label="fields.saml1_uri"
            name="saml1Uri"
            formik={formik}
            value={formik.values?.saml1Uri}
            doc_category={ATTRIBUTE}
          />
          <GluuInputRow
            label="fields.saml2_uri"
            name="saml2Uri"
            formik={formik}
            value={formik.values?.saml2Uri}
            doc_category={ATTRIBUTE}
          />
          <GluuFooter hideButtons={hideButtons} />
          <GluuCommitDialog
            handler={toggleModal}
            modal={modal}
            onAccept={submitForm}
            feature={adminUiFeatures.attributes_write}
            formik={formik}
          />
        </Form>
      )}
    </Formik>
  )
}

export default AttributeForm
