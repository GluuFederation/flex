import React, { useState, useEffect } from 'react'
import { FormGroup, Col, Input, Button } from '../../../components'
import { Accordion } from '../../../../app/components'
import { useTranslation } from 'react-i18next'

function GluuNameValueProperty({
  nameValueLabel,
  componentName,
  formik = null,
  keyId,
  keyName,
  keyPlaceholder,
  valueId,
  valueName,
  valuePlaceholder,
  dataArr = [],
}) {
  const [properties, setProperties] = useState([])
  const { t } = useTranslation()
  const addClick = () => {
    console.log('=====================2 ' + JSON.stringify(properties))
    setProperties((prev) => [...prev, { key: '', value: '' }])
  }
  useEffect(() => {
    setProperties(dataArr)
    console.log("====================current values: "+JSON.stringify(properties))
  }, [])

  const handleChange = (i) => (e) => {
    const { name, value } = e.target
    const newDataArr = [...properties]
    newDataArr[i] = { ...newDataArr[i], [name]: value }
    setProperties(newDataArr)
    formik.setFieldValue(componentName, newDataArr)
  }

  const removeClick = (i) => {
    const newData = properties.filter((element, index) => index != i)
    //setProperties([])
    setProperties((prev) => [...newData])
    console.log('=====================2 ' + JSON.stringify(properties))
    console.log('=====================3 ' + JSON.stringify(newData))
    formik.setFieldValue(componentName, newData)
  }

  return (
    <Accordion className="mb-2 b-primary" initialOpen>
      <Accordion.Header>{t(nameValueLabel).toUpperCase()}</Accordion.Header>
      {properties && (
        <Accordion.Body>
          <Button
            style={{ float: 'right', marginTop: -30 }}
            type="button"
            color="primary"
            onClick={addClick}
          >
            <i className="fa fa-fw fa-plus mr-2"></i>
            {t('actions.add_property')}
          </Button>
          <FormGroup row>
            <Col sm={12}>
              {properties.map((element, index) => (
                <FormGroup key={index} row>
                  <Col sm={4}>
                    <Input
                      placeholder={
                        keyPlaceholder
                          ? t(keyPlaceholder)
                          : t('placeholders.enter_property_key')
                      }
                      id={keyId}
                      name={keyName}
                      defaultValue={element.key}
                      onChange={handleChange(index)}
                    />
                  </Col>
                  <Col sm={6}>
                    <Input
                      placeholder={
                        valuePlaceholder
                          ? t(valuePlaceholder)
                          : t('placeholders.enter_property_value')
                      }
                      id={valueId}
                      name={valueName}
                      defaultValue={element.value}
                      onChange={handleChange(index)}
                    />
                  </Col>
                  <Col sm={2}>
                    <Button
                      type="button"
                      color="danger"
                      onClick={() => removeClick(index)}
                    >
                      <i className="fa fa-fw fa-trash mr-2"></i>
                      {t('actions.remove')}
                    </Button>
                  </Col>
                </FormGroup>
              ))}
            </Col>
          </FormGroup>
        </Accordion.Body>
      )}
    </Accordion>
  )
}

export default GluuNameValueProperty
