import React from 'react'
import { FormGroup, Input, CustomInput, Col } from 'Components'
import Toggle from 'react-toggle'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import GluuInumInput from 'Routes/Apps/Gluu/GluuInumInput'
import { ScriptTypeSelect } from '../shared'
import type { BasicInfoFieldsProps } from '../../types/props'
import type { CustomScriptScriptType, CustomScriptProgrammingLanguage } from '../../types/domain'

export function BasicInfoFields({
  formik,
  scriptTypes,
  disabled = false,
  loadingScriptTypes = false,
}: BasicInfoFieldsProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <>
      {formik.values.inum && (
        <GluuInumInput
          label="fields.inum"
          name="inum"
          lsize={3}
          rsize={9}
          value={formik.values.inum}
          formik={formik}
          disabled
        />
      )}

      <FormGroup row>
        <GluuLabel
          label="fields.name"
          size={3}
          required
          doc_category="custom_script"
          doc_entry="name"
        />
        <Col sm={9}>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder={t('placeholders.name')}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={disabled}
            invalid={!!(formik.touched.name && formik.errors.name)}
          />
          {formik.touched.name && formik.errors.name && (
            <div className="invalid-feedback d-block">{formik.errors.name}</div>
          )}
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel
          label="fields.description"
          size={3}
          doc_category="custom_script"
          doc_entry="description"
        />
        <Col sm={9}>
          <Input
            id="description"
            name="description"
            type="textarea"
            rows={3}
            placeholder={t('placeholders.description')}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={disabled}
          />
        </Col>
      </FormGroup>

      <ScriptTypeSelect
        value={formik.values.scriptType}
        options={scriptTypes}
        onChange={(value) => formik.setFieldValue('scriptType', value as CustomScriptScriptType)}
        disabled={disabled || !!formik.values.inum}
        loading={loadingScriptTypes}
        error={formik.touched.scriptType ? formik.errors.scriptType : undefined}
      />

      <FormGroup row>
        <GluuLabel
          label="fields.programming_language"
          size={3}
          required
          doc_category="custom_script"
          doc_entry="programmingLanguage"
        />
        <Col sm={9}>
          <CustomInput
            type="select"
            id="programmingLanguage"
            name="programmingLanguage"
            value={formik.values.programmingLanguage}
            disabled={disabled}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              formik.setFieldValue(
                'programmingLanguage',
                e.target.value as CustomScriptProgrammingLanguage,
              )
            }}
            invalid={!!(formik.touched.programmingLanguage && formik.errors.programmingLanguage)}
          >
            <option value="">{t('options.choose')}...</option>
            <option value="python">Jython</option>
            <option value="java">Java</option>
          </CustomInput>
          {formik.touched.programmingLanguage && formik.errors.programmingLanguage && (
            <div className="invalid-feedback d-block">{formik.errors.programmingLanguage}</div>
          )}
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel
          label="fields.level"
          size={3}
          required
          doc_category="custom_script"
          doc_entry="level"
        />
        <Col sm={9}>
          <Input
            id="level"
            name="level"
            type="number"
            min={1}
            value={formik.values.level}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={disabled}
            invalid={!!(formik.touched.level && formik.errors.level)}
          />
          {formik.touched.level && formik.errors.level && (
            <div className="invalid-feedback d-block">{formik.errors.level}</div>
          )}
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel
          label="options.enabled"
          size={3}
          doc_category="custom_script"
          doc_entry="enabled"
        />
        <Col sm={9}>
          <Toggle
            id="enabled"
            name="enabled"
            checked={formik.values.enabled}
            onChange={(e) => formik.setFieldValue('enabled', e.target.checked)}
            disabled={disabled}
          />
        </Col>
      </FormGroup>
    </>
  )
}

export default BasicInfoFields
