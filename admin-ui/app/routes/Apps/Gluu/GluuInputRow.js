import React, { useState } from 'react'
import { Col, FormGroup, Input } from 'Components'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import GluuLabel from './GluuLabel'
import PropTypes from 'prop-types';

function GluuInputRow({
  label,
  name,
  type,
  value,
  formik,
  required,
  lsize,
  rsize,
  doc_category,
  disabled,
  showError = false,
  errorMessage = '',
  handleChange = null,
  doc_entry
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
          defaultValue={value}
          onChange={(event) => {
            if (handleChange) { formik.handleChange(event); handleChange(event) }
            else { formik.handleChange(event); }
          }}
          onKeyDown={(evt) => evt.key === 'e' && type === "number" && evt.preventDefault()}
          disabled={disabled}
        />
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

GluuInputRow.defaultProps = {
  type: 'text',
  lsize: 3,
  rsize: 9,
  required: false,
  disabled: false,
  doc_entry: undefined
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
};
