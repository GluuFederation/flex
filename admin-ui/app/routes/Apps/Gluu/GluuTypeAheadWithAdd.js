import React, { useState, useContext } from 'react'
import { FormGroup, Col, Row, Button, Input } from 'Components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTooltip from './GluuTooltip'
import applicationStyle from './styles/applicationstyle'
import { useTranslation } from 'react-i18next'
import { ThemeContext } from 'Context/theme/themeContext'

function GluuTypeAheadWithAdd({
  label,
  name,
  value,
  placeholder,
  options,
  formik,
  validator,
  inputId,
  doc_category,
  lsize = 4,
  rsize = 8,
  disabled,
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
      items.push(newItem)
      opts.push(newItem)
      setItems(items)
      formik.setFieldValue(name, items)
    }
  }

  const handleChange = (aName, selected) => {
    setOpts(selected)
    setItems(selected)
    formik.setFieldValue(aName, selected)
  }

  return (
    <GluuTooltip doc_category={doc_category} doc_entry={name}>
      <FormGroup row>
        <GluuLabel label={label} size={lsize} />
        <Col
          sm={rsize}
          style={{
            borderStyle: 'solid',
            borderRadius: '5px',
            borderColor: '#03a96d',
          }}
        >
          &nbsp;
          <Row>
            <Col sm={10}>
              <Input
                placeholder={placeholder}
                id={inputId}
                disabled={disabled}
                data-testid="new_entry"
                aria-label="new_entry"
              />
            </Col>
            <Button
              color={`primary-${selectedTheme}`}
              type="button"
              disabled={disabled}
              style={applicationStyle.buttonStyle}
              onClick={addItem}
            >
              <i className="fa fa-plus-circle mr-2"></i>
              {t('actions.add')}
            </Button>
          </Row>
          &nbsp;
          <Typeahead
            emptyLabel=""
            labelKey={name}
            disabled={disabled}
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

GluuTypeAheadWithAdd.defaultProps = {
  lsize: 4,
  rsize: 8,
  required: false,
  disabled: false,
}

export default GluuTypeAheadWithAdd
