import React, { useState, useCallback, useMemo } from 'react'
import { Col, FormGroup, Input } from 'Components'
import type { InputProps } from 'reactstrap'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { ChevronIcon } from '@/components/SVG'
import GluuLabel from './GluuLabel'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME, THEME_DARK } from '@/context/theme/constants'
import { getLoadingOverlayRgba } from '@/customColors'
import { OPACITY } from '@/constants/ui'
import { useStyles } from './styles/GluuInputRow.style'
import type { GluuInputRowProps } from './types/GluuInputRow.types'

const GluuInputRow = <T = Record<string, unknown>,>({
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
  placeholder,
}: GluuInputRowProps<T>) => {
  const [customType, setCustomType] = useState<string | null>(null)
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state?.theme ?? DEFAULT_THEME), [state?.theme])
  const isDarkTheme = isDark ?? state?.theme === THEME_DARK
  const stepperHoverBg = useMemo(
    () =>
      getLoadingOverlayRgba(
        themeColors.fontColor,
        isDarkTheme ? OPACITY.HOVER_DARK : OPACITY.HOVER_LIGHT,
      ),
    [themeColors.fontColor, isDarkTheme],
  )
  const { classes } = useStyles({
    errorColor: themeColors.errorColor,
    fontColor: themeColors.fontColor,
    stepperHoverBg,
  })

  const setVisibility = useCallback((): void => {
    setCustomType((prev) => (prev ? null : 'text'))
  }, [])

  const numValue = type === 'number' && value !== '' && value != null ? Number(value) : NaN
  const stepUp = useCallback(() => {
    const next = (Number.isNaN(numValue) ? 0 : numValue) + 1
    if (formik) {
      formik.setFieldValue(name, next)
    }
    if (handleChange) {
      handleChange({ target: { name, value: String(next) } } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [formik, handleChange, name, numValue])
  const stepDown = useCallback(() => {
    const current = Number.isNaN(numValue) ? 0 : numValue
    if (current <= 0) return
    const next = current - 1
    if (formik) {
      formik.setFieldValue(name, next)
    }
    if (handleChange) {
      handleChange({ target: { name, value: String(next) } } as React.ChangeEvent<HTMLInputElement>)
    }
  }, [formik, handleChange, name, numValue])

  const inputEl = (
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
      placeholder={placeholder}
      className={shortcode ? classes.inputWithShortcode : undefined}
    />
  )

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
      <Col sm={rsize} className={classes.colWrapper}>
        {type === 'number' ? (
          <div className={classes.numberWrapper}>
            {inputEl}
            <div className={classes.numberStepper} aria-hidden>
              <button
                type="button"
                className={classes.numberStepperBtn}
                onClick={stepUp}
                disabled={disabled}
                tabIndex={-1}
                aria-label="Increment"
              >
                <ChevronIcon width={16} height={16} direction="up" />
              </button>
              <button
                type="button"
                className={classes.numberStepperBtn}
                onClick={stepDown}
                disabled={disabled || Number.isNaN(numValue) || numValue <= 0}
                tabIndex={-1}
                aria-label="Decrement"
              >
                <ChevronIcon width={16} height={16} direction="down" />
              </button>
            </div>
          </div>
        ) : (
          inputEl
        )}
        {shortcode}
        {type === 'password' && (
          <div className={classes.passwordToggle}>
            {customType === 'text' ? (
              <Visibility onClick={setVisibility} />
            ) : (
              <VisibilityOff onClick={setVisibility} />
            )}
          </div>
        )}
        {showError ? <div className={classes.error}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}

GluuInputRow.displayName = 'GluuInputRow'

export default GluuInputRow
