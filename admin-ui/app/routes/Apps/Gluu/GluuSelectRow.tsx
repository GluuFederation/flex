import React, { useCallback, useMemo } from 'react'
import { FormGroup, Col, CustomInput, InputGroup } from 'Components'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { ChevronIcon } from '@/components/SVG'
import GluuLabel from './GluuLabel'
import GluuText from './GluuText'
import { useTranslation } from 'react-i18next'
import { useTheme } from '@/context/theme/themeContext'
import getThemeColor from '@/context/theme/config'
import { DEFAULT_THEME } from '@/context/theme/constants'
import { useStyles } from './styles/GluuSelectRow.style'
import type { GluuSelectRowProps, SelectOption } from './types/GluuSelectRow.types'

const deduplicateSelectValues = (
  values: Array<string | SelectOption>,
): Array<string | SelectOption> => {
  const seen = new Set<string>()
  return values.filter((item) => {
    const val = typeof item === 'string' ? item : item.value
    if (seen.has(val)) return false
    seen.add(val)
    return true
  })
}

const GluuSelectRow: React.FC<GluuSelectRowProps> = ({
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
  isDark,
  freeSolo,
  onValueChange,
  inputHeight,
  inputPaddingTop,
  inputPaddingBottom,
}) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState?.theme ?? DEFAULT_THEME),
    [themeState?.theme],
  )
  const { classes } = useStyles({
    themeColors,
    inputHeight: inputHeight ?? 40,
    inputPaddingTop: inputPaddingTop ?? 8,
    inputPaddingBottom: inputPaddingBottom ?? 8,
  })

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      formik.handleChange(event)
      if (handleChange) {
        handleChange(event)
      }
    },
    [formik.handleChange, handleChange],
  )

  const displayValue = value != null ? String(value) : ''
  const options = useMemo(
    () =>
      deduplicateSelectValues(values).map((item) =>
        typeof item === 'string' ? item : (item.label ?? item.value),
      ),
    [values],
  )

  const content = freeSolo ? (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        doc_category={doc_category}
        doc_entry={doc_entry || name}
        required={required}
        isDark={isDark}
      />
      <Col sm={rsize} className={classes.colWrapper}>
        <Autocomplete
          id={name}
          freeSolo
          disableClearable
          options={options}
          value={displayValue || undefined}
          onChange={(_event, newValue) => {
            const value = newValue ? String(newValue) : ''
            formik.handleChange({
              target: { name, value },
            } as React.ChangeEvent<HTMLInputElement>)
            onValueChange?.(newValue ? String(newValue) : null)
          }}
          onBlur={() =>
            formik.handleBlur?.({ target: { name } } as React.FocusEvent<HTMLInputElement>)
          }
          disabled={disabled}
          className={classes.autocompleteRoot}
          renderInput={(params) => (
            <TextField
              {...params}
              name={name}
              placeholder={`${t('actions.choose')}...`}
              error={showError && Boolean(errorMessage)}
              helperText={showError ? errorMessage : undefined}
              size="small"
              fullWidth
            />
          )}
        />
      </Col>
    </FormGroup>
  ) : (
    <FormGroup row>
      <GluuLabel
        label={label}
        size={lsize}
        doc_category={doc_category}
        doc_entry={doc_entry || name}
        required={required}
        isDark={isDark}
      />
      <Col sm={rsize} className={classes.colWrapper}>
        <div className={classes.selectWrapper}>
          <InputGroup>
            <CustomInput
              type="select"
              id={name}
              name={name}
              data-testid={name}
              value={displayValue}
              onChange={handleSelectChange}
              onBlur={formik.handleBlur}
              disabled={disabled}
              className={classes.select}
            >
              <option value="">{t('actions.choose')}...</option>
              {deduplicateSelectValues(values).map((item) => {
                const optionValue = typeof item === 'string' ? item : item.value
                const optionLabel = typeof item === 'string' ? item : (item.label ?? item.value)
                return (
                  <option key={optionValue} value={optionValue}>
                    {optionLabel}
                  </option>
                )
              })}
            </CustomInput>
          </InputGroup>
          <span className={classes.chevronWrapper} aria-hidden>
            <ChevronIcon width={20} height={20} direction="down" />
          </span>
        </div>
        {showError && errorMessage && (
          <GluuText variant="span" className={classes.error} data-field-error disableThemeColor>
            {errorMessage}
          </GluuText>
        )}
      </Col>
    </FormGroup>
  )

  return content
}

export default GluuSelectRow
