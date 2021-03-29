import React, { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import {
  Col,
  InputGroup,
  CustomInput,
  Form,
  FormGroup,
  Label,
  Input,
} from './../../../components'
import GluuFooter from '../Gluu/GluuFooter'
import GluuLabel from '../Gluu/GluuLabel'
import GluuSelectRow from '../Gluu/GluuSelectRow'

function ScopeForm({ scope, handleSubmit, scripts}) {

	const authScripts = scripts
	.filter((item) => item.scriptType == 'UMA_RPT_POLICY')
	.map((item) => item.name)


	const [init, setInit] = useState(false)
	const [validation, setValidation] = useState(getInitialState(scope))
	const showInConfigurationEndpointOptions = ['true', 'false']

	function handleValidation() {
		console.log(" handleValidation validation = "+validation)
		setValidation(!validation)
	}
	function getInitialState(scope) {
		return (
				scope.scopeType  != null &&
				scope.scopeType === 'openid'
		)
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
			console.log("onSubmit - values = "+values)
			//const result = JSON.stringify(values)
			//handleSubmit(JSON.parse(result))
			 const result = Object.assign(scope, values)
			console.log("onSubmit - result = "+result)
			const spontaneousClientScopesList = []
			if(result.spontaneousClientScopes !=null && result.spontaneousClientScopes.trim().length>0)
				{
				console.log('result.spontaneousClientScopes = '+result.spontaneousClientScopes)
				spontaneousClientScopesList.push(result.spontaneousClientScopes)
				}
			 result['attributes'].spontaneousClientId = result.spontaneousClientId
             result['attributes'].spontaneousClientScopes = spontaneousClientScopesList
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
					</FormGroup>

					<FormGroup row>
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
				        </FormGroup>

				        <FormGroup row>
					<GluuLabel  label="SpontaneousClientScopes" />
					<Col sm={9}>
					<Input
					style={{ backgroundColor: '#F5F5F5' }}
					id="spontaneousClientScopes"
					name="spontaneousClientScopes"			
					defaultValue={scope.attributes.spontaneousClientScopes}
		            onChange={formik.handleChange}
					/>
				</Col>



				</FormGroup>

	
			
			
			 <FormGroup row>
		        <GluuLabel label="UmaAuthorizationPolicies" />
		        <Col sm={9}>
		          <Input
		            type="select"
		            name="umaAuthorizationPolicies"
		            id="umaAuthorizationPolicies"
		            defaultValue={scope.umaAuthorizationPolicies}
		            multiple
		            onChange={formik.handleChange}
		          >
		          
		          {authScripts.map((item, key) => (
		        	    		 <option>{item}</option>
		          ))}		 
		          </Input>
		        </Col>
		      </FormGroup>
		      
		      <FormGroup row></FormGroup>
		      <GluuFooter />
		    </Form>
		  )
		}

export default ScopeForm;

