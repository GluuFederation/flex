import React, { useState } from 'react'
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
  const [dataArray, setDataArray] = useState(dataArr)
  const { t } = useTranslation()
  const addClick = () => {
    setDataArray((prevDataArray) => [...prevDataArray, { key: '', value: '' }])
  }

  const handleChange = (i) => (e) => {
    const { name, value } = e.target
    const newDataArr = [...dataArray]
    newDataArr[i] = { ...newDataArr[i], [name]: value }
    setDataArray(newDataArr)
    formik.setFieldValue(componentName, newDataArr)
  }

  const removeClick = (i) => {
    const newDataArray = [...dataArray]
    newDataArray.splice(i, 1)
    setDataArray(newDataArray)
    formik.setFieldValue(componentName, newDataArray)
  }

  return (
    <Accordion className="mb-2 b-primary" initialOpen>
      <Accordion.Header>{t(nameValueLabel).toUpperCase()}</Accordion.Header>
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
            {dataArray.map((element, index) => (
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
    </Accordion>
  )
}

export default GluuNameValueProperty
