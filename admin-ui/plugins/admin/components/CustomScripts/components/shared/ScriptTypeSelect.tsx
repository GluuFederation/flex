import React from 'react'
import { FormGroup, CustomInput, Col } from 'Components'
import { Skeleton } from '@mui/material'
import { useTranslation } from 'react-i18next'
import GluuLabel from 'Routes/Apps/Gluu/GluuLabel'
import type { ScriptTypeSelectProps } from '../../types/props'

/**
 * Script type select component
 */
export function ScriptTypeSelect({
  value,
  options,
  onChange,
  disabled = false,
  loading = false,
  error,
  label = 'fields.script_type',
}: ScriptTypeSelectProps): JSX.Element {
  const { t } = useTranslation()

  if (loading) {
    return (
      <FormGroup row>
        <GluuLabel label={label} size={3} />
        <Col sm={9}>
          <Skeleton variant="rectangular" width="100%" height={38} />
        </Col>
      </FormGroup>
    )
  }

  return (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={3}
        required
        doc_category="custom_script"
        doc_entry="scriptType"
      />
      <Col sm={9}>
        <CustomInput
          type="select"
          id="scriptType"
          name="scriptType"
          value={value}
          disabled={disabled}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          invalid={!!error}
        >
          <option value="">{t('options.choose')}...</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.name}
            </option>
          ))}
        </CustomInput>
        {error && <div className="invalid-feedback d-block">{error}</div>}
      </Col>
    </FormGroup>
  )
}

export default ScriptTypeSelect
