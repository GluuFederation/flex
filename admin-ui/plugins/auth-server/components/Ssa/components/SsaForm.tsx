import React, { useEffect, useState, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useFormik, type FormikProps } from 'formik'
import type { JsonValue } from 'Routes/Apps/Gluu/types/common'
import { Form, Col, FormGroup } from 'Components'
import { GluuDatePicker } from '@/components/GluuDatePicker'
import { createDate, DATE_FORMATS } from '@/utils/dayjsUtils'
import type { Dayjs } from '@/utils/dayjsUtils'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuToogleRow from 'Routes/Apps/Gluu/GluuToogleRow'
import GluuRemovableInputRow from 'Routes/Apps/Gluu/GluuRemovableInputRow'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import GluuAutocomplete from 'Routes/Apps/Gluu/GluuAutocomplete'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { SSA } from 'Utils/ApiResources'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import { getFieldPlaceholder } from '@/utils/placeholderUtils'
import AvailableCustomAttributesPanel from './AvailableCustomAttributesPanel'
import { useStyles } from './styles/SsaForm.style'
import { GRANT_TYPES } from '../helper/constants'
import { useSsaValidationState } from '../hooks'
import { getSsaValidationSchema } from '../helper/validations'
import {
  getSsaInitialValues,
  shouldDisableApplyButton,
  hasFormChanges,
  toEpochSecondsFromDayjs,
} from '../utils'
import type { SsaFormValues, SsaCreatePayload } from '../types/SsaApiTypes'
import type { ModifiedFields } from '../types/SsaFormTypes'
import type { SsaFormProps } from '../types/ComponentTypes'

const SsaForm: React.FC<SsaFormProps> = ({
  onSubmitData,
  isSubmitting,
  customAttributes,
  softwareRolesOptions,
}) => {
  const { t } = useTranslation()
  const { navigateBack } = useAppNavigation()
  const { state: themeState } = useTheme()
  const selectedTheme = themeState?.theme ?? DEFAULT_THEME
  const themeColors = useMemo(() => getThemeColor(selectedTheme), [selectedTheme])
  const isDark = selectedTheme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })

  const [modal, setModal] = useState(false)
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([])
  const [searchInputValue, setSearchInputValue] = useState('')
  const [modifiedFields, setModifiedFields] = useState<ModifiedFields>({})
  const [pendingPayload, setPendingPayload] = useState<SsaCreatePayload | null>(null)
  const [formHeight, setFormHeight] = useState(0)
  const formContentRef = useRef<HTMLDivElement>(null)

  const formik = useFormik<SsaFormValues>({
    initialValues: getSsaInitialValues(),
    validationSchema: getSsaValidationSchema(),
    enableReinitialize: true,
    validateOnMount: true,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: () => {
      openCommitDialog()
    },
  })

  useEffect(() => {
    if (!formContentRef.current) return
    const observer = new ResizeObserver(([entry]) => {
      setFormHeight(entry.contentRect.height)
    })
    observer.observe(formContentRef.current)
    return () => observer.disconnect()
  }, [])

  const handleNavigateBack = useCallback(() => {
    navigateBack(ROUTES.AUTH_SERVER_SSA_LIST)
  }, [navigateBack])

  const openCommitDialog = useCallback(() => {
    const { is_expirable, expirationDate } = formik.values
    const payload: SsaCreatePayload = { ...formik.values }

    if (is_expirable) {
      const expirationSeconds = toEpochSecondsFromDayjs(expirationDate as Dayjs | null)
      if (expirationSeconds !== null) {
        payload.expiration = expirationSeconds
      }
    }

    setPendingPayload(payload)
    setModal(true)
  }, [formik.values])

  const handleInputChange = useCallback((value: string) => {
    setSearchInputValue(value)
  }, [])

  const handleAttributeSelect = useCallback(
    (attribute: string) => {
      setSelectedAttributes((prev) => [...prev, attribute])
      formik.setFieldValue(attribute, '')
    },
    [formik],
  )

  const handleAttributeRemove = useCallback(
    (attribute: string) => {
      setSelectedAttributes((prev) => prev.filter((attr) => attr !== attribute))
      formik.setFieldValue(attribute, '')
      setModifiedFields((prev) => {
        const newFields = { ...prev }
        delete newFields[attribute]
        return newFields
      })
    },
    [formik],
  )

  const isFormDirty = useMemo(
    () => hasFormChanges(formik.dirty, selectedAttributes, modifiedFields),
    [formik.dirty, selectedAttributes, modifiedFields],
  )

  const handleCancel = useCallback(() => {
    formik.resetForm()
    setModifiedFields({})
    setSelectedAttributes([])
  }, [formik])

  const handleChange = useCallback(
    (data: { target: { name: string; value: string | string[] | boolean } }) => {
      const { name, value } = data.target
      formik.setFieldValue(name, value)
      formik.setFieldTouched(name, true, false)
    },
    [formik],
  )

  const handleAutocompleteChange = useCallback(
    (fieldName: 'software_roles' | 'grant_types', nextValues: string[]) => {
      formik.setFieldValue(fieldName, nextValues)
      formik.setFieldTouched(fieldName, true, false)
    },
    [formik],
  )

  const validationState = useSsaValidationState(formik)

  const claimsPanelStyle = useMemo(
    () => (formHeight > 0 ? { maxHeight: formHeight } : undefined),
    [formHeight],
  )

  const disableApply = useMemo(
    () =>
      shouldDisableApplyButton(
        isSubmitting,
        formik.dirty,
        formik.isValid,
        modifiedFields,
        selectedAttributes,
      ),
    [isSubmitting, formik.dirty, formik.isValid, modifiedFields, selectedAttributes],
  )

  const enterHerePlaceholder = useMemo(() => t('placeholders.enter_here'), [t])

  const softwareRolesPlaceholder = useMemo(
    () => getFieldPlaceholder(t, 'fields.software_roles'),
    [t],
  )

  const grantTypesPlaceholder = useMemo(() => getFieldPlaceholder(t, 'fields.grant_types'), [t])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      formik.handleSubmit()
    },
    [formik],
  )

  const handleApply = useCallback(() => {
    formik.handleSubmit()
  }, [formik])

  const handleExpirationDateChange = useCallback(
    (date: Dayjs | null) => {
      formik.setFieldValue('expirationDate', date)
    },
    [formik],
  )

  const submitForm = useCallback(
    async (userMessage: string): Promise<void> => {
      if (!pendingPayload) return
      await onSubmitData(pendingPayload, userMessage)
      setModal(false)
      setPendingPayload(null)
    },
    [onSubmitData, pendingPayload],
  )

  return (
    <>
      <Form onSubmit={handleFormSubmit}>
        <FormGroup row className={classes.formRoot}>
          <Col sm={8}>
            <div ref={formContentRef} className={classes.leftStack}>
              <div className={classes.sectionCard}>
                <div className={classes.fieldsGrid}>
                  <GluuInputRow
                    label="fields.software_id"
                    name="software_id"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    required
                    value={formik.values.software_id}
                    placeholder={enterHerePlaceholder}
                    showError={validationState.softwareIdError}
                    errorMessage={validationState.softwareIdErrorMessage}
                    handleChange={handleChange}
                    doc_category={SSA}
                  />

                  <GluuInputRow
                    label="fields.organization"
                    name="org_id"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    required
                    value={formik.values.org_id}
                    placeholder={enterHerePlaceholder}
                    showError={validationState.organizationError}
                    errorMessage={validationState.organizationErrorMessage}
                    handleChange={handleChange}
                    doc_category={SSA}
                    doc_entry="org_id"
                  />

                  <div className={classes.autocompleteFieldWrap}>
                    <div className={classes.autocompleteCardWrap}>
                      <GluuAutocomplete
                        label={t('fields.software_roles')}
                        name="software_roles"
                        value={formik.values.software_roles}
                        options={softwareRolesOptions}
                        allowCustom
                        required
                        onChange={(nextValues) =>
                          handleAutocompleteChange('software_roles', nextValues)
                        }
                        onBlur={() => formik.setFieldTouched('software_roles', true, false)}
                        placeholder={softwareRolesPlaceholder}
                        showError={false}
                        doc_category={SSA}
                        cardBackgroundColor={themeColors.inputBackground}
                        inputBackgroundColor={
                          themeColors.settings?.cardBackground ?? themeColors.card.background
                        }
                      />
                    </div>
                    {validationState.softwareRolesError && (
                      <GluuText disableThemeColor className={classes.autocompleteFieldError}>
                        {validationState.softwareRolesErrorMessage}
                      </GluuText>
                    )}
                  </div>

                  <div className={classes.autocompleteFieldWrap}>
                    <div className={classes.autocompleteCardWrap}>
                      <GluuAutocomplete
                        label={t('fields.grant_types')}
                        name="grant_types"
                        value={formik.values.grant_types}
                        options={GRANT_TYPES}
                        allowCustom
                        required
                        onChange={(nextValues) =>
                          handleAutocompleteChange('grant_types', nextValues)
                        }
                        onBlur={() => formik.setFieldTouched('grant_types', true, false)}
                        placeholder={grantTypesPlaceholder}
                        showError={false}
                        doc_category={SSA}
                        cardBackgroundColor={themeColors.inputBackground}
                        inputBackgroundColor={
                          themeColors.settings?.cardBackground ?? themeColors.card.background
                        }
                      />
                    </div>
                    {validationState.grantTypesError && (
                      <GluuText disableThemeColor className={classes.autocompleteFieldError}>
                        {validationState.grantTypesErrorMessage}
                      </GluuText>
                    )}
                  </div>

                  <div className={classes.fullRow}>
                    <GluuInputRow
                      label="fields.description"
                      name="description"
                      formik={formik}
                      lsize={12}
                      rsize={12}
                      required
                      value={formik.values.description}
                      placeholder={enterHerePlaceholder}
                      showError={validationState.descriptionError}
                      errorMessage={validationState.descriptionErrorMessage}
                      handleChange={handleChange}
                      doc_category={SSA}
                    />
                  </div>

                  <GluuToogleRow
                    name="one_time_use"
                    formik={formik}
                    label="fields.one_time_use"
                    lsize={12}
                    rsize={12}
                    value={formik.values.one_time_use}
                    isDark={isDark}
                    doc_category={SSA}
                  />

                  <GluuToogleRow
                    name="rotate_ssa"
                    formik={formik}
                    label="fields.rotate_ssa"
                    lsize={12}
                    rsize={12}
                    value={formik.values.rotate_ssa}
                    isDark={isDark}
                    doc_category={SSA}
                  />

                  <GluuToogleRow
                    name="is_expirable"
                    formik={formik}
                    label="fields.is_expirable"
                    lsize={12}
                    rsize={12}
                    value={formik.values.is_expirable}
                    isDark={isDark}
                    doc_category={SSA}
                  />

                  {formik.values.is_expirable && (
                    <div className={classes.datePickerCell}>
                      <GluuDatePicker
                        format={DATE_FORMATS.DATE_PICKER_DISPLAY_US}
                        value={formik.values.expirationDate as Dayjs | null}
                        onChange={handleExpirationDateChange}
                        minDate={createDate()}
                        textColor={themeColors.fontColor}
                        backgroundColor={themeColors.background}
                        inputHeight={50}
                      />
                    </div>
                  )}
                </div>

                <div className={classes.dynamicClaimsWrap}>
                  {selectedAttributes.map((attribute) => (
                    <GluuRemovableInputRow
                      key={attribute}
                      label={attribute}
                      name={attribute}
                      isDirect={true}
                      value={formik.values[attribute] as string}
                      modifiedFields={modifiedFields}
                      setModifiedFields={setModifiedFields}
                      // GluuRemovableInputRow constrains FormikProps to Record<string, JsonValue>;
                      // SsaFormValues includes a Dayjs `expirationDate` (not JsonValue), but this row
                      // only ever reads the dynamic string-valued custom attribute fields, so the cast
                      // is safe at runtime.
                      formik={formik as object as FormikProps<Record<string, JsonValue>>}
                      lsize={12}
                      handler={() => handleAttributeRemove(attribute)}
                      doc_category={SSA}
                    />
                  ))}
                </div>
              </div>
            </div>
          </Col>
          <Col sm={4}>
            <div className={classes.claimsPanelWrap} style={claimsPanelStyle}>
              <AvailableCustomAttributesPanel
                availableAttributes={customAttributes}
                selectedAttributes={selectedAttributes}
                onAttributeSelect={handleAttributeSelect}
                searchInputValue={searchInputValue}
                onSearchChange={handleInputChange}
              />
            </div>
          </Col>
        </FormGroup>

        <GluuThemeFormFooter
          showBack
          onBack={handleNavigateBack}
          showCancel
          onCancel={handleCancel}
          disableCancel={isSubmitting || !isFormDirty}
          showApply
          onApply={handleApply}
          disableApply={disableApply}
          applyButtonType="button"
          isLoading={isSubmitting}
        />
      </Form>

      <GluuCommitDialog
        handler={() => {
          setModal(false)
          setPendingPayload(null)
        }}
        modal={modal}
        feature={adminUiFeatures.ssa_write}
        onAccept={submitForm}
        formik={formik}
      />
    </>
  )
}

SsaForm.displayName = 'SsaForm'

export default SsaForm
