// @ts-nocheck
import React, { useState } from 'react'
import { Col, FormGroup, Input } from 'Components'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import GluuLabel from './GluuLabel'
import PropTypes from 'prop-types';

function GluuInputRow({
  label,
  name,
  type = 'text',
  value,
  formik,
  required = false,
  lsize = 3,
  rsize = 9,
  doc_category,
  disabled = false,
  showError = false,
  errorMessage = '',
  handleChange = null,
  doc_entry,
  shortcode = null,
  onFocus,
  rows,
  cols
}) {
  const [customType, setCustomType] = useState(null)

  const setVisivility = () => {
    if (customType) {
      setCustomType(null)
    } else {
      setCustomType('text')
    }
  }
  return (
    <FormGroup row>
      <GluuLabel label={label} size={lsize} doc_category={doc_category} required={required} doc_entry={doc_entry || name} />
      <Col sm={rsize} style={{ position: 'relative' }}>
        <Input
          id={name}
          data-testid={name}
          type={customType || type}
          name={name}
          value={value}
          onChange={(event) => {
            if (handleChange) { formik.handleChange(event); handleChange(event) }
            else { formik.handleChange(event); }
          }}
          onFocus={onFocus}
          onKeyDown={(evt) => evt.key === 'e' && type === "number" && evt.preventDefault()}
          disabled={disabled}
          rows={rows}
          cols={cols}
        />
        {shortcode}
        {type == 'password' && (
          <div style={{ position: 'absolute', right: 20, top: 7 }}>
            {customType == 'text' ? (
              <Visibility onClick={() => setVisivility()} />
            ) : (
              <VisibilityOff onClick={() => setVisivility()} />
            )}
          </div>
        )}
        {showError ? <div style={{ color: "red" }}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}
export default GluuInputRow

GluuInputRow.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.any,
  formik: PropTypes.object,
  required: PropTypes.bool,
  lsize: PropTypes.number,
  rsize: PropTypes.number,
  doc_category: PropTypes.string,
  disabled: PropTypes.bool,
  showError: PropTypes.bool,
  errorMessage: PropTypes.string,
  handleChange: PropTypes.func,
  doc_entry: PropTypes.string,
  shortcode: PropTypes.element,
  onFocus: PropTypes.func,
  rows: PropTypes.string,
  cols: PropTypes.string
}
