import React, { Suspense, lazy, useState, ChangeEvent, useMemo, useCallback } from 'react'
import type { FormikProps } from 'formik'
import { useFormik, setNestedObjectValues } from 'formik'
import type { FormikTouched } from 'formik'
import Toggle from 'react-toggle'
import { Form, FormGroup, Input } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuInputRow from 'Routes/Apps/Gluu/GluuInputRow'
import GluuSelectRow from 'Routes/Apps/Gluu/GluuSelectRow'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuThemeFormFooter from 'Routes/Apps/Gluu/GluuThemeFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { SCRIPT } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { Button } from 'reactstrap'
import ErrorIcon from '@mui/icons-material/Error'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import { Skeleton, Alert } from '@mui/material'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
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
} from './types'
import { CustomScriptItem } from './types/customScript'
import { useCustomScriptTypes } from './hooks'
import { filterEmptyObjects, mapPropertyToKeyValue } from 'Utils/Util'
import { getCustomScriptValidationSchema, transformToFormValues, getModuleProperty } from './helper'
import { PROGRAMMING_LANGUAGES } from './constants'
import { PersonAuthenticationFields } from './PersonAuthenticationFields'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
const GluuScriptErrorModal = lazy(() => import('Routes/Apps/Gluu/GluuScriptErrorModal'))
const Counter = lazy(() => import('@/components/Widgets/GroupedButtons/Counter'))
const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))

function CustomScriptForm({ item, handleSubmit, viewOnly = false }: CustomScriptFormProps) {
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(() => getThemeColor(themeState.theme), [themeState.theme])
  const isDark = themeState.theme === THEME_DARK
  const { classes } = useStyles({ isDark, themeColors })
  const [modal, setModal] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const isEditMode = Boolean(item?.inum)

  const { data: scriptTypes = [], isLoading: loadingScriptTypes } = useCustomScriptTypes()

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const handleNavigateBack = useCallback(() => {
    navigateBack(ROUTES.CUSTOM_SCRIPT_LIST)
  }, [navigateBack])

  const transformPropertyForApi = (
    prop: ModuleProperty | ConfigurationProperty,
  ): ModuleProperty | ConfigurationProperty => {
    const baseResult: Record<string, string | boolean | undefined> = {
      value1: prop.key || prop.value1 || '',
      value2: prop.value || prop.value2 || '',
    }
    if (prop.hide !== undefined) {
      baseResult.hide = prop.hide
    }
    if ('description' in prop && prop.description) {
      baseResult.description = prop.description
    }
    return baseResult as ModuleProperty | ConfigurationProperty
  }

  const validationSchema = useMemo(() => getCustomScriptValidationSchema(t), [t])

  const formik = useFormik<FormValues>({
    initialValues: transformToFormValues(item),
    validationSchema,
    enableReinitialize: true,
    validateOnMount: false,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values: FormValues) => {
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

      const base: CustomScriptItem = {
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
      }

      const customScript: CustomScriptItem = {
        ...base,
        locationType: 'db',
        locationPath: undefined,
        script: values.script,
      }

      const actionMessage = values.action_message?.trim()

      const reqBody = {
        customScript: actionMessage
          ? { ...customScript, action_message: actionMessage }
          : customScript,
      }
      handleSubmit(reqBody)
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
    const resetValues = transformToFormValues(item)
    formik.resetForm({ values: resetValues })
  }, [formik, item])

  const handleDialogAccept = useCallback(async () => {
    const errors = await formik.validateForm()
    if (Object.keys(errors).length > 0) {
      const touched = setNestedObjectValues(errors, true) as FormikTouched<FormValues>
      formik.setTouched(touched)
      toggle()
      return
    }
    formik.handleSubmit()
    toggle()
  }, [formik, toggle])

  const configurationPropertiesOptions = useMemo(() => {
    return filterEmptyObjects(formik.values.configurationProperties)?.map(mapPropertyToKeyValue)
  }, [formik.values.configurationProperties])

  const modulePropertiesOptions = useMemo(() => {
    return filterEmptyObjects(formik.values.moduleProperties)?.map(mapPropertyToKeyValue)
  }, [formik.values.moduleProperties])

  const scriptTypeState = formik.values.scriptType

  return (
    <>
      {isModalOpen && (
        <Suspense fallback={<GluuSuspenseLoader />}>
          <GluuScriptErrorModal
            isOpen={isModalOpen}
            error={item.scriptError?.stackTrace ?? ''}
            handler={closeErrorModal}
          />
        </Suspense>
      )}

      {item?.scriptError?.stackTrace && (
        <Alert
          severity="error"
          icon={<ErrorIcon />}
          sx={{ mb: 3 }}
          action={
            <Button size="small" className={classes.errorButton} onClick={showErrorModal}>
              {t('actions.show_error')}
            </Button>
          }
        >
          {t('messages.error_in_script')}
        </Alert>
      )}
      <Form onSubmit={formik.handleSubmit} className={classes.formSection}>
        <div className={`${classes.fieldsGrid} ${classes.formLabels} ${classes.formWithInputs}`}>
          {item.inum && (
            <div className={`${classes.fieldItem} ${classes.inumFullWidth}`}>
              <GluuInumInput
                label="fields.inum"
                name="inum"
                lsize={3}
                rsize={9}
                value={item.inum}
                doc_category={SCRIPT}
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
                formik={{
                  handleChange: (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
                    const target = e.target as HTMLSelectElement
                    formik.setFieldValue('scriptType', target.value, true)
                    formik.setFieldTouched('scriptType', true)
                  },
                }}
                values={[
                  { value: '', label: `${t('options.choose')}...` },
                  ...scriptTypes.map((ele: ScriptType) => ({ value: ele.value, label: ele.name })),
                ]}
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
              values={[
                { value: '', label: `${t('options.choose')}...` },
                ...PROGRAMMING_LANGUAGES.map((lang) => ({
                  value: lang.value,
                  label: t(lang.labelKey),
                })),
              ]}
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
            />
          </div>

          <div className={classes.fieldItem}>
            <FormGroup row>
              <GluuLabel
                label="fields.level"
                size={12}
                doc_category={SCRIPT}
                doc_entry="level"
                isDark={isDark}
              />
              <Suspense fallback={<GluuSuspenseLoader />}>
                <Counter
                  counter={formik.values.level}
                  disabled={viewOnly}
                  onCounterChange={onLevelChange}
                  valueStyle={{
                    color: themeColors.fontColor,
                    opacity: 0.8,
                  }}
                />
              </Suspense>
              <Input type="hidden" id="level" value={formik.values.level} />
              {formik.errors.level && formik.touched.level && (
                <div className={classes.levelError}>{String(formik.errors.level)}</div>
              )}
            </FormGroup>
          </div>
          <div className={classes.descriptionEnabledRow}>
            <div className={classes.fieldItem} />
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    formik.setFieldValue('enabled', e.target.checked)
                  }
                  checked={Boolean(formik.values.enabled)}
                  disabled={viewOnly}
                />
              </FormGroup>
            </div>
          </div>

          {scriptTypeState === 'person_authentication' && (
            <div className={classes.fieldItemFullWidth}>
              <PersonAuthenticationFields
                formik={formik}
                viewOnly={viewOnly}
                usageTypeChange={usageTypeChange}
                getModuleProperty={getModuleProperty}
              />
            </div>
          )}

          <div className={classes.fieldItemFullWidth}>
            <div className={classes.propertiesBox}>
              <GluuProperties
                compName="configurationProperties"
                label="fields.custom_properties"
                formik={formik}
                keyPlaceholder="placeholders.enter_property_key"
                valuePlaceholder="placeholders.enter_property_value"
                options={configurationPropertiesOptions}
                disabled={viewOnly}
              />
              <GluuProperties
                compName="moduleProperties"
                label="fields.module_properties"
                formik={formik}
                keyPlaceholder="placeholders.enter_property_key"
                valuePlaceholder="placeholders.enter_property_value"
                options={modulePropertiesOptions}
                disabled={viewOnly}
              />
            </div>
          </div>

          <div className={`${classes.fieldItemFullWidth} ${classes.editorTheme}`}>
            <Suspense fallback={<GluuSuspenseLoader />}>
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
            </Suspense>
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
            onApply={toggle}
            disableApply={!formik.isValid || !formik.dirty}
            applyButtonType="button"
            isLoading={formik.isSubmitting ?? false}
          />
        )}
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={handleDialogAccept}
          formik={{
            setFieldValue: (field: string, value: string, shouldValidate?: boolean) =>
              formik.setFieldValue(field, value, shouldValidate),
          }}
          feature={adminUiFeatures.custom_script_write}
        />
      </Form>
    </>
  )
}

export default CustomScriptForm
