import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { FormGroup, Col, Row, Button, Input } from '../../../components'
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
    var dataArr2 = dataArray
    if (value != null && value.length) {
      if (value.length == 0) {
        return
      }
      for (var i = 0; i < value.length; i++) {
        var elm = value[i]
        var valueList = []
        var opts = []
        valueList = value[i].domains
        if (valueList != null) {
          for (var j = 0; j < valueList.length; j++) {
            var obj = valueList[j]
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
    var dataLength = selected.length
    var obj = JSON.stringify(selected[dataLength - 1])
    var jsonObj = JSON.parse(obj)
    var obj_text = jsonObj[name]
    let newDataArr = [...dataArray]
    var modEle = newDataArr[e]
    modEle.domains.push(obj_text)
    newDataArr[e] = { ...newDataArr[e], domains: modEle.domains }
    setDataArray(newDataArr)

    formik.setFieldValue(name, newDataArr)
  }

  const handleChange = (i) => (e) => {
    const { name, value } = e.target
    let newDataArr = [...dataArray]
    newDataArr[i] = { ...newDataArr[i], [name]: value }
    setDataArray(newDataArr)
    formik.setFieldValue(name, newDataArr)
  }

  const removeClick = (i) => {
    let newDataArr = [...dataArray]
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
