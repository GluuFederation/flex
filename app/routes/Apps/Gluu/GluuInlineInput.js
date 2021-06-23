import React, { useState } from 'react'
import {
  Col,
  InputGroup,
  CustomInput,
  FormGroup,
  Input,
  Button,
} from '../../../components'
import GluuLabel from './GluuLabel'
import { useTranslation } from 'react-i18next'
import { Typeahead } from 'react-bootstrap-typeahead'

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
  const [show, setShow] = useState(false)
  const [correctValue, setCorrectValue] = useState([])
  const onValueChanged = () => {
    setShow(true)
  }
  const handleTypeAheadChange = (selectedOptions) => {
    setCorrectValue(selectedOptions)
    setShow(true)
  }
  const onAccept = () => {
    const patch = {}
    patch['path'] = path
    if (isArray) {
      patch['value'] = correctValue
    } else {
      patch['value'] = document.getElementById(name).value
    }
    handler(patch)
    setShow(false)
  }
  const onCancel = () => {
    setCorrectValue([])
    setShow(false)
  }
  return (
    <FormGroup row>
      <Col sm={10}>
        <FormGroup row>
          <GluuLabel label={label} size={lsize} required={required} />
          <Col sm={rsize}>
            {!isBoolean && !isArray && (
              <Input
                id={name}
                name={name}
                type={type}
                defaultValue={value}
                onChange={onValueChanged}
              />
            )}
            {isBoolean && (
              <InputGroup>
                <CustomInput
                  type="select"
                  onChange={onValueChanged}
                  id={name}
                  name={name}
                  defaultValue={value}
                >
                  <option value="false">{t('options.false')}</option>
                  <option value="true">{t('options.true')}</option>
                </CustomInput>
              </InputGroup>
            )}
            {isArray && (
              <Typeahead
                id={name}
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
      </Col>
      <Col sm={2}>
        {show && (
          <div>
            <Button color="primary" size="sm" onClick={onAccept}>
              <i className="fa fa-check mr-2"></i>
            </Button>{' '}
            <Button color="danger" size="sm" onClick={onCancel}>
              <i className="fa fa-times mr-2"></i>
            </Button>
          </div>
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
