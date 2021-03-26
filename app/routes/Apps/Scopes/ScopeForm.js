import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Col,
  Container,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input
} from "./../../../components";
import GluuFooter from "../Gluu/GluuFooter";
import GluuLabel from "../Gluu/GluuLabel";
import GluuTypeAhead from '../Gluu/GluuTypeAhead'
import { getCustomScriptByType } from "../../../redux/actions/CustomScriptActions";
import ScopeAttributes from './ScopeAttributesPanel'


function ScopeForm({ scope, handleSubmit}) {

	const [init, setInit] = useState(false)
	

	  function toogle() {
	    if (!init) {
	      setInit(true)
	    }
	  }
		    
	    const formik = useFormik({
	        initialValues: {
	        	id: scope.id,
	        	displayName: scope.displayName,
	        	description: scope.description,
	        	scopeType: scope.scopeType,
	        	defaultScope: scope.defaultScope,
	    		groupClaims: scope.groupClaims,
	        },
	        validationSchema: Yup.object({
	          id: Yup.string()
	            .min(2, "ID 2 characters")
	            .required("Required!"),
	            scopeType: Yup.string()
	            .min(2, "Please select scopeType")
	            .required("Required!") 
	        }),
	   
	        onSubmit: (values) => {
	            //const result = Object.assign(scope, values)
	            //handleSubmit(JSON.stringify(values))
	        	const result = JSON.stringify(values)
	        	handleSubmit(JSON.parse(result))
	          },
	      });
	    
	    return (
	    	    <Form onSubmit={formik.handleSubmit}>
	    	      {/* START Input */}
	    	      {scope.inum && (
	    	    	        <FormGroup row>
	    	    	          <GluuLabel label="Inum" />
	    	    	          <Col sm={9}>
	    	    	            <Input
	    	    	              style={{ backgroundColor: '#F5F5F5' }}
	    	    	              id="inum"
	    	    	              name="inum"
	    	    	              disabled
	    	    	              value={scope.inum}
	    	    	            />
	    	    	          </Col>
	    	    	        </FormGroup>
	    	    	      )}
	
	    	     
	    	      <FormGroup row>
	    	        <GluuLabel label="Id" required />
	    	        <Col sm={9}>
	    	          <Input
	    	            placeholder="Enter the scope Id"
	    	            id="id"
	    	            valid={!formik.errors.id && !formik.touched.id && init}
	    	            name="id"
	    	            defaultValue={scope.id}
	    	            onKeyUp={toogle}
	    	            onChange={formik.handleChange}
	    	          />
	    	        </Col>
	    	      </FormGroup>
	    	      
	    	      <FormGroup row>
	    	        <GluuLabel label="displayName"  />
	    	        <Col sm={9}>
	    	          <Input
	    	            placeholder="Enter the displayName"
	    	            id="displayName"
	    	           /* valid={!formik.errors.displayName && !formik.touched.displayName && init}*/
	    	            name="displayName"
	    	            defaultValue={scope.displayName}
	    	            onKeyUp={toogle}
	    	            onChange={formik.handleChange}
	    	          />
	    	        </Col>
	    	      </FormGroup>
	    	      
	    	      <FormGroup row>
	    	        <GluuLabel label="Description"  />
	    	        <Col sm={9}>
	    	          <Input
	    	            type="textarea"
	    	            placeholder="Enter the description"
	    	            maxLength="4000"
	    	            id="description"
	    	           /* valid={!formik.errors.displayName && !formik.touched.displayName && init}*/
	    	            name="description"
	    	            defaultValue={scope.description}
	    	            onKeyUp={toogle}
	    	            onChange={formik.handleChange}
	    	          />
	    	        </Col>
	    	      </FormGroup>
	    	      
	    	      <FormGroup row>
	    	        <GluuLabel label="IconUrl"  />
	    	        <Col sm={9}>
	    	          <Input
	    	            placeholder="Enter the IconUrl"
	    	            id="iconUrl"
	    	            /*valid={!formik.errors.iconUrl && !formik.touched.iconUrl && init}*/
	    	            name="iconUrl"
	    	            defaultValue={scope.iconUrl}
	    	            onKeyUp={toogle}
	    	            onChange={formik.handleChange}
	    	          />
	    	        </Col>
	    	      </FormGroup>
	    	      
	    	      <FormGroup row>
	    	        <GluuLabel label="Scope Type" required />
	    	        <Col sm={9}>
	    	          <InputGroup>
	    	            <CustomInput
	    	              type="select"
	    	              id="scopeType"
	    	              name="scopeType"
	    	              defaultValue={scope.programmingLanguage}
	    	              onChange={formik.handleChange}
	    	            >
	    	              <option value="">Choose...</option>
	    	              <option value="openid">OpenID</option>
	    	              <option value="dynamic">Dynamic</option>
	    	              <option value="spontaneous">Spontaneous</option>
	    	              <option value="oauth">OAuth</option>
	    	              <option value="uma">UMA</option>
	    	            </CustomInput>
	    	          </InputGroup>
	    	        </Col>
	    	      </FormGroup>
	    	      

	    	     
	    	      
	    	      
	    	      <FormGroup row></FormGroup>
	    	      <GluuFooter />
	    	    </Form>
	    	  );
	    	
	  }
export default ScopeForm;

