import React from 'react'
import { FormGroup, Col } from '../../../components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import Typography from '@material-ui/core/Typography'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

const theme = createMuiTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
})

function GluuArrayCompleter({ label, name, value, options, required }) {
  return (
    <FormGroup row>
      {!!required ? (
        <GluuLabel label={label} size={6} required />
      ) : (
        <GluuLabel label={label} size={6} />
      )}
      <Col sm={6}>
        <Typeahead
          allowNew
          emptyLabel=""
          labelKey={name}
          onChange={(selected) => {}}
          id={name}
          name={name}
          multiple={true}
          defaultSelected={value}
          options={options}
        />
        <ThemeProvider theme={theme}>
          <Typography variant="subtitle1">
            Enter multiple items by selecting from appeared dropdown after
            entering each item.
          </Typography>
        </ThemeProvider>
      </Col>
    </FormGroup>
  )
}

export default GluuArrayCompleter
