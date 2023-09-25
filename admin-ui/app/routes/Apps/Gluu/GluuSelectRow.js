import React from 'react'
import GluuLabel from './GluuLabel'
import { Col, FormGroup, CustomInput, InputGroup } from 'Components'
import { useTranslation } from 'react-i18next'

function GluuSelectRow({
  label,
  name,
  value,
  formik,
  values,
  lsize,
  rsize,
  doc_category,
  disabled,
  handleChange,
  required,
  showError = false,
  errorMessage
}) {
  const { t } = useTranslation()
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} doc_category={doc_category} doc_entry={name} required={required}/>
      <Col sm={rsize}>
        <InputGroup>
          <CustomInput
            type="select"
            id={name}
            data-testid={name}
            name={name}
            defaultValue={value}
            onChange={(event) => {
              if (handleChange) { formik.handleChange(event); handleChange(event) }
              else { formik.handleChange(event); }
            }}
            disabled={disabled}
          >
            <option value="">{t('actions.choose')}...</option>
            {values.map((item) => {
              const value = typeof item === 'string' ? item : item.value
              const label = typeof item === 'string' ? item : item.label
              return (
                <option value={value} key={value}>
                  {label}
                </option>
              )
            })}
          </CustomInput>
        </InputGroup>
        {showError ? <div style={{ color: "red" }}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}

GluuSelectRow.defaultProps = {
  values: [],
  lsize: 3,
  rsize: 9,
  disabled: false,
}

export default GluuSelectRow
