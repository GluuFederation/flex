import React, { Suspense, lazy, useState, ChangeEvent } from 'react'
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
  CustomScriptItem,
  CustomScriptReducerState,
  RootState,
  FormValues,
  ModuleProperty,
  ConfigurationProperty,
  ScriptType,
} from './types'
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
    if (
      item.moduleProperties.filter((i: ModuleProperty) => i.value1 === 'location_type').length > 0
    ) {
      return (
        item.moduleProperties.filter((it: ModuleProperty) => it.value1 === 'location_type')[0]
          .value2 === 'file'
      )
    }
    return false
  })
  const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>(
    item.programmingLanguage,
  )

  function activate(): void {
    if (!init) {
      setInit(true)
    }
  }

  function toggle(): void {
    setModal(!modal)
  }

  function submitForm(): void {
    toggle()
    const submitButton = document.getElementsByClassName(
      'UserActionSubmitButton',
    )[0] as HTMLButtonElement
    if (submitButton) {
      submitButton.click()
    }
  }

  function getPropertiesConfig(
    entry: CustomScriptItem,
    key: keyof CustomScriptItem,
  ): Array<{ key: string; value: string }> {
    const entryValue = entry[key]
    if (entryValue && Array.isArray(entryValue)) {
      return entryValue.map((e: any) => ({
        key: e.value1,
        value: e.value2,
      }))
    } else {
      return []
    }
  }

  const defaultScriptPathValue: string | undefined =
    !!item?.moduleProperties &&
    item?.moduleProperties?.filter((i: ModuleProperty) => i.value1 === 'location_path').length > 0
      ? item?.moduleProperties?.filter((it: ModuleProperty) => it.value1 === 'location_path')[0]
          .value2
      : undefined

  const formik = useFormik<FormValues>({
    initialValues: {
      name: item.name || '',
      description: item.description || '',
      scriptType: item.scriptType || '',
      programmingLanguage: item.programmingLanguage || '',
      level: item.level || 0,
      script: item.script || '',
      aliases: item.aliases || [],
      moduleProperties: item.moduleProperties || [],
      configurationProperties: item.configurationProperties || [],
      script_path: defaultScriptPathValue || '',
      locationPath: item.locationPath || '',
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
      if (item.locationType === 'db') {
        const moduleProperties = item?.moduleProperties?.filter(
          (moduleItem: ModuleProperty) => moduleItem?.value1 !== 'location_path',
        )
        item.moduleProperties = moduleProperties
        delete item?.locationPath
        delete (values as any).locationPath
      } else if (item.locationType === 'file') {
        delete item?.script
        delete (values as any).script
      }

      ;(values as any).level = item.level

      if (!!values.configurationProperties) {
        ;(values as any).configurationProperties = values.configurationProperties
          .filter((e: ConfigurationProperty) => e != null)
          .filter((e: ConfigurationProperty) => Object.keys(e).length !== 0)
          .map((e: ConfigurationProperty) => ({
            value1: e.key || e.value1,
            value2: e.value || e.value2,
            hide: false,
          }))
      }
      if (!!values.moduleProperties && item.locationType !== 'db') {
        ;(values as any).moduleProperties = values.moduleProperties
          .filter((e: ModuleProperty) => e != null)
          .filter((e: ModuleProperty) => Object.keys(e).length !== 0)
          .map((e: ModuleProperty) => ({
            value1: e.key || e.value1,
            value2: e.value || e.value2,
            hide: false,
          }))
      }
      if (typeof values.enabled == 'object') {
        if (Array.isArray(values.enabled) && values.enabled.length > 0) {
          ;(values as any).enabled = true
        } else {
          ;(values as any).enabled = false
        }
      }
      const result = Object.assign(item, values)
      const reqBody = { customScript: result }

      // Remove internal form fields that shouldn't be sent to the API
      const customScript = reqBody.customScript as any
      delete customScript.script_path
      delete customScript.location_type

      if (!customScript.aliases) {
        delete customScript.aliases
      }
      handleSubmit(reqBody)
    },
  })

  function locationTypeChange(value: string): void {
    if (value !== '') {
      if (!item.moduleProperties) {
        item.moduleProperties = []
      }
      if (value === 'db') {
        const moduleProperties = item?.moduleProperties?.filter(
          (moduleItem: ModuleProperty) => moduleItem?.value1 !== 'location_path',
        )
        item.moduleProperties = moduleProperties
        formik.setFieldValue('script_path', undefined)
      } else if (value === 'file') {
        delete item.script
        formik.setFieldValue('script', undefined)
      }
      if (
        item.moduleProperties.filter(
          (candidate: ModuleProperty) => candidate.value1 === 'location_type',
        ).length > 0
      ) {
        item.moduleProperties.splice(
          item.moduleProperties.findIndex((el: ModuleProperty) => el.value1 === 'location_type'),
          1,
        )
      }
      item.moduleProperties.push({
        value1: 'location_type',
        value2: value,
        description: '',
      })
    }
    item.locationType = value
    formik.setFieldValue('location_type', value)
    if (value === 'file') {
      setScriptPath(true)
    } else {
      setScriptPath(false)
    }
  }

  function scriptPathChange(value: string): void {
    if (value !== '') {
      formik.setFieldValue('locationPath', value)
      if (!item.moduleProperties) {
        item.moduleProperties = []
      }

      if (
        item.moduleProperties.filter(
          (candidate: ModuleProperty) => candidate.value1 === 'location_path',
        ).length > 0
      ) {
        item.moduleProperties.splice(
          item.moduleProperties.findIndex((el: ModuleProperty) => el.value1 === 'location_path'),
          1,
        )
      }
      item.moduleProperties.push({
        value1: 'location_path',
        value2: value,
        description: '',
      })
    }
  }

  function usageTypeChange(value: string): void {
    if (value !== '') {
      if (!item.moduleProperties) {
        item.moduleProperties = []
      }
      if (
        item.moduleProperties.filter((ligne: ModuleProperty) => ligne.value1 === 'usage_type')
          .length > 0
      ) {
        item.moduleProperties.splice(
          item.moduleProperties.findIndex((row: ModuleProperty) => row.value1 === 'usage_type'),
          1,
        )
      }
      item.moduleProperties.push({
        value1: 'usage_type',
        value2: value,
        description: '',
      })
    }
  }

  function onLevelChange(level: number): void {
    item.level = level
  }

  const showErrorModal = (): void => {
    setIsModalOpen(true)
  }

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
                defaultValue={
                  !!item.moduleProperties &&
                  item.moduleProperties.filter((i: ModuleProperty) => i.value1 === 'location_type')
                    .length > 0
                    ? item.moduleProperties.filter(
                        (it: ModuleProperty) => it.value1 === 'location_type',
                      )[0].value2
                    : undefined
                }
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
                  defaultValue={
                    !!item.moduleProperties &&
                    item.moduleProperties.filter(
                      (vItem: ModuleProperty) => vItem.value1 === 'usage_type',
                    ).length > 0
                      ? item.moduleProperties.filter(
                          (kItem: ModuleProperty) => kItem.value1 === 'usage_type',
                        )[0].value2
                      : undefined
                  }
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
          options={getPropertiesConfig(item, 'configurationProperties')}
          disabled={viewOnly}
        ></GluuProperties>
        <GluuProperties
          compName="moduleProperties"
          label="fields.module_properties"
          formik={formik}
          keyPlaceholder={t('placeholders.enter_property_key')}
          valuePlaceholder={t('placeholders.enter_property_value')}
          options={getPropertiesConfig(item, 'moduleProperties')}
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
