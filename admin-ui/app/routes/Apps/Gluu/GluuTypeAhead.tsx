import React, { useMemo, useCallback, MutableRefObject, memo } from 'react'
import { FormGroup, Col } from 'Components'
import { Typeahead } from 'react-bootstrap-typeahead'
import type { TypeaheadRef } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'
import { FormikContextType } from 'formik'

type Option = string | Record<string, unknown>

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
})

interface GluuTypeAheadProps {
  label: string
  labelKey?: string | ((option: Option) => string)
  name: string
  value?: Option[]
  options: Option[]
  formik?: FormikContextType<any> | null
  required?: boolean
  doc_category?: string
  doc_entry?: string
  forwardRef?: MutableRefObject<TypeaheadRef | null> | null
  onChange?: ((selected: Option[]) => void) | null
  lsize?: number
  rsize?: number
  disabled?: boolean
  showError?: boolean
  errorMessage?: string
  allowNew?: boolean
  isLoading?: boolean
  multiple?: boolean
  hideHelperMessage?: boolean
  minLength?: number
  emptyLabel?: string
}

const GluuTypeAhead = memo(function GluuTypeAhead({
  label,
  labelKey,
  name,
  value,
  options,
  formik = null,
  required = false,
  doc_category,
  doc_entry,
  forwardRef = null,
  onChange = null,
  lsize = 4,
  rsize = 8,
  disabled = false,
  showError = false,
  errorMessage,
  allowNew = true,
  isLoading = false,
  multiple = true,
  hideHelperMessage = false,
  minLength = 0,
  emptyLabel = 'fields.nothingToShowInTheList',
}: GluuTypeAheadProps) {
  const { t } = useTranslation()

  const selectedValue = useMemo(() => {
    if (value !== undefined) {
      return value
    }
    const fieldValue = formik?.values?.[name]
    return Array.isArray(fieldValue) ? (fieldValue as Option[]) : []
  }, [value, formik?.values?.[name], name])

  const handleChange = useCallback(
    (selected: Option[]) => {
      if (formik) {
        formik.setFieldValue(name, selected)
        if (onChange) {
          onChange(selected)
        }
      } else if (onChange) {
        onChange(selected)
      }
    },
    [formik?.setFieldValue, name, onChange],
  )

  const resolvedLabelKey = useMemo(() => {
    if (typeof labelKey === 'function' || typeof labelKey === 'string') {
      return labelKey
    }
    return 'name'
  }, [labelKey])

  return (
    <FormGroup row>
      {required ? (
        <GluuLabel
          label={label}
          size={lsize}
          required
          doc_category={doc_category}
          doc_entry={doc_entry || name}
        />
      ) : (
        <GluuLabel
          label={label}
          size={lsize}
          doc_category={doc_category}
          doc_entry={doc_entry || name}
        />
      )}
      <Col sm={rsize}>
        <Typeahead
          allowNew={allowNew}
          disabled={disabled}
          ref={forwardRef}
          emptyLabel={t(emptyLabel)}
          labelKey={resolvedLabelKey}
          isLoading={isLoading}
          minLength={minLength}
          onChange={handleChange}
          id={name}
          data-testid={name}
          multiple={multiple}
          selected={selectedValue}
          options={options}
        />
        {!hideHelperMessage && (
          <ThemeProvider theme={theme}>
            <Typography variant="subtitle1">
              {t('placeholders.typeahead_holder_message')}
            </Typography>
          </ThemeProvider>
        )}
        {showError ? <div style={{ color: customColors.accentRed }}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
})

export default GluuTypeAhead
