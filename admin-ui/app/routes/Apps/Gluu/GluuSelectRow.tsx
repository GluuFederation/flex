import React, { useCallback, useMemo } from 'react'
import { FormGroup, Col, CustomInput, InputGroup } from 'Components'
import { ChevronIcon } from '@/components/SVG'
import GluuLabel from './GluuLabel'
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
}) => {
  const { t } = useTranslation()
  const { state: themeState } = useTheme()
  const themeColors = useMemo(
    () => getThemeColor(themeState?.theme ?? DEFAULT_THEME),
    [themeState?.theme],
  )
  const { classes } = useStyles({ fontColor: themeColors.fontColor })

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

  return (
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
              const optionLabel = typeof item === 'string' ? item : item.label
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
        {showError && errorMessage && <div className={classes.error}>{errorMessage}</div>}
      </Col>
    </FormGroup>
  )
}

export default GluuSelectRow
