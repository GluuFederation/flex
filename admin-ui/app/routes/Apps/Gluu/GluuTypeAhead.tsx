import React, { useMemo, useCallback, memo } from 'react'
import { FormGroup, Col } from 'Components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import { useTranslation } from 'react-i18next'
import { useStyles } from './styles/GluuTypeAhead.style'
import type { GluuTypeAheadOption, GluuTypeAheadProps } from './types/GluuTypeAhead.types'

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
  isDark,
}: GluuTypeAheadProps) {
  const { t } = useTranslation()
  const { classes } = useStyles()

  const selectedValue = useMemo(() => {
    if (value !== undefined) {
      return value
    }
    const fieldValue = formik?.values?.[name]
    return Array.isArray(fieldValue) ? (fieldValue as GluuTypeAheadOption[]) : []
  }, [value, formik?.values?.[name], name])

  const handleChange = useCallback(
    (selected: GluuTypeAheadOption[]) => {
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
      <GluuLabel
        label={label}
        size={lsize}
        required={required}
        doc_category={doc_category}
        doc_entry={doc_entry || name}
        isDark={isDark}
      />
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
          <span className={classes.helperText}>{t('placeholders.typeahead_holder_message')}</span>
        )}
        {showError ? <div className={classes.error}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
})

export default GluuTypeAhead
