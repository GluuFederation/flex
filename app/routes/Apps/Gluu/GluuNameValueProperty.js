import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { FormGroup, Col, Row, Button, Input } from '../../../components'
import GluuLabel from '../Gluu/GluuLabel'
import { Formik } from 'formik'
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

class GluuNameValueProperty extends React.Component {	
	
	constructor(props) {
	    super(props);
	    console.log('************************************************  constructor this.props.value = '+JSON.stringify(this.props.value))
	    this.state = {
	    		formik: this.props.formik || null,
	    		name: this.props.name,
	    		label1: this.props.label1 || 'Name',
	    		name1: this.props.name1 || 'name',
	    		placeholder1: this.props.placeholder1 ||  'Enter name',	    	
	    		label2: this.props.label2  || 'Value',
	    		name2: this.props.name2   || 'value',
	    		placeholder2: this.props.placeholder2 || 'Enter value',
	    		value: this.props.value || [],
	    		inputId: this.props.inputId || null, 
	    		options: this.props.options || null,
	    		validator : this.props.validator || null,
	    		items: this.props.items || [],
	    		dataArr: [{name: "", value: []}]	            
	    };
	   // this.handleSubmit = this.handleSubmit.bind(this);
	    this.setValues();
	  
	  }
	
	theme = createMuiTheme({
		  typography: {
		    subtitle1: {
		      fontSize: 12,
		    },
		  },
		});	
	
    setValues(){
    	console.log(' setValue - Entry value = '+JSON.stringify(this.state.value))
    	//For testing ????
    	//this.state.value = [{name: "https://jans-ui.jans.io", domain: ["jans-ui.jans.io","b-jans-ui.jans.io"]}];
    	
    	if(this.state.value != null && this.state.value.length){
    		console.log(' setValue -  this.state.value.length = '+this.state.value.length)
    		
    		if(this.state.value.length == 0){
    			dataArr = [{name: "", value: []}];
    			return;
    		}
    		for (var i = 0; i < this.state.value.length; i++) {
    			var elm= this.state.value[i];
    			var valueList = [] ;    		
    			var opts = [];
   			  	//console.log('****JSON.stringify(elm)= '+JSON.stringify(elm))
    			  valueList =  this.state.value[i].domains;
    			  console.log('**** valueList= '+valueList)
    			  if(valueList!=null ){
    					for (var j = 0; j< valueList.length; j++) {
    						var obj = valueList[j];
    		    			console.log(' obj = '+obj); 
    		    			opts.push(obj);
    		    			}
    			  }
    			  console.log(' opts = '+opts);
    			  this.state.dataArr[i] = {name: this.state.value[i].name, value: opts};
    			  
    		}
    	}//this.state.value != null
    	 console.log('****Final this.state.dataArr = '+JSON.stringify(this.state.dataArr))
    }

    //var [items, setItems] = useState(this.state.value);
	//var [opts, setOpts] = useState(this.state.options);
	  addItem() {
	    const newItem = document.getElementById(inputId).value
	    document.getElementById(inputId).value = ''
	    if (validator(newItem)) {
	      items.push(newItem)
	      opts.push(newItem)
	      setItems(items)
	      formik.setFieldValue(name, items)
	
	    }
	  }	  

  
  addClick(){
  this.setState(prevState => ({ 
    	dataArr: [...prevState.dataArr, { name: "", value: [] }]
    }))
   /* console.log('Before addClick()  dataArr = '+this.state.dataArr);
    console.log('Before addClick()  dataArr.length = '+this.state.dataArr.length)
	this.state.dataArr.push({ name: "", value: "" })
	console.log('After addClick() - dataArr = '+this.state.dataArr)
	console.log('After addClick() - dataArr.length = '+this.state.dataArr.length)*/
	
  }
  
  createUI(){
     return this.state.dataArr.map((party, index) => (
    		  console.log('****############ Rendering this.state.dataArr = '+JSON.stringify(this.state.dataArr)),
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
     onChange={this.handleChange.bind(this, index)}
      id={this.state.name2}
      name={this.state.name2}
      multiple={true}
      defaultSelected={party.value}
      options={this.state.options}
    />
    <ThemeProvider theme={this.theme}>
      <Typography variant="subtitle1">Enter multiple items by selecting from appeared dropdown after entering each item.</Typography>
    </ThemeProvider>
  </Col>
	
          &nbsp;
    	  <input type='button' value='remove' onClick={this.removeClick.bind(this, index)}/> 
     	  </FormGroup>
     	   </div>     
     	
     ))
  }
  
  handleChange(i, e) {
	  console.log('Inside handleChange- Entry -  i '+i+' , e = '+e );
     const { name, value } = e.target;
     let dataArr = [...this.state.dataArr];
     console.log('Inside handleChange- dataArr - 1'+ JSON.stringify(dataArr));
     dataArr[i] = {...dataArr[i], [name]: value};
     this.setState({ dataArr });
     console.log('Inside handleChange- dataArr 2 -'+ JSON.stringify(dataArr));
     console.log('*** Inside handleChange-  this.state.name = '+this.state.name);
     this.state.formik.setFieldValue("fido2RequestedParties",dataArr);
    // console.log('Inside handleChange-  this.state.formik.fido2RequestedParties.value = '+  this.state.formik.fido2RequestedParties.value);
  }
  
  removeClick(i){
     let dataArr = [...this.state.dataArr];
     dataArr.splice(i, 1);
     this.setState({ dataArr });
  }
  
  handleSubmit(event) {
    alert('A name was submitted: ' + JSON.stringify(this.state.dataArr));
    event.preventDefault();
  }

  render() {
    return (
    		
    		 <Row>	
    		<GluuLabel label='Parties' size={9} />
    		  &nbsp;
    		<input type='button' value='Add more' onClick={this.addClick.bind(this)}/>    
    		  &nbsp;
    		{this.createUI()}    	
    		</Row>
    );
  }
}

export default GluuNameValueProperty;