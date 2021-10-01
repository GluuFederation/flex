import React, { useState } from 'react'
import { FormGroup, Col, Row, Button, Input } from '../../../components'
import { Typeahead } from 'react-bootstrap-typeahead'
import GluuLabel from '../Gluu/GluuLabel'
import GluuTooltip from './GluuTooltip'
import { useTranslation } from 'react-i18next'

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
}) {
  const [items, setItems] = useState(value)
  const [opts, setOpts] = useState(options)
  const { t } = useTranslation()

  const addItem = () => {
    const newItem = document.getElementById(inputId).value
    document.getElementById(inputId).value = ''
    if (validator(newItem)) {
      setItems((currItems) => [...currItems, newItem])
      setOpts((currOpts) => [...currOpts, newItem])
      formik.setFieldValue(name, items)
    }
  }

  const handleChange = (name, selected) => {
    console.log(selected)
    setItems(selected)
    setOpts(selected)
    formik.setFieldValue(name, items)
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
            borderColor: '#03a96d',
          }}
        >
          &nbsp;
          <Row>
            <Col sm={10}>
              <Input placeholder={placeholder} id={inputId} />
            </Col>
            <Button color="primary" type="button" onClick={addItem}>
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

export default GluuAutoCompleteWithAdd
