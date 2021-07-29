import React from 'react'
import { FormGroup, Col } from '../../../components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
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

function GluuTypeAheadForDn({ label, name, value, options, formik, required }) {
  const { t } = useTranslation()
  return (
    <FormGroup row>
      <GluuLabel label={label} size={4} required={required} />
      <Col sm={8}>
        <Typeahead
          labelKey={(option) => `${option.name}`}
          onChange={(selected) => {
            formik.setFieldValue(
              name,
              selected.map((item) => item.dn),
            )
          }}
          id={name}
          name={name}
          multiple={true}
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
  )
}

export default GluuTypeAheadForDn
