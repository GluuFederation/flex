import React, { Suspense, lazy, useState, ChangeEvent, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Alert, Button } from 'reactstrap'
import ErrorIcon from '@mui/icons-material/Error'
import GluuSuspenseLoader from 'Routes/Apps/Gluu/GluuSuspenseLoader'
import { useSelector } from 'react-redux'
import { Skeleton } from '@mui/material'
import { adminUiFeatures } from 'Plugins/admin/helper/utils'
import customColors from '@/customColors'
import {
  CustomScriptFormProps,
  RootState,
  FormValues,
  ModuleProperty,
  ConfigurationProperty,
  ScriptType,
} from './types'
import { CustomScriptItem } from './types/customScript'
import { filterEmptyObjects, mapPropertyToKeyValue } from 'Utils/Util'
import { customScriptValidationSchema } from './helper/validations'
import { transformToFormValues, getModuleProperty } from './helper/utils'
const GluuScriptErrorModal = lazy(() => import('Routes/Apps/Gluu/GluuScriptErrorModal'))
const Counter = lazy(() => import('@/components/Widgets/GroupedButtons/Counter'))
const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))

function CustomScriptForm({ item, handleSubmit, viewOnly = false }: CustomScriptFormProps) {
  const navigate = useNavigate()
  const { scriptTypes, loadingScriptTypes } = useSelector(
    (state: RootState) => state.customScriptReducer,
  )
  const { t } = useTranslation()
  const [init, setInit] = useState<boolean>(false)
  const [modal, setModal] = useState<boolean>(false)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const activate = useCallback(() => {
    setInit((prev) => (!prev ? true : prev))
  }, [])

  const toggle = useCallback(() => {
    setModal((prev) => !prev)
  }, [])

  const handleNavigateBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

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
    validateOnMount: true,
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

      const customScript: CustomScriptItem =
        values.location_type === 'file'
          ? {
              ...base,
              locationType: 'file',
              locationPath: values.script_path,
              script: undefined,
            }
          : {
              ...base,
              locationType: 'db',
              locationPath: undefined,
              script: values.script,
            }

      const reqBody = { customScript }
      handleSubmit(reqBody)
    },
  })

  const updateModuleProperty = useCallback(
    (key: string, value: string): void => {
      const currentProperties = formik.values.moduleProperties || []
      const index = currentProperties.findIndex((p) => p.value1 === key)

      let newProperties: ModuleProperty[]
      if (index >= 0) {
        newProperties = currentProperties.map((p, idx) =>
          idx === index
            ? { ...p, value1: key, value2: value, description: p.description || '' }
            : p,
        )
      } else {
        newProperties = [...currentProperties, { value1: key, value2: value, description: '' }]
      }
      formik.setFieldValue('moduleProperties', newProperties)
    },
    [formik.values.moduleProperties, formik.setFieldValue],
  )

  const removeModuleProperty = useCallback(
    (key: string): void => {
      const currentProperties = formik.values.moduleProperties || []
      const newProperties = currentProperties.filter((p) => p.value1 !== key)
      formik.setFieldValue('moduleProperties', newProperties)
    },
    [formik.values.moduleProperties, formik.setFieldValue],
  )

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

  const locationTypeChange = useCallback(
    (value: string): void => {
      const currentProperties = formik.values.moduleProperties || []
      const newProperties = updatePropertyInModuleProperties(
        currentProperties,
        'location_type',
        value,
      )

      formik.setFieldValue('moduleProperties', newProperties)
      formik.setFieldValue('location_type', value || '')

      if (value === 'db') {
        formik.setFieldValue('script_path', undefined)
      } else if (value === 'file') {
        formik.setFieldValue('script', undefined)
      } else {
        formik.setFieldValue('script', undefined)
        formik.setFieldValue('script_path', undefined)
      }
    },
    [formik.setFieldValue, formik.values.moduleProperties, updatePropertyInModuleProperties],
  )

  const scriptPathChange = useCallback(
    (value: string): void => {
      if (!value) return
      formik.setFieldValue('locationPath', value)
      removeModuleProperty('location_path')
      updateModuleProperty('location_path', value)
    },
    [formik.setFieldValue, removeModuleProperty, updateModuleProperty],
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
    },
    [formik.setFieldValue],
  )

  const showErrorModal = useCallback((): void => setIsModalOpen(true), [])

  const closeErrorModal = useCallback((): void => setIsModalOpen(false), [])

  const handleCancel = useCallback(() => {
    const resetValues = transformToFormValues(item)
    formik.resetForm({ values: resetValues })
  }, [formik, item])

  const handleDialogAccept = useCallback(() => {
    formik.handleSubmit()
    toggle()
  }, [formik.handleSubmit, toggle])

  const configurationPropertiesOptions = useMemo(() => {
    return filterEmptyObjects(formik.values.configurationProperties)?.map(mapPropertyToKeyValue)
  }, [formik.values.configurationProperties])

  const modulePropertiesOptions = useMemo(() => {
    return filterEmptyObjects(formik.values.moduleProperties)?.map(mapPropertyToKeyValue)
  }, [formik.values.moduleProperties])

  const scriptPath = formik.values.location_type === 'file'
  const scriptTypeState = formik.values.scriptType

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
          className="d-flex align-items-center justify-content-between w-100 mb-3"
          color="danger"
        >
          <div className="d-flex align-items-center" style={{ gap: '4px' }}>
            <ErrorIcon color="error" />
            <h5 className="alert-heading m-0">{t('messages.error_in_script')}!</h5>
          </div>
          <Button color="danger" onClick={showErrorModal}>
            {t('actions.show_error')}
          </Button>
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
              valid={!formik.errors.name && !formik.touched.name && init}
              name="name"
              disabled={viewOnly}
              value={formik.values.name}
              onKeyUp={activate}
              onChange={formik.handleChange}
            />
            {formik.errors.name && formik.touched.name ? (
              <div style={{ color: customColors.accentRed }}>{String(formik.errors.name)}</div>
            ) : null}
          </Col>
        </FormGroup>

        <FormGroup row>
          <GluuLabel label="fields.description" doc_category={SCRIPT} doc_entry="description" />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.description')}
                valid={!formik.errors.description && !formik.touched.description && init}
                id="description"
                name="description"
                disabled={viewOnly}
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </InputGroup>
          </Col>
        </FormGroup>
        {scriptTypeState === 'person_authentication' && (
          <FormGroup row>
            <GluuLabel label={t('Select SAML ACRS')} doc_category={SCRIPT} doc_entry="aliases" />
            <Col sm={9}>
              <Input
                type="select"
                name="aliases"
                id="aliases"
                value={formik.values.aliases}
                multiple
                disabled={viewOnly}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  const selectEl = e.currentTarget as unknown as HTMLSelectElement
                  const values = Array.from(selectEl.selectedOptions).map((o) => o.value)
                  formik.setFieldValue('aliases', values)
                }}
              >
                <option value="urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocol">
                  urn:oasis:names:tc:SAML:2.0:ac:classes:InternetProtocol
                </option>
                <option value="urn:oasis:names:tc:SAML:2.0:ac:classes:Password">
                  urn:oasis:names:tc:SAML:2.0:ac:classes:Password
                </option>
                <option value="urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport">
                  urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport
                </option>
              </Input>
            </Col>
          </FormGroup>
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
                  disabled={viewOnly}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    formik.setFieldValue('scriptType', e.target.value, true)
                  }}
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
            {formik.errors.scriptType && formik.touched.scriptType ? (
              <div style={{ color: customColors.accentRed }}>
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
                }}
              >
                <option value="">{t('Choose')}...</option>
                <option value="java">Java</option>
                <option value="python">Jython</option>
              </CustomInput>
            </InputGroup>
            {formik.errors.programmingLanguage && formik.touched.programmingLanguage && (
              <div style={{ color: customColors.accentRed }}>
                {String(formik.errors.programmingLanguage)}
              </div>
            )}
          </Col>
        </FormGroup>

        <FormGroup row>
          <GluuLabel label="fields.location_type" doc_category={SCRIPT} doc_entry="locationType" />
          <Col sm={9}>
            <InputGroup>
              <CustomInput
                type="select"
                id="location_type"
                name="location_type"
                disabled={viewOnly}
                value={formik.values.location_type}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  locationTypeChange(e.target.value)
                }}
              >
                <option value="">{t('options.choose')}...</option>
                <option value="db">{t('Database')}</option>
                <option value="file">{t('File')}</option>
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>
        {scriptPath && (
          <FormGroup row>
            <GluuLabel
              required
              label="fields.script_path"
              doc_category={SCRIPT}
              doc_entry="scriptPath"
            />
            <Col sm={9}>
              <InputGroup>
                <Input
                  placeholder={t('placeholders.script_path')}
                  valid={!formik.errors.script_path && !formik.touched.script_path && init}
                  disabled={viewOnly}
                  id="location_path"
                  value={formik.values.script_path || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    scriptPathChange(e.target.value)
                    formik.setFieldValue('script_path', e.target.value)
                  }}
                />
              </InputGroup>
              {formik.errors.script_path && formik.touched.script_path && (
                <div style={{ color: customColors.accentRed }}>
                  {String(formik.errors.script_path)}
                </div>
              )}
            </Col>
          </FormGroup>
        )}
        {scriptTypeState === 'person_authentication' && (
          <FormGroup row>
            <GluuLabel label="Interactive" required doc_category={SCRIPT} doc_entry="usage_type" />
            <Col sm={9}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="usage_type"
                  name="usage_type"
                  disabled={viewOnly}
                  value={getModuleProperty('usage_type', formik.values.moduleProperties) || ''}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    usageTypeChange(e.target.value)
                  }}
                >
                  <option value="">{t('options.choose')}...</option>
                  <option value="interactive">Web</option>
                  <option value="service">Native</option>
                  <option value="both">Both methods</option>
                </CustomInput>
              </InputGroup>
              {formik.errors.moduleProperties && formik.touched.moduleProperties && (
                <div style={{ color: customColors.accentRed }}>
                  {String(formik.errors.moduleProperties)}
                </div>
              )}
            </Col>
          </FormGroup>
        )}

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
          </Col>
        </FormGroup>
        <GluuProperties
          compName="configurationProperties"
          label="fields.custom_properties"
          formik={formik}
          keyPlaceholder={t('placeholders.enter_property_key')}
          valuePlaceholder={t('placeholders.enter_property_value')}
          options={configurationPropertiesOptions}
          disabled={viewOnly}
        ></GluuProperties>
        <GluuProperties
          compName="moduleProperties"
          label="fields.module_properties"
          formik={formik}
          keyPlaceholder={t('placeholders.enter_property_key')}
          valuePlaceholder={t('placeholders.enter_property_value')}
          options={modulePropertiesOptions}
          disabled={viewOnly}
        ></GluuProperties>
        {!scriptPath && (
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
              required={formik.values.location_type === 'db'}
            />
          </Suspense>
        )}

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
