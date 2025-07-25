// @ts-nocheck
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

function GluuArrayCompleter({
  formik,
  label,
  name,
  value,
  options,
  required,
  doc_category,
  lsize,
  rsize,
}) {
  const { t } = useTranslation()
  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        {required ? (
          <GluuLabel label={label} size={lsize || 6} required />
        ) : (
          <GluuLabel label={label} size={lsize || 6} />
        )}
        <Col sm={rsize || 6}>
          <Typeahead
            allowNew
            emptyLabel=""
            labelKey={name}
            onChange={(selected) => {
              formik.setFieldValue(
                name,
                selected.map((value) => value[name]),
              )
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
