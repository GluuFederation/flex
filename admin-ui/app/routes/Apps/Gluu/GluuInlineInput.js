import React, { useState, useContext } from 'react'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import GluuToogle from './GluuToogle'
import { useTranslation } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  Col,
  InputGroup,
  CustomInput,
  FormGroup,
  Input,
  Button,
} from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'

function GluuInlineInput({
  label,
  name,
  type,
  value,
  required,
  lsize,
  rsize,
  isBoolean,
  isArray,
  handler,
  options,
  path,
}) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const VALUE = 'value'
  const PATH = 'path'
  const [show, setShow] = useState(false)
  const [correctValue, setCorrectValue] = useState([])
  const [data, setData] = useState(value)
  const onValueChanged = () => {
    setShow(true)
  }
  const handleTypeAheadChange = (selectedOptions) => {
    setCorrectValue(selectedOptions)
    setShow(true)
  }
  const onAccept = () => {
    const patch = {}
    patch[PATH] = path
    if (isArray) {
      patch[VALUE] = correctValue
    } else {
      patch[VALUE] = document.getElementById(name).value
    }
    patch['op'] = 'replace'
    handler(patch)
    setShow(!show)
    setData(document.getElementById(name).value)
  }
  const onCancel = () => {
    setCorrectValue([])
    setShow(!show)
  }
  return (
    <FormGroup row>
      <Col sm={10}>
        <GluuTooltip doc_category="json_properties" doc_entry={name}>
          <FormGroup row>
            <GluuLabel
              label={label}
              size={lsize}
              required={required}
              withTooltip={false}
            />
            <Col sm={rsize}>
              {!isBoolean && !isArray && (
                <Input
                  id={name}
                  data-testid={name}
                  name={name}
                  type={type}
                  defaultValue={data}
                  onChange={onValueChanged}
                />
              )}
              {isBoolean && (
                <GluuToogle
                  id={name}
                  data-testid={name}
                  name={name}
                  onChange={onValueChanged}
                  value={value}
                />
              )}
              {isArray && (
                <Typeahead
                  id={name}
                  data-testid={name}
                  name={name}
                  allowNew
                  emptyLabel=""
                  labelKey={name}
                  onChange={handleTypeAheadChange}
                  multiple={true}
                  defaultSelected={value}
                  options={options}
                />
              )}
            </Col>
          </FormGroup>
        </GluuTooltip>
      </Col>
      <Col sm={2}>
        {show && (
          <>
            <Button
              color={`primary-${selectedTheme}`}
              style={applicationStyle.buttonStyle}
              size="sm"
              onClick={onAccept}
            >
              <i className="fa fa-check mr-2"></i>
            </Button>{' '}
            <Button color="danger" size="sm" onClick={onCancel}>
              <i className="fa fa-times mr-2"></i>
            </Button>
          </>
        )}
      </Col>
    </FormGroup>
  )
}

GluuInlineInput.defaultProps = {
  type: 'text',
  lsize: 3,
  rsize: 9,
  required: false,
}

export default GluuInlineInput
