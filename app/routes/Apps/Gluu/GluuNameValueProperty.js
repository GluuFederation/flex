import React, { useState } from 'react'
import { FormGroup, Col, Row, Input } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'

function GluuNameValueProperty({
  nameValueLabel,
  componentName,
  formik = null,
  keyId,
  keyName,
  keyLabel = 'Key',
  keyPlaceholder = 'Enter key',
  valueId,
  valueName,
  valueLabel = 'Value',
  valuePlaceholder = 'Enter value',
  dataArr = [],
}) {
  const [dataArray, setDataArray] = useState(dataArr)

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
    <Row>
      <GluuLabel label={nameValueLabel} size={9} />

      <input
        type="button"
        value="Add more"
        onClick={addClick}
        style={{
          background: '#03a96d',
          color: '#fff',
          border: 'none',
          padding: 5,
          borderRadius: 5,
        }}
      />

      {dataArray.map((element, index) => (
        <div key={index} style={{ marginLeft: 20 }}>
          <FormGroup row>
            <GluuLabel label={keyLabel} />
            <Col sm={9}>
              <Input
                placeholder={keyPlaceholder}
                id={keyId}
                name={keyName}
                defaultValue={element.key}
                onChange={handleChange(index)}
              />
            </Col>

            <GluuLabel label={valueLabel} />
            <Col sm={9}>
              <Input
                placeholder={valuePlaceholder}
                id={valueId}
                name={valueName}
                defaultValue={element.value}
                onChange={handleChange(index)}
              />
            </Col>
            <Col sm={3} style={{ marginTop: 20 }}>
              <input
                type="button"
                value="Remove"
                onClick={() => removeClick(index)}
                style={{
                  background: '#03a96d',
                  color: '#fff',
                  border: 'none',
                  padding: 5,
                  borderRadius: 5,
                }}
              />
            </Col>
          </FormGroup>
        </div>
      ))}
    </Row>
  )
}

export default GluuNameValueProperty
