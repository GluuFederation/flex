// @ts-nocheck
import React, { useState, useContext } from 'react'
import { FormGroup, Col, Row, Button, Input } from 'Components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTooltip from './GluuTooltip'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'
import PropTypes from 'prop-types'
import customColors from '@/customColors'

function GluuAutoCompleteWithAdd({
  label,
  name,
  value,
  options,
  validator,
  inputId,
  formik = undefined,
  placeholder,
  doc_category,
  handler = null,
}) {
  const [items, setItems] = useState(value)
  const [opts, setOpts] = useState(options)
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme

  const addItem = () => {
    const newItem = document.getElementById(inputId).value
    document.getElementById(inputId).value = ''
    if (validator(newItem)) {
      setItems((currItems) => [...currItems, newItem])
      setOpts((currOpts) => [...currOpts, newItem])
      formik.setFieldValue(name, items)
      if (handler) {
        handler(name, items)
      }
    }
  }

  const handleChange = (elementName, selected) => {
    setItems(selected)
    setOpts(selected)
    formik.setFieldValue(elementName, items)
  }

  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={4} />
        <Col
          sm={8}
          style={{
            borderStyle: 'solid',
            borderRadius: '5px',
            borderColor: customColors.logo,
          }}
        >
          &nbsp;
          <Row>
            <Col sm={10}>
              <Input placeholder={placeholder} id={inputId} />
            </Col>
            <Button color={`primary-${selectedTheme}`} type="button" onClick={addItem}>
              {t('actions.add')}
            </Button>
          </Row>
          &nbsp;
          <Typeahead
            emptyLabel=""
            labelKey={name}
            onChange={(selected) => {
              handleChange(name, selected)
            }}
            id={name}
            name={name}
            data-testid={name}
            multiple={true}
            selected={items}
            options={opts}
          />
          &nbsp;
        </Col>
      </FormGroup>
    </GluuTooltip>
  )
}

GluuAutoCompleteWithAdd.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.array,
  options: PropTypes.array,
  validator: PropTypes.func,
  inputId: PropTypes.string,
  formik: PropTypes.object,
  placeholder: PropTypes.string,
  doc_category: PropTypes.string,
  handler: PropTypes.func,
}
export default GluuAutoCompleteWithAdd
