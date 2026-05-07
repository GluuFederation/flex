import React, { useState, ChangeEvent, useMemo, useCallback } from 'react'
import type { FormikProps } from 'formik'
import { useFormik } from 'formik'
import Toggle from 'react-toggle'
import { Form, FormGroup, Input } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import { GluuButton } from '@/components/GluuButton'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { SCRIPT } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { Button } from 'Components'
import { Add, DeleteOutline, ErrorIcon } from '@/components/icons'
import { Skeleton, Alert } from '@mui/material'
import GluuText from 'Routes/Apps/Gluu/GluuText'
import { FEATURE_CUSTOM_SCRIPT_WRITE } from './constants'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { THEME_DARK } from '@/context/theme/constants'
import { useStyles } from './styles/CustomScriptFormPage.style'
import {
  CustomScriptFormProps,
  FormValues,
  ModuleProperty,
  ConfigurationProperty,
  ScriptType,
  CustomScriptItem,
} from './types'
import { useCustomScriptTypes } from './hooks'
import { filterEmptyObjects } from 'Utils/Util'
import {
  getCustomScriptValidationSchema,
  transformToFormValues,
  getModuleProperty,
  buildChangedFieldOperations,
} from './helper'
import { PROGRAMMING_LANGUAGES, LOCATION_TYPE_DB, DEFAULT_SCRIPT_TYPE } from './constants'
import { PersonAuthenticationFields } from './PersonAuthenticationFields'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
import GluuScriptErrorModal from 'Routes/Apps/Gluu/GluuScriptErrorModal'
import type { GluuCommitDialogOperation } from 'Routes/Apps/Gluu/types/index'
import GluuInputEditor from 'Routes/Apps/Gluu/GluuInputEditor'

const transformPropertyForApi = (
  prop: ModuleProperty | ConfigurationProperty,
): ModuleProperty | ConfigurationProperty => {
  const baseResult: Record<string, string | boolean | undefined> = {
    value1: prop.value1 || '',
    value2: prop.value2 || '',
  }
  if (prop.hide !== undefined) {
    baseResult.hide = prop.hide
  }
  if ('description' in prop && prop.description) {
    baseResult.description = prop.description
  }
  return baseResult as ModuleProperty | ConfigurationProperty
}

const CustomScriptForm = ({ item, handleSubmit, viewOnly = false }: CustomScriptFormProps) => {
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const { themeColors, isDark } = useMemo(
    () => ({
      themeColors: getThemeColor(themeState.theme),
      isDark: themeState.theme === THEME_DARK,
    }),
    [themeState.theme],
  )
  const { classes } = useStyles({ isDark, themeColors })
  const [modal, setModal] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [commitOperations, setCommitOperations] = useState<GluuCommitDialogOperation[]>([])

  const isEditMode = useMemo(() => Boolean(item?.inum), [item?.inum])

  const { data: scriptTypes = [], isLoading: loadingScriptTypes } = useCustomScriptTypes()

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const handleNavigateBack = useCallback(() => {
    navigateBack(ROUTES.CUSTOM_SCRIPT_LIST)
  }, [navigateBack])

  const validationSchema = useMemo(() => getCustomScriptValidationSchema(t), [t])

  const initialValues = useMemo(() => transformToFormValues(item), [item.inum])

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (_values, { setSubmitting }) => {
      const operations = isEditMode
        ? buildChangedFieldOperations(initialValues, formik.values, t)
        : []
      setCommitOperations(operations)
      setSubmitting(false)
      toggle()
    },
  })

  const updatePropertyInModuleProperties = useCallback(
    (properties: ModuleProperty[], key: string, value: string): ModuleProperty[] => {
      if (!value) {
        return properties.filter((p) => p.value1 !== key)
      }

      const index = properties.findIndex((p) => p.value1 === key)
      if (index >= 0) {
        return properties.map((p, idx) =>
          idx === index ? { ...p, value2: value, description: p.description || '' } : p,
        )
      }

      return [...properties, { value1: key, value2: value, description: '' }]
    },
    [],
  )

  const usageTypeChange = useCallback(
    (value: string): void => {
      const currentProperties = formik.values.moduleProperties || []
      const newProperties = updatePropertyInModuleProperties(currentProperties, 'usage_type', value)

      formik.setFieldValue('moduleProperties', newProperties, true)
    },
    [formik, updatePropertyInModuleProperties],
  )

  const onLevelChange = useCallback(
    (level: number): void => {
      formik.setFieldValue('level', level)
      formik.setFieldTouched('level', true)
    },
    [formik],
  )

  const showErrorModal = useCallback((): void => setIsModalOpen(true), [])

  const closeErrorModal = useCallback((): void => setIsModalOpen(false), [])

  const handleCancel = useCallback(() => {
    formik.resetForm({ values: initialValues })
  }, [formik, initialValues])

  const submitForm = useCallback(
    async (userMessage: string) => {
      const values = formik.values

      const mappedConfigurationProperties: ConfigurationProperty[] | undefined =
        values.configurationProperties
          ? (filterEmptyObjects(values.configurationProperties).map(
              transformPropertyForApi,
            ) as ConfigurationProperty[])
          : undefined

      const mappedModuleProperties: ModuleProperty[] | undefined = values.moduleProperties
        ? (filterEmptyObjects(values.moduleProperties).map(
            transformPropertyForApi,
          ) as ModuleProperty[])
        : undefined

      const booleanEnabled: boolean | undefined = Array.isArray(values.enabled)
        ? values.enabled.length > 0
        : typeof values.enabled === 'boolean'
          ? values.enabled
          : undefined

      const customScript: CustomScriptItem = {
        ...item,
        name: values.name,
        description: values.description,
        scriptType: values.scriptType,
        programmingLanguage: values.programmingLanguage,
        level: values.level,
        aliases: values.aliases && values.aliases.length ? values.aliases : undefined,
        moduleProperties: mappedModuleProperties,
        configurationProperties: mappedConfigurationProperties,
        enabled: booleanEnabled,
        locationType: LOCATION_TYPE_DB,
        script: values.script,
      }

      const actionMessage = userMessage?.trim()
      const reqBody = {
        customScript: actionMessage
          ? { ...customScript, action_message: actionMessage }
          : customScript,
      }

      await handleSubmit(reqBody)
    },
    [formik.values, item, handleSubmit],
  )

  const addConfigurationProperty = useCallback(() => {
    const current = formik.values.configurationProperties || []
    formik.setFieldValue('configurationProperties', [...current, { value1: '', value2: '' }])
  }, [formik])

  const removeConfigurationProperty = useCallback(
    (index: number) => {
      const current = formik.values.configurationProperties || []
      formik.setFieldValue(
        'configurationProperties',
        current.filter((_, i) => i !== index),
      )
    },
    [formik],
  )

  const addModuleProperty = useCallback(() => {
    const current = formik.values.moduleProperties || []
    formik.setFieldValue('moduleProperties', [...current, { value1: '', value2: '' }])
  }, [formik])

  const removeModuleProperty = useCallback(
    (index: number) => {
      const current = formik.values.moduleProperties || []
      formik.setFieldValue(
        'moduleProperties',
        current.filter((_, i) => i !== index),
      )
    },
    [formik],
  )

  const scriptTypeChangeHandler = useMemo(
    () => ({
      handleChange: async (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const target = e.target as HTMLSelectElement
        const newType = target.value
        await formik.setFieldValue('scriptType', newType, false)
        if (newType !== DEFAULT_SCRIPT_TYPE) {
          const cleaned = (formik.values.moduleProperties || []).filter(
            (p) => p.value1 !== 'usage_type',
          )
          await formik.setFieldValue('moduleProperties', cleaned, false)
        }
        formik.setFieldTouched('scriptType', true, false)
        formik.validateForm()
      },
    }),
    [formik],
  )

  const commitDialogFormik = useMemo(
    () => ({
      setFieldValue: (field: string, value: string, shouldValidate?: boolean) =>
        formik.setFieldValue(field, value, shouldValidate),
    }),
    [formik],
  )

  const scriptTypeSelectOptions = useMemo(
    () =>
      scriptTypes.map((ele: ScriptType) => ({
        value: ele.value,
        label: ele.name,
      })),
    [scriptTypes],
  )

  const programmingLanguageOptions = useMemo(
    () =>
      PROGRAMMING_LANGUAGES.map((lang) => ({
        value: lang.value,
        label: t(lang.labelKey),
      })),
    [t],
  )

  const handleEnabledToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue('enabled', e.target.checked)
    },
    [formik],
  )

  const isPersonAuth = useMemo(
    () => formik.values.scriptType === DEFAULT_SCRIPT_TYPE,
    [formik.values.scriptType],
  )

  return (
    <>
      <GluuScriptErrorModal
        isOpen={isModalOpen}
        error={item.scriptError?.stackTrace ?? ''}
        handler={closeErrorModal}
      />

      {item?.scriptError?.stackTrace && (
        <Alert
          severity="error"
          icon={<ErrorIcon className={classes.errorAlertIcon} />}
          className={classes.errorAlert}
          action={
            <Button size="sm" className={classes.errorButton} onClick={showErrorModal}>
              {t('actions.show_error')}
            </Button>
          }
        >
          <GluuText variant="span" disableThemeColor className={classes.errorAlertText}>
            {t('messages.error_in_script')}
          </GluuText>
        </Alert>
      )}
      <Form onSubmit={formik.handleSubmit} className={classes.formSection}>
        <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
          {item.inum && (
            <div className={`${classes.fieldItem} ${classes.inumFullWidth}`}>
              <GluuInumInput
                label="fields.inum"
                name="inum"
                lsize={12}
                rsize={12}
                value={item.inum}
                doc_category={SCRIPT}
                isDark={isDark}
              />
            </div>
          )}

          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.name"
              formik={formik}
              value={formik.values.name}
              lsize={12}
              rsize={12}
              required
              name="name"
              doc_category={SCRIPT}
              doc_entry="name"
              placeholder={t('placeholders.name')}
              errorMessage={formik.errors.name}
              showError={!!(formik.errors.name && formik.touched.name)}
              isDark={isDark}
              disabled={viewOnly}
            />
          </div>
          <div className={classes.fieldItem}>
            <GluuInputRow
              label="fields.description"
              formik={formik}
              value={formik.values.description}
              lsize={12}
              rsize={12}
              name="description"
              doc_category={SCRIPT}
              doc_entry="description"
              placeholder={t('placeholders.description')}
              errorMessage={formik.errors.description}
              showError={!!(formik.errors.description && formik.touched.description)}
              isDark={isDark}
              disabled={viewOnly}
            />
          </div>

          <div className={classes.fieldItem}>
            {loadingScriptTypes ? (
              <Skeleton variant="text" width="100%" sx={{ fontSize: '3rem' }} />
            ) : (
              <GluuSelectRow
                label="fields.script_type"
                name="scriptType"
                value={formik.values.scriptType}
                formik={scriptTypeChangeHandler}
                values={scriptTypeSelectOptions}
                lsize={12}
                rsize={12}
                required
                doc_category={SCRIPT}
                doc_entry="scriptType"
                disabled={viewOnly || isEditMode}
                errorMessage={formik.errors.scriptType}
                showError={
                  !!(
                    formik.errors.scriptType &&
                    formik.touched.scriptType &&
                    !formik.values.scriptType
                  )
                }
                isDark={isDark}
              />
            )}
          </div>
          <div className={classes.fieldItem}>
            <GluuSelectRow
              label="fields.programming_language"
              name="programmingLanguage"
              value={formik.values.programmingLanguage}
              formik={formik}
              values={programmingLanguageOptions}
              lsize={12}
              rsize={12}
              required
              doc_category={SCRIPT}
              doc_entry="programmingLanguage"
              errorMessage={formik.errors.programmingLanguage}
              showError={
                !!(
                  formik.errors.programmingLanguage &&
                  formik.touched.programmingLanguage &&
                  !formik.values.programmingLanguage
                )
              }
              isDark={isDark}
              disabled={viewOnly}
            />
          </div>

          <div className={classes.levelEnabledRow}>
            <div className={classes.fieldItem}>
              <GluuInputRow
                label="fields.level"
                name="level"
                type="number"
                value={formik.values.level}
                formik={formik}
                lsize={12}
                rsize={12}
                doc_category={SCRIPT}
                doc_entry="level"
                isDark={isDark}
                disabled={viewOnly}
                handleChange={(e) => onLevelChange(Number(e.target.value))}
                showError={!!(formik.errors.level && formik.touched.level)}
                errorMessage={String(formik.errors.level ?? '')}
              />
            </div>
            <div className={classes.fieldItem}>
              <FormGroup>
                <GluuLabel
                  label="options.enabled"
                  size={12}
                  doc_category={SCRIPT}
                  doc_entry="enabled"
                  isDark={isDark}
                />
                <Toggle
                  id="enabled"
                  name="enabled"
                  onChange={handleEnabledToggle}
                  checked={Boolean(formik.values.enabled)}
                  disabled={viewOnly}
                />
              </FormGroup>
            </div>
          </div>

          {isPersonAuth && (
            <div className={classes.fieldItemFullWidth}>
              <PersonAuthenticationFields
                formik={formik}
                viewOnly={viewOnly}
                isDark={isDark}
                usageTypeChange={usageTypeChange}
                getModuleProperty={getModuleProperty}
              />
            </div>
          )}

          <div className={classes.fieldItemFullWidth}>
            <div
              className={`${classes.propsBox} ${!formik.values.configurationProperties?.length ? classes.propsBoxEmpty : ''}`.trim()}
            >
              <div
                className={`${classes.propsHeader} ${!formik.values.configurationProperties?.length ? classes.propsHeaderEmpty : ''}`.trim()}
              >
                <GluuText variant="h5" disableThemeColor>
                  <span className={classes.propsTitle}>{t('fields.custom_properties')}</span>
                </GluuText>
                <GluuButton
                  type="button"
                  disabled={viewOnly}
                  backgroundColor={themeColors.settings.addPropertyButton.bg}
                  textColor={themeColors.settings.addPropertyButton.text}
                  useOpacityOnHover
                  className={classes.propsActionBtn}
                  onClick={addConfigurationProperty}
                >
                  <Add fontSize="small" />
                  {t('actions.add_property')}
                </GluuButton>
              </div>
              <div className={classes.propsBody}>
                {(formik.values.configurationProperties || []).map((prop, index) => (
                  <div key={index} className={classes.propsRow}>
                    <Input
                      name={`configurationProperties.${index}.value1`}
                      value={prop.value1 || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('placeholders.enter_property_key')}
                      disabled={viewOnly}
                      className={classes.propsInput}
                    />
                    <Input
                      name={`configurationProperties.${index}.value2`}
                      value={prop.value2 || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('placeholders.enter_property_value')}
                      disabled={viewOnly}
                      className={classes.propsInput}
                    />
                    <GluuButton
                      type="button"
                      disabled={viewOnly}
                      backgroundColor={themeColors.settings.removeButton.bg}
                      textColor={themeColors.settings.removeButton.text}
                      useOpacityOnHover
                      className={classes.propsActionBtn}
                      onClick={() => removeConfigurationProperty(index)}
                    >
                      <DeleteOutline fontSize="small" />
                      {t('actions.remove')}
                    </GluuButton>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={classes.fieldItemFullWidth}>
            <div
              className={`${classes.propsBox} ${!formik.values.moduleProperties?.length ? classes.propsBoxEmpty : ''}`.trim()}
            >
              <div
                className={`${classes.propsHeader} ${!formik.values.moduleProperties?.length ? classes.propsHeaderEmpty : ''}`.trim()}
              >
                <GluuText variant="h5" disableThemeColor>
                  <span className={classes.propsTitle}>{t('fields.module_properties')}</span>
                </GluuText>
                <GluuButton
                  type="button"
                  disabled={viewOnly}
                  backgroundColor={themeColors.settings.addPropertyButton.bg}
                  textColor={themeColors.settings.addPropertyButton.text}
                  useOpacityOnHover
                  className={classes.propsActionBtn}
                  onClick={addModuleProperty}
                >
                  <Add fontSize="small" />
                  {t('actions.add_property')}
                </GluuButton>
              </div>
              <div className={classes.propsBody}>
                {(formik.values.moduleProperties || []).map((prop, index) => (
                  <div key={index} className={classes.propsRow}>
                    <Input
                      name={`moduleProperties.${index}.value1`}
                      value={prop.value1 || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('placeholders.enter_property_key')}
                      disabled={viewOnly}
                      className={classes.propsInput}
                    />
                    <Input
                      name={`moduleProperties.${index}.value2`}
                      value={prop.value2 || ''}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder={t('placeholders.enter_property_value')}
                      disabled={viewOnly}
                      className={classes.propsInput}
                    />
                    <GluuButton
                      type="button"
                      disabled={viewOnly}
                      backgroundColor={themeColors.settings.removeButton.bg}
                      textColor={themeColors.settings.removeButton.text}
                      useOpacityOnHover
                      className={classes.propsActionBtn}
                      onClick={() => removeModuleProperty(index)}
                    >
                      <DeleteOutline fontSize="small" />
                      {t('actions.remove')}
                    </GluuButton>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={`${classes.fieldItemFullWidth} ${classes.editorTheme}`}>
            <GluuInputEditor
              doc_category={SCRIPT}
              name="script"
              language={formik.values.programmingLanguage?.toLowerCase() ?? ''}
              label="fields.script"
              lsize={12}
              rsize={12}
              formik={formik as FormikProps<object>}
              value={formik.values.script}
              readOnly={viewOnly}
              errorMessage={formik.errors.script}
              showError={!!(formik.errors.script && formik.touched.script)}
              required
              isDark={isDark}
            />
          </div>
        </div>
        {viewOnly ? (
          <GluuThemeFormFooter
            showBack
            onBack={handleNavigateBack}
            showCancel={false}
            showApply={false}
          />
        ) : (
          <GluuThemeFormFooter
            showBack
            onBack={handleNavigateBack}
            showCancel
            onCancel={handleCancel}
            disableCancel={!formik.dirty}
            showApply
            onApply={formik.handleSubmit}
            disableApply={!formik.dirty || !formik.isValid}
            applyButtonType="button"
            isLoading={formik.isSubmitting ?? false}
          />
        )}
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          formik={commitDialogFormik}
          feature={FEATURE_CUSTOM_SCRIPT_WRITE}
          operations={commitOperations}
          autoCloseOnAccept
        />
      </Form>
    </>
  )
}

export default CustomScriptForm
