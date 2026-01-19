import React, {
  Suspense,
  lazy,
  useState,
  ChangeEvent,
  useMemo,
  useCallback,
  useEffect,
} from 'react'
import { useFormik } from 'formik'
import Toggle from 'react-toggle'
import { Col, InputGroup, CustomInput, Form, FormGroup, Input } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuFormFooter from 'Routes/Apps/Gluu/GluuFormFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import { SCRIPT } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import { Button } from 'reactstrap'
import ErrorIcon from '@mui/icons-material/Error'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import { Skeleton, Alert } from '@mui/material'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
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
import { customScriptValidationSchema } from './helper/validations'
import { transformToFormValues, getModuleProperty } from './helper/utils'
import { PROGRAMMING_LANGUAGES } from './constants'
import { PersonAuthenticationFields } from './PersonAuthenticationFields'
import { useAppNavigation, ROUTES } from '@/helpers/navigation'
const GluuScriptErrorModal = lazy(() => import('Routes/Apps/Gluu/GluuScriptErrorModal'))
const Counter = lazy(() => import('@/components/Widgets/GroupedButtons/Counter'))
const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))

function CustomScriptForm({ item, handleSubmit, viewOnly = false }: CustomScriptFormProps) {
  const { navigateBack } = useAppNavigation()
  const { t } = useTranslation()
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
    const baseResult: Record<string, unknown> = {
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

  const formik = useFormik<FormValues>({
    initialValues: transformToFormValues(item),
    validationSchema: customScriptValidationSchema,
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
      if (!value) return

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
      const touched: Record<string, boolean> = {}
      Object.keys(errors).forEach((key) => {
        touched[key] = true
      })
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

  useEffect(() => {
    const isApplyDisabled = !formik.isValid || !formik.dirty
    console.log('🔵 [CustomScriptForm] Form Validation State:')
    console.log('  - formik.isValid:', formik.isValid)
    console.log('  - formik.dirty:', formik.dirty)
    console.log('  - Apply Button Disabled:', isApplyDisabled)
    console.log('  - Validation Errors:', formik.errors)
    console.log('  - Touched Fields:', formik.touched)
    if (!formik.isValid) {
      console.log('  ❌ Form is INVALID. Reasons:')
      Object.keys(formik.errors).forEach((key) => {
        console.log(`    - ${key}:`, formik.errors[key as keyof typeof formik.errors])
      })
    }
    if (!formik.dirty) {
      console.log('  ⚠️ Form is NOT DIRTY (no changes made)')
    }
  }, [formik.isValid, formik.dirty, formik.errors, formik.touched])

  return (
    <>
      {isModalOpen && (
        <Suspense fallback={<GluuSuspenseLoader />}>
          <GluuScriptErrorModal
            isOpen={isModalOpen}
            error={item.scriptError?.stackTrace}
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
            <Button
              size="small"
              style={{
                backgroundColor: customColors.accentRed,
                color: customColors.white,
              }}
              onClick={showErrorModal}
            >
              {t('actions.show_error')}
            </Button>
          }
        >
          {t('messages.error_in_script')}!
        </Alert>
      )}
      <Form onSubmit={formik.handleSubmit}>
        {item.inum && (
          <GluuInumInput
            label="fields.inum"
            name="inum"
            lsize={3}
            rsize={9}
            value={item.inum}
            doc_category={SCRIPT}
          />
        )}

        <FormGroup row>
          <GluuLabel label="fields.name" required doc_category={SCRIPT} doc_entry="name" />
          <Col sm={9}>
            <Input
              placeholder={t('placeholders.name')}
              id="name"
              valid={formik.touched.name && !formik.errors.name}
              invalid={formik.touched.name && !!formik.errors.name}
              name="name"
              disabled={viewOnly}
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.name && formik.touched.name && (
              <div style={{ color: customColors.accentRed, marginTop: '4px' }}>
                {String(formik.errors.name)}
              </div>
            )}
          </Col>
        </FormGroup>

        <FormGroup row>
          <GluuLabel label="fields.description" doc_category={SCRIPT} doc_entry="description" />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.description')}
                valid={formik.touched.description && !formik.errors.description}
                invalid={formik.touched.description && !!formik.errors.description}
                id="description"
                name="description"
                disabled={viewOnly}
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.description && formik.touched.description && (
                <div style={{ color: customColors.accentRed, marginTop: '4px' }}>
                  {String(formik.errors.description)}
                </div>
              )}
            </InputGroup>
          </Col>
        </FormGroup>
        {scriptTypeState === 'person_authentication' && (
          <PersonAuthenticationFields
            formik={formik}
            viewOnly={viewOnly}
            usageTypeChange={usageTypeChange}
            getModuleProperty={getModuleProperty}
          />
        )}

        <FormGroup row>
          <GluuLabel
            label="fields.script_type"
            required
            doc_category={SCRIPT}
            doc_entry="scriptType"
          />
          <Col sm={9}>
            {loadingScriptTypes ? (
              <Skeleton variant="text" width="100%" sx={{ fontSize: '3rem' }} />
            ) : (
              <InputGroup>
                <CustomInput
                  type="select"
                  id="scriptType"
                  name="scriptType"
                  value={formik.values.scriptType}
                  disabled={viewOnly || isEditMode}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    formik.setFieldValue('scriptType', e.target.value, true)
                    formik.setFieldTouched('scriptType', true)
                  }}
                  onBlur={formik.handleBlur}
                >
                  <option value="">{t('options.choose')}...</option>
                  {scriptTypes.map((ele: ScriptType) => (
                    <option key={ele.value} value={ele.value}>
                      {ele.name}
                    </option>
                  ))}
                </CustomInput>
              </InputGroup>
            )}
            {formik.errors.scriptType && formik.touched.scriptType && !formik.values.scriptType ? (
              <div style={{ color: customColors.accentRed, marginTop: '4px' }}>
                {String(formik.errors.scriptType)}
              </div>
            ) : null}
          </Col>
        </FormGroup>

        <FormGroup row>
          <GluuLabel
            label="fields.programming_language"
            required
            doc_category={SCRIPT}
            doc_entry="programmingLanguage"
          />
          <Col sm={9}>
            <InputGroup>
              <CustomInput
                type="select"
                id="programmingLanguage"
                name="programmingLanguage"
                value={formik.values.programmingLanguage}
                disabled={viewOnly}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  formik.setFieldValue('programmingLanguage', e.target.value)
                  formik.setFieldTouched('programmingLanguage', true)
                }}
                onBlur={formik.handleBlur}
              >
                <option value="">{t('options.choose')}...</option>
                {PROGRAMMING_LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </CustomInput>
            </InputGroup>
            {formik.errors.programmingLanguage &&
              formik.touched.programmingLanguage &&
              !formik.values.programmingLanguage && (
                <div style={{ color: customColors.accentRed, marginTop: '4px' }}>
                  {String(formik.errors.programmingLanguage)}
                </div>
              )}
          </Col>
        </FormGroup>

        <FormGroup row>
          <GluuLabel label="fields.level" doc_category={SCRIPT} doc_entry="level" />
          <Col sm={9}>
            <Suspense fallback={<GluuSuspenseLoader />}>
              <Counter
                counter={formik.values.level}
                disabled={viewOnly}
                onCounterChange={onLevelChange}
              />
            </Suspense>
            <Input type="hidden" id="level" value={formik.values.level} />
            {formik.errors.level && formik.touched.level && (
              <div style={{ color: customColors.accentRed, marginTop: '4px' }}>
                {String(formik.errors.level)}
              </div>
            )}
          </Col>
        </FormGroup>
        <GluuProperties
          compName="configurationProperties"
          label="fields.custom_properties"
          formik={formik}
          keyPlaceholder="placeholders.enter_property_key"
          valuePlaceholder="placeholders.enter_property_value"
          options={configurationPropertiesOptions}
          disabled={viewOnly}
        ></GluuProperties>
        <GluuProperties
          compName="moduleProperties"
          label="fields.module_properties"
          formik={formik}
          keyPlaceholder="placeholders.enter_property_key"
          valuePlaceholder="placeholders.enter_property_value"
          options={modulePropertiesOptions}
          disabled={viewOnly}
        ></GluuProperties>
        <Suspense fallback={<GluuSuspenseLoader />}>
          <GluuInputEditor
            doc_category={SCRIPT}
            name="script"
            language={formik.values.programmingLanguage?.toLowerCase()}
            label="fields.script"
            lsize={2}
            rsize={10}
            formik={formik}
            value={formik.values.script}
            readOnly={viewOnly}
            errorMessage={formik.errors.script}
            showError={formik.errors.script && formik.touched.script}
            required={true}
          />
        </Suspense>

        <FormGroup row>
          <GluuLabel label="options.enabled" size={3} doc_category={SCRIPT} doc_entry="enabled" />
          <Col sm={1}>
            <Toggle
              id="enabled"
              name="enabled"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                formik.setFieldValue('enabled', e.target.checked)
              }
              checked={Boolean(formik.values.enabled)}
              disabled={viewOnly}
            />
          </Col>
        </FormGroup>
        {viewOnly ? (
          <GluuFormFooter
            showBack={true}
            showCancel={false}
            showApply={false}
            onBack={handleNavigateBack}
          />
        ) : (
          <GluuFormFooter
            showBack={true}
            showCancel={true}
            showApply={true}
            onBack={handleNavigateBack}
            onApply={toggle}
            onCancel={handleCancel}
            disableBack={false}
            disableCancel={!formik.dirty}
            disableApply={!formik.isValid || !formik.dirty}
            applyButtonType="button"
            isLoading={formik.isSubmitting ?? false}
          />
        )}
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={handleDialogAccept}
          formik={formik}
          feature={adminUiFeatures.custom_script_write}
        />
      </Form>
    </>
  )
}

export default CustomScriptForm
