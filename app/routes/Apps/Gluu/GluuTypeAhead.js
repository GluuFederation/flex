import React from 'react'
import { FormGroup, Col } from '../../../components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  typography: {
    subtitle1: {
      fontSize: 12,
    },
  },
});

function GluuTypeAhead({ label, name, value, options, formik, required }) {
  return (
    <FormGroup row>
      {!!required ? <GluuLabel label={label} size={4} required /> : <GluuLabel label={label} size={4} />}
      <Col sm={8}>
        <Typeahead
          allowNew
          emptyLabel=""
          labelKey={name}
          onChange={(selected) => {
            formik.setFieldValue(name, selected)
          }}
          id={name}
          name={name}
          multiple={true}
          defaultSelected={value}
          options={options}
        />
        <ThemeProvider theme={theme}>
          <Typography variant="subtitle1">Enter multiple items by selecting from appeared dropdown after entering each item.</Typography>
        </ThemeProvider>
      </Col>
    </FormGroup>
  )
}

export default GluuTypeAhead
