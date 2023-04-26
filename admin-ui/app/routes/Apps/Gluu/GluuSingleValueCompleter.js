import React from 'react'
import { FormGroup, Col } from 'Components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTooltip from './GluuTooltip'
import Typography from '@mui/material/Typography'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

const theme = createTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
})

function GluuSingleValueCompleter({
  label,
  name,
  value,
  options,
  required,
  doc_category,
  doc_entry,
  onChange = null,
}) {
  const { t } = useTranslation()
  return (
    
    <FormGroup row>
      {required ? (
        <GluuLabel label={label} size={4} required doc_category={doc_category} doc_entry={doc_entry || name}/>
      ) : (
        <GluuLabel label={label} size={4} doc_category={doc_category} doc_entry={doc_entry || name} />
      )}
      <Col sm={8}>
        <Typeahead
          emptyLabel=""
          labelKey={name}
          id={name}
          data-testid={name}
          name={name}
          defaultSelected={value}
          options={options}
          onChange={(e) => {
            if (onChange) {
              onChange(e)
            }
          }}
        />
        <ThemeProvider theme={theme}>
          <Typography variant="subtitle1">
            {t('placeholders.typeahead_holder_message')}
          </Typography>
        </ThemeProvider>
      </Col>
    </FormGroup>
  )
}

export default GluuSingleValueCompleter
