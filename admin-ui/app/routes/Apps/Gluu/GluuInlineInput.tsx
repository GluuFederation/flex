import React, { useState, useContext } from 'react'
import GluuLabel from './GluuLabel'
import GluuToogle from './GluuToogle'
import { useTranslation } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'
import applicationStyle from 'Routes/Apps/Gluu/styles/applicationstyle'
import { Col, FormGroup, Input, Button } from 'Components'
import { ThemeContext } from 'Context/theme/themeContext'
import customColors from '@/customColors'

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
  doc_category = 'json_properties',
}: any) {
  const { t } = useTranslation()
  const theme: any = useContext(ThemeContext)
  const selectedTheme = theme.state.theme
  const VALUE = 'value'
  const PATH = 'path'
  const [show, setShow] = useState(false)
  const [correctValue, setCorrectValue] = useState([])
  const [data, setData] = useState(value)
  const onValueChanged = (e: any) => {
    if (isBoolean) {
      setData(e.target.checked)
    } else {
      setData(e.target.value)
    }
    setShow(true)
  }
  const handleTypeAheadChange = (selectedOptions: any) => {
    const object = selectedOptions.filter((data: any) => typeof data == 'object')
    const arrayItems = selectedOptions.filter((data: any) => typeof data != 'object')
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
    const patch: any = {}
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
                allowNew
                emptyLabel=""
                labelKey={name}
                onChange={handleTypeAheadChange}
                multiple={true}
                defaultSelected={Array.isArray(value) ? value.filter((item) => item != null) : []}
                options={Array.isArray(options) ? options.filter((item) => item != null) : []}
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
            </Button>
            <Button
              style={{
                backgroundColor: customColors.accentRed,
                color: customColors.white,
                border: 'none',
              }}
              size="sm"
              onClick={onCancel}
            >
              <i className="fa fa-times me-2"></i>
            </Button>
          </>
        )}
      </Col>
    </FormGroup>
  )
}
export default GluuInlineInput
