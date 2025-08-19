import { FormGroup, Col } from 'Components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import customColors from '@/customColors'

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
  hideHelperMessage = false,
  minLength = 0,
  emptyLabel = '',
}: any) {
  const { t } = useTranslation()
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
          labelKey={labelKey || name}
          isLoading={isLoading}
          minLength={minLength}
          onChange={(selected) => {
            if (formik) {
              formik.setFieldValue(name, selected)
              if (onChange) {
                onChange(selected)
              }
            } else if (onChange) {
              onChange(selected)
            }
          }}
          id={name}
          data-testid={name}
          multiple={multiple}
          defaultSelected={value}
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
}
export default GluuTypeAhead
