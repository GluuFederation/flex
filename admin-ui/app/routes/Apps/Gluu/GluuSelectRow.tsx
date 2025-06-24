import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'

interface SelectOption {
  value: string
  label: string
}

interface GluuSelectRowProps {
  label: string
  name: string
  value: any
  formik: {
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  }
  values?: Array<string | SelectOption>
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  handleChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  required?: boolean
  showError?: boolean
  errorMessage?: string
  doc_entry?: string
}

function GluuSelectRow({
  label,
  name,
  value,
  formik,
  values = [],
  lsize = 3,
  rsize = 9,
  doc_category,
  disabled,
  handleChange,
  required = false,
  showError = false,
  errorMessage,
  doc_entry,
}: GluuSelectRowProps) {
  const { t } = useTranslation()

  function removeDuplicates(values: Array<string | SelectOption>): Array<string | SelectOption> {
    const seen = new Set<string>()
    return values.filter((item) => {
      const val = typeof item === 'string' ? item : item.value
      if (seen.has(val)) return false
      seen.add(val)
      return true
    })
  }

  return (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        doc_category={doc_category}
        doc_entry={doc_entry || name}
        required={required}
      />
      <Col sm={rsize}>
        <InputGroup>
          <CustomInput
            type="select"
            id={name}
            data-testid={name}
            name={name}
            defaultValue={value}
            onChange={(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
              if (handleChange) {
                formik.handleChange(event)
                handleChange(event)
              } else {
                formik.handleChange(event)
              }
            }}
            disabled={disabled}
          >
            <option value="">{t('actions.choose')}...</option>
            {removeDuplicates(values).map((item) => {
              const value = typeof item === 'string' ? item : item.value
              const label = typeof item === 'string' ? item : item.label
              return (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            })}
          </CustomInput>
        </InputGroup>
        {showError ? <div style={{ color: 'red' }}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}

export default GluuSelectRow
