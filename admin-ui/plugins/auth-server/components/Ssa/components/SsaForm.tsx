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
import GluuMultiSelectRow from 'Routes/Apps/Gluu/GluuMultiSelectRow'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { SSA } from 'Utils/ApiResources'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import AvailableCustomAttributesPanel from './AvailableCustomAttributesPanel'
import { useStyles } from './styles/SsaForm.style'
import { GRANT_TYPES } from '../helper/constants'
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

  const submitForm = async (userMessage: string): Promise<void> => {
    if (!pendingPayload) return
    await onSubmitData(pendingPayload, userMessage)
    setModal(false)
    setPendingPayload(null)
  }

  const softwareRolesMultiSelectOptions = useMemo(
    () => softwareRolesOptions.map((role) => ({ value: role, label: role })),
    [softwareRolesOptions],
  )

  const grantTypesMultiSelectOptions = useMemo(
    () => GRANT_TYPES.map((gt) => ({ value: gt, label: gt })),
    [],
  )

  const handleChange = useCallback(
    (data: { target: { name: string; value: string | string[] | boolean } }) => {
      const { name, value } = data.target
      formik.setFieldValue(name, value)
      formik.setFieldTouched(name, true, false)
    },
    [formik],
  )

  return (
    <>
      <Form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault()
          formik.handleSubmit()
        }}
      >
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
                    placeholder={t('placeholders.enter_here')}
                    showError={Boolean(formik.touched.software_id && formik.errors.software_id)}
                    errorMessage={
                      typeof formik.errors.software_id === 'string' ? formik.errors.software_id : ''
                    }
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
                    placeholder={t('placeholders.enter_here')}
                    showError={Boolean(formik.touched.org_id && formik.errors.org_id)}
                    errorMessage={
                      typeof formik.errors.org_id === 'string' ? formik.errors.org_id : ''
                    }
                    handleChange={handleChange}
                    doc_category={SSA}
                    doc_entry="org_id"
                  />

                  <div className={classes.fullRow}>
                    <GluuInputRow
                      label="fields.description"
                      name="description"
                      formik={formik}
                      lsize={12}
                      rsize={12}
                      required
                      value={formik.values.description}
                      placeholder={t('placeholders.enter_here')}
                      showError={Boolean(formik.touched.description && formik.errors.description)}
                      errorMessage={
                        typeof formik.errors.description === 'string'
                          ? formik.errors.description
                          : ''
                      }
                      handleChange={handleChange}
                      doc_category={SSA}
                    />
                  </div>

                  <GluuMultiSelectRow
                    label="fields.software_roles"
                    name="software_roles"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.software_roles}
                    options={softwareRolesMultiSelectOptions}
                    required
                    doc_category={SSA}
                    showError={Boolean(
                      formik.touched.software_roles && formik.errors.software_roles,
                    )}
                    errorMessage={(formik.errors.software_roles as string) || ''}
                  />

                  <GluuMultiSelectRow
                    label="fields.grant_types"
                    name="grant_types"
                    formik={formik}
                    lsize={12}
                    rsize={12}
                    value={formik.values.grant_types}
                    options={grantTypesMultiSelectOptions}
                    required
                    doc_category={SSA}
                    showError={Boolean(formik.touched.grant_types && formik.errors.grant_types)}
                    errorMessage={(formik.errors.grant_types as string) || ''}
                  />

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
                        onChange={(date) => formik.setFieldValue('expirationDate', date)}
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
            <div
              className={classes.claimsPanelWrap}
              style={formHeight > 0 ? { maxHeight: formHeight } : {}}
            >
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
          onApply={() => formik.handleSubmit()}
          disableApply={shouldDisableApplyButton(
            isSubmitting,
            formik.dirty,
            formik.isValid,
            modifiedFields,
            selectedAttributes,
          )}
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
