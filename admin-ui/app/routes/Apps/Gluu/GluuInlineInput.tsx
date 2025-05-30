// @ts-nocheck
import React, { useState, useContext } from 'react'
import GluuLabel from './GluuLabel'
import GluuTooltip from './GluuTooltip'
import GluuToogle from './GluuToogle'
import { useTranslation } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import {
  Col,
  FormGroup,
  Input,
  Button,
} from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import PropTypes from 'prop-types'

function GluuInlineInput({
  label,
  name,
  type = 'text',
  value,
  required = false,
  lsize = 3,
  rsize = 9,
  isBoolean,
  isArray,
  handler,
  options,
  path,
  doc_category = "json_properties",
}) {
  const { t } = useTranslation()
  const theme = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const VALUE = 'value'
  const PATH = 'path'
  const [show, setShow] = useState(false)
  const [correctValue, setCorrectValue] = useState([])
  const [data, setData] = useState(value)
  const onValueChanged = (e) => {
    if (isBoolean) {
      setData(e.target.checked)
    } else {
      setData(e.target.value)
    }
    setShow(true)
  }
  const handleTypeAheadChange = (selectedOptions) => {
    const object = selectedOptions.filter((data) => typeof data == 'object')
    const arrayItems = selectedOptions.filter((data) => typeof data != 'object')
    for (const i in object) {
      if (!object[i]['tokenEndpointAuthMethodsSupported']) {
        arrayItems.push(object[i][name])
      } else {
        arrayItems.push(object[i]['tokenEndpointAuthMethodsSupported'])
      }
    }
    setCorrectValue(arrayItems)
    setShow(true)
  }
  const onAccept = () => {
    const patch = {}
    patch[PATH] = path
    if (isArray) {
      patch[VALUE] = correctValue
    } else {
      patch[VALUE] = data
    }
    patch['op'] = 'replace'
    handler(patch)
    setShow(!show)
  }
  const onCancel = () => {
    setCorrectValue([])
    setShow(!show)
  }
  return (
    <FormGroup row>
      <Col sm={10}>
        <FormGroup row>
          <GluuLabel
            label={label}
            size={lsize}
            required={required}
            doc_category={doc_category}
            doc_entry={name}
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
                handler={onValueChanged}
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
                options={options || []}
              />
            )}
          </Col>
        </FormGroup>
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
              <i className="fa fa-check me-2"></i>
            </Button>{' '}
            <Button color="danger" size="sm" onClick={onCancel}>
              <i className="fa fa-times me-2"></i>
            </Button>
          </>
        )}
      </Col>
    </FormGroup>
  )
}

GluuInlineInput.propTypes = {
  doc_category: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  type: PropTypes.string,
  lsize: PropTypes.number,
  rsize: PropTypes.number,
  required: PropTypes.bool,
  isBoolean: PropTypes.bool,
  isArray: PropTypes.any,
  handler: PropTypes.func,
  options: PropTypes.any,
  path: PropTypes.string,
}

export default GluuInlineInput
