import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { FormGroup, Col, Row, Input } from 'Components'
import GluuLabel from '../Gluu/GluuLabel'
import Typography from '@material-ui/core/Typography'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'

function GluuNameValuesProperty({
  formik,
  name,
  label1,
  name1,
  placeholder1,
  label2,
  name2,
  placeholder2,
  value,
  inputId,
  options,
  validator,
  items,
  dataArr,
}) {
  const [dataArray, setDataArray] = useState(dataArr)
  const theme = createTheme({
    typography: {
      subtitle1: {
        fontSize: 12,
      },
    },
  })
  setValues()

  const addClick = () => {
    setDataArray([...dataArray, { name: '', domains: [] }])
  }
  const setValues = () => {
    const dataArr2 = dataArray
    if (value != null && value.length) {
      if (value.length == 0) {
        return
      }
      for (let i = 0; i < value.length; i++) {
        let valueList = []
        const opts = []
        valueList = value[i].domains
        if (valueList != null) {
          for (let j = 0; j < valueList.length; j++) {
            const obj = valueList[j]
            opts.push(obj)
          }
        }
        console.log(' opts = ' + opts)
        dataArr2[i] = { name: value[i].name, domains: opts }
      }

      setDataArray(dataArr2)
    }
  }

  const handleChangeValue = (i, selected, name) => (e) => {
    const dataLength = selected.length
    const obj = JSON.stringify(selected[dataLength - 1])
    const jsonObj = JSON.parse(obj)
    const obj_text = jsonObj[name]
    const newDataArr = [...dataArray]
    const modEle = newDataArr[e]
    modEle.domains.push(obj_text)
    newDataArr[e] = { ...newDataArr[e], domains: modEle.domains }
    setDataArray(newDataArr)

    formik.setFieldValue(name, newDataArr)
  }

  const handleChange = (i) => (e) => {
    const { name, value } = e.target
    const newDataArr = [...dataArray]
    newDataArr[i] = { ...newDataArr[i], [name]: value }
    setDataArray(newDataArr)
    formik.setFieldValue(name, newDataArr)
  }

  const removeClick = (i) => {
    const newDataArr = [...dataArray]
    newDataArr.splice(i, 1)
    setDataArray(newDataArr)
  }

  const handleInputChange = (input) => (e) => {
    console.log('value', input)
  }

  return (
    <Row>
      <GluuLabel label="Parties" size={9} />
      &nbsp;
      <input type="button" value="Add more" onClick={addClick} />
      &nbsp;
      {dataArray.map((party, index) => (
        <div key={index}>
          <FormGroup row>
            <GluuLabel label={label1} />
            <Col sm={9}>
              <Input
                placeholder={placeholder1}
                id={name1}
                name={name1}
                defaultValue={party.name}
                onChange={handleChange(index)}
              />
            </Col>
            <GluuLabel label={label2} />
            <Col sm={8}>
              <Typeahead
                allowNew
                emptyLabel=""
                labelKey={name2}
                placeholder={placeholder2}
                onInputChange={handleInputChange}
                onChange={(selected) => {
                  handleChangeValue(index, selected, name2)
                }}
                id={name2}
                name={name2}
                multiple={true}
                defaultSelected={party.domains}
                options={options}
              />
              <ThemeProvider theme={theme}>
                <Typography variant="subtitle1">
                  Enter multiple items by selecting from appeared dropdown after
                  entering each item.
                </Typography>
              </ThemeProvider>
            </Col>
            &nbsp;
            <input
              type="button"
              value="remove"
              onClick={() => removeClick(index)}
            />
          </FormGroup>
        </div>
      ))}
    </Row>
  )
}

export default GluuNameValuesProperty
