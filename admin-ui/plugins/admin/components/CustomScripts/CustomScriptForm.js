import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import Toggle from 'react-toggle'
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Input,
} from 'Components'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import GluuInputEditor from 'Routes/Apps/Gluu/GluuInputEditor'
import GluuProperties from 'Routes/Apps/Gluu/GluuProperties'
import Counter from 'Components/Widgets/GroupedButtons/Counter'
import GluuCommitFooter from 'Routes/Apps/Gluu/GluuCommitFooter'
import GluuCommitDialog from 'Routes/Apps/Gluu/GluuCommitDialog'
import GluuTooltip from 'Routes/Apps/Gluu/GluuTooltip'
import { SCRIPT } from 'Utils/ApiResources'
import { useTranslation } from 'react-i18next'
import items from './scriptTypes'

function CustomScriptForm({ item, scripts, handleSubmit, viewOnly }) {
  const { t } = useTranslation()
  const [init, setInit] = useState(false)
  const [modal, setModal] = useState(false)
  const [scriptTypeState, setScriptTypeState] = useState(item.scriptType)
  const [scriptPath, setScriptPath] = useState(() => {
    if (!item.moduleProperties) {
      return false
    }

    if (
      item.moduleProperties.filter((i) => i.value1 === 'location_type').length >
      0
    ) {
      return (
        item.moduleProperties.filter((it) => it.value1 === 'location_type')[0]
          .value2 == 'file'
      )
    }
    return false
  })
  const [selectedLanguage, setSelectedLanguage] = useState(
    item.programmingLanguage,
  )

  function activate() {
    if (!init) {
      setInit(true)
    }
  }
  function toggle() {
    setModal(!modal)
  }

  function submitForm() {
    toggle()
    document.getElementsByClassName('UserActionSubmitButton')[0].click()
  }

  function getPropertiesConfig(entry) {
    if (
      entry.configurationProperties &&
      Array.isArray(entry.configurationProperties)
    ) {
      return entry.configurationProperties.map((e) => ({
        key: e.value1,
        value: e.value2,
      }))
    } else {
      return []
    }
  }

  const formik = useFormik({
    initialValues: {
      name: item.name,
      description: item.description,
      scriptType: item.scriptType,
      programmingLanguage: item.programmingLanguage,
      level: item.level,
      script: item.script,
      aliases: item.aliases,
      moduleProperties: item.moduleProperties,
      configurationProperties: item.configurationProperties,
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Mininum 2 characters').required('Required!'),
      description: Yup.string(),
      scriptType: Yup.string()
        .min(2, 'Mininum 2 characters')
        .required('Required!'),
      programmingLanguage: Yup.string()
        .min(3, 'This value is required')
        .required('Required!'),
      script: Yup.string().required('Required!'),
    }),

    onSubmit: (values) => {
      values.level = item.level
      values.moduleProperties = item.moduleProperties
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!values.configurationProperties) {
        values.configurationProperties = values.configurationProperties
          .filter((e) => e != null)
          .filter((e) => Object.keys(e).length !== 0)
          .map((e) => ({
            value1: e.key || e.value1,
            value2: e.value || e.value2,
            hide: false,
          }))
      }
      if (typeof values.enabled == 'object') {
        if (values.enabled.length > 0) {
          values.enabled = true
        } else {
          values.enabled = false
        }
      }
      const result = Object.assign(item, values)
      const reqBody = { customScript: result }
      handleSubmit(reqBody)
    },
  })

  function locationTypeChange(value) {
    if (value != '') {
      if (!item.moduleProperties) {
        item.moduleProperties = []
      }

      if (
        item.moduleProperties.filter(
          (candidate) => candidate.value1 === 'location_type',
        ).length > 0
      ) {
        item.moduleProperties.splice(
          item.moduleProperties.findIndex(
            (el) => el.value1 === 'location_type',
          ),
          1,
        )
      }
      item.moduleProperties.push({
        value1: 'location_type',
        value2: value,
        description: '',
      })
    }
    if (value == 'file') {
      setScriptPath(true)
    } else {
      setScriptPath(false)
    }
  }

  function scriptPathChange(value) {
    if (value != '') {
      if (!item.moduleProperties) {
        item.moduleProperties = []
      }

      if (
        item.moduleProperties.filter(
          (candidate) => candidate.value1 === 'location_path',
        ).length > 0
      ) {
        item.moduleProperties.splice(
          item.moduleProperties.findIndex(
            (el) => el.value1 === 'location_path',
          ),
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

  function usageTypeChange(value) {
    if (value != '') {
      if (!item.moduleProperties) {
        item.moduleProperties = []
      }

      if (
        item.moduleProperties.filter((ligne) => ligne.value1 === 'usage_type')
          .length > 0
      ) {
        item.moduleProperties.splice(
          item.moduleProperties.findIndex((row) => row.value1 === 'usage_type'),
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

  function onLevelChange(level) {
    item.level = level
  }

  return (
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
      <GluuTooltip doc_category={SCRIPT} doc_entry="name">
        <FormGroup row>
          <GluuLabel label="fields.name" required />
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
              <div style={{ color: 'red' }}>{formik.errors.name}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={SCRIPT} doc_entry="description">
        <FormGroup row>
          <GluuLabel label="fields.description" />
          <Col sm={9}>
            <InputGroup>
              <Input
                placeholder={t('placeholders.description')}
                valid={
                  !formik.errors.description &&
                  !formik.touched.description &&
                  init
                }
                id="description"
                disabled={viewOnly}
                defaultValue={item.description}
                onChange={formik.handleChange}
              />
            </InputGroup>
          </Col>
        </FormGroup>
      </GluuTooltip>
      {scriptTypeState === 'person_authentication' && (
        <GluuTooltip doc_category={SCRIPT} doc_entry="aliases">
          <FormGroup row>
            <GluuLabel label={t('Select SAML ACRS')} />
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
        </GluuTooltip>
      )}
      <GluuTooltip doc_category={SCRIPT} doc_entry="scriptType">
        <FormGroup row>
          <GluuLabel label="fields.script_type" required />
          <Col sm={9}>
            <InputGroup>
              <CustomInput
                type="select"
                id="scriptType"
                name="scriptType"
                defaultValue={item.scriptType}
                disabled={viewOnly}
                onChange={(e) => {
                  setScriptTypeState(e.target.value)
                  formik.setFieldValue('scriptType', e.target.value)
                }}
              >
                <option value="">{t('options.choose')}...</option>
                {items.map((ele, index) => (
                  <option key={index} value={ele.value}>
                    {ele.name}
                  </option>
                ))}
              </CustomInput>
            </InputGroup>
            {formik.errors.scriptType && formik.touched.scriptType ? (
              <div style={{ color: 'red' }}>{formik.errors.scriptType}</div>
            ) : null}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={SCRIPT} doc_entry="programmingLanguage">
        <FormGroup row>
          <GluuLabel label="fields.programming_language" required />
          <Col sm={9}>
            <InputGroup>
              <CustomInput
                type="select"
                id="programmingLanguage"
                name="programmingLanguage"
                defaultValue={item.programmingLanguage}
                disabled={viewOnly}
                onChange={(e) => {
                  formik.setFieldValue('programmingLanguage', e.target.value)
                  setSelectedLanguage(e.target.value)
                }}
              >
                <option value="">{t('Choose')}...</option>
                <option value="java">Java</option>
                <option value="python">Jython</option>
              </CustomInput>
            </InputGroup>
            {formik.errors.programmingLanguage &&
              formik.touched.programmingLanguage && (
                <div style={{ color: 'red' }}>
                  {formik.errors.programmingLanguage}
                </div>
              )}
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuTooltip doc_category={SCRIPT} doc_entry="locationType">
        <FormGroup row>
          <GluuLabel label="fields.location_type" />
          <Col sm={9}>
            <InputGroup>
              <CustomInput
                type="select"
                id="location_type"
                name="location_type"
                disabled={viewOnly}
                defaultValue={
                  !!item.moduleProperties &&
                  item.moduleProperties.filter(
                    (i) => i.value1 === 'location_type',
                  ).length > 0
                    ? item.moduleProperties.filter(
                        (it) => it.value1 === 'location_type',
                      )[0].value2
                    : undefined
                }
                onChange={(e) => {
                  locationTypeChange(e.target.value)
                }}
              >
                <option value="">{t('options.choose')}...</option>
                <option value="ldap">{t('Database')}</option>
                <option value="file">{t('File')}</option>
              </CustomInput>
            </InputGroup>
          </Col>
        </FormGroup>
      </GluuTooltip>
      {scriptPath && (
        <GluuTooltip doc_category={SCRIPT} doc_entry="scriptPath">
          <FormGroup row>
            <GluuLabel label="fields.script_path" />
            <Col sm={9}>
              <InputGroup>
                <Input
                  placeholder={t('placeholders.script_path')}
                  valid={
                    !formik.errors.location_path &&
                    !formik.touched.location_path &&
                    init
                  }
                  disabled={viewOnly}
                  id="location_path"
                  defaultValue={
                    !!item.moduleProperties &&
                    item.moduleProperties.filter(
                      (i) => i.value1 === 'location_path',
                    ).length > 0
                      ? item.moduleProperties.filter(
                          (it) => it.value1 === 'location_path',
                        )[0].value2
                      : undefined
                  }
                  onChange={(e) => {
                    scriptPathChange(e.target.value)
                  }}
                />
              </InputGroup>
            </Col>
          </FormGroup>
        </GluuTooltip>
      )}
      {scriptTypeState === 'person_authentication' && (
        <GluuTooltip doc_category={SCRIPT} doc_entry="usage_type">
          <FormGroup row>
            <GluuLabel label="Interactive" />
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
                      (vItem) => vItem.value1 === 'usage_type',
                    ).length > 0
                      ? item.moduleProperties.filter(
                          (kItem) => kItem.value1 === 'usage_type',
                        )[0].value2
                      : undefined
                  }
                  onChange={(e) => {
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
        </GluuTooltip>
      )}
      <GluuTooltip doc_category={SCRIPT} doc_entry="level">
        <FormGroup row>
          <GluuLabel doc_category={SCRIPT} label="fields.level" />
          <Col sm={9}>
            <Counter
              counter={item.level}
              disabled={viewOnly}
              onCounterChange={(level) => onLevelChange(level)}
            />
            <Input type="hidden" id="level" defaultValue={item.level} />
          </Col>
        </FormGroup>
      </GluuTooltip>
      <GluuProperties
        compName="configurationProperties"
        label="fields.custom_properties"
        formik={formik}
        keyPlaceholder={t('placeholders.enter_property_key')}
        valuePlaceholder={t('placeholders.enter_property_value')}
        options={getPropertiesConfig(item)}
        disabled={viewOnly}
      ></GluuProperties>
      {!scriptPath && (
        <GluuInputEditor
          doc_category={SCRIPT}
          name="script"
          language={selectedLanguage?.toLowerCase()}
          label="script"
          lsize={2}
          rsize={10}
          formik={formik}
          value={item.script}
          readOnly={viewOnly}
          required
        ></GluuInputEditor>
      )}
      <GluuTooltip doc_category={SCRIPT} doc_entry="enabled">
        <FormGroup row>
          <GluuLabel label="options.enabled" size={3} />
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
      </GluuTooltip>
      <GluuTooltip doc_category={SCRIPT} doc_entry="moduleProperties">
        <FormGroup row>
          <Input
            type="hidden"
            id="moduleProperties"
            defaultValue={item.moduleProperties}
            disabled={viewOnly}
          />
        </FormGroup>
      </GluuTooltip>
      {!viewOnly && <GluuCommitFooter saveHandler={toggle} />}
      <GluuCommitDialog
        handler={toggle}
        modal={modal}
        onAccept={submitForm}
        formik={formik}
        disabled={viewOnly}
      />
    </Form>
  )
}

export default CustomScriptForm
