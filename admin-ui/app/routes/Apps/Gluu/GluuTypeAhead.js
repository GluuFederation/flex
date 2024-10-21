import React from 'react'
import { FormGroup, Col } from 'Components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
})

function GluuTypeAhead({
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
  hideHelperMessage = false
}) {
  const { t } = useTranslation()
  return (

    <FormGroup row>
      {required ? (
        <GluuLabel label={label} size={lsize} required doc_category={doc_category} doc_entry={doc_entry || name} />
      ) : (
        <GluuLabel label={label} size={lsize} doc_category={doc_category} doc_entry={doc_entry || name} />
      )}
      <Col sm={rsize}>
        <Typeahead
          allowNew={allowNew}
          disabled={disabled}
          ref={forwardRef}
          emptyLabel=""
          labelKey={labelKey || name}
          isLoading={isLoading}
          onChange={(selected) => {
            if (formik) {
              formik.setFieldValue(name, selected)
            } else if (onChange) {
              onChange(selected)
            }
          }}
          id={name}
          data-testid={name}
          name={name}
          multiple={multiple}
          defaultSelected={value}
          options={options}
        />
        {!hideHelperMessage && <ThemeProvider theme={theme}>
          <Typography variant="subtitle1">
            {t('placeholders.typeahead_holder_message')}
          </Typography>
        </ThemeProvider>}
        {showError ? <div style={{ color: "red" }}>{errorMessage}</div> : null}
      </Col>
    </FormGroup>
  )
}

GluuTypeAhead.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  options: PropTypes.array,
  formik: PropTypes.object,
  required: PropTypes.bool,
  doc_category: PropTypes.string,
  doc_entry: PropTypes.any,
  forwardRef: PropTypes.object,
  onChange: PropTypes.func,
  lsize: PropTypes.number,
  rsize: PropTypes.number,
  disabled: PropTypes.bool,
  showError: PropTypes.bool,
  errorMessage: PropTypes.string,
  allowNew: PropTypes.bool,
  isLoading: PropTypes.bool,
  multiple: PropTypes.bool,
  hideHelperMessage: PropTypes.bool
};
export default GluuTypeAhead
