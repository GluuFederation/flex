import React from 'react'
import { FormGroup, Col } from '../../../components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTooltip from './GluuTooltip'
import Typography from '@material-ui/core/Typography'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
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
}) {
  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={doc_entry || name}>
      <FormGroup row>
        {!!required ? (
          <GluuLabel label={label} size={4} required />
        ) : (
          <GluuLabel label={label} size={4} />
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
          />
          <ThemeProvider theme={theme}>
            <Typography variant="subtitle1">
              {t('placeholders.typeahead_holder_message')}
            </Typography>
          </ThemeProvider>
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

export default GluuSingleValueCompleter
