import React, { useState } from 'react'
import { Col, FormGroup, Input } from 'Components'
import type { InputProps } from 'reactstrap'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import type { FormikProps } from 'formik'
import GluuLabel from './GluuLabel'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'

interface GluuInputRowProps<T = Record<string, unknown>> {
  label: string
  name: string
  type?: InputProps['type']
  value?: string | number
  formik?: FormikProps<T> | null
  required?: boolean
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  showError?: boolean
  errorMessage?: string
  handleChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | null
  doc_entry?: string
  shortcode?: React.ReactNode
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  rows?: number
  cols?: number
  isDark?: boolean
}

function GluuInputRow<T = Record<string, unknown>>({
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
  isDark,
}: GluuInputRowProps<T>) {
  const [customType, setCustomType] = useState<string | null>(null)
  const { state } = useTheme()
  const themeColors = getThemeColor(state?.theme ?? DEFAULT_THEME)

  const setVisivility = (): void => {
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
        isDark={isDark}
      />
      <Col sm={rsize} style={{ position: 'relative' }}>
        <Input
          id={name}
          data-testid={name}
          type={(customType ?? type) as InputProps['type']}
          name={name}
          value={value != null ? String(value) : ''}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            if (formik) {
              formik.handleChange(event)
            }
            if (handleChange) {
              handleChange(event)
            }
          }}
          onBlur={formik?.handleBlur}
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
        {showError ? <div style={{ color: themeColors.errorColor }}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}

export default GluuInputRow
