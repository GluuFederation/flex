import React, { Suspense, lazy, useState, ChangeEvent, useMemo } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Toggle from 'react-toggle'
import { Col, InputGroup, CustomInput, Form, FormGroup, Input } from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
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
const GluuScriptErrorModal = lazy(() => import('Routes/Apps/Gluu/GluuScriptErrorModal'))
const Counter = lazy(() => import('@/components/Widgets/GroupedButtons/Counter'))
const GluuInputEditor = lazy(() => import('Routes/Apps/Gluu/GluuInputEditor'))

function CustomScriptForm({ item, handleSubmit, viewOnly = false }: CustomScriptFormProps) {
  const { scriptTypes, loadingScriptTypes } = useSelector(
    (state: RootState) => state.customScriptReducer,
  )
  const { t } = useTranslation()
  const [init, setInit] = useState<boolean>(false)
  const [modal, setModal] = useState<boolean>(false)
  const [scriptTypeState, setScriptTypeState] = useState<string | undefined>(item.scriptType)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [scriptPath, setScriptPath] = useState<boolean>(() => {
    if (!item.moduleProperties) {
      return false
    }
    const locationTypeProp = item.moduleProperties.find(
      (prop: ModuleProperty) => prop.value1 === 'location_type',
    )
    return locationTypeProp?.value2 === 'file'
  })
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    item.programmingLanguage,
  )

  const activate = () => !init && setInit(true)
  const toggle = () => setModal((prev) => !prev)

  const submitForm = () => {
    toggle()
    const submitButton = document.getElementsByClassName(
      'UserActionSubmitButton',
    )[0] as HTMLButtonElement
    submitButton?.click()
  }

  const getModuleProperty = (key: string, properties?: ModuleProperty[]): string | undefined => {
    const moduleProps = properties || item?.moduleProperties || []
    return moduleProps.find((p) => p.value1 === key)?.value2
  }

  const defaultScriptPathValue: string | undefined = getModuleProperty('location_path')

  // Helper to transform property format for API (key/value → value1/value2)
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
    initialValues: {
      name: item.name || '',
      description: item.description || '',
      scriptType: item.scriptType || '',
      programmingLanguage: item.programmingLanguage || '',
      level: item.level || 0,
      script: item.script,
      aliases: item.aliases || [],
      moduleProperties: filterEmptyObjects(item.moduleProperties),
      configurationProperties: filterEmptyObjects(item.configurationProperties),
      script_path: defaultScriptPathValue || '',
      locationPath: item.locationPath,
      location_type: item.locationType || '',
      enabled: item.enabled,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(/^[a-zA-Z0-9_]+$/, 'Name should contain only letters, digits and underscores')
        .min(2, 'Mininum 2 characters')
        .required('Required!'),
      description: Yup.string(),
      scriptType: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      programmingLanguage: Yup.string().min(3, 'This value is required').required('Required!'),
      script: Yup.string().when('location_type', {
        is: (value: string) => {
          return value === 'db'
        },
        then: () => Yup.string().required('Required!'),
      }),
      script_path: Yup.string().when('location_type', {
        is: (value: string) => {
          return value === 'file'
        },
        then: () => Yup.string().required('Required!'),
      }),
    }),

    onSubmit: (values: FormValues) => {
      const submitValues: FormValues = { ...values }

      if (item.locationType === 'db') {
        const moduleProperties = item?.moduleProperties?.filter(
          (moduleItem: ModuleProperty) => moduleItem?.value1 !== 'location_path',
        )
        item.moduleProperties = moduleProperties
        delete item?.locationPath
        submitValues.locationPath = undefined
      } else if (item.locationType === 'file') {
        delete item?.script
        submitValues.script = undefined
      }

      submitValues.level = item.level || 0

      if (values.configurationProperties) {
        submitValues.configurationProperties = filterEmptyObjects(
          values.configurationProperties,
        ).map(transformPropertyForApi) as ConfigurationProperty[]
      }
      if (values.moduleProperties) {
        submitValues.moduleProperties = filterEmptyObjects(values.moduleProperties).map(
          transformPropertyForApi,
        ) as ModuleProperty[]
      }
      if (typeof values.enabled == 'object') {
        if (Array.isArray(values.enabled) && values.enabled.length > 0) {
          submitValues.enabled = true
        } else {
          submitValues.enabled = false
        }
      }
      const result = Object.assign(item, submitValues)
      const reqBody = { customScript: result }

      // Remove internal form fields that shouldn't be sent to the API
      const customScript = result as CustomScriptItem & {
        script_path?: string
        location_type?: string
      }
      delete customScript.script_path
      delete customScript.location_type

      if (!customScript.aliases) {
        delete customScript.aliases
      }
      handleSubmit(reqBody)
    },
  })

  const updateModuleProperty = (key: string, value: string): void => {
    const currentProperties = formik.values.moduleProperties || []
    const index = currentProperties.findIndex((p) => p.value1 === key)

    let newProperties: ModuleProperty[]
    if (index >= 0) {
      newProperties = currentProperties.map((p, idx) =>
        idx === index ? { ...p, value1: key, value2: value, description: p.description || '' } : p,
      )
    } else {
      newProperties = [...currentProperties, { value1: key, value2: value, description: '' }]
    }
    formik.setFieldValue('moduleProperties', newProperties)
    item.moduleProperties = newProperties
  }

  const removeModuleProperty = (key: string): void => {
    const currentProperties = formik.values.moduleProperties || []
    const newProperties = currentProperties.filter((p) => p.value1 !== key)
    formik.setFieldValue('moduleProperties', newProperties)
    item.moduleProperties = newProperties
  }

  const locationTypeChange = (value: string): void => {
    if (!value) return

    if (value === 'db') {
      formik.setFieldValue('script_path', undefined)
    } else if (value === 'file') {
      delete item.script
      formik.setFieldValue('script', undefined)
    }

    updateModuleProperty('location_type', value)

    item.locationType = value
    formik.setFieldValue('location_type', value)
    setScriptPath(value === 'file')
  }

  const scriptPathChange = (value: string): void => {
    if (!value) return
    formik.setFieldValue('locationPath', value)
    removeModuleProperty('location_path')
    updateModuleProperty('location_path', value)
  }

  const usageTypeChange = (value: string): void => {
    if (!value) return
    removeModuleProperty('usage_type')
    updateModuleProperty('usage_type', value)
  }

  const onLevelChange = (level: number): void => {
    item.level = level
  }

  const showErrorModal = (): void => setIsModalOpen(true)

  const configurationPropertiesOptions = useMemo(() => {
    return filterEmptyObjects(formik.values.configurationProperties)?.map(mapPropertyToKeyValue)
  }, [formik.values.configurationProperties])

  const modulePropertiesOptions = useMemo(() => {
    return filterEmptyObjects(formik.values.moduleProperties)?.map(mapPropertyToKeyValue)
  }, [formik.values.moduleProperties])

  return (
    <>
      {isModalOpen && (
        <Suspense fallback={<GluuSuspenseLoader />}>
          <GluuScriptErrorModal
            isOpen={isModalOpen}
            error={item.scriptError?.stackTrace}
            handler={() => setIsModalOpen(false)}
          />
        </Suspense>
      )}

      {item?.scriptError?.stackTrace ? (
        <>
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
        </>
      ) : null}
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
              defaultValue={item.name}
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
                disabled={viewOnly}
                defaultValue={item.description}
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
                defaultValue={item.aliases}
                multiple
                disabled={viewOnly}
                onChange={formik.handleChange}
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
                  defaultValue={item.scriptType}
                  disabled={viewOnly}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                    setScriptTypeState(e.target.value)
                    formik.setFieldValue('scriptType', e.target.value)
                  }}
                >
                  <option value="">{t('options.choose')}...</option>
                  {scriptTypes.map((ele: ScriptType, index: number) => (
                    <option key={index} value={ele.value}>
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
                defaultValue={item.programmingLanguage}
                disabled={viewOnly}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                  formik.setFieldValue('programmingLanguage', e.target.value)
                  setSelectedLanguage(e.target.value)
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
                defaultValue={getModuleProperty('location_type')}
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
                  defaultValue={defaultScriptPathValue}
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
            <GluuLabel label="Interactive" doc_category={SCRIPT} doc_entry="usage_type" />
            <Col sm={9}>
              <InputGroup>
                <CustomInput
                  type="select"
                  id="usage_type"
                  name="usage_type"
                  disabled={viewOnly}
                  defaultValue={getModuleProperty('usage_type')}
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
            </Col>
          </FormGroup>
        )}

        <FormGroup row>
          <GluuLabel label="fields.level" doc_category={SCRIPT} doc_entry="level" />
          <Col sm={9}>
            <Suspense fallback={<GluuSuspenseLoader />}>
              <Counter
                counter={item.level}
                disabled={viewOnly}
                onCounterChange={(level: number) => onLevelChange(level)}
              />
            </Suspense>
            <Input type="hidden" id="level" defaultValue={item.level} />
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
              language={selectedLanguage?.toLowerCase()}
              label="fields.script"
              lsize={2}
              rsize={10}
              formik={formik}
              value={formik.values.script}
              readOnly={viewOnly}
              errorMessage={formik.errors.script}
              showError={formik.errors.script && formik.touched.script}
              required
            />
          </Suspense>
        )}

        <FormGroup row>
          <GluuLabel label="options.enabled" size={3} doc_category={SCRIPT} doc_entry="enabled" />
          <Col sm={1}>
            <Toggle
              id="enabled"
              name="enabled"
              onChange={formik.handleChange}
              defaultChecked={item.enabled}
              disabled={viewOnly}
            />
          </Col>
        </FormGroup>
        <GluuCommitFooter saveHandler={toggle} hideButtons={{ save: viewOnly, back: viewOnly }} />
        <GluuCommitDialog
          handler={toggle}
          modal={modal}
          onAccept={submitForm}
          formik={formik}
          feature={adminUiFeatures.custom_script_write}
        />
      </Form>
    </>
  )
}

export default CustomScriptForm
