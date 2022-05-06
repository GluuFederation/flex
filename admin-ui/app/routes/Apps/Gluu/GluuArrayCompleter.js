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

function GluuArrayCompleter({
  label,
  name,
  value,
  options,
  required,
  doc_category,
}) {
  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        {required ? (
          <GluuLabel label={label} size={6} required />
        ) : (
          <GluuLabel label={label} size={6} />
        )}
        <Col sm={6}>
          <Typeahead
            allowNew
            emptyLabel=""
            labelKey={name}
            onChange={(selected) => {
              console.log(selected)
            }}
            id={name}
            name={name}
            data-testid={name}
            multiple={true}
            defaultSelected={value}
            options={options}
          />
          <ThemeProvider theme={theme}>
            <Typography variant="subtitle1">
              {t(
                'Enter multiple items by selecting from appeared dropdown after entering each item.',
              )}
            </Typography>
          </ThemeProvider>
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

export default GluuArrayCompleter
