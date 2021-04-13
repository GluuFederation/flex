import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { FormGroup, Col, Row, Button, Input } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import Typography from '@material-ui/core/Typography'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles'

class GluuNameValueProperty extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formik: this.props.formik || null,
      name: this.props.name,
      label1: this.props.label1 || 'Name',
      name1: this.props.name1 || 'name',
      placeholder1: this.props.placeholder1 || 'Enter name',
      label2: this.props.label2 || 'Value',
      name2: this.props.name2 || 'value',
      placeholder2: this.props.placeholder2 || 'Enter value',
      value: this.props.value || [],
      inputId: this.props.inputId || null,
      options: this.props.options || null,
      validator: this.props.validator || null,
      items: this.props.items || [],
      //dataArr: [{name: "", value: []}]
      dataArr: [{ name: '', domains: [] }],
    }
    this.setValues()
  }

  theme = createMuiTheme({
    typography: {
      subtitle1: {
        fontSize: 12,
      },
    },
  })

  setValues() {
    //console.log(' setValue - Entry value = '+JSON.stringify(this.state.value))
    var dataArr2 = this.state.dataArr;
    if (this.state.value != null && this.state.value.length) {
      //console.log(' setValue -  this.state.value.length = '+this.state.value.length)
      if (this.state.value.length == 0) {
        //dataArr = this.state.dataArr
        return;
      }
      for (var i = 0; i < this.state.value.length; i++) {
        var elm = this.state.value[i]
        var valueList = []
        var opts = []
        valueList = this.state.value[i].domains
        //console.log('**** valueList= '+valueList)
        if (valueList != null) {
          for (var j = 0; j < valueList.length; j++) {
            var obj = valueList[j]
            //console.log(' obj = '+obj);
            opts.push(obj)
          }
        }
        console.log(' opts = ' + opts);
        dataArr2[i] = { name: this.state.value[i].name, domains: opts };
      }//for
      console.log('****Final this.state.dataArr2 = ' + JSON.stringify(this.state.dataArr2))
      this.setState({
        dataArr: dataArr2
      })
    }//this.state.value != null 
    console.log('****Final this.state.dataArr = ' + JSON.stringify(this.state.dataArr))
  }

  addClick() {
    this.setState((prevState) => ({
      dataArr: [...prevState.dataArr, { name: '', domains: [] }],
    }))
  }

  createUI() {
    return this.state.dataArr.map((party, index) => (
      <div key={index}>
        <FormGroup row>
          <GluuLabel label={this.state.label1} />
          <Col sm={9}>
            <Input
              placeholder={this.state.placeholder1}
              id={this.state.name1}
              name={this.state.name1}
              defaultValue={party.name}
              onChange={this.handleChange.bind(this, index)}
            />
          </Col>
          <GluuLabel label={this.state.label2} />
          <Col sm={8}>
            <Typeahead
              allowNew
              emptyLabel=""
              labelKey={this.state.name2}
              placeholder={this.state.placeholder2}
              onInputChange={this.handleInputChange}
              onChange={(selected) => {
                this.handleChangeValue(this, index, selected, this.state.name2)
              }}
              id={this.state.name2}
              name={this.state.name2}
              multiple={true}
              defaultSelected={party.domains}
              options={this.state.options}
            />
            <ThemeProvider theme={this.theme}>
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
            onClick={this.removeClick.bind(this, index)}
          />
        </FormGroup>
      </div>
    ))
  }

  handleInputChange(input, e) {
    console.log('value', input)
  }

  handleChangeValue(i, e, selected, name) {
    //console.log('Inside handleChangeValue- Entry -  i '+i+' , e = '+e+" , selected = "+selected+', name = '+name);
    var dataLength = selected.length
    var obj = JSON.stringify(selected[dataLength - 1])
    var jsonObj = JSON.parse(obj)
    var obj_text = jsonObj[name]

    //Update array values
    let dataArr = [...this.state.dataArr]
    var modEle = dataArr[e]
    modEle.domains.push(obj_text)
    dataArr[e] = { ...dataArr[e], domains: modEle.domains }
    this.setState({ dataArr })
    //console.log('Inside handleChangeValue- dataArr 2 -'+ JSON.stringify(dataArr));
    this.state.formik.setFieldValue(this.state.name, dataArr)
  }

  handleChange(i, e) {
    //console.log('Inside handleChange- Entry -  i '+i+' , e = '+e );
    const { name, value } = e.target
    let dataArr = [...this.state.dataArr]
    dataArr[i] = { ...dataArr[i], [name]: value }
    this.setState({ dataArr })
    this.state.formik.setFieldValue(this.state.name, dataArr)
  }

  removeClick(i) {
    let dataArr = [...this.state.dataArr]
    dataArr.splice(i, 1)
    this.setState({ dataArr })
  }

  render() {
    return (
      <Row>
        <GluuLabel label="Parties" size={9} />
        &nbsp;
        <input
          type="button"
          value="Add more"
          onClick={this.addClick.bind(this)}
        />
        &nbsp;
        {this.createUI()}
      </Row>
    )
  }
}

export default GluuNameValueProperty
