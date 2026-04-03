import React, { useState, useMemo, useCallback, memo } from 'react'
import { Formik, FormikProps } from 'formik'
import { Form } from 'Components'
import type { MultiSelectOption } from 'Routes/Apps/Gluu/types/GluuMultiSelectRow.types'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import { ATTRIBUTE } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/UserClaimsFormPage.style'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { useAttributeValidationSchema } from '../utils/validation'
import {
  useInitialAttributeValues,
  getInitialValidationState,
  handleAttributeSubmit,
  hasFormChanged,
  getDefaultFormValues,
  isFormValid,
  computeModifiedFields,
} from '../utils/formHelpers'
import type { AttributeFormProps, AttributeFormValues } from './types/UserClaimsListPage.types'

const EDIT_VIEW_OPTIONS: MultiSelectOption[] = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
]

const USAGE_TYPE_OPTIONS: MultiSelectOption[] = [{ value: 'openid', label: 'OpenID' }]

const UserClaimsForm = memo(function UserClaimsForm(props: AttributeFormProps) {
  const { item, customOnSubmit, hideButtons } = props
  const { t } = useTranslation()
  const { navigateBack } = useAppNavigation()
  const [modal, setModal] = useState<boolean>(false)
  const [commitOperations, setCommitOperations] = useState<GluuCommitDialogOperation[]>([])

  const theme = useTheme()
  const { themeColors, isDark } = useMemo(() => {
    const selected = theme.state.theme || DEFAULT_THEME
    return {
      themeColors: getThemeColor(selected),
      isDark: selected === THEME_DARK,
    }
  }, [theme.state.theme])

  const { classes } = useStyles({ isDark, themeColors })

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

  const isViewMode = useMemo(() => hideButtons?.save === true, [hideButtons])

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
      onSubmit={(values) => {
        if (!isCreateMode) {
          const modified = computeModifiedFields(initialValues, values)
          setCommitOperations(
            Object.entries(modified).map(([key, value]) => ({
              path: key,
              value: Array.isArray(value) ? value.join(', ') : String(value ?? ''),
            })),
          )
        }
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

        return (
          <Form onSubmit={formik.handleSubmit}>
            <div className={`${classes.formLabels} ${classes.formWithInputs}`}>
              {/* 2-column grid layout matching Figma design */}
              <div className={classes.formGrid}>
                {item.inum && (
                  <div className={`${classes.fieldItem} ${classes.inumFullWidth}`}>
                    <GluuInumInput
                      label="fields.inum"
                      name="inum"
                      lsize={12}
                      rsize={12}
                      value={item.inum}
                      doc_category={ATTRIBUTE}
                      isDark={isDark}
                    />
                  </div>
                )}

                {/* Row 1: Name | Display Name */}
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.name"
                    name="name"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.name}
                    doc_category={ATTRIBUTE}
                    doc_entry="name"
                    placeholder={t('placeholders.enter_the_attribute_name')}
                    errorMessage={formik.errors.name ? t(formik.errors.name) : undefined}
                    showError={!!(formik.errors.name && formik.touched.name)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.displayname"
                    name="displayName"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.displayName}
                    doc_category={ATTRIBUTE}
                    doc_entry="displayName"
                    placeholder={t('placeholders.enter_the_attribute_display_name')}
                    errorMessage={
                      formik.errors.displayName ? t(formik.errors.displayName) : undefined
                    }
                    showError={!!(formik.errors.displayName && formik.touched.displayName)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                {/* Row 2: Description | Status */}
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.description"
                    name="description"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.description}
                    doc_category={ATTRIBUTE}
                    doc_entry="description"
                    placeholder={t('placeholders.enter_the_attribute_description')}
                    errorMessage={
                      formik.errors.description ? t(formik.errors.description) : undefined
                    }
                    showError={!!(formik.errors.description && formik.touched.description)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div className={classes.fieldItem}>
                  <GluuSelectRow
                    label="fields.status"
                    name="status"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.status}
                    doc_category={ATTRIBUTE}
                    doc_entry="status"
                    values={[
                      { value: 'active', label: t('options.active') },
                      { value: 'inactive', label: t('options.inactive') },
                    ]}
                    errorMessage={formik.errors.status ? t(formik.errors.status) : undefined}
                    showError={!!(formik.errors.status && formik.touched.status)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                {/* Row 3: Data Type | oxAuth claim name */}
                <div className={classes.fieldItem}>
                  <GluuSelectRow
                    label="fields.data_type"
                    name="dataType"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.dataType}
                    doc_category={ATTRIBUTE}
                    doc_entry="dataType"
                    values={[
                      { value: 'string', label: t('options.string') },
                      { value: 'json', label: t('options.json') },
                      { value: 'numeric', label: t('options.numeric') },
                      { value: 'binary', label: t('options.binary') },
                      { value: 'certificate', label: t('options.certificate') },
                      { value: 'date', label: t('options.date') },
                      { value: 'boolean', label: t('options.boolean') },
                    ]}
                    errorMessage={formik.errors.dataType ? t(formik.errors.dataType) : undefined}
                    showError={!!(formik.errors.dataType && formik.touched.dataType)}
                    disabled={isViewMode}
                    required
                  />
                </div>

                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.oxauth_claim_name"
                    name="claimName"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values?.claimName ?? ''}
                    doc_category={ATTRIBUTE}
                    doc_entry="claimName"
                    placeholder={t('placeholders.enter_here')}
                    disabled={isViewMode}
                  />
                </div>

                {/* Row 4: Edit Type | View Type */}
                <div className={classes.fieldItem}>
                  <GluuMultiSelectRow
                    label="fields.edit_type"
                    name="editType"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.editType}
                    options={EDIT_VIEW_OPTIONS}
                    required
                    doc_category={ATTRIBUTE}
                    doc_entry="editType"
                    helperText={t('messages.multi_select_hint')}
                    showError={!!(formik.errors.editType && formik.touched.editType)}
                    errorMessage={formik.errors.editType ? t(formik.errors.editType as string) : ''}
                    disabled={isViewMode}
                  />
                </div>

                <div className={classes.fieldItem}>
                  <GluuMultiSelectRow
                    label="fields.view_type"
                    name="viewType"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.viewType}
                    options={EDIT_VIEW_OPTIONS}
                    required
                    doc_category={ATTRIBUTE}
                    doc_entry="viewType"
                    helperText={t('messages.multi_select_hint')}
                    showError={!!(formik.errors.viewType && formik.touched.viewType)}
                    errorMessage={formik.errors.viewType ? t(formik.errors.viewType as string) : ''}
                    disabled={isViewMode}
                  />
                </div>

                {/* Row 5: Usage Type | (empty) */}
                <div className={classes.fieldItem}>
                  <GluuMultiSelectRow
                    label="fields.usage_type"
                    name="usageType"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.usageType}
                    options={USAGE_TYPE_OPTIONS}
                    doc_category={ATTRIBUTE}
                    doc_entry="usageType"
                    helperText={t('messages.multi_select_hint')}
                    showError={!!(formik.errors.usageType && formik.touched.usageType)}
                    errorMessage={
                      formik.errors.usageType ? t(formik.errors.usageType as string) : ''
                    }
                    disabled={isViewMode}
                  />
                </div>

                {/* empty cell to keep grid alignment */}
                <div />

                {/* Row 6: Saml1 URI | Saml2 URI */}
                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.saml1_uri"
                    name="saml1Uri"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values?.saml1Uri ?? ''}
                    doc_category={ATTRIBUTE}
                    doc_entry="saml1Uri"
                    placeholder={t('placeholders.enter_here')}
                    disabled={isViewMode}
                  />
                </div>

                <div className={classes.fieldItem}>
                  <GluuInputRow
                    label="fields.saml2_uri"
                    name="saml2Uri"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values?.saml2Uri ?? ''}
                    doc_category={ATTRIBUTE}
                    doc_entry="saml2Uri"
                    placeholder={t('placeholders.enter_here')}
                    disabled={isViewMode}
                  />
                </div>

                {/* Row 7: Multivalued | Hide On Discovery */}
                <div className={classes.toggleRow}>
                  <GluuToogleRow
                    name="oxMultiValuedAttribute"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    label="fields.multivalued"
                    value={formik.values?.oxMultiValuedAttribute}
                    handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                      formik.setFieldValue('oxMultiValuedAttribute', e.target.checked)
                    }}
                    doc_category={ATTRIBUTE}
                    disabled={isViewMode}
                  />
                </div>

                <div className={classes.toggleRow}>
                  <GluuToogleRow
                    name="jansHideOnDiscovery"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    label="fields.hide_on_discovery"
                    value={formik.values?.jansHideOnDiscovery}
                    doc_category={ATTRIBUTE}
                    disabled={isViewMode}
                    handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                      formik.setFieldValue('jansHideOnDiscovery', e.target.checked)
                    }}
                  />
                </div>

                {/* Row 8: Include In SCIM Extension | Enable Custom Validation */}
                <div className={classes.toggleRow}>
                  <GluuToogleRow
                    name="scimCustomAttr"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    label="fields.include_in_scim_extension"
                    value={formik.values?.scimCustomAttr}
                    doc_category={ATTRIBUTE}
                    disabled={isViewMode}
                    handler={(e: React.ChangeEvent<HTMLInputElement>) => {
                      formik.setFieldValue('scimCustomAttr', e.target.checked)
                    }}
                  />
                </div>

                <div className={classes.toggleRow}>
                  <GluuToogleRow
                    name="validation"
                    lsize={12}
                    rsize={12}
                    label="fields.enable_custom_validation_for_this_attribute"
                    value={validation}
                    handler={() => handleValidation(formik)}
                    doc_category={ATTRIBUTE}
                    disabled={isViewMode}
                  />
                </div>

                {/* Validation fields — each in its own grid cell */}
                {validation && (
                  <>
                    <div className={classes.fieldItem}>
                      <GluuInputRow
                        label="fields.regular_expression"
                        name="regexp"
                        formik={formik}
                        lsize={12}
                        rsize={12}
                        value={formik.values?.regexp ?? undefined}
                        doc_category={ATTRIBUTE}
                        placeholder={t('placeholders.enter_here')}
                        disabled={isViewMode}
                      />
                    </div>
                    <div className={classes.fieldItem}>
                      <GluuInputRow
                        label="fields.minimum_length"
                        name="minLength"
                        formik={formik}
                        type="number"
                        lsize={12}
                        rsize={12}
                        value={formik.values?.minLength ?? undefined}
                        doc_category={ATTRIBUTE}
                        disabled={isViewMode}
                        placeholder={getFieldPlaceholder(t, 'fields.minimum_length')}
                      />
                    </div>
                    <div className={classes.fieldItem}>
                      <GluuInputRow
                        label="fields.maximum_length"
                        name="maxLength"
                        formik={formik}
                        type="number"
                        lsize={12}
                        rsize={12}
                        value={formik.values?.maxLength ?? undefined}
                        doc_category={ATTRIBUTE}
                        disabled={isViewMode}
                        placeholder={getFieldPlaceholder(t, 'fields.maximum_length')}
                      />
                    </div>

                    <div />
                  </>
                )}
              </div>

              <GluuThemeFormFooter
                showBack={!hideButtons?.back}
                onBack={handleBack}
                showCancel={!hideButtons?.save}
                onCancel={() => handleCancel(formik)}
                disableCancel={!formHasChanged}
                showApply={!hideButtons?.save}
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
                operations={commitOperations}
              />
            </div>
          </Form>
        )
      }}
    </Formik>
  )
})

UserClaimsForm.displayName = 'UserClaimsForm'

export default UserClaimsForm
