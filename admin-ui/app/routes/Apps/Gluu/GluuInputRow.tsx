import { useState } from 'react'
import { Col, FormGroup, Input } from 'Components'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import GluuLabel from './GluuLabel'
import customColors from '@/customColors'

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
  cols,
}: any) {
  const [customType, setCustomType] = useState<string | null>(null)

  const setVisivility = () => {
    if (customType) {
      setCustomType(null)
    } else {
      setCustomType('text')
    }
  }
  return (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        doc_category={doc_category}
        required={required}
        doc_entry={doc_entry || name}
      />
      <Col sm={rsize} style={{ position: 'relative' }}>
        <Input
          id={name}
          data-testid={name}
          type={customType || type}
          name={name}
          value={value}
          onChange={(event) => {
            if (handleChange) {
              formik.handleChange(event)
              handleChange(event)
            } else {
              formik.handleChange(event)
            }
          }}
          onBlur={formik.handleBlur}
          onFocus={onFocus}
          onKeyDown={(evt) => evt.key === 'e' && type === 'number' && evt.preventDefault()}
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
        {showError ? <div style={{ color: customColors.accentRed }}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}
export default GluuInputRow
