import React from 'react'
import { FormGroup, Col } from 'Components'
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

function GluuTypeAheadForDn({
  label,
  name,
  value,
  options,
  formik,
  required,
  doc_category,
  doc_entry,
  allowNew = false,
  lsize = 4,
  rsize = 8,
}) {
  const { t } = useTranslation()
  function getItemName(theOptions, item) {
    const data = theOptions.filter((e) => e.dn === item)
    return data[0].name
  }
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={doc_entry || name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} required={required} />
        <Col sm={rsize}>
          <Typeahead
            labelKey={(opt) => `${opt.name || getItemName(options, opt)}`}
            onChange={(selected) => {
              formik.setFieldValue(
                name,
                selected.map((item) =>
                  item.customOption ? item.label : item.dn,
                ),
              )
            }}
            id={name}
            data-testid={name}
            name={name}
            allowNew={allowNew}
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
    </GluuTooltip>
  )
}

export default GluuTypeAheadForDn
