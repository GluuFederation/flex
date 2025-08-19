import React from 'react'
import { Grid, FormControl, Select, MenuItem, FormHelperText } from '@mui/material'
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
  value: any
  formik: {
    handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  }
  values?: Array<string | SelectOption>
  lsize?: number
  rsize?: number
  doc_category?: string
  disabled?: boolean
  handleChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  required?: boolean
  showError?: boolean
  errorMessage?: string
  doc_entry?: string
}

function GluuSelectRow({
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
}: GluuSelectRowProps) {
  const { t } = useTranslation()

  function removeDuplicates(values: Array<string | SelectOption>): Array<string | SelectOption> {
    const seen = new Set<string>()
    return values.filter((item) => {
      const val = typeof item === 'string' ? item : item.value
      if (seen.has(val)) return false
      seen.add(val)
      return true
    })
  }

  // Calculate grid sizes based on Bootstrap column system (out of 12)
  const labelGridSize = Math.round((lsize / 12) * 12)
  const selectGridSize = Math.round((rsize / 12) * 12)

  return (
    <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
      <Grid item xs={labelGridSize}>
        <GluuLabel
          label={label}
          size={lsize}
          doc_category={doc_category}
          doc_entry={doc_entry || name}
          required={required}
        />
      </Grid>
      <Grid item xs={selectGridSize}>
        <FormControl fullWidth error={showError} disabled={disabled}>
          <Select
            labelId={`${name}-label`}
            id={name}
            data-testid={name}
            size="small"
            name={name}
            value={value || ''}
            onChange={(event) => {
              const syntheticEvent = {
                ...event,
                target: {
                  ...event.target,
                  name: name,
                  value: event.target.value,
                },
              } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>

              if (handleChange) {
                formik.handleChange(syntheticEvent)
                handleChange(syntheticEvent)
              } else {
                formik.handleChange(syntheticEvent)
              }
            }}
            displayEmpty
            sx={{
              minHeight: '40px',
            }}
          >
            <MenuItem value="">
              <em>{t('actions.choose')}...</em>
            </MenuItem>
            {removeDuplicates(values).map((item) => {
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
