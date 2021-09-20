import React, { useState, useCallback } from 'react'
import { FormGroup, Col, Button } from '../../../components'
import { Accordion } from '../../../../app/components'
import GluuPropertyItem from './GluuPropertyItem'
import { useTranslation } from 'react-i18next'

function GluuProperties({
  name,
  label,
  formik = null,
  keyPlaceholder,
  valuePlaceholder,
  options = [],
}) {
  const [properties, setProperties] = useState(options)
  const { t } = useTranslation()

  const addProperty = () => {
    setProperties((prev) => [...prev, { key: '', value: '' }])
  }

  const changeProperty = (position) => (e) => {
    const { name, value } = e.target
    console.log('================ name ' + name)
    console.log('================ value ' + value)
    console.log('================ position ' + position)
    const newDataArr = [...properties]
    newDataArr[position] = { ...newDataArr[i], [name]: value }
    setProperties(newDataArr)
    formik.setFieldValue(name, newDataArr)
  }

  const removeProperty = (position) => {
    const list = properties.filter((element, index) => index !== position)
    console.log('================ values' + JSON.stringify(list))
    setProperties(list)
    formik.setFieldValue(name, list)
  }

  return (
    <Accordion className="mb-2 b-primary" initialOpen>
      <Accordion.Header>{t(label).toUpperCase()}</Accordion.Header>
      <Accordion.Body>
        <Button
          style={{ float: 'right', marginTop: -40 }}
          type="button"
          color="primary"
          onClick={addProperty}
        >
          <i className="fa fa-fw fa-plus mr-2"></i>
          {t('actions.add_property')}
        </Button>
        <FormGroup row>
          <Col sm={12}>
            <FormGroup row></FormGroup>
            {properties.map((item, index) => (
              <GluuPropertyItem
                key={index}
                position={index}
                keyPlaceholder={keyPlaceholder}
                valuePlaceholder={valuePlaceholder}
                property={item}
                onPropertyChange={changeProperty}
                onPropertyRemove={removeProperty}
              ></GluuPropertyItem>
            ))}
          </Col>
        </FormGroup>
      </Accordion.Body>
    </Accordion>
  )
}

export default GluuProperties
