import React, { useState } from 'react'
import { FormGroup, Col, Row, Button, Input } from '../../../components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'

function GluuTypeAheadWithAdd({
  label,
  name,
  value,
  placeholder,
  options,
  formik,
  validator,
  inputId,
}) {
  const [items, setItems] = useState(value)
  const [opts, setOpts] = useState(options)
  function addItem() {
    const newItem = document.getElementById(inputId).value
    document.getElementById(inputId).value = ''
    if (validator(newItem)) {
      items.push(newItem)
      opts.push(newItem)
      setItems(items)
      formik.setFieldValue(name, items)
    }
  }
  return (
    <FormGroup row>
      <GluuLabel label={label} size={4} />
      <Col
        sm={8}
        style={{
          borderStyle: 'solid',
          borderRadius: '5px',
          borderColor: '#1EB7FF',
        }}
      >
        &nbsp;
        <Row>
          <Col sm={10}>
            <Input placeholder={placeholder} id={inputId} />
          </Col>
          <Button color="primary" type="button" onClick={addItem}>
            Add
          </Button>
        </Row>
        &nbsp;
        <Typeahead
          emptyLabel=""
          labelKey={name}
          onChange={(selected) => {
            formik.setFieldValue(name, selected)
          }}
          id={name}
          name={name}
          multiple={true}
          selected={items}
          options={opts}
        />
        &nbsp;
      </Col>
    </FormGroup>
  )
}

export default GluuTypeAheadWithAdd
