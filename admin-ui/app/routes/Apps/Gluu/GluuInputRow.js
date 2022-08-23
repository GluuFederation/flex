import React, { useState } from 'react'
import { Col, FormGroup, Input } from 'Components'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
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
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} required={required} />
        <Col sm={rsize}>
          <Input
            id={name}
            data-testid={name}
            type={customType || type}
            name={name}
            defaultValue={value}
            onChange={formik.handleChange}
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
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

GluuInputRow.defaultProps = {
  type: 'text',
  lsize: 3,
  rsize: 9,
  required: false,
  disabled: false,
}

export default GluuInputRow
