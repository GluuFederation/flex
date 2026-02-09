import React, { useMemo, useCallback } from 'react'
import {
  Grid,
  FormControl,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material'
import GluuLabel from './GluuLabel'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'

interface SelectOption {
  value: string
  label: string
}

interface GluuSelectRowProps {
  label: string
  name: string
  value?: string | number
  formik: {
    handleChange: (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent,
    ) => void
  }
  values?: Array<string | SelectOption>
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  handleChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent,
  ) => void
  required?: boolean
  showError?: boolean
  errorMessage?: string
  doc_entry?: string
  isDark?: boolean
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

  const deduplicatedValues = useMemo(() => {
    const seen = new Set<string>()
    return values.filter((item) => {
      const val = typeof item === 'string' ? item : item.value
      if (seen.has(val)) return false
      seen.add(val)
      return true
    })
  }, [values])

  const selectStyle = useMemo(
    () => ({
      height: '35px',
      minHeight: '35px',
    }),
    [],
  )

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | SelectChangeEvent) => {
      formik.handleChange(event)
      if (handleChange) {
        handleChange(event)
      }
    },
    [formik.handleChange, handleChange],
  )

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={lsize}>
        <GluuLabel
          label={label}
          size={lsize}
          doc_category={doc_category}
          doc_entry={doc_entry || name}
          required={required}
          isDark={isDark}
        />
      </Grid>
      <Grid item xs={rsize}>
        <FormControl fullWidth error={showError} disabled={disabled}>
          <Select
            labelId={`${name}-label`}
            id={name}
            data-testid={name}
            size="small"
            name={name}
            value={value != null ? String(value) : ''}
            onChange={handleSelectChange}
            displayEmpty
            sx={selectStyle}
          >
            <MenuItem value="">
              <em>{t('actions.choose')}...</em>
            </MenuItem>
            {deduplicatedValues.map((item) => {
              const optionValue = typeof item === 'string' ? item : item.value
              const optionLabel = typeof item === 'string' ? item : item.label
              return (
                <MenuItem key={optionValue} value={optionValue}>
                  {optionLabel}
                </MenuItem>
              )
            })}
          </Select>
          {showError && (
            <FormHelperText sx={{ color: customColors.accentRed }}>{errorMessage}</FormHelperText>
          )}
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default GluuSelectRow
