import React, { useState, useMemo, useCallback, memo } from 'react'
import { Formik, ErrorMessage, FormikProps } from 'formik'
import { Col, InputGroup, CustomInput, Form, FormGroup, Input } from 'Components'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import { ATTRIBUTE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useAttributeValidationSchema } from '../../utils/validation'
import {
  useInitialAttributeValues,
  getInitialValidationState,
  handleAttributeSubmit,
  hasFormChanged,
  getDefaultFormValues,
  isFormValid,
} from '../../utils/formHelpers'
import type { AttributeFormProps, AttributeFormValues } from '../types/AttributeListPage.types'

const createMultiSelectHandler = (
  fieldName: 'editType' | 'viewType' | 'usageType',
  setFieldValue: (field: string, value: string[]) => void,
) => {
  return (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target instanceof HTMLSelectElement) {
      const options = e.target.options
      const selectedValues: string[] = []
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value)
        }
      }
      setFieldValue(fieldName, selectedValues)
    }
  }
}

const AttributeForm = memo(function AttributeForm(props: AttributeFormProps) {
  const { item, customOnSubmit, hideButtons } = props
  const { t } = useTranslation()
  const { navigateBack } = useAppNavigation()
  const [init, setInit] = useState<boolean>(false)
  const [modal, setModal] = useState<boolean>(false)

  // Memoized initial values
  const initialValues = useInitialAttributeValues(item)

  // Memoized default empty values for create mode
  const defaultFormValues = useMemo(() => getDefaultFormValues(), [])

  // Determine if we're in create mode (no inum) or edit mode (has inum)
  const isCreateMode = useMemo(() => !item.inum, [item.inum])

  // Memoized initial validation state
  const initialValidationState = useMemo(() => getInitialValidationState(item), [item])
  const [validation, setValidation] = useState<boolean>(initialValidationState)

  // Memoized validation schema - conditionally validates based on validation toggle
  const validationSchema = useAttributeValidationSchema(validation)

  // Determine if this is view mode (when hideButtons is set with save and back)
  const isViewMode = useMemo(
    () => hideButtons?.save === true && hideButtons?.back === true,
    [hideButtons],
  )

  // Memoized handlers
  const toggleModal = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const handleValidation = useCallback((formik: FormikProps<AttributeFormValues>) => {
    setValidation((prev) => {
      const newValue = !prev
      if (!newValue) {
        // Clear validation fields when validation is disabled
        formik.setFieldValue('regexp', null)
        formik.setFieldValue('maxLength', null)
        formik.setFieldValue('minLength', null)
        formik.setFieldTouched('regexp', false)
        formik.setFieldTouched('maxLength', false)
        formik.setFieldTouched('minLength', false)
      }
      return newValue
    })
  }, [])

  const toggle = useCallback(() => {
    setInit(true)
  }, [])

  const submitForm = useCallback(
    (userMessage: string, formikValues: AttributeFormValues): void => {
      handleAttributeSubmit({
        values: formikValues,
        item,
        customOnSubmit,
        userMessage,
        validationEnabled: validation,
      })
    },
    [item, customOnSubmit, validation],
  )

  // Memoized navigation handlers
  // Uses navigateBack with explicit fallback to attributes list (conforms to global navigation policy)
  const handleBack = useCallback(() => {
    navigateBack(ROUTES.ATTRIBUTES_LIST)
  }, [navigateBack])

  const handleCancel = useCallback(
    (formik: FormikProps<AttributeFormValues>) => {
      if (isCreateMode) {
        // In create mode: clear all fields to default/empty state
        formik.resetForm({ values: defaultFormValues })
        setValidation(false)
      } else {
        // In edit mode: reset to original values
        formik.resetForm({ values: initialValues })
        setValidation(initialValidationState)
      }
    },
    [isCreateMode, defaultFormValues, initialValues, initialValidationState],
  )

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      validateOnMount={true}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={() => {
        toggleModal()
      }}
      enableReinitialize={true}
      key={item.inum || 'new'}
    >
      {(formik: FormikProps<AttributeFormValues>) => {
        const valuesChanged = hasFormChanged(initialValues, formik.values)
        const validationStateChanged = validation !== initialValidationState
        const formHasChanged = valuesChanged || validationStateChanged

        const formValid = isFormValid(formik.values, formik.errors, formik.isValid)

        const canApply = formValid && (isCreateMode || formHasChanged)

        const handleEditTypeChange = createMultiSelectHandler('editType', formik.setFieldValue)
        const handleViewTypeChange = createMultiSelectHandler('viewType', formik.setFieldValue)
        const handleUsageTypeChange = createMultiSelectHandler('usageType', formik.setFieldValue)

        return (
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
                  value={formik.values.name}
                  onKeyUp={toggle}
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
                    value={formik.values.displayName}
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
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  />
                </InputGroup>
                <ErrorMessage name="description">
                  {(msg: string) => <div style={{ color: customColors.accentRed }}>{msg}</div>}
                </ErrorMessage>
              </Col>
            </FormGroup>

            <FormGroup row>
              <GluuLabel
                label="fields.status"
                required
                doc_category={ATTRIBUTE}
                doc_entry="status"
              />
              <Col sm={9}>
                <InputGroup>
                  <CustomInput
                    type="select"
                    id="status"
                    name="status"
                    value={formik.values.status}
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
                    value={formik.values.dataType}
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
                  value={formik.values.editType}
                  multiple
                  onChange={handleEditTypeChange}
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
                  value={formik.values.viewType}
                  multiple
                  onChange={handleViewTypeChange}
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
              <GluuLabel label="fields.usage_type" doc_category={ATTRIBUTE} doc_entry="usageType" />
              <Col sm={9}>
                <Input
                  type="select"
                  name="usageType"
                  id="usageType"
                  value={formik.values.usageType}
                  multiple
                  onChange={handleUsageTypeChange}
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
              handler={() => handleValidation(formik)}
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
            <GluuFormFooter
              showBack={true}
              onBack={handleBack}
              showCancel={!isViewMode}
              onCancel={() => handleCancel(formik)}
              disableCancel={!formHasChanged}
              showApply={!isViewMode}
              applyButtonType="submit"
              disableApply={!canApply}
              isLoading={false}
            />
            <GluuCommitDialog
              handler={toggleModal}
              modal={modal}
              onAccept={(userMessage: string) => submitForm(userMessage, formik.values)}
              feature={adminUiFeatures.attributes_write}
              formik={formik}
            />
          </Form>
        )
      }}
    </Formik>
  )
})

AttributeForm.displayName = 'AttributeForm'

export default AttributeForm
