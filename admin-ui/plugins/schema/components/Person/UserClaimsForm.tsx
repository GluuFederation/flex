import React, { useState, useMemo, useCallback, memo } from 'react'
import { Formik, FormikProps } from 'formik'
import { useTranslation } from 'react-i18next'
import { Form } from 'Components'
import type { MultiSelectOption } from 'Routes/Apps/Gluu/types/GluuMultiSelectRow.types'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { ATTRIBUTE } from 'Utils/ApiResources'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useTheme } from 'Context/theme/themeContext'
import getThemeColor from 'Context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/UserClaimsFormPage.style'
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
import type { AttributeFormProps, AttributeFormValues } from '../types/UserClaimsListPage.types'

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

  const theme = useTheme()
  const { themeColors, isDark } = useMemo(() => {
    const selected = theme.state.theme || DEFAULT_THEME
    return {
      themeColors: getThemeColor(selected),
      isDark: selected === THEME_DARK,
    }
  }, [theme.state.theme])

  const { classes } = useStyles({ isDark, themeColors })

  const initialValues = useInitialAttributeValues(item)
  const defaultFormValues = useMemo(() => getDefaultFormValues(), [])
  const isCreateMode = useMemo(() => !item.inum, [item.inum])
  const initialValidationState = useMemo(() => getInitialValidationState(item), [item])
  const [validation, setValidation] = useState<boolean>(initialValidationState)
  const validationSchema = useAttributeValidationSchema(validation)
  const isViewMode = useMemo(() => hideButtons?.save === true, [hideButtons])

  const statusOptions = useMemo(
    () => [
      { value: 'active', label: t('options.active') },
      { value: 'inactive', label: t('options.inactive') },
    ],
    [t],
  )

  const dataTypeOptions = useMemo(
    () => [
      { value: 'string', label: t('options.string') },
      { value: 'json', label: t('options.json') },
      { value: 'numeric', label: t('options.numeric') },
      { value: 'binary', label: t('options.binary') },
      { value: 'certificate', label: t('options.certificate') },
      { value: 'date', label: t('options.date') },
      { value: 'boolean', label: t('options.boolean') },
    ],
    [t],
  )

  const formClassName = useMemo(
    () => `${classes.formLabels} ${classes.formWithInputs}`,
    [classes.formLabels, classes.formWithInputs],
  )

  const toggleModal = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const handleValidation = useCallback((formik: FormikProps<AttributeFormValues>) => {
    setValidation((prev) => {
      const newValue = !prev
      if (!newValue) {
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

  const handleBack = useCallback(() => {
    navigateBack(ROUTES.ATTRIBUTES_LIST)
  }, [navigateBack])

  const handleCancel = useCallback(
    (formik: FormikProps<AttributeFormValues>) => {
      if (isCreateMode) {
        formik.resetForm({ values: defaultFormValues })
        setValidation(false)
      } else {
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
      validateOnMount
      validateOnChange
      validateOnBlur
      onSubmit={toggleModal}
      enableReinitialize
      key={item.inum || 'new'}
    >
      {(formik: FormikProps<AttributeFormValues>) => {
        const valuesChanged = hasFormChanged(initialValues, formik.values)
        const formHasChanged = valuesChanged || validation !== initialValidationState
        const formValid = isFormValid(formik.values, formik.errors, formik.isValid)
        const canApply = formValid && (isCreateMode || formHasChanged)

        return (
          <Form onSubmit={formik.handleSubmit}>
            <div className={formClassName}>
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
                    values={statusOptions}
                    errorMessage={formik.errors.status ? t(formik.errors.status) : undefined}
                    showError={!!(formik.errors.status && formik.touched.status)}
                    disabled={isViewMode}
                    required
                  />
                </div>

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
                    values={dataTypeOptions}
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

                <div />

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
