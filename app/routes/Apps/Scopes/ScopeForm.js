import React, { useState, useEffect } from 'react'
import { connect } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
	Button,
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
import GluuFormDetailRow from '../Gluu/GluuFormDetailRow'
import GluuLabel from "../Gluu/GluuLabel";
import GluuSelectRow from '../Gluu/GluuSelectRow'
import GluuTypeAhead from '../Gluu/GluuTypeAhead'
import { getCustomScriptByType } from "../../../redux/actions/CustomScriptActions";
import ScopeAttributes from './ScopeAttributesPanel'


function ScopeForm({ scope, handleSubmit,scripts}) {

	const authScripts = scripts
	.filter((item) => item.scriptType == 'UMA_RPT_POLICY')
	.map((item) => item.name)


	const [init, setInit] = useState(false)
	const [validation, setValidation] = useState(getInitialState(scope))
	const showInConfigurationEndpointOptions = ['true', 'false']
	const clientScopeList = []


	function handleValidation(e) {
		console.log(' Scope Form handleValidation()- validation = '+validation+' ,e.target.value ='+e.target.value)
		if(e.target.value  === 'openid'){
			setValidation(true)
		}
		else{
			setValidation(false)
			MyForm.spontaneousClientId.value = null
			MyForm.spontaneousClientScopes.value = null
			MyForm.clientScopes.value = null
			MyForm.showInConfigurationEndpoint.value = false
		}
		console.log(' Scope Form handleValidation()- final validation = '+validation)
	}
	/*
const handleValidation = (event, newValue) => {
	console.log(' Scope Form handleValidation()- newValue ='+newValue)
   // setValue(newValue);
};
	 */
	function getInitialState(scope) {
		return (
				scope.scopeType  != null &&
				scope.attributeValidation.regexp === 'openid'
		)
	}
	/*
	function addClientScopes( e){
		console.log(" Scope Form - addClientScopes  - scope.attributes.spontaneousClientScopes = "+scope.attributes.spontaneousClientScopes+" ,e = "+e.value)
		if(e.target.value !=null && e.target.value.trim()=="" && e.target.value.trim().length==0 ){
			scope.attributes.spontaneousClientScopes.push(e.target.value)

		}
		console.log(" Scope Form - addClientScopes  - final scope.attributes.spontaneousClientScopes = "+scope.attributes.spontaneousClientScopes)
	}
	 */


	function addClientScopes( e){
		console.log(" Scope Form - addClientScopes  - clientScopeList = "+ clientScopeList+" , MyForm.clientScopes.value= "+MyForm.clientScopes.value)		
		if(MyForm.clientScopes.value !=null && MyForm.clientScopes.value.trim()!="" && MyForm.clientScopes.value.trim().length!=0 ){
			console.log(" Scope Form - addClientScopes  - Inside if ");
			clientScopeList.push(MyForm.clientScopes.value)
			MyForm.spontaneousClientScopes.value= clientScopeList
			MyForm.clientScopes.value = null

		}
		console.log(" Scope Form - addClientScopes  - final  clientScopeList = "+clientScopeList)
	}


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
			attributes: scope.attributes,
			umaAuthorizationPolicies: scope.umaAuthorizationPolicies,
			clientScopeList: scope.attributes.spontaneousClientScopes,

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
			console.log(" Scope Form - onSubmit")
			console.log("onSubmit - values = "+values)
//			const result = JSON.stringify(values)
//			handleSubmit(JSON.parse(result))
			const result = Object.assign(scope, values)
			console.log("onSubmit - result = "+result)
			result['attributes'].spontaneousClientId = result.spontaneousClientId
			result['attributes'].spontaneousClientScopes = result.spontaneousClientScopes
			result['attributes'].showInConfigurationEndpoint = result.showInConfigurationEndpoint
			handleSubmit(JSON.stringify(result))
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
			valid={!formik.errors.displayName && !formik.touched.displayName && init}
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
			defaultValue={scope.scopeType}
			onChange={handleValidation}
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


			{validation && (
					<FormGroup row>
					
					<GluuLabel label="SpontaneousClientId"/>
					<Col sm={9}>
					<Input
					placeholder="Enter spontaneousClientId"
					id="spontaneousClientId"
					name="spontaneousClientId"
					defaultValue={scope.attributes.spontaneousClientId}
					onChange={formik.handleChange}
					/>
					</Col>
					
					<GluuLabel label="ShowInConfigurationEndpoint" />
				        <Col sm={9}>
				          <InputGroup>
				            <CustomInput
				              type="select"
				              id="showInConfigurationEndpoint"
				              name="showInConfigurationEndpoint"
				              defaultValue={scope.attributes.showInConfigurationEndpoint}
				              onChange={formik.handleChange}
				            >
				              <option>true</option>
				              <option>false</option>
				            </CustomInput>
				          </InputGroup>
				        </Col>
					

					<GluuLabel  label="SpontaneousClientScopes" />
					<Col sm={9}>
					<Input
					style={{ backgroundColor: '#F5F5F5' }}
					id="spontaneousClientScopes"
					name="spontaneousClientScopes"			
					defaultValue={scope.attributes.spontaneousClientScopes}
		            onChange={formik.handleChange}
					tootip="Enter comma seperated values for spontaneousClientScopes"
					/>
					
					</Col>



				</FormGroup>
			)}

			
			<GluuSelectRow
			label="UmaAuthorizationPolicies"
			name="umaAuthorizationPolicies"
			formik={formik}
			lsize={20}
			rsize={8}
			defaultValue={scope.umaAuthorizationPolicies}
			values={authScripts}
			multiple
			></GluuSelectRow>
			
		        


			<FormGroup row></FormGroup>
			<GluuFooter />
			</Form>
	);

}
export default ScopeForm;

