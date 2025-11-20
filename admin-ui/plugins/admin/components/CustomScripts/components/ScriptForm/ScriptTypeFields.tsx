import React, { useMemo } from 'react'
import { FormGroup, Input, Col } from 'Components'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import type { ScriptTypeFieldsProps } from '../../types/props'
import { SAML_ACR_OPTIONS, SPECIAL_SCRIPT_TYPES, MODULE_PROPERTY_KEYS } from '../../constants'

export function ScriptTypeFields({
  formik,
  scriptType,
  disabled = false,
}: ScriptTypeFieldsProps): JSX.Element | null {
  const { t } = useTranslation()

  const usageType = useMemo(() => {
    return (
      formik.values.moduleProperties.find((p) => p.value1 === MODULE_PROPERTY_KEYS.USAGE_TYPE)
        ?.value2 || ''
    )
  }, [formik.values.moduleProperties])

  if (scriptType !== SPECIAL_SCRIPT_TYPES.PERSON_AUTHENTICATION) {
    return null
  }

  const handleUsageTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsageType = e.target.value
    const updatedProps = formik.values.moduleProperties.filter(
      (p) => p.value1 !== MODULE_PROPERTY_KEYS.USAGE_TYPE,
    )
    if (newUsageType) {
      updatedProps.push({
        value1: MODULE_PROPERTY_KEYS.USAGE_TYPE,
        value2: newUsageType,
      })
    }
    formik.setFieldValue('moduleProperties', updatedProps)
  }

  const handleAliasesChange = (value: string) => {
    const aliasArray = value
      .split(',')
      .map((alias) => alias.trim())
      .filter((alias) => alias.length > 0)
    formik.setFieldValue('aliases', aliasArray)
  }

  return (
    <>
      <FormGroup row>
        <GluuLabel
          label="fields.saml_acr"
          size={3}
          doc_category="custom_script"
          doc_entry="aliases"
        />
        <Col sm={9}>
          <Input
            type="select"
            multiple
            id="aliases"
            name="aliases"
            value={formik.values.aliases}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((option) => option.value)
              formik.setFieldValue('aliases', selected)
            }}
            disabled={disabled}
            style={{ minHeight: '150px' }}
          >
            {SAML_ACR_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Input>
          <small className="form-text text-muted">
            {t('messages.hold_ctrl_to_select_multiple')}
          </small>
        </Col>
      </FormGroup>

      <FormGroup row>
        <GluuLabel
          label="fields.usage_type"
          size={3}
          required
          doc_category="custom_script"
          doc_entry="usage_type"
        />
        <Col sm={9}>
          <Input
            type="select"
            id="usage_type"
            name="usage_type"
            value={usageType}
            onChange={handleUsageTypeChange}
            disabled={disabled}
            invalid={!!(formik.touched.moduleProperties && formik.errors.moduleProperties)}
          >
            <option value="">{t('options.choose')}...</option>
            <option value="interactive">{t('options.interactive')}</option>
            <option value="service">{t('options.service')}</option>
            <option value="both">{t('options.both')}</option>
          </Input>
          {formik.touched.moduleProperties && formik.errors.moduleProperties && (
            <div className="invalid-feedback d-block">
              {typeof formik.errors.moduleProperties === 'string'
                ? formik.errors.moduleProperties
                : t('messages.interactive_required')}
            </div>
          )}
        </Col>
      </FormGroup>
    </>
  )
}

export default ScriptTypeFields
