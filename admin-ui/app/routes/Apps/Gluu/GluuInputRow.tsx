import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Col, FormGroup, Input } from 'Components'
import type { InputProps } from 'reactstrap'
import { Visibility, VisibilityOff } from '@/components/icons'
import { ChevronIcon } from '@/components/SVG'
import GluuLabel from './GluuLabel'
import GluuText from './GluuText'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './styles/GluuInputRow.style'
import type { JsonValue } from './types/common'
import type { GluuInputRowProps } from './types/GluuInputRow.types'

const GluuInputRow = <T = Record<string, JsonValue>,>({
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
  allowPasswordToggleWhenDisabled = false,
  inputClassName,
}: GluuInputRowProps<T>) => {
  const { t } = useTranslation()
  const [customType, setCustomType] = useState<string | null>(null)
  const { state } = useTheme()
  const themeColors = useMemo(() => getThemeColor(state?.theme ?? DEFAULT_THEME), [state?.theme])
  const { classes } = useStyles({
    errorColor: themeColors.errorColor,
    fontColor: themeColors.fontColor,
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
      handleChange({ target: { name, value: String(next) } })
    }
  }, [formik, handleChange, name, numValue])

  const stepDown = useCallback(() => {
    const current = Number.isNaN(numValue) ? 0 : numValue
    if (current <= 0) return
    const next = Math.max(0, current - 1)
    if (formik) {
      formik.setFieldValue(name, next)
    }
    if (handleChange) {
      handleChange({ target: { name, value: String(next) } })
    }
  }, [formik, handleChange, name, numValue])

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (formik) {
        formik.handleChange(event)
      }
      if (handleChange) {
        handleChange(event)
      }
    },
    [formik, handleChange],
  )

  const onKeyDown = useCallback(
    (evt: React.KeyboardEvent) => {
      if (evt.key.toLowerCase() === 'e' && type === 'number') {
        evt.preventDefault()
      }
    },
    [type],
  )

  const inputClassName_ = useMemo(
    () =>
      [
        shortcode ? classes.inputWithShortcode : undefined,
        type === 'password' ? classes.passwordInputPadding : undefined,
        inputClassName,
      ]
        .filter(Boolean)
        .join(' '),
    [shortcode, type, classes.inputWithShortcode, classes.passwordInputPadding, inputClassName],
  )

  const displayValue = value != null ? String(value) : ''

  const sharedInputProps = useMemo(
    () => ({
      'id': name,
      'data-testid': name,
      name,
      'value': displayValue,
      onChange,
      'onBlur': formik?.handleBlur,
      onFocus,
      onKeyDown,
      disabled,
      placeholder,
      'className': inputClassName_,
    }),
    [
      name,
      displayValue,
      onChange,
      formik?.handleBlur,
      onFocus,
      onKeyDown,
      disabled,
      placeholder,
      inputClassName_,
    ],
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
            <Input {...sharedInputProps} type="number" />
            <div className={classes.numberStepper} aria-hidden>
              <button
                type="button"
                className={classes.numberStepperBtn}
                onClick={stepUp}
                disabled={disabled}
                tabIndex={-1}
              >
                <ChevronIcon width={16} height={16} direction="up" />
              </button>
              <button
                type="button"
                className={classes.numberStepperBtn}
                onClick={stepDown}
                disabled={disabled || Number.isNaN(numValue) || numValue <= 0}
                tabIndex={-1}
              >
                <ChevronIcon width={16} height={16} direction="down" />
              </button>
            </div>
          </div>
        ) : type === 'password' ? (
          <div className={classes.passwordInputWrapper}>
            <Input {...sharedInputProps} type={(customType ?? 'password') as InputProps['type']} />
            <button
              type="button"
              className={classes.passwordToggle}
              onClick={setVisibility}
              disabled={disabled && !allowPasswordToggleWhenDisabled}
              aria-disabled={disabled && !allowPasswordToggleWhenDisabled}
              aria-label={t(customType === 'text' ? 'password.hide' : 'password.show')}
            >
              {customType === 'text' ? <Visibility /> : <VisibilityOff />}
            </button>
          </div>
        ) : (
          <Input
            {...sharedInputProps}
            type={(customType ?? type) as InputProps['type']}
            rows={rows}
            cols={cols}
          />
        )}
        {type !== 'number' ? shortcode : null}
        <GluuText variant="span" className={classes.error} data-field-error disableThemeColor>
          {showError ? errorMessage : '\u00A0'}
        </GluuText>
      </Col>
    </FormGroup>
  )
}

GluuInputRow.displayName = 'GluuInputRow'

export default GluuInputRow
